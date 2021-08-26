export function compareProfiles(p1: any | null, p2: any) {
  if (!p1) return false;

  for (const key in p1.bio) {
    if (Object.prototype.hasOwnProperty.call(p1.bio, key)) {
      const element = p1.bio[key];
      if (element[0] !== p2.bio[key][0]) return false;
    }
  }
  return true;
}
