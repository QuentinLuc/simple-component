import * as React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "../../src/components/AuthenticationContext";

export const Container = () => {
  const props = {
    signinCallback: "/examples/src/signin-callback.html",
    signoutCallback: ""
  };

  return (
    <AuthProvider {...props}>
      <p>You're authenticated</p>
    </AuthProvider>
  );
};

ReactDOM.render(<Container />, document.getElementById("root"));
