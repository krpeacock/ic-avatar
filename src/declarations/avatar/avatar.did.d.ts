import type { Principal } from '@dfinity/principal';
export interface AssetDetails {
  'key' : Key,
  'encodings' : Array<AssetEncodingDetails>,
  'content_type' : string,
}
export interface AssetEncodingDetails {
  'modified' : Time,
  'sha256' : [] | [Array<number>],
  'length' : bigint,
  'content_encoding' : string,
}
export type BatchId = bigint;
export type BatchOperationKind = { 'CreateAsset' : CreateAssetArguments } |
  { 'UnsetAssetContent' : UnsetAssetContentArguments } |
  { 'DeleteAsset' : DeleteAssetArguments } |
  { 'SetAssetContent' : SetAssetContentArguments } |
  { 'Clear' : ClearArguments };
export interface Bio {
  'familyName' : [] | [string],
  'about' : [] | [string],
  'displayName' : [] | [string],
  'name' : [] | [string],
  'givenName' : [] | [string],
  'location' : [] | [string],
}
export type ChunkId = bigint;
export type ClearArguments = {};
export interface CommitBatchArguments {
  'batch_id' : BatchId,
  'operations' : Array<BatchOperationKind>,
}
export interface CreateAssetArguments { 'key' : Key, 'content_type' : string }
export interface DeleteAssetArguments { 'key' : Key }
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface Image {
  'data' : Array<number>,
  'fileName' : string,
  'filetype' : string,
}
export type Key = string;
export interface Profile {
  'id' : Principal,
  'bio' : Bio,
  'image' : [] | [Image],
}
export interface ProfileUpdate { 'bio' : Bio, 'image' : [] | [Image] }
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Profile } |
  { 'err' : Error };
export interface SetAssetContentArguments {
  'key' : Key,
  'sha256' : [] | [Array<number>],
  'chunk_ids' : Array<ChunkId>,
  'content_encoding' : string,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : string,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export type Time = bigint;
export interface UnsetAssetContentArguments {
  'key' : Key,
  'content_encoding' : string,
}
export interface anon_class_25_1 {
  'clear' : (arg_0: ClearArguments) => Promise<undefined>,
  'commit_batch' : (arg_0: CommitBatchArguments) => Promise<undefined>,
  'create' : (arg_0: ProfileUpdate) => Promise<Result>,
  'create_asset' : (arg_0: CreateAssetArguments) => Promise<undefined>,
  'create_batch' : (arg_0: {}) => Promise<{ 'batch_id' : BatchId }>,
  'create_chunk' : (
      arg_0: { 'content' : Array<number>, 'batch_id' : BatchId },
    ) => Promise<{ 'chunk_id' : ChunkId }>,
  'delete' : () => Promise<Result>,
  'delete_asset' : (arg_0: DeleteAssetArguments) => Promise<undefined>,
  'get' : (
      arg_0: { 'key' : Key, 'accept_encodings' : Array<string> },
    ) => Promise<
      {
        'content' : Array<number>,
        'sha256' : [] | [Array<number>],
        'content_type' : string,
        'content_encoding' : string,
        'total_length' : bigint,
      }
    >,
  'get_chunk' : (
      arg_0: {
        'key' : Key,
        'sha256' : [] | [Array<number>],
        'index' : bigint,
        'content_encoding' : string,
      },
    ) => Promise<{ 'content' : Array<number> }>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'http_request_streaming_callback' : (
      arg_0: StreamingCallbackToken,
    ) => Promise<StreamingCallbackHttpResponse>,
  'list' : (arg_0: {}) => Promise<Array<AssetDetails>>,
  'read' : () => Promise<Result_1>,
  'set_asset_content' : (arg_0: SetAssetContentArguments) => Promise<undefined>,
  'unset_asset_content' : (arg_0: UnsetAssetContentArguments) => Promise<
      undefined
    >,
  'update' : (arg_0: ProfileUpdate) => Promise<Result>,
}
export interface _SERVICE extends anon_class_25_1 {}
