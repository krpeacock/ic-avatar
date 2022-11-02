import zx from "zx";
import fs from "fs";
import path from "path";
import fetch from "isomorphic-fetch";

const RELEASE = "release-2022-10-28";

const main = async () => {
  const candid = await fetch(
    `https://github.com/dfinity/internet-identity/releases/download/${RELEASE}/internet_identity.did`
  ).then((res: Response) => res.text()); //?

  fs.writeFileSync(
    path.join("src", "internet-identity", "internet-identity.did"),
    candid
  );

  const wasm: Blob = await fetch(
    `https://github.com/dfinity/internet-identity/releases/download/${RELEASE}/internet_identity_dev.wasm`
  ).then((res: Response) => {
    return res.blob();
  });

  fs.writeFileSync(
    path.join("src", "internet-identity", "internet-identity.wasm"),
    Buffer.from(await wasm.arrayBuffer())
  );
};
main();
