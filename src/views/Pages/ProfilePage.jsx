import React from "react";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import {
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { PanelHeader, CardAuthor, CardSocials } from "components";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/actions/index';
import NotificationAlert from "react-notification-alert";
import SearchBar from '../../googlemap/SearchBar/SearchBar';
import ValidationService from '../../services/validation/ProfileValidation';    // import validationService
import MapView from '../../googlemap/MapView';
import ChauffeurServiceAPI from '../../services/ChauffeurEntity';    // import ChauffeurService
import CustomerServiceAPI from '../../services/CustomerEntity';    // import CustomerService
import UserServiceAPI from '../../services/UserEntity';    // import UserService

import userBackground from "assets/img/bg5.jpg";
import userAvatar from "assets/img/mike.jpg";

var dataTable=[];

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chauffeurs: [],
      id: 0,
      bMapUpdate: false,
      type : {
        societe: "",
        contact: "",
        email: "",
        phone: "",
        addr: "",
        parent: "",
        manufacturer: "",
        model: "",
        immatriculation: "",
        status: "",
        name: "",
        password: "",
        confirm: "",
        societeState: "",
        contactState: "",
        emailState: "",
        phoneState: "",
        addrState: "",
        parentState: "",
        manufacturerState: "",
        modelState: "",
        immatriculationState: "",
        statusState: "",
        nameState: "",
        passwordState: "",
        confirmState: ""
      }      
    };

    this.validationService = new ValidationService(this); // create an instance of validation    
    this.ChauffeurService = new ChauffeurServiceAPI(this);
    this.CustomerService = new CustomerServiceAPI(this);
    this.UserService = new UserServiceAPI(this);

    this.saveChauffeur = this.saveChauffeur.bind(this);
    this.saveCustomer = this.saveCustomer.bind(this);
    this.save = this.save.bind(this);
  }
  
  componentDidMount() {
    this.getCurrentUserProfile();
    this.getAllChauffeurs();      // Get all Chauffeurs from external api.
  }

  getCurrentUserProfile() {
    const {userValue} = this.props;
    var userRole = 0;
    if (userValue.roles.indexOf("ROLE_CHAUFFEUR") > 0)
      userRole = 1;
    else if (userValue.roles.indexOf("ROLE_CUSTOMER") > 0)
      userRole = 2;
    this.userRole = userRole;

    this.UserService.getProfile()
      .then(data => {      
        var type = this.state.type;
        if (userRole === 0) {
        } 
        else if (userRole === 1) {
          this.setState({ bMapUpdate : true });
          type["societe"] = data.societe;
          type["contact"] = data.contact;
          type["email"] = data.email;
          type["phone"] = data.telephone;
          type["addr"] = data.adresse;
          type["status"] = data.activated?true:false;
          type["manufacturer"] = data.manufacturer;
          type["model"] = data.model;
          type["immatriculation"] = data.immatricualation;
          if (data.parent_chauffeur !== undefined)
            type["parent"] = data.parent_chauffeur.id;
          else
            type["parent"] = -1;
          this.setState({ id: data.id, type: type});
        } 
        else if (userRole === 2) {
          type["name"] = data.contact;
          type["email"] = data.email;
          type["phone"] = data.telephone;
          type["status"] = data.activated?true:false;
          this.setState({ id: data.id, type: type });
        }
      });
  }

  // Get all Chauffeurs from external api.
  getAllChauffeurs() {
    this.ChauffeurService.fetchAll()
      .then(data => {
        dataTable = data;
        dataTable.sort(function(a, b){return a.id > b.id});
        this.setState({ chauffeurs: dataTable });
      });
  }

  saveAdmin() {
    var type = this.state.type;
    this.UserService.fetchAll()
      .then(data => {
        const { userValue } = this.props;
        for (var i = 0; i < data.length; i++) {
          if (data[i].username === userValue.username) {
            this.UserService.edit(data[i].id, data[i].username, type["password"])
              .then(() => {
                var options = {};
                options = {
                  place: "tr",
                  message: "The profile data is saved successfully",
                  type: "info",
                  icon: "now-ui-icons ui-1_bell-53",
                  autoDismiss: 3
                };      
                this.refs.notificationAlert.notificationAlert(options);
              });
          }
        }
      });
  }

  saveChauffeur() {
    var type = this.state.type;
    this.ChauffeurService.edit(this.state.id, type["societe"], type["contact"], type["email"], type["phone"], type["addr"],
        type["manufacturer"], type["model"], type["immatriculation"], type["parent"], type["status"] )  // call external api to edit a Chauffeur
      .then(() => {
        this.UserService.fetchAll()
          .then(data => {
            const { userValue } = this.props;
            for (var i = 0; i < data.length; i++) {
              if (data[i].username === userValue.username) {
                this.UserService.edit(data[i].id, data[i].username, type["password"])
                  .then(() => {
                    var options = {};
                    options = {
                      place: "tr",
                      message: "The profile data is saved successfully",
                      type: "info",
                      icon: "now-ui-icons ui-1_bell-53",
                      autoDismiss: 3
                    };      
                    this.refs.notificationAlert.notificationAlert(options);
                  });
              }
            }
          });
        
      });
  }

  saveCustomer() {
    var type = this.state.type;
    this.CustomerService.edit(this.state.id, type["name"], type["email"], type["phone"], type["status"])  // call external api to edit a customer
    .then(() => {
      this.UserService.fetchAll()
        .then(data => {
          const { userValue } = this.props;
          for (var i = 0; i < data.length; i++) {
            if (data[i].username === userValue.username) {
              this.UserService.edit(data[i].id, data[i].username, type["password"])
                .then(() => {
                  var options = {};
                  options = {
                    place: "tr",
                    message: "The profile data is saved successfully",
                    type: "info",
                    icon: "now-ui-icons ui-1_bell-53",
                    autoDismiss: 3
                  };      
                  this.refs.notificationAlert.notificationAlert(options);
                });
            }
          }
        });
      
    });
  }

  setMapUpdate(bUpdate) {
    if (this.state.bMapUpdate !== bUpdate)
        this.setState({ bMapUpdate : bUpdate });
  }

  disableMapUpdate() {
    this.setMapUpdate(false);
  }
  
  enableMapUpdate() {
    this.setMapUpdate(true);
  }

  onErrorAddr() {
    var type = this.state.type;
    type["addrState"] = "has-danger";
    this.setState({ type });
  }

  save() {
    if (this.validationService.isFormValid()) {
      if (this.userRole === 0) {
        this.saveAdmin();
      }
      else if (this.userRole === 1) {
        this.saveChauffeur();
      }
      else if (this.userRole === 2) {
        this.saveCustomer();
      }
    }
  }

  render() {
    return (
      <div>
        <NotificationAlert ref="notificationAlert" />
        <PanelHeader size="sm" />
        <div className="content">
          <Row>
            <Col md={8} xs={12}>
              <Card>
                <CardHeader>
                  <h5 className="title">Edit Profile</h5>
                </CardHeader>
                <CardBody>
                  {
                    this.userRole === 1 && (
                    <form>
                      <Row>
                        <div className="col-md-3 pr-1">
                          <FormGroup className={this.state.type.societeState}>
                              <Label>Societe : </Label>
                              <Input
                                type="text"
                                value={this.state.type["societe"]}
                                onChange={e => this.validationService.typeSociete(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.contactState}>
                              <Label>Contact : </Label>
                              <Input
                                type="text"
                                value={this.state.type["contact"]}
                                onChange={e => this.validationService.typeContact(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.emailState}>
                              <Label>Email : </Label>
                              <Input
                                type="text"
                                value={this.state.type["email"]}
                                onChange={e => this.validationService.typeEmail(e)}
                                readOnly
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-6 pr-1">
                          <FormGroup className={this.state.type.passwordState}>
                              <Label>Password : </Label>
                              <Input
                                type="password"
                                value={this.state.type["password"]}
                                onChange={e => this.validationService.typePassword(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-6 pr-1">
                          <FormGroup className={this.state.type.confirmState}>
                              <Label>Confirm : </Label>
                              <Input
                                type="password"
                                value={this.state.type["confirm"]}
                                onChange={e => this.validationService.typeConfirm(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-5 pr-1">
                          <FormGroup className={this.state.type.phoneState}>
                              <Label>Telephone : </Label>
                              <Input
                                type="text"
                                value={this.state.type["phone"]}
                                onChange={e => this.validationService.typePhone(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.parentState}>
                              <Label>Chauffeur : </Label>
                              <Select
                                name="selectChauffeur"
                                value={this.state.type.parent}
                                onChange={e => this.validationService.typeParent(e)}
                                options={
                                    this.state.chauffeurs.map((prop, key) => {
                                        return { value: prop.id, label: prop.contact };
                                    })
                                }
                                clearable={false}
                                style={this.state.type.parentState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.manufacturerState}>
                              <Label>Car Manufacturer : </Label>
                              <Input
                                type="text"
                                value={this.state.type["manufacturer"]}
                                onChange={e => this.validationService.typeManufacturer(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.modelState}>
                              <Label>Car Model : </Label>
                              <Input
                                type="text"
                                value={this.state.type["model"]}
                                onChange={e => this.validationService.typeModel(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.immatriculationState}>
                              <Label>Car Immatriculation : </Label>
                              <Input
                                type="text"
                                value={this.state.type["immatriculation"]}
                                onChange={e => this.validationService.typeImmatriculation(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-12 pr-1">
                          <FormGroup className={this.state.type.addrState}>
                              <Label>Address :  </Label>
                              <SearchBar  
                                value={this.state.type["addr"]}
                                onChange={e => this.validationService.typeAddr(e)}
                                onError={this.onErrorAddr}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-12 pr-1" style={{ height: 250 }}>
                        <MapView location={this.state.type["addr"]}     
                          onError={this.onErrorAddr} validData={ this.state.bMapUpdate } style={{ width: '100%', height: '100%', marginLeft: 20 }} />
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.statusState}>
                              <Label>Status : </Label>
                              <Select
                                name="selectStatus"
                                value={this.state.type.status}
                                onChange={e => this.validationService.typeStatus(e)}
                                options={[
                                  {label: "Active", value: true},
                                  {label: "Inactive", value: false}
                                ]}
                                style={this.state.type.statusState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                    </form>
                    )
                  }
                  {
                    this.userRole === 2 && (
                    <form>
                      <Row>
                        <div className="col-md-3 pr-1">
                          <FormGroup className={this.state.type.nameState}>
                              <Label>Name : </Label>
                              <Input
                                type="text"
                                value={this.state.type["name"]}
                                onChange={e => this.validationService.typeName(e)}
                              />
                          </FormGroup>
                        </div>
                        <div className="col-md-5 pr-1">
                          <FormGroup className={this.state.type.emailState}>
                              <Label>Email : </Label>
                              <Input
                                type="text"
                                value={this.state.type["email"]}
                                onChange={e => this.validationService.typeEmail(e)}
                                readOnly
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-9 pr-1">
                          <FormGroup className={this.state.type.passwordState}>
                              <Label>Password : </Label>
                              <Input
                                type="password"
                                value={this.state.type["password"]}
                                onChange={e => this.validationService.typePassword(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-9 pr-1">
                          <FormGroup className={this.state.type.confirmState}>
                              <Label>Confirm : </Label>
                              <Input
                                type="password"
                                value={this.state.type["confirm"]}
                                onChange={e => this.validationService.typeConfirm(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-5 pr-1">
                          <FormGroup className={this.state.type.phoneState}>
                              <Label>Telephone : </Label>
                              <Input
                                type="text"
                                value={this.state.type["phone"]}
                                onChange={e => this.validationService.typePhone(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-4 pr-1">
                          <FormGroup className={this.state.type.statusState}>
                              <Label>Status : </Label>
                              <Select
                                name="selectStatus"
                                value={this.state.type.status}
                                onChange={e => this.validationService.typeStatus(e)}
                                options={[
                                  {label: "Active", value: true},
                                  {label: "Inactive", value: false}
                                ]}
                                style={this.state.type.statusState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                    </form>
                    )
                  }
                  {
                    this.userRole === 0 && (
                    <form>
                      <Row>
                        <div className="col-md-9 pr-1">
                          <FormGroup className={this.state.type.passwordState}>
                              <Label>Password : </Label>
                              <Input
                                type="password"
                                value={this.state.type["password"]}
                                onChange={e => this.validationService.typePassword(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                      <Row>
                        <div className="col-md-9 pr-1">
                          <FormGroup className={this.state.type.confirmState}>
                              <Label>Confirm : </Label>
                              <Input
                                type="password"
                                value={this.state.type["confirm"]}
                                onChange={e => this.validationService.typeConfirm(e)}
                              />
                          </FormGroup>
                        </div>
                      </Row>
                    </form>
                    )
                  }
                  <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Button color="info" className="pull-right" onClick={this.save}>Save</Button>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md={4} xs={12}>
              <Card className="card-user">
                <div className="image">
                  <img src={userBackground} alt="..." />
                </div>
                <CardBody>
                  <CardAuthor
                    avatar={userAvatar}
                    avatarAlt="..."
                    title="Mike Andrew"
                    description="michael23"
                  />
                  <p className="description text-center">
                    "Lamborghini Mercy <br />
                    Your chick she so thirsty <br />
                    I'm in that two seat Lambo"
                  </p>
                </CardBody>
                <hr />
                <CardSocials
                  size="lg"
                  socials={[
                    {
                      icon: "fa fa-facebook-square",
                      href: "https://www.facebook.com/"
                    },
                    {
                      icon: "fa fa-twitter",
                      href: "https://www.facebook.com/"
                    },
                    {
                      icon: "fa fa-google-plus-square",
                      href: "https://plus.google.com/discover"
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  userValue: store.userReducer
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
