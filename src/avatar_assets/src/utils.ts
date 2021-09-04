import assert from "assert";
import { ProfileUpdate } from "../../declarations/avatar/avatar.did";

export function profilesMatch(
  p1: undefined | ProfileUpdate,
  p2: ProfileUpdate
) {
  const profile1 = {
    bio: p1?.bio,
    image: p1?.image,
    wallets: p1?.wallets,
  };
  const profile2 = {
    bio: p2?.bio,
    image: p2?.image,
    wallets: p2?.wallets,
  };

  try {
    assert.deepEqual(profile1, profile2);
    return true;
  } catch (error) {
    return false;
  }
}
