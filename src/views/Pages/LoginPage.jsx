import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";

import NotificationAlert from "react-notification-alert";
import { Button } from "components";
import bgImage from "assets/img/bg14.jpg";
import API from "../../api";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/actions/index';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "test@klh-competence.com",
      password: "Malakoff92240%"
    };
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    const { infoValue, clrinfo } = this.props;
    if (infoValue === 'token_error') {
      clrinfo();
      let options = {};
      options = {
        place: "tr",
        message: "Token Error : Invalid token is detected.",
        type: "warning",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 3
      };            
      this.refs.notificationAlert.notificationAlert(options);
    }
    else if (infoValue === 'logout_success') {
      clrinfo();
      let options = {};
      options = {
        place: "tr",
        message: "You are signed out successfully.",
        type: "info",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 3
      };            
      this.refs.notificationAlert.notificationAlert(options);
    }
  }

  login() {
    var username = this.state.username;
    var password = this.state.password;
    // signin();
    API.post("login_check", {
      'username' : username,
      'password' : password
    }).then(res => {
      const {signin, settoken, setinfo, setuser} = this.props;
      if (res.statusText === "OK") {
        let tokenStr = res.data.token;
        let decodeStr = atob(tokenStr.split('.')[1]);
        var obj = JSON.parse(decodeStr);
        setuser(obj);
        settoken(res.data.token);
        setinfo("login_success");
        signin();
      }
      else {
        var options = {};
        options = {
          place: "tr",
          message: "Signin Error : Invalid username or password",
          type: "warning",
          icon: "now-ui-icons ui-1_bell-53",
          autoDismiss: 3
        };            
        this.refs.notificationAlert.notificationAlert(options);
      }
    })
    .catch(error => {
      var options = {};
      options = {
        place: "tr",
        message: "Signin Error : Invalid username or password",
        type: "warning",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 3
      };            
      this.refs.notificationAlert.notificationAlert(options);
    })
  }

  usernameChange(e){
    this.setState({username: e.target.value});
  }
  
  passwordChange(e){
    this.setState({password: e.target.value});
  }

  render() {
    return (
      <div>
        <NotificationAlert ref="notificationAlert" />
        <div className="full-page-content">
          <div className="login-page">
            <Container>
              <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
                <Form>
                  <Card className="card-login card-plain">
                    <CardHeader>
                      <div className="logo-container">
                      </div>
                    </CardHeader>
                    <CardBody>
                      <InputGroup
                        size="lg"
                        className={
                          "no-border " +
                          (this.state.usernameFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon>
                          <i className="now-ui-icons users_circle-08" />
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username..."
                          value={this.state.username}
                          onChange={e => this.usernameChange(e)}
                          onFocus={e => this.setState({ usernameFocus: true })}
                          onBlur={e => this.setState({ usernameFocus: false })}
                        />
                      </InputGroup>
                      <InputGroup
                        size="lg"
                        className={
                          "no-border " +
                          (this.state.passwordFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon>
                          <i className="now-ui-icons text_caps-small" />
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password..."
                          value={this.state.password}
                          onChange={e => this.passwordChange(e)}
                          onFocus={e => this.setState({ passwordFocus: true })}
                          onBlur={e => this.setState({ passwordFocus: false })}
                        />
                      </InputGroup>
                    </CardBody>
                    <CardFooter>
                      <Button
                        color="primary"
                        size="lg"
                        block
                        round
                        onClick={this.login}
                      >
                        Sign in
                      </Button>
                      
                    </CardFooter>
                  </Card>
                </Form>
              </Col>
            </Container>
          </div>
        </div>
        <div
          className="full-page-background"
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        />
      </div>
    );
  }
}

const mapStateToProps = store => ({
  tokenValue: store.tokenReducer,
  infoValue: store.infoReducer,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);