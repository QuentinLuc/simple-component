import { User, UserManager, UserManagerSettings } from "oidc-client";
import React, { useEffect, useState } from "react";

class AuthConstants {
  static readonly AUTHORITY = "https://demo.identityserver.io/";
  static readonly CLIENT_ID = "spa";
  static readonly REDIRECT_URI = "/examples/src/signin-callback.html";
  static readonly POST_LOGOUT_REDIRECT_URI = "/signout-callback.html";
  static readonly RESPONSE_TYPE = "code";
  static readonly SCOPE = "openid profile email";
}

export const AuthenticationContext = React.createContext<{
  token: string;
  user?: User;
}>({ token: "", user: undefined });

const createUserManager = () => {
  const origin = window.location.origin;

  const userManagerSettings: UserManagerSettings = {
    authority: AuthConstants.AUTHORITY,
    client_id: AuthConstants.CLIENT_ID,
    redirect_uri: `${origin}${AuthConstants.REDIRECT_URI}`,
    post_logout_redirect_uri: `${origin}${AuthConstants.POST_LOGOUT_REDIRECT_URI}`,
    response_type: AuthConstants.RESPONSE_TYPE,
    scope: AuthConstants.SCOPE
  };

  return new UserManager(userManagerSettings);
};

const createAuthContextState = (): {
  token: string;
  isLoggedIn: boolean;
  user?: User;
  userManager: UserManager;
} => {
  return {
    token: "",
    isLoggedIn: false,
    user: undefined,
    userManager: createUserManager()
  };
};

export const AuthProvider = (props: any) => {
  const [authState, setState] = useState(createAuthContextState());

  useEffect(() => {
    const internalLogin = () => {
      authState.userManager.getUser().then((usr: User | null) => {
        if (!!usr?.access_token) {
          setState(prevState => {
            return {
              token: usr.access_token,
              isLoggedIn: true,
              user: usr,
              userManager: prevState.userManager
            };
          });
        }
        if (!usr) {
          authState.userManager.signinRedirect().then(() => {
            authState.userManager.getUser().then((usr: User | null) => {
              if (!!usr?.access_token) {
                setState(prevState => {
                  return {
                    token: usr.access_token,
                    isLoggedIn: true,
                    user: usr,
                    userManager: prevState.userManager
                  };
                });
              }
            });
          });
        }
      });
    };

    internalLogin();
  }, [authState.userManager]);

  return (
    <AuthenticationContext.Provider value={{ token: authState.token, user: authState.user }}>
      {authState.isLoggedIn ? props.children : null}
    </AuthenticationContext.Provider>
  );
};
