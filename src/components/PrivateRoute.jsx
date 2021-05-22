import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../features/auth.jsx";
import routes from "../routes.js";

const PrivateRoute = ({ component, ...props }) => {
  const { user } = useAuth();
  const Component = component;

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      render={({ location }) =>
        user ? (
          <Component />
        ) : (
          <Redirect to={{ pathname: routes.login(), state: { from: location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
