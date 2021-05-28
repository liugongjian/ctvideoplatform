import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { hot } from 'react-hot-loader';

import { store, history } from 'Redux/store';
// import { App } from 'Container/index';
import createRouters from 'Setting/routeconfig';

const Root = () => (
  <Provider store={store}>
    {/* ConnectedRouter will use the store from Provider automatically */}
    <ConnectedRouter history={history}>
      {/* <App /> */}
      {createRouters()}
    </ConnectedRouter>
  </Provider>
);

let mRoot = null;
if (__DEVELOPMENT__) {
  mRoot = hot(module)(Root);
} else {
  mRoot = Root;
}

const MyRoot = mRoot;

export default MyRoot;
