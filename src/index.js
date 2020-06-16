import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import store from './redux/createStore';
import App from './App';

// save redux states into local storage.
window.onbeforeunload = function(e) {
  const state = store.getState();
  localStorage.setItem(
    'state-login',
    state.loginReducer
  );
  localStorage.setItem(
    'state-token',
    state.tokenReducer
  );
};


/* provide store so that child elements can share this store. */
ReactDOM.render(
      <Provider store={store}>    
        <App />
      </Provider>,
      document.getElementById("root")
    );
