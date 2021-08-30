import React from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../App";
import { emptyProfile } from "../hooks";
import { profilesMatch } from "../utils";

interface Props {}

function RedirectManager(props: Props) {
  const { isAuthenticated, profile } = useContext(AppContext);

  // Logged out
  if (!isAuthenticated) return <Redirect to="/" />;
  // Authenticated but no profile
  if (isAuthenticated && !profile) return <Redirect to="/create" />;
  if (isAuthenticated && profilesMatch(profile, emptyProfile))
    return <Redirect to="/create" />;
  // Logged in with profile
  return <Redirect to="/manage" />;
}

export default RedirectManager;
