import React, { useState, useEffect } from 'react';
import Layout from './components/layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

/* PAGES */
import Home from './pages/home';
import Client from './pages/client';
import Booking from './pages/booking';
import Subsidiary from './pages/subsidiary';
import Employee from './pages/employee';
import Service from './pages/service';
import Configuration from './pages/configuration';
import Login from './pages/login';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Layout >
          <Route exact path="/" >
            <Home />
          </Route>
          <Route exact path="/booking" >
             <Booking />
          </Route>
          <Route exact path="/client">
             <Client />
          </Route>
          <Route exact path="/subsidiary">
             <Subsidiary />
          </Route>
          <Route exact path="/employee">
             <Employee />
          </Route>
          <Route exact path="/service">
             <Service />
          </Route>
          <Route exact path="/configuration">
             <Configuration />
          </Route>
          <Route exact path="/login" >
             <Login />
          </Route>
        </Layout>
      </Switch>
    </Router >
  );
};

export default App;
