import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./screens/Home.js";
import Login from "./screens/Login.js";
import NotFound from "./screens/NotFound.js";
import { Provider as AuthProvider } from "./features/auth.js";

export default () => {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <div>
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};
