import * as React from "react";
import {
  Provider,
  defaultTheme,
  Flex,
  ActionButton,
} from "@adobe/react-spectrum";
import styled from "styled-components";
import NotAuthenticated from "./components/NotAuthenticated";
import Home from "./components/Home";
import { _SERVICE, ProfileUpdate } from "../../declarations/avatar/avatar.did";
import toast, { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  withRouter,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import CreateProfile from "./components/CreateProfile";
import ManageProfile from "./components/ManageProfile";
import { emptyProfile, useAuthClient, useProfile } from "./hooks";
import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { useEffect } from "react";
import { remove } from "local-storage";
import RedirectManager from "./components/RedirectManager";
import { checkDelegation, getImageString, profilesMatch } from "./utils";

const Header = styled.header`
  position: relative;
  padding: 1rem;
  display: flex;
  justify-content: center;
  h1 {
    margin-top: 0;
  }
  #logout {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

export const AppContext = React.createContext<{
  authClient?: AuthClient;
  setAuthClient?: React.Dispatch<AuthClient>;
  isAuthenticated?: boolean;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  login: () => void;
  logout: () => void;
  actor?: ActorSubclass<_SERVICE>;
  profile?: ProfileUpdate;
  updateProfile?: React.Dispatch<ProfileUpdate>;
  hasLoggedIn: boolean;
  activeImage: string;
  setActiveImage: React.Dispatch<string>;
}>({
  login: () => {},
  logout: () => {},
  profile: emptyProfile,
  hasLoggedIn: false,
  activeImage: "",
  setActiveImage: () => {},
});

const App = () => {
  const history = createBrowserHistory();
  const {
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    actor,
    hasLoggedIn,
  } = useAuthClient();
  const identity = authClient?.getIdentity();
  const { profile, updateProfile } = useProfile({ identity });
  const [activeImage, setActiveImage] = React.useState("");
  const [hasInitializedImage, setHasInitializedImage] = React.useState(false);

  useEffect(() => {
    if (!profile || hasInitializedImage) return;
    const image = profile?.image[0];

    const imageString =
      image && authClient ? getImageString(image, authClient) : "";

    if (!imageString) return;

    setActiveImage(imageString);
    setHasInitializedImage(true);
  }, [hasInitializedImage, profile]);

  console.log(activeImage);

  useEffect(() => {
    if (history.location.pathname === "/") return;

    if (actor) {
      // if (!profile) {
      //   toast.loading("Checking the IC for an existing avatar");
      // }
      actor.read().then((result) => {
        if (history.location.pathname === "/") return;
        if ("ok" in result) {
          // Return if IC profile matches current
          if (profilesMatch(profile, result.ok)) {
            return;
          }
          // toast.success("Updated avatar from IC");
          updateProfile(result.ok);
        } else {
          if ("NotAuthorized" in result.err) {
            // clear local delegation and log in
            toast.error("Your session expired. Please reauthenticate");
            logout();
          } else if ("NotFound" in result.err) {
            // User has deleted account
            remove("profile");
            if (profile) {
              toast.error("Avatar not found in IC. Please try creating again");
            }
            updateProfile(undefined);
          } else {
            toast.error("Error: " + Object.keys(result.err)[0]);
          }
        }
      });
    }
  }, [actor, hasLoggedIn]);

  if (!authClient) return null;

  return (
    <>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: "bottom-center",
        }}
      />
      <ErrorBoundary>
        <AppContext.Provider
          value={{
            authClient,
            setAuthClient,
            isAuthenticated,
            setIsAuthenticated,
            login,
            logout,
            actor,
            profile,
            updateProfile,
            hasLoggedIn,
            activeImage,
            setActiveImage,
          }}
        >
          <Provider theme={defaultTheme}>
            <Router>
              <RedirectManager hasLoggedIn={hasLoggedIn} />
              <Header>
                <Route path="/manage">
                  <ActionButton id="logout" onPress={logout}>
                    Log out
                  </ActionButton>
                </Route>
                <Route path="/create">
                  <ActionButton id="logout" onPress={logout}>
                    Log out
                  </ActionButton>
                </Route>
                <h2>IC Avatar</h2>
              </Header>
              <Main>
                <Flex maxWidth={700} margin="2rem auto" id="main-container">
                  <Switch>
                    <Route path="/" exact>
                      <Flex direction="column">
                        <Home />
                        <NotAuthenticated />
                      </Flex>
                    </Route>
                    <Route path="/manage" exact>
                      <ManageProfile />
                    </Route>
                    <Route path="/create" exact>
                      <CreateProfile />
                    </Route>
                  </Switch>
                </Flex>
              </Main>
            </Router>
          </Provider>
        </AppContext.Provider>
      </ErrorBoundary>
    </>
  );
};

export default React.memo(App);
