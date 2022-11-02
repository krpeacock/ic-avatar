import { AuthClient, IdbStorage } from "@dfinity/auth-client";
import { isDelegationValid } from "@dfinity/authentication";
import { DelegationChain } from "@dfinity/identity";
import assert from "assert";
import { canisterId } from "../../declarations/avatar_assets";
import { ProfileUpdate, Image } from "../../declarations/avatar/avatar.did";
import dfxJson from '../../../dfx.json';

dfxJson.networks.local.bind

export function profilesMatch(
  p1: undefined | ProfileUpdate,
  p2: ProfileUpdate
) {
  try {
    assert.deepEqual(p1, p2);
    return true;
  } catch (error) {
    return false;
  }
}

export const convertToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve) => {
    var reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
};

export const getImageString = (
  image: Image,
  authClient: AuthClient,
  raw = false
): string => {
  const fileExtension = "." + image?.filetype?.split("/").pop();

  let imageString = "";
  if (process.env.NODE_ENV !== "production") {
    imageString = `http://localhost:8000/images/${authClient
      ?.getIdentity()
      ?.getPrincipal()
      ?.toString()}/profile${fileExtension}?canisterId=${canisterId}`;
  } else {
    imageString = `https://${canisterId}.${
      raw ? "raw." : ""
    }ic0.app/images/${authClient
      ?.getIdentity()
      ?.getPrincipal()
      ?.toString()}/profile${fileExtension}`;
  }
  return imageString;
};

export async function checkDelegation() {
  const delegations = await new IdbStorage().get("ic-delegation");
  if (!delegations) return false;
  const chain = DelegationChain.fromJSON(delegations);
  return isDelegationValid(chain);
}
