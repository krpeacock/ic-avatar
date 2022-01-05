import React from "react";
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

  const isDelegationValid = checkDelegation();

  // Not ready
  if (!authClient) return null;

  // Logged out
  if (!isDelegationValid) return <Redirect to="/" />;
  // Authenticated but no profile
  if (isAuthenticated && !profile) return <Redirect to="/create" />;
  if (isAuthenticated && profilesMatch(profile, emptyProfile))
    return <Redirect to="/create" />;
  // Logged in with profile
  return <Redirect to="/manage" />;
}

export default React.memo(RedirectManager);
