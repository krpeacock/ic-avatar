export const idlFactory = ({ IDL }) => {
  const ClearArguments = IDL.Record({});
  const BatchId = IDL.Nat;
  const Key = IDL.Text;
  const CreateAssetArguments = IDL.Record({
    'key' : Key,
    'content_type' : IDL.Text,
  });
  const UnsetAssetContentArguments = IDL.Record({
    'key' : Key,
    'content_encoding' : IDL.Text,
  });
  const DeleteAssetArguments = IDL.Record({ 'key' : Key });
  const ChunkId = IDL.Nat;
  const SetAssetContentArguments = IDL.Record({
    'key' : Key,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'chunk_ids' : IDL.Vec(ChunkId),
    'content_encoding' : IDL.Text,
  });
  const BatchOperationKind = IDL.Variant({
    'CreateAsset' : CreateAssetArguments,
    'UnsetAssetContent' : UnsetAssetContentArguments,
    'DeleteAsset' : DeleteAssetArguments,
    'SetAssetContent' : SetAssetContentArguments,
    'Clear' : ClearArguments,
  });
  const CommitBatchArguments = IDL.Record({
    'batch_id' : BatchId,
    'operations' : IDL.Vec(BatchOperationKind),
  });
  const Bio = IDL.Record({
    'familyName' : IDL.Opt(IDL.Text),
    'about' : IDL.Opt(IDL.Text),
    'displayName' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'givenName' : IDL.Opt(IDL.Text),
    'location' : IDL.Opt(IDL.Text),
  });
  const Image = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'fileName' : IDL.Text,
    'filetype' : IDL.Text,
  });
  const ProfileUpdate = IDL.Record({ 'bio' : Bio, 'image' : IDL.Opt(Image) });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func(
          [StreamingCallbackToken],
          [StreamingCallbackHttpResponse],
          ['query'],
        ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const Time = IDL.Int;
  const AssetEncodingDetails = IDL.Record({
    'modified' : Time,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'length' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const AssetDetails = IDL.Record({
    'key' : Key,
    'encodings' : IDL.Vec(AssetEncodingDetails),
    'content_type' : IDL.Text,
  });
  const Profile = IDL.Record({
    'id' : IDL.Principal,
    'bio' : Bio,
    'image' : IDL.Opt(Image),
  });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  const anon_class_25_1 = IDL.Service({
    'clear' : IDL.Func([ClearArguments], [], []),
    'commit_batch' : IDL.Func([CommitBatchArguments], [], []),
    'create' : IDL.Func([ProfileUpdate], [Result], []),
    'create_asset' : IDL.Func([CreateAssetArguments], [], []),
    'create_batch' : IDL.Func(
        [IDL.Record({})],
        [IDL.Record({ 'batch_id' : BatchId })],
        [],
      ),
    'create_chunk' : IDL.Func(
        [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8), 'batch_id' : BatchId })],
        [IDL.Record({ 'chunk_id' : ChunkId })],
        [],
      ),
    'delete' : IDL.Func([], [Result], []),
    'delete_asset' : IDL.Func([DeleteAssetArguments], [], []),
    'get' : IDL.Func(
        [IDL.Record({ 'key' : Key, 'accept_encodings' : IDL.Vec(IDL.Text) })],
        [
          IDL.Record({
            'content' : IDL.Vec(IDL.Nat8),
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'content_type' : IDL.Text,
            'content_encoding' : IDL.Text,
            'total_length' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_chunk' : IDL.Func(
        [
          IDL.Record({
            'key' : Key,
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'index' : IDL.Nat,
            'content_encoding' : IDL.Text,
          }),
        ],
        [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8) })],
        ['query'],
      ),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'http_request_streaming_callback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackHttpResponse],
        ['query'],
      ),
    'list' : IDL.Func([IDL.Record({})], [IDL.Vec(AssetDetails)], ['query']),
    'read' : IDL.Func([], [Result_1], []),
    'set_asset_content' : IDL.Func([SetAssetContentArguments], [], []),
    'unset_asset_content' : IDL.Func([UnsetAssetContentArguments], [], []),
    'update' : IDL.Func([ProfileUpdate], [Result], []),
  });
  return anon_class_25_1;
};
export const init = ({ IDL }) => { return []; };
