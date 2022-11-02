export const idlFactory = ({ IDL }) => {
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
  const Profile = IDL.Record({
    'id' : IDL.Principal,
    'bio' : Bio,
    'image' : IDL.Opt(Image),
  });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  const anon_class_18_1 = IDL.Service({
    'create' : IDL.Func([ProfileUpdate], [Result], []),
    'delete' : IDL.Func([], [Result], []),
    'read' : IDL.Func([], [Result_1], ['query']),
    'remaining_cycles' : IDL.Func([], [IDL.Nat], ['query']),
    'update' : IDL.Func([ProfileUpdate], [Result], []),
  });
  return anon_class_18_1;
};
export const init = ({ IDL }) => { return [IDL.Text]; };
