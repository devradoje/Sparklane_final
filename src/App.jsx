import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { AuthRoute } from "react-router-auth";
import {connect} from "react-redux";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.css?v=1.1.1";
import "assets/css/demo.css";

import indexRoutes from "routes/index.jsx"; 

const hist = createBrowserHistory();

class App extends React.Component {
    render() {
        const {store} = this.props;
      return (
        <Router history={hist}>
            <Switch>
            {indexRoutes.map((prop, key) => {
                if (prop.needAuth === true)
                    return (
                        <AuthRoute component={prop.component} from={prop.path} redirectTo="/pages/login-page" 
                        authenticated={store.loginReducer} key={key} />
                    );
                else
                    return (<Route component={prop.component} key={key} path={prop.path}></Route>);
            })}
            </Switch>
        </Router>
      )
    }
  }

const mapStateToProps = store => ({
    store: store,
});
export default connect(mapStateToProps)(App);