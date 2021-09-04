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
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import {
  Authorization,
  AUTHORIZATION_SCOPE,
  ProfileUpdate,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import {
  AuthorizationOptions,
  createAuthorizationResponseUrl,
  parseAuthorizationRequestUrl,
} from "../authentication";

interface Props {}

function AuthorizationHandler(props: Props) {
  const { isAuthenticated, authClient, actor } = useContext(AppContext);
  const [authorizationRequest, setAuthorizationRequest] =
    useState<AuthorizationOptions | null>(null);
  const {} = props;

  const triggerRef = React.createRef<any>();

  console.log(authClient?.getIdentity().getPrincipal());

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

  function _mapScope(scope: string[]): AUTHORIZATION_SCOPE[] {
    const options = ["read_wallets", "read_all", "read_bio", "read_image"];
    const scopes: AUTHORIZATION_SCOPE[] = scope
      .filter((v) => {
        return options.includes(v);
      })
      .map((v) => {
        let obj = {};
        return Object.defineProperty(obj, v, {
          value: null,
          writable: true,
          enumerable: true,
        }) as AUTHORIZATION_SCOPE;
      });
    return scopes;
  }

  async function approve() {
    if (actor && authorizationRequest) {
      const scope = _mapScope(authorizationRequest.scope);

      if (!authorizationRequest.principals.length || !scope.length) {
        toast.error("Malformed authorization url");
        return;
      }
      const authorizations = authorizationRequest.principals.map(
        (principal) => {
          const authorization: Authorization = {
            id: principal,
            scope,
            url: authorizationRequest.redirectUri,
          };
          return authorization;
        }
      );

      console.log(authorizations);
      const result = await actor.authorize(authorizations);
      if ("ok" in result) {
        const redirect = createAuthorizationResponseUrl({
          ok: true,
          redirectUri: authorizationRequest.redirectUri,
          message: authClient?.getIdentity().getPrincipal().toText(),
        });
        window.location.assign(redirect.toString());
      } else {
        toast.error("Error while authorizing: " + Object.keys(result.err)[0]);
      }
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
