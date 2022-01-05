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
export interface anon_class_17_1 {
  'create' : (arg_0: ProfileUpdate) => Promise<Result>,
  'delete' : () => Promise<Result>,
  'read' : () => Promise<Result_1>,
  'update' : (arg_0: ProfileUpdate) => Promise<Result>,
}
export interface _SERVICE extends anon_class_17_1 {}
