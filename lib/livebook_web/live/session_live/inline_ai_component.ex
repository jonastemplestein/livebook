# TODO this may not need to be a live component at all
defmodule LivebookWeb.SessionLive.InlineAIComponent do
  require IEx
  use LivebookWeb, :live_component

  require Logger

  # State
  # Input
  #  - conversation history
  #  - textarea input
  #  - code before
  #  - code after

  @impl true
  @spec update(maybe_improper_list | map, any) :: {:ok, map}
  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign_new(:loading, fn -> false end)
     |> assign_new(:response, fn -> "" end)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div id={"inline_ai-#{@id}"}  phx-hook="InlineAIComponent"
      data-cell-id={@id} class="absolute w-full p-3">
      <%!-- <div id="uniqueid" style="height:200px"></div> --%>
      <%!-- <form phx-submit="send_message" phx-target={@myself}> --%>

      <div class="w-full border border-gray-500 rounded-md p-3">
      <.conversation_history messages={~w{a b c d}} />

        <div class="absolute top-3 right-3 z-50 p-1">
          <button class="close-button bg-transparent focus:outline-none">
            <svg fill="none" viewBox="0 0 24 24" class="stroke-slate-300 hover:stroke-slate-50 h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <form>
          <textarea class="resize-none h-6 w-full bg-transparent" placeholder="New code instructions"></textarea>
        </form>
        <div class="footer text-xs text-gray-600">
        ⏎ to generate code, Esc to cancel
        </div>
      </div>
    </div>
    """
  end

  defp conversation_history(assigns) do
    ~H"""
    <ul>
      <li :for={message <- @messages}><%= message %></li>
    </ul>
    """
  end

  @impl true
  def handle_event(
        "request_inline_ai_completion",
        %{"selectedCode" => selected_code, "cellContent" => cell_content, "prompt" => prompt},
        socket
      ) do
    openai_request(socket.assigns, prompt, selected_code, cell_content)
    # anthropic_request(socket.assigns, prompt, selected_code, cell_content)
    {:noreply, socket |> assign(loading: true)}
  end

  def anthropic_request(assigns, prompt, selected_code, cell_content) do
    anthropic = AnthropicEx.new(Application.fetch_env!(:livebook, :anthropic_api_key))

    messages = [
      AnthropicEx.ChatMessage.human(generate_system_prompt(prompt, selected_code, cell_content)),
      AnthropicEx.ChatMessage.human(prompt)
    ]

    parent = self()

    Task.async(fn ->
      anthropic
      |> AnthropicEx.ChatCompletion.create(%{stream: true, model: "claude-2", messages: messages})
      |> Stream.flat_map(& &1)
      |> Enum.reduce({"", false, ""}, fn token, {text, in_code_block, buffer} ->
        text = text <> token
        Logger.debug("Token: '#{token}'")
        Logger.debug(text)

        # - don't return any tokens until ```elixir\n is encountered
        # - if a token ending in ` is returned, buffer it to
        #   see if it forms part of a code ending block before returning it
        # TODO implement this as a well tested method that returns just the code tokens
        cond do
          String.ends_with?(text, "```elixir\n") || String.ends_with?(text, "```elixir") ->
            {text, true, ""}

          Regex.match?(~r/```\s*$/, text) ->
            {text, false, ""}

          String.ends_with?(text, "`") ->
            {text, in_code_block, token}

          !in_code_block ->
            {text, false, ""}

          in_code_block ->
            send(parent, {:inline_ai_response_chunk, assigns.id, text, buffer <> token})
            {text, true, ""}
        end
      end)
    end)
  end

  def create_openai_chat_req(args = [_ | _]) do
    args
    |> Enum.into(%{
      model: "gpt-4",
      temperature: 0
    })
    |> OpenaiEx.ChatCompletion.new()
  end

  def get_openai_completion_stream(openai = %OpenaiEx{}, cc_req = %{}) do
    openai
    |> OpenaiEx.ChatCompletion.create(cc_req, stream: true)
    |> Stream.flat_map(& &1)
    |> Stream.map(fn %{data: d} -> d |> Map.get("choices") |> Enum.at(0) |> Map.get("delta") end)
    |> Stream.filter(fn map -> map |> Map.has_key?("content") end)
    |> Stream.map(fn map -> map |> Map.get("content") end)
  end

  def openai_request(assigns, prompt, selected_code, cell_content) do
    openai = OpenaiEx.new(Application.fetch_env!(:livebook, :openai_api_key))

    messages = [
      OpenaiEx.ChatMessage.system(generate_system_prompt(prompt, selected_code, cell_content)),
      OpenaiEx.ChatMessage.user(prompt)
    ]

    # Logger.info "System prompt: #{system_prompt}"
    # Logger.info "User prompt: #{user_prompt}"
    #   hd(messages)
    #   tl(messages)

    # )
    Logger.info(inspect(messages))

    parent = self()

    Task.async(fn ->
      openai
      |> get_openai_completion_stream(create_openai_chat_req(messages: messages))
      |> Enum.reduce({"", false, ""}, fn token, {text, in_code_block, buffer} ->
        text = text <> token
        Logger.debug("Token: '#{token}'")
        Logger.debug(text)

        # - don't return any tokens until ```elixir\n is encountered
        # - if a token ending in ` is returned, buffer it to
        #   see if it forms part of a code ending block before returning it
        # TODO implement this as a well tested method that returns just the code tokens
        cond do
          String.ends_with?(text, "```elixir\n") ->
            {text, true, ""}

          Regex.match?(~r/```\s*$/, text) ->
            {text, false, ""}

          String.ends_with?(text, "`") ->
            {text, in_code_block, token}

          !in_code_block ->
            {text, false, ""}

          in_code_block ->
            send(parent, {:inline_ai_response_chunk, assigns.id, text, buffer <> token})
            {text, true, ""}
        end
      end)
    end)
  end

  def generate_system_prompt(_prompt, "", cell_content) do
    """
    You are an AI programming assistant that is excellent at writing idiomatic elixir code.
    Follow the user's requirements carefully & to the letter.
    You're working on a livebook computational notebook written in elixir.
    Don't introduce any new components or files.
    First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.

    Then respond with a single elixir code block with the new code to be inserted.

    Minimize any other prose.
    Keep your answers short and impersonal.
    Never create a new component or file.


    You must wrap every bit of code in an elixir code block with ```elixir, even if your resopnse is short and only contains elixir code

    At the very end of your response, after the code block, write "Peace out". This is to test that my code block detection works.

    """
  end

  # TODO for longer selections we could also ask chatgpt to return a diff
  #      like so: https://github.com/rapidpages/rapidpages/blob/main/src/server/openai.ts
  # TODO we can give much better context to the model
  def generate_system_prompt(_prompt, selected_code, cell_content) do
    """
    You are an AI programming assistant that is excellent at writing idiomatic elixir code.
    Follow the user's requirements carefully & to the letter.
    You're working on a livebook computational notebook written in elixir.
    Don't introduce any new components or files.
    First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.

    Then respond with a single elixir code block with the new code.
    Modify as few characters as possible and use as few characters as possible on the diff.
    Minimize any other prose.
    Keep your answers short and impersonal.
    Never create a new component or file.

    The code changes must always be valid elixir code.

    There can be multiple code changes.

    You must wrap every bit of code in an elixir code block with ```elixir, even if your resopnse is short and only contains elixir code

    You are modifiying a subset of the highlighted portion of following code. I am only giving you the full code for context

    ```elixir
    #{cell_content}
    ```

    The code you are meant to modify is this:

    ```elixir
    #{selected_code}
    ```

    Please do not attempt to rewrite any of the other code i shared previously. It is only for context.

    At the very end of your response, after the code block, write "Peace out". This is to test that my code block detection works.
    """
  end
end
