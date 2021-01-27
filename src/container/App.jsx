import React from 'react';
import {
  Route, Switch
} from 'react-router-dom';
import LoginContainer from 'Common/LoginContainer';
import Login from 'Views/login';
import Header from './Header/Header';
import Manage from './Manage';
import Footer from './Footer/Footer';

export default () => (
  // <LoginContainer>
  <div style={{ height: '100%' }}>
    <Header />
    <Manage />
    <Footer />
    <Switch>
      <Route path="/login" exact component={Login} />
    </Switch>
  </div>
  // </LoginContainer>
);
