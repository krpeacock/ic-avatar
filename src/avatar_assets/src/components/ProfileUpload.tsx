import Camera from "@spectrum-icons/workflow/Camera";
import User from "@spectrum-icons/workflow/User";
import React from "react";
import { createRef } from "react";
import styled from "styled-components";
import { resizeImage } from "../resize";

interface Props {
  defaultImage?: string;
  onChange: (value: string) => void;
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
  const { defaultImage, onChange } = props;
  const [image, setImage] = React.useState("");
  const inputRef = createRef<HTMLInputElement>();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const convertToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve) => {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleFile = async (e: any) => {
    const selectedFile = e.target.files[0];
    const config = {
      quality: 1,
      width: imageSize,
      height: imageSize,
    };
    const resized = await convertToBase64(
      await resizeImage(selectedFile, config)
    );

    setImage(resized);
    onChange(resized);
  };

  const displayImage = image || defaultImage;

  return (
    <>
      <Button onClick={handleClick} type="button">
        <picture>
          {displayImage ? <img src={displayImage} /> : <User />}
        </picture>
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
