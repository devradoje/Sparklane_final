import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Switch, Redirect } from "react-router-dom";
import { Footer } from "components";
import pagesRoutes from "routes/pages.jsx";
import { AuthRoute, UnauthRoute } from "react-router-auth";
import { connect } from 'react-redux';

var ps;

class Pages extends React.Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.fullPages);
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { store } = this.props;
    return (
      <div>
        <div className="wrapper wrapper-full-page" ref="fullPages">
          <div className="full-page section-image">
            <Switch>
              {
                pagesRoutes.map((prop, key) => {
                  if (prop.redirect === true)
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  var loginState = store.loginReducer;            // Get login state value from redux store.
                  if (prop.path !== "/pages/login-page")          // if current url is not a login's url, then check login state.
                  {
                    // if current user did not sign in, then redirect to signin page. 
                    return (
                      <AuthRoute component={prop.component} from={prop.path} redirectTo="/pages/login-page" 
                         authenticated={loginState} key={key} />
                    );
                  }
                  else                                             // if current url is a login's url, then also check login state.
                  {
                    // if current user already signed in, then redirect to dashboard page.
                    return (
                      <UnauthRoute path={prop.path} component={prop.component} redirectTo="/" 
                        authenticated={loginState} key={key} />
                    );
                  }
                })
              }
            </Switch>
            <Footer fluid />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
    store: store,
});
export default connect(mapStateToProps)(Pages);     // connect redux store to this page.