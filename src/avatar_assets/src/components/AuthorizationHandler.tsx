import {
  ActionButton,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Flex,
  Heading,
  Well,
} from "@adobe/react-spectrum";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../App";
import {
  AuthorizationOptions,
  createAuthorizationResponseUrl,
  parseAuthorizationRequestUrl,
} from "../authentication";

interface Props {}

function AuthorizationHandler(props: Props) {
  const { isAuthenticated, authClient } = useContext(AppContext);
  const [authorizationRequest, setAuthorizationRequest] =
    useState<AuthorizationOptions | null>(null);
  const history = useHistory();
  const {} = props;

  const triggerRef = React.createRef<any>();

  useEffect(() => {
    if (isAuthenticated) {
      const authorizationRequest = parseAuthorizationRequestUrl({
        url: window.location.href,
        silent: false,
      });
      setAuthorizationRequest(authorizationRequest);
      triggerRef.current?.click?.();
    }
  }, []);

  function approve() {
    if (authorizationRequest) {
      const redirect = createAuthorizationResponseUrl({
        ok: true,
        redirectUri: authorizationRequest.redirectUri,
        message: authClient?.getIdentity().getPrincipal().toText(),
      });
      window.location.assign(redirect.toString());
    }
  }

  function reject() {
    if (authorizationRequest) {
      const redirect = createAuthorizationResponseUrl({
        ok: false,
        redirectUri: authorizationRequest.redirectUri,
        message: "Rejected by user",
      });
      window.location.assign(redirect.toString());
    }
  }

  if (!authorizationRequest) return null;

  return (
    <div style={{ position: "fixed" }}>
      <Dialog>
        <DialogContainer onDismiss={reject}>
          <Content>
            <div style={{ minHeight: "500px", padding: "1rem" }}>
              <Heading level={3}>Integration Request</Heading>
              <p>
                You have a request to authorize{" "}
                {authorizationRequest?.redirectUri} to view and display your
                identity. Do you trust this site and wish to proceed?
              </p>
              <p>These principals will be authorized: </p>
              {authorizationRequest?.principals.map((principal) => (
                <Well key={principal.toText()}>
                  <code>{principal.toText()}</code>
                </Well>
              ))}
            </div>
            <Flex alignItems="center">
              <ButtonGroup alignSelf="flex-end">
                <ActionButton margin="size-100" onPress={approve}>
                  Approve
                </ActionButton>
                <ActionButton margin="size-100" onPress={reject}>
                  Reject
                </ActionButton>
              </ButtonGroup>
            </Flex>
          </Content>
        </DialogContainer>
      </Dialog>
    </div>
  );
}

export default AuthorizationHandler;
