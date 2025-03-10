defmodule LivebookProto.Event do
  use Protobuf, syntax: :proto3, protoc_gen_elixir_version: "0.12.0"

  oneof :type, 0

  field :secret_created, 1,
    type: LivebookProto.SecretCreated,
    json_name: "secretCreated",
    oneof: 0

  field :secret_updated, 2,
    type: LivebookProto.SecretUpdated,
    json_name: "secretUpdated",
    oneof: 0

  field :secret_deleted, 3,
    type: LivebookProto.SecretDeleted,
    json_name: "secretDeleted",
    oneof: 0

  field :user_connected, 4,
    type: LivebookProto.UserConnected,
    json_name: "userConnected",
    oneof: 0

  field :file_system_created, 5,
    type: LivebookProto.FileSystemCreated,
    json_name: "fileSystemCreated",
    oneof: 0

  field :file_system_updated, 6,
    type: LivebookProto.FileSystemUpdated,
    json_name: "fileSystemUpdated",
    oneof: 0

  field :file_system_deleted, 7,
    type: LivebookProto.FileSystemDeleted,
    json_name: "fileSystemDeleted",
    oneof: 0
end
