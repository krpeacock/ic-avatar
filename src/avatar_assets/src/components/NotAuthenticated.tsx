import { Button, Icon } from "@adobe/react-spectrum";
import * as React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Loop from "../../assets/loop.svg";
import { AppContext } from "../App";

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

function NotAuthenticated() {
  const { isAuthenticated, login, profile } = useContext(AppContext);

  return (
    <Section>
      <h3>You are not authenticated</h3>
      <Button variant="cta" onPress={login}>
        Login with&nbsp;
        <Icon>
          <Loop />
        </Icon>
      </Button>
    </Section>
  );
}

export default React.memo(NotAuthenticated);
