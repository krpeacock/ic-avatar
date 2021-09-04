import { AUTHORIZATION_SCOPE } from "../../../declarations/avatar/avatar.did";
const scope = ["read_all"];

function _mapScope(scope: string[]): AUTHORIZATION_SCOPE | null {
  const options = ["read_wallets", "read_all", "read_bio", "read_image"];
  scope.find((v) => {
    if (!options.includes(v)) {
      return undefined;
    }
    let obj = {};
    return Object.defineProperty(obj, v, {
      value: null,
      writable: true,
      enumerable: true,
    }) as AUTHORIZATION_SCOPE;
  });

  return null;
}

_mapScope(scope);
