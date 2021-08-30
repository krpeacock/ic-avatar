export const idlFactory = ({ IDL }) => {
  const Bio = IDL.Record({
    'familyName' : IDL.Opt(IDL.Text),
    'about' : IDL.Opt(IDL.Text),
    'displayName' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'givenName' : IDL.Opt(IDL.Text),
    'location' : IDL.Opt(IDL.Text),
  });
  const ProfileUpdate = IDL.Record({
    'bio' : Bio,
    'image' : IDL.Opt(IDL.Text),
  });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Profile = IDL.Record({
    'id' : IDL.Principal,
    'bio' : Bio,
    'image' : IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  return IDL.Service({
    'create' : IDL.Func([ProfileUpdate], [Result], []),
    'delete' : IDL.Func([], [Result], []),
    'read' : IDL.Func([], [Result_1], []),
    'update' : IDL.Func([ProfileUpdate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
