import assert from "assert";
import { ProfileUpdate } from "../../declarations/avatar/avatar.did";

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
