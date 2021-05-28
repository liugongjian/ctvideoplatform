import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// import { reducer as reduxAsyncConnect } from 'redux-async-connect';
// import createHistory from 'history/createHashHistory'; // 兼容IE
// 兼容IE
// import { createHashHistory } from 'history';
import { createBrowserHistory as createHistory } from 'history';
import {
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';

import reduxPromise from 'Common/reduxPromise';
import reducers from 'Redux/reducer/index';
// Or wherever you keep your reducers

// const createHistory = createHashHistory;

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
function logger({ getState, dispatch }) {
  return next => (action) => {
    console.log('will dispatch', action);
    console.log('===><', typeof action.promise);
    if (action.promise && typeof action.promise.then === 'function') {
      action.promise.then((data) => {
        console.log('加载完成!');
        dispatch({ type: 'loaded', data });
      });
      // return action(dispatch, getState, extraArgument);
    }

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    const returnValue = next(action);

    console.log('state after dispatch', getState());

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}

const promise = ({ dispatch, getState }) => next => (action) => {
  console.log('===>', typeof action.promise);
  if (typeof action.promise === 'function') {
    action.promise.then((data) => {
      console.log('加载完成');
      dispatch({ type: 'loaded', data });
    });
    // return action(dispatch, getState, extraArgument);
  }

  return next(action);
};

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  composeWithDevTools(applyMiddleware(middleware, reduxPromise)),
);

if (__DEVELOPMENT__ && module.hot) {
  console.log('-----');
  module.hot.accept('./reducer/index', () => {
    console.log('===>>>>>>>>>>>>>');
    import('./reducer/index').then((module) => {
      store.replaceReducer(module.default);
    });
  });
}

export { store, history };
