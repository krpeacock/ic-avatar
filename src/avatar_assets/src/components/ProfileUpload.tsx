import Camera from "@spectrum-icons/workflow/Camera";
import User from "@spectrum-icons/workflow/User";
import React from "react";
import { createRef } from "react";
import styled from "styled-components";

interface Props {
  defaultImage?: string;
  onChange: (value: string) => void;
}

const Button = styled.button`
  border: 1px solid var(--spectrum-alias-text-color);
  height: 100px;
  width: 100px;
  max-width: 100px;
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

  const handleFile = (e: any) => {
    const selectedFile = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function (e) {
      const result = reader.result as string;
      setImage(result);
      onChange(result);
    };
  };

  const displayImage = image || defaultImage;

  return (
    <>
      <Button onClick={handleClick} type="button">
        <picture>
          {displayImage ? <img src={displayImage} /> : <User />}
        </picture>
        <Camera id="camera-icon" />
        <input type="file" ref={inputRef} onChange={handleFile} />
      </Button>
    </>
  );
}

export default ProfileUpload;
