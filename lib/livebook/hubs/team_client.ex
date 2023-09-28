defmodule Livebook.Hubs.TeamClient do
  use GenServer
  require Logger

  alias Livebook.FileSystem
  alias Livebook.FileSystems
  alias Livebook.Hubs
  alias Livebook.Secrets
  alias Livebook.Teams

  @registry Livebook.HubsRegistry
  @supervisor Livebook.HubsSupervisor

  defstruct [
    :hub,
    :connection_error,
    :derived_keys,
    connected?: false,
    secrets: [],
    file_systems: []
  ]

  @type registry_name :: {:via, Registry, {Livebook.HubsRegistry, String.t()}}

  @doc """
  Connects the Team client with WebSocket server.
  """
  @spec start_link(Hubs.Team.t()) :: GenServer.on_start()
  def start_link(%Hubs.Team{} = team) do
    GenServer.start_link(__MODULE__, team, name: registry_name(team.id))
  end

  @doc """
  Stops the WebSocket server.
  """
  @spec stop(String.t()) :: :ok
  def stop(id) do
    if pid = GenServer.whereis(registry_name(id)) do
      DynamicSupervisor.terminate_child(@supervisor, pid)
    end

    :ok
  end

  @doc """
  Returns a list of cached secrets.
  """
  @spec get_secrets(String.t()) :: list(Secrets.Secret.t())
  def get_secrets(id) do
    GenServer.call(registry_name(id), :get_secrets)
  end

  @doc """
  Returns a list of cached file systems.
  """
  @spec get_file_systems(String.t()) :: list(FileSystem.t())
  def get_file_systems(id) do
    GenServer.call(registry_name(id), :get_file_systems)
  end

  @doc """
  Returns the latest error from connection.
  """
  @spec get_connection_error(String.t()) :: String.t() | nil
  def get_connection_error(id) do
    GenServer.call(registry_name(id), :get_connection_error)
  catch
    :exit, _ -> "connection refused"
  end

  @doc """
  Returns if the Team client is connected.
  """
  @spec connected?(String.t()) :: boolean()
  def connected?(id) do
    GenServer.call(registry_name(id), :connected?)
  catch
    :exit, _ -> false
  end

  ## GenServer callbacks

  @impl true
  def init(%Hubs.Team{offline: nil} = team) do
    derived_keys = Teams.derive_keys(team.teams_key)

    headers = [
      {"x-lb-version", to_string(Application.spec(:livebook, :vsn))},
      {"x-user", to_string(team.user_id)},
      {"x-org", to_string(team.org_id)},
      {"x-org-key", to_string(team.org_key_id)},
      {"x-session-token", team.session_token}
    ]

    {:ok, _pid} = Teams.Connection.start_link(self(), headers)
    {:ok, %__MODULE__{hub: team, derived_keys: derived_keys}}
  end

  def init(%Hubs.Team{} = team) do
    derived_keys = Teams.derive_keys(team.teams_key)

    {:ok, %__MODULE__{hub: team, secrets: team.offline.secrets, derived_keys: derived_keys}}
  end

  @impl true
  def handle_call(:get_connection_error, _caller, state) do
    {:reply, state.connection_error, state}
  end

  def handle_call(:connected?, _caller, state) do
    {:reply, state.connected?, state}
  end

  def handle_call(:get_secrets, _caller, state) do
    {:reply, state.secrets, state}
  end

  def handle_call(:get_file_systems, _caller, state) do
    {:reply, state.file_systems, state}
  end

  @impl true
  def handle_info(:connected, state) do
    Hubs.Broadcasts.hub_connected(state.hub.id)
    {:noreply, %{state | connected?: true, connection_error: nil}}
  end

  def handle_info({:connection_error, reason}, state) do
    Hubs.Broadcasts.hub_connection_failed(state.hub.id, reason)
    {:noreply, %{state | connected?: false, connection_error: reason}}
  end

  def handle_info({:server_error, reason}, state) do
    Hubs.Broadcasts.hub_server_error(state.hub.id, "#{state.hub.hub_name}: #{reason}")
    :ok = Hubs.delete_hub(state.hub.id)

    {:noreply, %{state | connected?: false}}
  end

  def handle_info({:event, topic, data}, state) do
    Logger.debug("Received event #{topic} with data: #{inspect(data)}")

    {:noreply, handle_event(topic, data, state)}
  end

  # Private

  defp registry_name(id) do
    {:via, Registry, {@registry, id}}
  end

  defp put_secret(state, secret) do
    state = remove_secret(state, secret)
    %{state | secrets: [secret | state.secrets]}
  end

  defp remove_secret(state, secret) do
    %{state | secrets: Enum.reject(state.secrets, &(&1.name == secret.name))}
  end

  defp build_secret(state, %{name: name, value: value}) do
    {secret_key, sign_secret} = state.derived_keys
    {:ok, decrypted_value} = Teams.decrypt(value, secret_key, sign_secret)

    %Secrets.Secret{
      name: name,
      value: decrypted_value,
      hub_id: state.hub.id
    }
  end

  defp put_file_system(state, file_system) do
    state = remove_file_system(state, file_system)
    %{state | file_systems: [file_system | state.file_systems]}
  end

  defp remove_file_system(state, file_system) do
    %{
      state
      | file_systems:
          Enum.reject(state.file_systems, &(&1.external_id == file_system.external_id))
    }
  end

  defp build_file_system(state, file_system) do
    {secret_key, sign_secret} = state.derived_keys
    {:ok, decrypted_value} = Teams.decrypt(file_system.value, secret_key, sign_secret)

    dumped_data =
      decrypted_value
      |> Jason.decode!()
      |> Map.put("external_id", file_system.id)

    FileSystems.load(file_system.type, dumped_data)
  end

  defp handle_event(:secret_created, %Secrets.Secret{} = secret, state) do
    Hubs.Broadcasts.secret_created(secret)

    put_secret(state, secret)
  end

  defp handle_event(:secret_created, secret_created, state) do
    handle_event(:secret_created, build_secret(state, secret_created), state)
  end

  defp handle_event(:secret_updated, %Secrets.Secret{} = secret, state) do
    Hubs.Broadcasts.secret_updated(secret)

    put_secret(state, secret)
  end

  defp handle_event(:secret_updated, secret_updated, state) do
    handle_event(:secret_updated, build_secret(state, secret_updated), state)
  end

  defp handle_event(:secret_deleted, secret_deleted, state) do
    if secret = Enum.find(state.secrets, &(&1.name == secret_deleted.name)) do
      Hubs.Broadcasts.secret_deleted(secret)
      remove_secret(state, secret)
    else
      state
    end
  end

  defp handle_event(:file_system_created, %{external_id: _} = file_system, state) do
    Hubs.Broadcasts.file_system_created(file_system)

    put_file_system(state, file_system)
  end

  defp handle_event(:file_system_created, file_system_created, state) do
    handle_event(:file_system_created, build_file_system(state, file_system_created), state)
  end

  defp handle_event(:file_system_updated, %{external_id: _} = file_system, state) do
    Hubs.Broadcasts.file_system_updated(file_system)

    put_file_system(state, file_system)
  end

  defp handle_event(:file_system_updated, file_system_updated, state) do
    handle_event(:file_system_updated, build_file_system(state, file_system_updated), state)
  end

  defp handle_event(:file_system_deleted, %{external_id: _} = file_system, state) do
    Hubs.Broadcasts.file_system_deleted(file_system)

    remove_file_system(state, file_system)
  end

  defp handle_event(:file_system_deleted, %{id: id}, state) do
    if file_system = Enum.find(state.file_systems, &(&1.external_id == id)) do
      handle_event(:file_system_deleted, file_system, state)
    else
      state
    end
  end

  defp handle_event(:user_connected, user_connected, state) do
    state
    |> dispatch_secrets(user_connected)
    |> dispatch_file_systems(user_connected)
  end

  defp dispatch_secrets(state, %{secrets: secrets}) do
    decrypted_secrets = Enum.map(secrets, &build_secret(state, &1))

    {created, deleted, updated} =
      diff(
        state.secrets,
        decrypted_secrets,
        &(&1.name == &2.name and &1.value == &2.value),
        &(&1.name == &2.name),
        &(&1.name == &2.name and &1.value != &2.value)
      )

    dispatch_events(state,
      secret_deleted: deleted,
      secret_created: created,
      secret_updated: updated
    )
  end

  defp dispatch_file_systems(state, %{file_systems: file_systems}) do
    decrypted_file_systems = Enum.map(file_systems, &build_file_system(state, &1))

    {created, deleted, updated} =
      diff(
        state.file_systems,
        decrypted_file_systems,
        &(&1.external_id == &2.external_id)
      )

    dispatch_events(state,
      file_system_deleted: deleted,
      file_system_created: created,
      file_system_updated: updated
    )
  end

  defp dispatch_file_systems(state, _), do: state

  defp diff(old_list, new_list, fun, deleted_fun \\ nil, updated_fun \\ nil) do
    deleted_fun = unless deleted_fun, do: fun, else: deleted_fun
    updated_fun = unless updated_fun, do: fun, else: updated_fun

    created = Enum.reject(new_list, fn item -> Enum.find(old_list, &fun.(&1, item)) end)
    deleted = Enum.reject(old_list, fn item -> Enum.find(new_list, &deleted_fun.(&1, item)) end)
    updated = Enum.filter(new_list, fn item -> Enum.find(old_list, &updated_fun.(&1, item)) end)

    {created, deleted, updated}
  end

  defp dispatch_events(state, events_by_topic) do
    for {topic, events} <- events_by_topic,
        event <- events,
        reduce: state,
        do: (acc -> handle_event(topic, event, acc))
  end
end
