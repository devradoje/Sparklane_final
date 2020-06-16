import React, { Component } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import { Card, CardBody, CardHeader, CardTitle, Row, Col,
        Modal, ModalHeader, ModalBody, ModalFooter,
        Input, Label, FormGroup
    } from "reactstrap";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import NotificationAlert from "react-notification-alert";
import Radium from 'radium';
import { PanelHeader, Button } from "components";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/actions/index';
import ChauffeurServiceAPI from '../../services/ChauffeurEntity';    // import ChauffeurService
import ReactFileReader from 'react-file-reader';
import Papa from 'papaparse';
import ReactTooltip from 'react-tooltip';
import MapView from '../../googlemap/MapView';
import SearchBar from '../../googlemap/SearchBar/SearchBar';
import ValidationService from '../../services/validation/ChauffeurValidation';    // import validationService
import "../../assets/css/mstyle.css";

var dataTable = [];   // All Chauffeur table data is stored here.

// This component is for Chauffeur Page.
class ChauffeurPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal: false,
      date: new Date(),
      data: [],
      chauffeurs: [],
      type: {
        societe: "",     
        contact: "",     
        email: "",       
        phone: "",       
        addr: "",
        manufacturer: "",
        model: "",
        immatriculation: "",
        parent: "",     
        activated: false,
        societeState: "",
        contactState: "",
        emailState: "",  
        phoneState: "",  
        addrState: "",
        manufacturerState: "",
        modelState: "",
        immatriculationState: "",
        parentState: "",
        activatedState: "",
        
        showsociete: "",
        showcontact: "",
        showemail: "",
        showphone: "",
        showaddr: ""
      },
      bMapUpdate: false,
      editFullscreen: false,
      showFullscreen: false,
      modalType: "",        // add or edit, this represents whether the modal is for adding or editing.
      curKey: 0             // This is the id of current editing Chauffeur.
    };

    this.ChauffeurService = new ChauffeurServiceAPI(this);
    this.validationService = new ValidationService(this); // create an instance of validation

    this.toggle = this.toggle.bind(this);
    this.addChauffeur = this.addChauffeur.bind(this);
    this.editChauffeur = this.editChauffeur.bind(this);
    this.addToggle = this.addToggle.bind(this);
    this.editToggle = this.editToggle.bind(this);
    this.showToggle = this.showToggle.bind(this);
    this.onErrorAddr = this.onErrorAddr.bind(this);
    this.initData = this.initData.bind(this);
    this.initDataFromCSV = this.initDataFromCSV.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);
    this.onShowFullScreen = this.onShowFullScreen.bind(this);
  }

  componentWillMount() {
      this.getAllChauffeurs();      // Get all Chauffeurs from external api.
  }

  // Get all Chauffeurs from external api.
  getAllChauffeurs() {
    this.ChauffeurService.fetchAll()
      .then(data => {
        dataTable = data;                         // set received data to dataTable so that 
        dataTable.sort(function(a, b){return a.id > b.id});
        this.setState({ chauffeurs: dataTable });
        this.initData();                          //    initData() method can init table with it.
      });
  }

  // Get a specified Chauffeur from database.
  getChauffeur(id) {
    this.ChauffeurService.fetch(id)
      .then(data => {
      });
  } 

  // init table with loaded data from CSV file
  initDataFromCSV() {
    this.setState({ data: dataTable.map((prop, key) => {
        var fulladdr = prop[4];
        var addr = fulladdr.split(',').pop(); 
        return this.produceChauffeur(prop[0], prop[1], prop[2], prop[3], addr, fulladdr);
      }) });
  }

  // Read and parse a CSV file.
  handleCSV = files => {
    var object = this;
    Papa.parse(files[0], {
      delimiter: ";",
      complete: function(results) {
          dataTable = results.data;
          object.initDataFromCSV();
      }
    });
  }

  // init table with received data from external api
  initData() {
    this.setState({ data: dataTable.map((prop, key) => {
        var fulladdr = prop.adresse;
        var addr = fulladdr.split(',').pop(); 
        var chauf_id = -1, chauf_name = "";
        if (prop.parent_chauffeur !== undefined) {
          chauf_id = prop.parent_chauffeur.id;
          chauf_name = prop.parent_chauffeur.contact;
        }
        return this.produceChauffeur(prop.id, prop.societe, prop.contact, prop.email, prop.telephone, addr, fulladdr,
            prop.manufacturer, prop.model, prop.immatricualation, chauf_id, chauf_name, prop.activated);
      }) });
  }

  redirectToCalendar(id) {
    const {history} = this.props;
    history.push("/calendar-page/chauffeur/" + id);
  }
  
  // Produce a Chauffeur element from data to add into Chauffeur table.
  produceChauffeur(id, societe, contact, email, telephone, addr, fulladdr, manufacturer, model, immatriculation, parent_id, parent_name, activated) 
  {
    var key = id;
    // remove all spaces
    return {
        id: key,
        societe: societe,
        contact: contact,
        email: email,
        phone: telephone,
        parent_name:  parent_name,
        manufacturer: manufacturer,
        model: model,
        immatriculation: immatriculation,
        parent: parent_id,
        activated: activated?true:false,
        activatedString: activated?"Active":"Inactive",
        addr: (
          <div>
          <div data-tip data-for={'addr1Tooltip'+key} style={{ cursor: "default" }}>
              { addr }
          </div>
          <ReactTooltip id={'addr1Tooltip'+key} place='bottom' effect='float'>
            <span>{ fulladdr }</span>
          </ReactTooltip>
          </div>
        ),
        fulladdr: fulladdr,
        actions: (
            // we've added some custom button actions
            <div className="actions-right">
            {/* use this button to add a edit kind of action */}
            <Button 
                color="success"
                size="sm"
                round
                icon
                onClick={() => {
                    this.redirectToCalendar(key);           // Launch the edit modal
                }} >
                <i className="fa fa-calendar" />
            </Button>{" "}
            <Button
                onClick={() => {
                    let obj = this.state.data.find(o => o.id === key);
                    this.editToggle(obj);           // Launch the edit modal
                }}
                color="warning"
                size="sm"
                round
                icon
            >
                <i className="fa fa-edit" />
            </Button>{" "}
            {/* use this button to remove the data row */}
            <Button
                onClick={() => {
                var data = this.state.data;
                data.find((o, i) => {
                    if (o.id === key) {
                      data.splice(i, 1);                      // Delete from table.
                      this.ChauffeurService.delete(o.id).then(res => {
                        var options = {};
                        options = {
                          place: "tr",
                          message: "One chauffeur is deleted.",
                          type: "info",
                          icon: "now-ui-icons ui-1_bell-53",
                          autoDismiss: 3
                        };            
                        this.refs.notificationAlert.notificationAlert(options);
                      });
                      return true;
                    }
                    return false;
                });
                this.setState({ data: data });
                }}
                color="danger"
                size="sm"
                round
                icon
            >
                <i className="fa fa-times" />
            </Button>{" "}
            <Button
                onClick={() => {               
                  let obj = this.state.data.find(o => o.id === key);
                  this.showingToggle(obj);   
                }}
                color="info"
                size="sm"
                round
                icon
            >
                <i className="fa fa-eye" />
            </Button>{" "}
            </div>
        )
    };
  }

  onFullScreen() {
    this.setState({ editFullscreen: !this.state.editFullscreen });
  }

  onShowFullScreen() {
    this.setState({ showFullscreen: !this.state.showFullscreen });
  }

  // Invert the modal status.
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  // Launch add modal.
  addToggle() {
    this.setState({ modalType: "add" });      // set modal type as "add".
    var type = this.state.type;
    // init modal data.
    type["societeState"] = type["addrState"] = type["contactState"] = type["emailState"] = type["phoneState"] = type["manufacturerState"] = type["modelState"] = type["immatriculationState"] = type["parentState"] = type["activatedState"] = "";
    type["societe"] = "";
    type["addr"] = "";
    type["contact"] = "";
    type["email"] = "";
    type["phone"] = "";
    type["manufacturer"] = "";
    type["model"] = "";
    type["immatriculation"] = "";
    type["parent"] = -1;
    type["activated"] = false;
    
    this.setState({ type });    
    this.setState({ editFullscreen: false });
    this.toggle();              // launch modal.
  }

  // Launch edit modal.
  editToggle(obj) {
    this.setState({ curKey: obj.id });           // set id of current editing Chauffeur.
    this.setState({ modalType: "edit" });        // set modal type as "edit".
    var type = this.state.type;

    this.setState({ bMapUpdate : true });
    // set modal data
    type["societe"] = obj.societe;
    type["contact"] = obj.contact;
    type["email"] = obj.email;
    type["addr"] = obj.fulladdr;
    type["phone"] = obj.phone;
    type["manufacturer"] = obj.manufacturer;
    type["model"] = obj.model;
    type["immatriculation"] = obj.immatriculation;
    type["parent"] = obj.parent;
    type["activated"] = obj.activated;

    this.setState({ type });
    this.setState({ editFullscreen: false });

    this.validationService.isFormValid();         // check the modal form if its data is valid. 
    this.toggle();              // launch modal.
  }

  showToggle() {
    this.setState({ showFullscreen: false });
    this.setState({
      showModal: !this.state.showModal
    });
  }

  showingToggle(obj) {
    var type = this.state.type;

    // set modal data
    type["showsociete"] = obj.societe;
    type["showcontact"] = obj.contact;
    type["showemail"] = obj.email;
    type["showaddr"] = obj.fulladdr;
    type["showphone"] = obj.phone;

    this.setState({ type });
    this.setState({
      showModal: !this.state.showModal
    });
  }

  // This method is called when we press "Add" button in add modal.
  addChauffeur() {
    if (this.validationService.isFormValid())     // check the modal form if its data is valid.
    {
        var type = this.state.type;
        // call external api to add a new Chauffeur
        // add a new Chauffeur to table.
        this.ChauffeurService.add( type["societe"], type["contact"], type["email"], type["phone"], type["addr"], type["manufacturer"],
              type["model"], type["immatriculation"], type["parent"], type["activated"] )
          .then(res => {
            var id = res.id;
            var fulladdr = type["addr"];
            var addr = fulladdr.split(',').pop(); 
            var data = this.state.data;
            var parent_name = "";
            this.state.chauffeurs.map((prop, key) => {
              if (prop.id === type["parent"]) {
                parent_name = prop.contact;
              }
              return prop.contact;
            });

            data.push( this.produceChauffeur(id, type["societe"], type["contact"], type["email"], type["phone"], addr, fulladdr,
              type["manufacturer"], type["model"], type["immatriculation"], type["parent"], parent_name, type["activated"] ));
            this.setState({ data });
            var options = {};
            options = {
              place: "tr",
              message: "A new chauffeur is added successfully.",
              type: "info",
              icon: "now-ui-icons ui-1_bell-53",
              autoDismiss: 3
            };            
            this.refs.notificationAlert.notificationAlert(options);
          });
        
        this.setState({                 // close the modal
            modal: !this.state.modal
        }); 
    }
  }

  editChauffeur() {
    if (this.validationService.isFormValid())    // check the modal form if its data is valid.
    {
        var type = this.state.type;
        var key = this.state.curKey;
        var data = this.state.data;
        data.find((o, i) => {
            if (o.id === key) {
                // here you should add some custom code so you can delete the data
                // from this component and from your server as well

                // set a Chauffeur data.                

                this.ChauffeurService.edit(o.id, type["societe"], type["contact"], type["email"], type["phone"], type["addr"],
                    type["manufacturer"], type["model"], type["immatriculation"], type["parent"], type["activated"] )  // call external api to edit a Chauffeur
                  .then(() => {
                    o.fulladdr = type["addr"];
                    var addr = o.fulladdr.split(',').pop();
                    o.addr = (
                        <div>
                            <div data-tip data-for={'addr1Tooltip'+key} style={{ cursor: "default" }}>
                                { addr }
                            </div>
                            <ReactTooltip id={'addr1Tooltip'+key} place='bottom' effect='float'>
                                <span>{ o.fulladdr }</span>
                            </ReactTooltip>
                        </div>
                    );
                    o.societe = type["societe"];
                    o.contact = type["contact"];
                    o.phone = type["phone"];
                    o.email = type["email"];
                    o.manufacturer = type["manufacturer"];
                    o.model = type["model"];
                    o.immatriculation = type["immatriculation"];
                    o.parent = type["parent"];
                    var parent_name = "";
                    this.state.chauffeurs.map((prop, key) => {
                      if (prop.id === type["parent"]) {
                        parent_name = prop.contact;
                      }
                      return prop.contact;
                    });
                    o.parent_name = parent_name;
                    o.activated = type["activated"];
                    o.activatedString = o.activated?"Active":"Inactive";
                    var options = {};
                    options = {
                      place: "tr",
                      message: "The changed data is saved successfully",
                      type: "info",
                      icon: "now-ui-icons ui-1_bell-53",
                      autoDismiss: 3
                    };     
                    this.setState({ data: data });
                    this.setState({
                        modal: !this.state.modal
                    });       
                    this.refs.notificationAlert.notificationAlert(options);
                  });
                return true;
            }
            return false;
        });
    }
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
  
  render() {
 
    return (
      <div >
        <NotificationAlert ref="notificationAlert" />
        <PanelHeader
          content={
            <div className="header text-center">
              <h2 className="title">Chauffeur</h2>
              <p className="category">
                You can add, edit, delete and show chauffeurs here.
              </p>
            </div>
          }
        />
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <Card>
                <CardHeader>
                    <Row>
                        <Col xs={4} md={4}>
                            <CardTitle>Chauffeur Table</CardTitle>
                        </Col>
                        <Col xs={8} md={8}>
                            <Button color="info" className="pull-right" onClick={this.addToggle}>  {/* Add button */}
                                <i className="fa fa-plus" style={{marginRight: 5}}/> Add
                            </Button>
                            <ReactFileReader handleFiles={this.handleCSV} fileTypes={'.csv'} multipleFiles={false}>
                                <Button data-tip data-for='csvTooltip' color="primary" className="pull-right" style={{marginRight: 10}}
                                       > {/* Load from CSV button */}
                                    <i className="fa fa-download" style={{marginRight: 5}}/> From CSV
                                </Button>
                            </ReactFileReader>
                            <ReactTooltip id='csvTooltip' place='bottom' effect='solid'>
                              <span>Data format is Societe | Contact | Email | Telephone | Adresse </span>
                            </ReactTooltip>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={this.state.data}        // set data to react table.
                    filterable
                    defaultFilterMethod = {(filter, row) => {
                      const id = filter.pivotId || filter.id;
                      return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : true
                    }}
                    columns={[
                      {
                        Header: "Societe",
                        accessor: "societe"
                      },
                      {
                        Header: "Contact",
                        accessor: "contact"
                      },
                      {
                        Header: "Email",
                        accessor: "email"
                      },
                      {
                        Header: "Telephone",
                        accessor: "phone"
                      },
                      {
                        Header: "Adresse",
                        accessor: "addr"
                      },
                      {
                        Header: "Chauffeur",
                        accessor: "parent_name"
                      },
                      {
                        Header: "Car manufacturer",
                        accessor: "manufacturer"
                      },
                      {
                        Header: "Car model",
                        accessor: "model"
                      },
                      {
                        Header: "Car immatriculation",
                        accessor: "immatriculation"
                      },
                      {
                          Header: "Status",
                          accessor: "activatedString"
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                      }
                    ]}
                    defaultPageSize={10}
                    showPaginationTop
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">     {/* Add or Edit modal */}
          <ModalHeader toggle={this.toggle}>{ this.state.modalType==="add"?"New Chauffeur":"Edit Chauffeur" }</ModalHeader>
          <ModalBody className="edit-modal-input">
            <form>
              <Row style={{ marginRight: -30}}>
                <Col sm={12} md={8} style={ this.state.editFullscreen?{ display: 'none' }:{} }>
                <Row>
                    <Label sm={4}>Societe : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.societeState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["societe"]}
                            onChange={e => this.validationService.typeSociete(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Contact : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.contactState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["contact"]}
                            onChange={e => this.validationService.typeContact(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Email : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.emailState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["email"]}
                            onChange={e => this.validationService.typeEmail(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Telephone : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.phoneState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["phone"]}
                            onChange={e => this.validationService.typePhone(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Adresse : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.addrState}>   {/* desc field */}
                            <SearchBar  
                            value={this.state.type["addr"]}
                            onChange={e => this.validationService.typeAddr(e)}
                            onError={this.onErrorAddr}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Chauffeur : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.parentState}>   {/* desc field */}
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
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Car manufacturer : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.manufacturerState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["manufacturer"]}
                            onChange={e => this.validationService.typeManufacturer(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Car model : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.modelState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["model"]}
                            onChange={e => this.validationService.typeModel(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Car immatriculation : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.immatriculationState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["immatriculation"]}
                            onChange={e => this.validationService.typeImmatriculation(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                  <Label sm={4}>Status</Label>
                  <Col xs={12} sm={8}>
                    <FormGroup className={this.state.type.activatedState}>   {/* Name field */}
                      <Select
                        name="selectStatus"
                        value={this.state.type.activated}
                        onChange={e => this.validationService.typeActivated(e)}
                        options={[
                          { value: true, label: "Active" },
                          { value: false, label: "Inactive" }
                        ]}
                        clearable={false}
                        style={this.state.type.statusState === "has-danger" ? { borderColor: "#ff3636", borderRadius: 30 } : { borderColor: "#e3e3e3", borderRadius: 30 }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                </Col>
                <Col sm={12} md={ this.state.editFullscreen?12:4 } style={{ minHeight: 250 }} >
                  <Button className="pull-left btn-sm btn-outline-dark" style={{ marginTop: -25, marginBottom: 3, marginLeft: -15, lineHeight: '1em' }} onClick={this.onFullScreen}>  {/* Add button */}
                    <i className="fa fa-bars"/>
                  </Button>
                  <Row style={{ width: '100%', height: '100%' }}>
                    <MapView location={this.state.type["addr"]}     
                    onError={this.onErrorAddr} validData={ this.state.bMapUpdate } style={{ width: '100%', height: '100%' }} />
                  </Row>
                </Col>
              </Row>
            </form>
          </ModalBody>
          <ModalFooter className="justify-content-baseline" >
            {/* Set button text as "Add" if modal type is add or "Save" if modal type is edit. */}
            <Button color="info" className="pull-right" onClick={this.state.modalType==="add"?this.addChauffeur:this.editChauffeur}>{ this.state.modalType==="add"?"Add":"Save" }</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.showModal} toggle={this.showToggle} className="modal-lg">     {/* Add or Edit modal */}
          <ModalHeader toggle={this.showToggle}>Show Chauffeur</ModalHeader>
          <ModalBody className="edit-modal-input">
            <form>
            <Row style={{ marginRight: -30}}>
                <Col sm={12} md={8} style={ this.state.showFullscreen?{ display: 'none' }:{} }>
                <Row>
                    <Label sm={4}>Societe : </Label>
                    <Col xs={12} sm={8}>
                        <Label>{this.state.type["showsociete"]}</Label>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Contact : </Label>
                    <Col xs={12} sm={8}>
                        <Label>{this.state.type["showcontact"]}</Label>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Email : </Label>
                    <Col xs={12} sm={8}>
                        <Label>{this.state.type["showemail"]}</Label>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Telephone : </Label>
                    <Col xs={12} sm={8}>
                        <Label>{this.state.type["showphone"]}</Label>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Adresse : </Label>
                    <Col xs={12} sm={8}>
                        <Label>{this.state.type["showaddr"]}</Label>
                    </Col>
                </Row>
                </Col>
                <Col sm={12} md={ this.state.showFullscreen?12:4 } style={{ minHeight: 250 }} >
                  <Button className="pull-left btn-sm btn-outline-dark" style={{ marginTop: -25, marginBottom: 3, marginLeft: -15, lineHeight: '1em' }} onClick={this.onShowFullScreen}>  {/* Add button */}
                    <i className="fa fa-bars"/>
                  </Button>
                  <Row style={{ width: '100%', height: '100%' }}>
                    <MapView location={this.state.type["showaddr"]}    
                    onError={this.onErrorAddr} validData={ true } style={{ width: '100%', height: '100%' }} />
                  </Row>
                </Col>
              </Row>
            </form>
          </ModalBody>
          <ModalFooter className="justify-content-baseline" >
            <Button color="secondary" onClick={this.showToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


ChauffeurPage = Radium(ChauffeurPage);

const mapStateToProps = store => ({                   
  store: store,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChauffeurPage);      // connect redux store to this page.
