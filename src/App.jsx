import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './screens/Home.jsx';
import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
import NotFound from './screens/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import routes from './routes.js';

export default function App() {
  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar />
        <Switch>
          <Route path={routes.login()} exact component={Login} />
          <Route path={routes.signup()} exact component={Signup} />
          <PrivateRoute path={routes.home()} exact component={Home} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}
