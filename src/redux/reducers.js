import { combineReducers } from 'redux';

// Load saved state values from local storage.

// Default state values
var initialLoginState = false;
var initialTokenState = "";
var initialUserState = {};

var loginState = null;
var loginString = localStorage.getItem('state-login');

// parse login state value
if (loginString !== null ) {
  if (loginString === "true")
    loginState = true;
  else if (loginString === "false")
    loginState = false;
}
var tokenState = localStorage.getItem('state-token');
var userState = null;

if (tokenState !== null && tokenState !== "") {
  var decodeStr = atob(tokenState.split('.')[1]);
  userState = JSON.parse(decodeStr);
}

const defaultLoginState = loginState || initialLoginState;
const defaultTokenState = tokenState || initialTokenState;
const defaultUserState = userState || initialUserState;

// This reducer contains the login state.   ture or false.
const loginReducer = (state = defaultLoginState, action) => {
    switch (action.type) {
      case 'SIGNIN':
        state = true;
        break;
      case 'SIGNOUT':
        state = false;
        break;
      default:
    }
    return state;
  }

// This reducer contains the token value.
const tokenReducer = (state = defaultTokenState, action) => {
    switch (action.type) {
      case 'SETTOKEN':
        state = action.token;
        break;
      case 'CLRTOKEN':
        state = "";
        break;
      default:
    }
    return state;
  }

// This reducer contains the token value.
const infoReducer = (state = "", action) => {
  switch (action.type) {
    case 'SETINFO':
      state = action.info;
      break;
    case 'CLRINFO':
      state = "";
      break;
    default:
  }
  return state;
}

const userReducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case 'SETUSER':
      state = action.user;
      break;
    case 'CLRUSER':
      state = null;
      break;
    default:
  }
  return state;
}
    
export default combineReducers({loginReducer, tokenReducer, infoReducer, userReducer});   // export reducers.