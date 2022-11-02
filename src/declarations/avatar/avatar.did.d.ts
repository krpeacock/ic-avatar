import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
  'data' : Uint8Array,
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
export interface anon_class_18_1 {
  'create' : ActorMethod<[ProfileUpdate], Result>,
  'delete' : ActorMethod<[], Result>,
  'read' : ActorMethod<[], Result_1>,
  'remaining_cycles' : ActorMethod<[], bigint>,
  'update' : ActorMethod<[ProfileUpdate], Result>,
}
export interface _SERVICE extends anon_class_18_1 {}
