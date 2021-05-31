import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';
import routes from '../routes.js';

const PrivateRoute = ({ component, ...props }) => {
  const { user } = useAuth();
  const Component = component;

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      render={({ location }) => {
        const to = { pathname: routes.login(), state: { from: location } };
        return user ? (
          <Component />
        ) : (
          <Redirect to={to} />
        );
      }}
    />
  );
};

export default PrivateRoute;
