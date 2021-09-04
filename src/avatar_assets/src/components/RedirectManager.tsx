import React from "react";
import { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { AppContext } from "../App";
import { emptyProfile } from "../hooks";
import { profilesMatch } from "../utils";

interface Props {}

function RedirectManager(props: Props) {
  const { isAuthenticated, profile } = useContext(AppContext);
  const history = useHistory();
  const search = history.location.search;

  // Logged out
  if (!isAuthenticated)
    return <Redirect to={`/${search ? `${search}` : ""}`} />;
  // Authenticated but no profile
  if (isAuthenticated && !profile)
    return <Redirect to={`/create${search ? `${search}` : ""}`} />;
  if (isAuthenticated && profilesMatch(profile, emptyProfile))
    return <Redirect to={`/create${search ? `${search}` : ""}`} />;
  // Logged in with profile
  return <Redirect to={`/manage${search ? `${search}` : ""}`} />;
}

export default RedirectManager;
