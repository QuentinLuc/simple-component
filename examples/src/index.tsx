import * as React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "../../src/components/AuthenticationContext";

class Container extends React.Component {
  render() {
    return (
      <AuthProvider>
        <p>You're authenticated</p>
      </AuthProvider>
    );
  }
}

ReactDOM.render(<Container />, document.getElementById("root"));
