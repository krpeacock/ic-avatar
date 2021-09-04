import type { Principal } from '@dfinity/principal';
export type AUTHORIZATION_SCOPE = { 'read_wallets' : null } |
  { 'read_all' : null } |
  { 'read_bio' : null } |
  { 'read_image' : null };
export interface Authorization {
  'id' : Principal,
  'scope' : Array<AUTHORIZATION_SCOPE>,
}
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
export interface FullProfile {
  'id' : Principal,
  'bio' : Bio,
  'privacySettings' : PrivacySettings,
  'authorizations' : Array<Authorization>,
  'wallets' : Wallets,
  'image' : [] | [string],
}
export interface PrivacySettings {
  'bio' : {
    'familyName' : boolean,
    'about' : boolean,
    'displayName' : boolean,
    'name' : boolean,
    'givenName' : boolean,
    'location' : boolean,
  },
  'wallets' : {
    'nns' : boolean,
    'plug' : boolean,
    'cycles' : boolean,
    'stoic' : boolean,
  },
  'image' : boolean,
}
export type Profile = { 'full' : FullProfile } |
  {
    'partial' : {
      'id' : Principal,
      'bio' : Bio,
      'wallets' : Wallets,
      'image' : [] | [string],
    }
  };
export interface ProfileUpdate {
  'bio' : Bio,
  'privacySettings' : PrivacySettings,
  'authorizations' : Array<Authorization>,
  'wallets' : Wallets,
  'image' : [] | [string],
}
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Profile } |
  { 'err' : Error };
export interface Wallets {
  'nns' : [] | [string],
  'plug' : [] | [string],
  'cycles' : [] | [string],
  'stoic' : [] | [string],
}
export interface _SERVICE {
  'authorize' : (arg_0: Authorization) => Promise<Result>,
  'create' : (arg_0: ProfileUpdate) => Promise<Result>,
  'delete' : () => Promise<Result>,
  'read' : (arg_0: Principal) => Promise<Result_1>,
  'update' : (arg_0: ProfileUpdate) => Promise<Result>,
}
