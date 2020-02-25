import React, { useState, useEffect } from 'react';
import Layout from './components/layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
/* COMPONENTS */
import PrivateRoute from './components/pritaveRouter';
/* PAGES */
import Home from './pages/home';
import Client from './pages/client';
import Booking from './pages/booking';
import Login from './pages/login';
import { withRouter } from "react-router";
import { AUTH_TOKEN } from './constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateToken = this.updateToken.bind(this);
    this.state = {
      token: localStorage.getItem(AUTH_TOKEN) || null,
    };
  }

  updateToken = (token) => {
    this.setState({
      token
    });
  }
  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
    this.updateToken(token);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Layout token={this.state.token}>
            <Route exact path="/" >
              <Home token={this.state.token} updateToken={this.updateToken} />
            </Route>
            <Route exact path="/booking" component={withRouter(Booking)} />
            <Route exact path="/client" component={withRouter(Client)} />
            <Route exact path="/login" >
              <Login save={this._saveUserData} updateToken={this.updateToken}  />
            </Route>
          </Layout>
        </Switch>
      </Router >
    );
  }
};

export default App;
