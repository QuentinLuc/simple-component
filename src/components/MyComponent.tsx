import { AuthenticationContext } from "@letsbuilders/authentication";
import React, { useContext } from "react";

export const MyComponent = () => {
  const userContext = useContext(AuthenticationContext);

  return (
    <p>
      Hello <span>{userContext.user?.profile.name}</span>!
    </p>
  );
};
