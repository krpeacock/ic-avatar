import imageCompression from "browser-image-compression";

export const resizeImage = async (file, config) => {
  return await imageCompression(file, config);
};
