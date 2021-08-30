import { readAndCompressImage } from "browser-image-resizer";

export const resizeImage = async (file, config) => {
  return await readAndCompressImage(file, config);
};
