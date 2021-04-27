import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./screens/Home.js";
import Login from "./screens/Login.js";
import Signup from "./screens/Signup.js";
import NotFound from "./screens/NotFound.js";
import Navbar from "./components/Navbar.js";
import PrivateRoute from "./components/PrivateRoute.js";

export default () => {
  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <PrivateRoute path="/" exact>
            <Home />
          </PrivateRoute>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
