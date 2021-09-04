export const idlFactory = ({ IDL }) => {
  const AUTHORIZATION_SCOPE = IDL.Variant({
    'read_wallets' : IDL.Null,
    'read_all' : IDL.Null,
    'read_bio' : IDL.Null,
    'read_image' : IDL.Null,
  });
  const Authorization = IDL.Record({
    'id' : IDL.Principal,
    'url' : IDL.Text,
    'scope' : IDL.Vec(AUTHORIZATION_SCOPE),
  });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Bio = IDL.Record({
    'familyName' : IDL.Opt(IDL.Text),
    'about' : IDL.Opt(IDL.Text),
    'displayName' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'givenName' : IDL.Opt(IDL.Text),
    'location' : IDL.Opt(IDL.Text),
  });
  const PrivacySettings = IDL.Record({
    'bio' : IDL.Record({
      'familyName' : IDL.Bool,
      'about' : IDL.Bool,
      'displayName' : IDL.Bool,
      'name' : IDL.Bool,
      'givenName' : IDL.Bool,
      'location' : IDL.Bool,
    }),
    'wallets' : IDL.Record({
      'nns' : IDL.Bool,
      'plug' : IDL.Bool,
      'cycles' : IDL.Bool,
      'stoic' : IDL.Bool,
    }),
    'image' : IDL.Bool,
  });
  const Wallets = IDL.Record({
    'nns' : IDL.Opt(IDL.Text),
    'plug' : IDL.Opt(IDL.Text),
    'cycles' : IDL.Opt(IDL.Text),
    'stoic' : IDL.Opt(IDL.Text),
  });
  const ProfileUpdate = IDL.Record({
    'bio' : Bio,
    'privacySettings' : PrivacySettings,
    'authorizations' : IDL.Vec(Authorization),
    'wallets' : Wallets,
    'image' : IDL.Opt(IDL.Text),
  });
  const FullProfile = IDL.Record({
    'id' : IDL.Principal,
    'bio' : Bio,
    'privacySettings' : PrivacySettings,
    'authorizations' : IDL.Vec(Authorization),
    'wallets' : Wallets,
    'image' : IDL.Opt(IDL.Text),
  });
  const Profile = IDL.Variant({
    'full' : FullProfile,
    'partial' : IDL.Record({
      'id' : IDL.Principal,
      'bio' : Bio,
      'wallets' : Wallets,
      'image' : IDL.Opt(IDL.Text),
    }),
  });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  return IDL.Service({
    'authorize' : IDL.Func([IDL.Vec(Authorization)], [Result], []),
    'create' : IDL.Func([ProfileUpdate], [Result], []),
    'delete' : IDL.Func([], [Result], []),
    'read' : IDL.Func([IDL.Principal], [Result_1], ['query']),
    'update' : IDL.Func([ProfileUpdate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
