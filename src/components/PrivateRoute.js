import React from "react";
import { useAuth } from "../features/auth.js";
import { Route, Redirect } from "react-router-dom";
import routes from "../routes.js";

const PrivateRoute = ({ children, ...props }) => {
  const { user } = useAuth();

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{ pathname: routes.login, state: { from: location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
