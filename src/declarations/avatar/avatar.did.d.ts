import type { Principal } from '@dfinity/principal';
export interface Bio {
  'familyName' : [] | [string],
  'about' : [] | [string],
  'displayName' : [] | [string],
  'name' : [] | [string],
  'givenName' : [] | [string],
  'location' : [] | [string],
}
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
  'status_code' : number,
}
export interface Image {
  'data' : Array<number>,
  'fileName' : string,
  'filetype' : string,
}
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
export interface _SERVICE {
  'create' : (arg_0: ProfileUpdate) => Promise<Result>,
  'delete' : () => Promise<Result>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'read' : () => Promise<Result_1>,
  'update' : (arg_0: ProfileUpdate) => Promise<Result>,
}
