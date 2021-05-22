import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../features/auth.jsx";

const PrivateRoute = ({ children, ...props }) => {
  const { user } = useAuth();

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      render={({ location }) =>
        user ? children : <Redirect to={{ pathname: "/login", state: { from: location } }} />
      }
    />
  );
};

export default PrivateRoute;
