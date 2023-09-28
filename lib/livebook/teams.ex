defmodule Livebook.Teams do
  alias Livebook.{FileSystem, Hubs}
  alias Livebook.Hubs.Team
  alias Livebook.Secrets.Secret
  alias Livebook.Teams.{Requests, Org}

  import Ecto.Changeset,
    only: [add_error: 3, apply_action: 2, apply_action!: 2, get_field: 2, change: 1]

  @prefix Org.teams_key_prefix()

  @doc """
  Creates an Org.

  With success, returns the response from Livebook Teams API to continue the org creation flow.
  Otherwise, it will return an error tuple with changeset.
  """
  @spec create_org(Org.t(), map()) ::
          {:ok, map()}
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def create_org(%Org{} = org, attrs) do
    create_org_request(org, attrs, &Requests.create_org/1)
  end

  @doc """
  Joins an Org.

  With success, returns the response from Livebook Teams API to continue the org joining flow.
  Otherwise, it will return an error tuple with changeset.
  """
  @spec join_org(Org.t(), map()) ::
          {:ok, map()}
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def join_org(%Org{} = org, attrs) do
    create_org_request(org, attrs, &Requests.join_org/1)
  end

  defp create_org_request(%Org{} = org, attrs, callback) when is_function(callback, 1) do
    changeset = Org.changeset(org, attrs)

    with {:ok, %Org{} = org} <- apply_action(changeset, :insert),
         {:ok, response} <- callback.(org) do
      {:ok, response}
    else
      {:error, %Ecto.Changeset{} = changeset} ->
        {:error, changeset}

      {:error, %{"errors" => errors_map}} ->
        errors_map =
          if errors = errors_map["key_hash"],
            do: Map.put_new(errors_map, "teams_key", errors),
            else: errors_map

        {:error, add_org_errors(changeset, errors_map)}

      any ->
        any
    end
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking org changes.
  """
  @spec change_org(Org.t(), map()) :: Ecto.Changeset.t()
  def change_org(%Org{} = org, attrs \\ %{}) do
    Org.changeset(org, attrs)
  end

  @doc """
  Send a request to Livebook Teams API to get an org request.
  """
  @spec get_org_request_completion_data(Org.t(), binary()) ::
          {:ok, map() | :awaiting_confirmation}
          | {:error, :expired}
          | {:transport_error, String.t()}
  def get_org_request_completion_data(%Org{id: id}, device_code) do
    case Requests.get_org_request_completion_data(id, device_code) do
      {:ok, %{"status" => "awaiting_confirmation"}} -> {:ok, :awaiting_confirmation}
      {:ok, completion_data} -> {:ok, completion_data}
      {:error, %{"status" => "expired"}} -> {:error, :expired}
      any -> any
    end
  end

  @doc """
  Send a request to Livebook Teams API to sign a payload.
  """
  @spec org_sign(Team.t(), String.t()) ::
          {:ok, String.t()}
          | {:transport_error, String.t()}
  def org_sign(team, payload) do
    case Requests.org_sign(team, payload) do
      {:ok, %{"signature" => signature}} -> {:ok, signature}
      any -> any
    end
  end

  @doc """
  Creates a Secret.
  """
  @spec create_secret(Team.t(), Secret.t()) ::
          :ok
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def create_secret(%Team{} = team, %Secret{} = secret) do
    case Requests.create_secret(team, secret) do
      {:ok, %{"id" => _}} -> :ok
      {:error, %{"errors" => errors}} -> {:error, add_secret_errors(secret, errors)}
      any -> any
    end
  end

  @doc """
  Updates a Secret.
  """
  @spec update_secret(Team.t(), Secret.t()) ::
          :ok
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def update_secret(%Team{} = team, %Secret{} = secret) do
    case Requests.update_secret(team, secret) do
      {:ok, %{"id" => _}} -> :ok
      {:error, %{"errors" => errors}} -> {:error, add_secret_errors(secret, errors)}
      any -> any
    end
  end

  @doc """
  Deletes a Secret.
  """
  @spec delete_secret(Team.t(), Secret.t()) ::
          :ok
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def delete_secret(%Team{} = team, %Secret{} = secret) do
    case Requests.delete_secret(team, secret) do
      {:ok, _} -> :ok
      {:error, %{"errors" => errors}} -> {:error, add_secret_errors(secret, errors)}
      any -> any
    end
  end

  @doc """
  Creates a File System.
  """
  @spec create_file_system(Team.t(), FileSystem.t()) ::
          :ok
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def create_file_system(%Team{} = team, file_system) do
    case Requests.create_file_system(team, file_system) do
      {:ok, %{"id" => _}} -> :ok
      {:error, %{"errors" => errors}} -> {:error, add_file_system_errors(file_system, errors)}
      any -> any
    end
  end

  @doc """
  Updates a File System.
  """
  @spec update_file_system(Team.t(), FileSystem.t()) ::
          :ok
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def update_file_system(%Team{} = team, file_system) do
    case Requests.update_file_system(team, file_system) do
      {:ok, %{"id" => _}} -> :ok
      {:error, %{"errors" => errors}} -> {:error, add_file_system_errors(file_system, errors)}
      any -> any
    end
  end

  @doc """
  Deletes a File System.
  """
  @spec delete_file_system(Team.t(), FileSystem.t()) ::
          :ok
          | {:error, Ecto.Changeset.t()}
          | {:transport_error, String.t()}
  def delete_file_system(%Team{} = team, file_system) do
    case Requests.delete_file_system(team, file_system) do
      {:ok, _} -> :ok
      {:error, %{"errors" => errors}} -> {:error, add_file_system_errors(file_system, errors)}
      any -> any
    end
  end

  @doc """
  Creates a Hub.

  It notifies interested processes about hub metadata data change.
  """
  @spec create_hub!(map()) :: Team.t()
  def create_hub!(attrs) do
    changeset = Team.change_hub(Team.new(), attrs)
    team = apply_action!(changeset, :insert)

    Hubs.save_hub(team)
  end

  @doc """
  Updates a Hub.

  With success, notifies interested processes about hub metadata data change.
  Otherwise, it will return an error tuple with changeset.
  """
  @spec update_hub(Team.t(), map()) :: {:ok, Team.t()} | {:error, Ecto.Changeset.t()}
  def update_hub(%Team{} = team, attrs) do
    changeset = Team.change_hub(team, attrs)
    id = get_field(changeset, :id)

    if Hubs.hub_exists?(id) do
      with {:ok, struct} <- apply_action(changeset, :update) do
        {:ok, Hubs.save_hub(struct)}
      end
    else
      {:error, add_error(changeset, :hub_name, "does not exists")}
    end
  end

  @doc """
  Encrypts the given value with Teams key derived keys.
  """
  @spec encrypt(String.t() | nil, bitstring(), bitstring()) :: String.t()
  def encrypt(value, _secret, _sign_secret) when value in ["", nil], do: value

  def encrypt(value, secret, sign_secret) do
    Plug.Crypto.MessageEncryptor.encrypt(value, secret, sign_secret)
  end

  @doc """
  Decrypts the given encrypted value with Teams key derived keys.
  """
  @spec decrypt(String.t() | nil, bitstring(), bitstring()) :: {:ok, String.t()} | :error
  def decrypt(value, _secret, _sign_secret) when value in ["", nil], do: value

  def decrypt(encrypted_value, secret, sign_secret) do
    Plug.Crypto.MessageEncryptor.decrypt(encrypted_value, secret, sign_secret)
  end

  @doc """
  Derives the secret and sign secret from given `teams_key`.
  """
  @spec derive_keys(String.t()) :: {bitstring(), bitstring()}
  def derive_keys(@prefix <> teams_key) do
    binary_key = Base.url_decode64!(teams_key, padding: false)

    <<secret::16-bytes, sign_secret::16-bytes>> =
      Plug.Crypto.KeyGenerator.generate(binary_key, "notebook secret", cache: Plug.Crypto.Keys)

    {secret, sign_secret}
  end

  defp add_org_errors(%Ecto.Changeset{} = changeset, errors_map) do
    add_errors(changeset, Org.__schema__(:fields), errors_map)
  end

  defp add_secret_errors(%Secret{} = secret, errors_map) do
    add_errors(change(secret), Secret.__schema__(:fields), errors_map)
  end

  defp add_file_system_errors(%struct{} = file_system, errors_map) do
    %{error_field: field} = FileSystem.external_metadata(file_system)
    errors_map = Map.new(errors_map, fn {_key, values} -> {field, values} end)

    add_errors(change(file_system), struct.__schema__(:fields), errors_map)
  end

  defp add_errors(%Ecto.Changeset{} = changeset, fields, errors_map) do
    for {key, errors} <- errors_map,
        field = String.to_atom(key),
        field in fields,
        error <- errors,
        reduce: changeset,
        do: (acc -> add_error(acc, field, error))
  end
end
