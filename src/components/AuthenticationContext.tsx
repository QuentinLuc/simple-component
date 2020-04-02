import { User, UserManager, UserManagerSettings } from "oidc-client";
import React, { useEffect, useState } from "react";

export interface AuthProviderProps {
  signinCallback: string;
  signoutCallback: string;
}

export const AuthenticationContext = React.createContext<{
  token: string;
  user?: User;
}>({ token: "", user: undefined });

class AuthConstants {
  static readonly AUTHORITY = "https://demo.identityserver.io/";
  static readonly CLIENT_ID = "spa";
  static readonly RESPONSE_TYPE = "code";
  static readonly SCOPE = "openid profile email";
}

const createUserManager = (signinCallback: string, signoutCallback: string) => {
  const origin = window.location.origin;

  const userManagerSettings: UserManagerSettings = {
    authority: AuthConstants.AUTHORITY,
    client_id: AuthConstants.CLIENT_ID,
    redirect_uri: `${origin}${signinCallback}`,
    post_logout_redirect_uri: `${origin}${signoutCallback}`,
    response_type: AuthConstants.RESPONSE_TYPE,
    scope: AuthConstants.SCOPE
  };

  return new UserManager(userManagerSettings);
};

const createAuthContextState = (
  signinCallback: string,
  signoutCallback: string
): {
  token: string;
  isLoggedIn: boolean;
  user?: User;
  userManager: UserManager;
} => {
  return {
    token: "",
    isLoggedIn: false,
    user: undefined,
    userManager: createUserManager(signinCallback, signoutCallback)
  };
};

export const AuthProvider = (props: React.PropsWithChildren<AuthProviderProps>) => {
  const [authState, setState] = useState(createAuthContextState(props.signinCallback, props.signoutCallback));

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
