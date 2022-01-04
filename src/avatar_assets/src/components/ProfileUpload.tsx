import Camera from "@spectrum-icons/workflow/Camera";
import User from "@spectrum-icons/workflow/User";
import React, { useContext, useEffect } from "react";
import { createRef } from "react";
import styled from "styled-components";
import { resizeImage } from "../resize";
import { Image } from "../../../declarations/avatar/avatar.did";
import { convertToBase64, getImageString } from "../utils";
import { AppContext } from "../App";

interface Props {
  onChange: (value: Image) => void;
  image?: Image;
}

const imageSize = 200;

const Button = styled.button`
  border: 1px solid var(--spectrum-alias-text-color);
  height: ${imageSize}px;
  width: ${imageSize}px;
  max-width: ${imageSize}px;
  margin: auto;
  border-radius: 100%;
  padding: 0;
  position: relative;

  picture {
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 100%;
    overflow: hidden;
    img,
    svg {
      width: 100%;
      height: 100%;
      min-height: 100%;
    }
  }
  #camera-icon {
    --size: 32px;
    height: var(--size);
    width: var(--size);
    top: calc(50% - (var(--size) / 2));
    left: calc(50% - (var(--size) / 2) - 2px);
    background: var(--spectrum-alias-text-color);
    border-radius: 100%;
    opacity: 0.4;
    padding: 4px;
    position: absolute;
  }
  input[type="file"] {
    display: none;
  }
`;

function ProfileUpload(props: Props) {
  const { onChange, image } = props;
  const { authClient } = useContext(AppContext);
  const [preview, setPreview] = React.useState("");
  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (image && authClient) {
      setPreview(getImageString(image, authClient));
    }
  }, [image, authClient]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e: any) => {
    const selectedFile = e.target.files[0];
    const filetype = selectedFile.type;
    const config = {
      quality: 1,
      width: imageSize,
      height: imageSize,
    };
    const resized = await resizeImage(selectedFile, config);
    const resizedString = await convertToBase64(
      await resizeImage(selectedFile, config)
    );

    const data = [...new Uint8Array(await resized.arrayBuffer())];

    setPreview(resizedString);
    let image = {
      fileName: `profile.${filetype.split("/").pop()}`,
      filetype,
      data,
    };
    onChange(image);
  };

  return (
    <>
      <Button onClick={handleClick} type="button">
        <picture>{preview ? <img src={preview} /> : <User />}</picture>
        <Camera id="camera-icon" />
        <input
          type="file"
          ref={inputRef}
          onChange={handleFile}
          accept="image/*"
        />
      </Button>
    </>
  );
}

export default ProfileUpload;
