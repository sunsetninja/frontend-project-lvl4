import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./screens/Home.jsx";
import Login from "./screens/Login.jsx";
import Signup from "./screens/Signup.jsx";
import NotFound from "./screens/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export default function App() {
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
}
