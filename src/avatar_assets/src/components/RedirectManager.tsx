import { isDelegationValid } from "@dfinity/authentication";
import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../App";
import { emptyProfile } from "../hooks";
import { checkDelegation, profilesMatch } from "../utils";

interface Props {
  hasLoggedIn: boolean;
}

function RedirectManager(props: Props) {
  const { isAuthenticated, profile, authClient } = useContext(AppContext);
  const [isDelegationValid, setIsDelegationValid] = useState<null | boolean>(
    null
  );

  useEffect(() => {
    checkDelegation().then((v) => setIsDelegationValid(v));
  }, [props, isAuthenticated, authClient]);

  // Not ready
  if (!authClient) return null;

  // Logged out
  if (isDelegationValid === false) return <Redirect to="/" />;
  // Authenticated but no profile
  if (isAuthenticated && !profile) return <Redirect to="/create" />;
  if (isAuthenticated && profilesMatch(profile, emptyProfile))
    return <Redirect to="/create" />;
  // Logged in with profile
  if (isAuthenticated && !profilesMatch(profile, emptyProfile)) return <Redirect to="/manage" />;
  return <></>
}

export default React.memo(RedirectManager);
