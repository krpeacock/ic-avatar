import { Button, Icon } from "@adobe/react-spectrum";
import * as React from "react";
import { useContext } from "react";
import styled from "styled-components";
import Loop from "../assets/loop.svg";
import { AppContext } from "../App";
import RedirectManager from "./RedirectManager";
import { Redirect } from "react-router-dom";

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

function NotAuthenticated() {
  const { hasLoggedIn, login, isAuthenticated, profile } = useContext(AppContext);

  if(isAuthenticated && profile) return <Redirect to="/manage"/>
  if(isAuthenticated && !profile) return <Redirect to="/create"/>
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
