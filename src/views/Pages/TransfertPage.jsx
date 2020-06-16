import React, { Component } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import { Card, CardBody, CardHeader, CardFooter,CardTitle, Row, Col,
        Modal, ModalHeader, ModalBody, ModalFooter,
        Input, Label, FormGroup
    } from "reactstrap";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import NotificationAlert from "react-notification-alert";
import Radium from 'radium';
import { PanelHeader, Button,
    Statistics } from "components";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/actions/index';
import TransfertServiceAPI from '../../services/TransfertEntity';    // import this.TransfertService
import CommandServiceAPI from '../../services/CommandEntity';    // import this.CommandService
import ChauffeurServiceAPI from '../../services/ChauffeurEntity';    // import this.ChauffeurService
import DateTime from 'react-datetime';
import moment from 'moment';
import ReactFileReader from 'react-file-reader';
import Papa from 'papaparse';
import ReactTooltip from 'react-tooltip';
import DirectionMap from '../../googlemap/DirectionMap';
import DistanceView from '../../googlemap/DistanceView';
import SearchBar from '../../googlemap/SearchBar/SearchBar';
import ValidationService from '../../services/validation/TransfertValidation';    // import validationService
import "../../assets/css/mstyle.css";

let dataTable = [];   // All Transfert table data is stored here.
let statusList = [ "draft", "validated", "decerned", "onWay", "customerIn", "customerOut", "finished" ];

// This component is for Transfert Page.
class TransfertPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal: false,
      date: new Date(),
      data: [],
      commands: [],
      chauffeurs: [],
      transferts: [],
      order_id: -1,
      type: {
        date1: "",          // current form date1 data
        date2: "",          // current form date2 data
        addr1: "",          // current form addr1 data
        addr2: "",          // current form addr2 data
        fullname: "",       // current form fullname data
        email: "",          // current form email data
        phone: "",          // current form phone data
        cmd: 1,            // current form command data
        chauf: -1,          // current form chauffeur data
        chauf_price: "",
        customer_price: "",
        status : -1,
        date1State: "",          // has-success or has-danger, this represents whether the date1 is valid.
        date2State: "",          // has-success or has-danger, this represents whether the date2 is valid.
        addr1State: "",          // has-success or has-danger, this represents whether the addr1 is valid.
        addr2State: "",          // has-success or has-danger, this represents whether the addr2 is valid.
        fullnameState: "",       // has-success or has-danger, this represents whether the fullname is valid.
        emailState: "",          // has-success or has-danger, this represents whether the email is valid.
        phoneState: "",          // has-success or has-danger, this represents whether the phone is valid.
        cmdState: "",            // has-success or has-danger, this represents whether the command is valid.
        chaufState: "",          // has-success or has-danger, this represents whether the chauffeur is valid.
        chauf_priceState: "",
        customer_priceState: "",
        status_state: "",

        showdate1: "",          // current form date1 data of show modal
        showdate2: "",          // current form date2 data of show modal
        showaddr1: "",          // current form addr1 data of show modal
        showaddr2: ""           // current form date2 data of show modal
      },
      error: {
        chauf_price: "",
        customer_price: "",
        addr1: "",
        addr2: "",
        fullname: "",
        email: "",
        phone: "",
        status: "",
        command: "",
        date1: "",
        date2: ""
      },
      sum_chauf: 0,
      sum_customer: 0,
      bMapUpdate: false,
      editFullscreen: false,
      modalType: "",        // add or edit, this represents whether the modal is for adding or editing.
      curKey: 0             // This is the id of current editing Transfert.
    };

    this.TransfertService = new TransfertServiceAPI(this);
    this.CommandService = new CommandServiceAPI(this);
    this.ChauffeurService = new ChauffeurServiceAPI(this);
    this.validationService = new ValidationService(this); // create an instance of validation

    this.toggle = this.toggle.bind(this);
    this.addTransfert = this.addTransfert.bind(this);
    this.editTransfert = this.editTransfert.bind(this);
    this.addToggle = this.addToggle.bind(this);
    this.editToggle = this.editToggle.bind(this);
    this.showToggle = this.showToggle.bind(this);
    this.onErrorAddr1 = this.onErrorAddr1.bind(this);
    this.onErrorAddr2 = this.onErrorAddr2.bind(this);
    this.initData = this.initData.bind(this);
    this.initDataFromCSV = this.initDataFromCSV.bind(this);
    this.onFullScreen = this.onFullScreen.bind(this);
  }

  componentWillMount() {
      this.getAllCommands();
      this.getAllChauffeurs();
      if (this.props.match.params.id === undefined)
      {
        this.getAllTransferts();      // Get all Transferts from external api.  
      }
      else {
        let order_id = parseInt(this.props.match.params.id, 10);
        this.getTransfertsByOrderId(order_id);      // Get all Transferts from external api.
        this.setState({ order_id: order_id});
      }
  }
  
  redirectToCalendar(id) {
    const {history} = this.props;
    if (this.state.order_id < 0)
      history.push("/calendar-page");
    else
      history.push("/calendar-page/order/" + this.state.order_id);
  }

  // Get all Transferts with Cmd id.
  getTransfertsByOrderId(order_id) {
    this.TransfertService.fetchByOrderId(order_id)
      .then(data => {
        dataTable = data;                         // set received data to dataTable so that 
        dataTable.sort(function(a, b){return a.id > b.id});
        this.initData();                          //    initData() method can init table with it.
      });
  }

  getAllCommands() {
    this.CommandService.fetchAll()
      .then(data => {
        data.sort(function(a, b){return a.id > b.id});
        this.setState({ commands : data });
      });
  }
  
  getAllChauffeurs() {
    this.ChauffeurService.fetchAll()
      .then(data => {
        data.sort(function(a, b){return a.id > b.id});
        this.setState({ chauffeurs : data });
      });
  }

  // Get all Transferts from external api.
  getAllTransferts() {
    this.TransfertService.fetchAll()
      .then(data => {
        dataTable = data;                         // set received data to dataTable so that 
        if (dataTable !== undefined) {
          dataTable.sort(function(a, b){return a.id > b.id});
          this.initData();                          //    initData() method can init table with it.
        }
      });
  }

  // Get a specified Transfert from database.
  getTransfert(id) {
    this.TransfertService.fetch(id)
      .then(data => {
      });
  } 

  // init table with loaded data from CSV file
  initDataFromCSV() {
    this.setState({ data: dataTable.map((prop, key) => {
        var cm = moment(prop[2]).utc();
        var vdate = cm.format("YYYY-MM-DD");
        var vfulldate = cm.format("YYYY-MM-DD hh:mm A");
        var cm1 = moment(prop[4]).utc();
        var date1 = cm1.format("DD-MM-YY H:mm");
        var fulldate1 = cm1.format("YYYY-MM-DD hh:mm A");
        var cm2 = moment(prop[5]).utc();
        var date2 = cm2.format("DD-MM-YY H:mm");
        var fulldate2 = cm2.format("YYYY-MM-DD hh:mm A");
        var fulladdr1 = prop[6];
        var addr1 = fulladdr1.split(',').pop();
        var fulladdr2 = prop[7];
        var addr2 = fulladdr2.split(',').pop(); 
        var i;
        var chauf_id = -1, chauf_name = "";
        if (prop[13] !== undefined) {
           chauf_id = prop[13];
           chauf_name = prop[14];
        }
        for(i = 0; i < statusList.length; i++) {
          if (prop[13] === statusList[i])
            break;
        }
        if (i === statusList.length)
          i = -1;
        return this.produceTransfert(prop[0], prop[1], vdate, vfulldate, prop[3],
          date1, fulldate1, date2, fulldate2, addr1, fulladdr1, addr2, fulladdr2, prop[8], 
          prop[9], prop[10], prop[11], prop[12], i, chauf_id, chauf_name);
      }) });
      this.calculateSums();
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
        var cm = moment(prop.commande.validated_date).utc();
        var vdate = cm.format("YYYY-MM-DD");
        var vfulldate = cm.format("YYYY-MM-DD hh:mm A");
        var cm1 = moment(prop.date_enlevement).utc();
        var date1 = cm1.format("DD-MM-YY H:mm");
        var fulldate1 = cm1.format("YYYY-MM-DD hh:mm A");
        var cm2 = moment(prop.date_depot).utc();
        var date2 = cm2.format("DD-MM-YY H:mm");
        var fulldate2 = cm2.format("YYYY-MM-DD hh:mm A");
        var fulladdr1 = prop.addresse_depart;
        var addr1 = fulladdr1.split(',').pop();
        var fulladdr2 = prop.addresse_arriver;
        var addr2 = fulladdr2.split(',').pop();
        var i;
        var chauf_id = -1, chauf_name = "";
        if (prop.chauffeur !== undefined) {
          chauf_id = prop.chauffeur.id;
          chauf_name = prop.chauffeur.contact;
        }
        for(i = 0; i < statusList.length; i++) {
          if (prop.status === statusList[i])
            break;
        }
        if (i === statusList.length)
          i = -1;

        return this.produceTransfert(prop.id, prop.commande.id, vdate, vfulldate, prop.commande.designation,
                    date1, fulldate1, date2, fulldate2, addr1, fulladdr1, addr2, fulladdr2, prop.transport_fullname, 
                    prop.transport_email, prop.transport_phone, prop.chauffeur_price, prop.customer_price, i, chauf_id, chauf_name);
      }) });
      this.calculateSums();
  }
  
  // Produce a Transfert element from data to add into Transfert table.
  produceTransfert(id, cmd_id, vdate, vfulldate, designation, date1, fulldate1, date2, fulldate2, addr1, 
                    fulladdr1, addr2, fulladdr2, fullname, email, phone, chauf_price, cust_price, status_id, chauf_id, chauf_name) 
  {
    var key = id;
    // remove all spaces
    return {
        id: key,
        id_string: cmd_id + "-" + key,
        cmd_id: cmd_id,
        vdate: vdate,
        vfulldate: vfulldate,
        designation: designation,
        date1: date1,
        fulldate1: fulldate1,
        date2: date2,
        fulldate2: fulldate2,
        status: status_id,
        addr1: (
          <div>
          <div data-tip data-for={'addr1Tooltip'+key} style={{ cursor: "default" }}>
              { addr1 }
          </div>
          <ReactTooltip id={'addr1Tooltip'+key} place='bottom' effect='float'>
            <span>{ fulladdr1 }</span>
          </ReactTooltip>
          </div>
        ),
        fulladdr1: fulladdr1,
        addr2: (
          <div>
          <div data-tip data-for={'addr2Tooltip'+key} style={{ cursor: "default" }}>
              { addr2 }
          </div>
          <ReactTooltip id={'addr2Tooltip'+key} place='bottom' effect='float'>
            <span>{ fulladdr2 }</span>
          </ReactTooltip>
          </div>
        ),
        fulladdr2: fulladdr2,
        fullname: fullname,
        email: email,
        phone: phone,
        chauf_price: chauf_price,
        customer_price: cust_price,
        chauf: chauf_id,
        chauf_name: chauf_name,
        statusString: statusList[status_id],
        actions: (
            // we've added some custom button actions
            <div className="actions-right" style={{ minWidth : 110}}>
            {/* use this button to add a edit kind of action */}
            <Button
                onClick={() => {
                    let obj = this.state.data.find(o => o.id === key);
                    if (obj.status < 3)
                      this.editToggle(obj);           // Launch the edit modal
                    else {
                      var options = {};
                      options = {
                        place: "tr",
                        message: "Sorry but you can not edit this transfert because it’s " + obj.statusString + ".",
                        type: "primary",
                        icon: "now-ui-icons ui-1_bell-53",
                        autoDismiss: 5
                      };      
                      this.refs.notificationAlert.notificationAlert(options);
                    }
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
                    if (o.id === key) {                 // Delete from table.
                      data.splice(i, 1);
                      this.TransfertService.delete(o.id).then(res => {
                        var options = {};
                        options = {
                          place: "tr",
                          message: "One transfert is deleted.",
                          type: "info",
                          icon: "now-ui-icons ui-1_bell-53",
                          autoDismiss: 3
                        };            
                        this.refs.notificationAlert.notificationAlert(options);
                      })
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
    type["date1State"] = type["date2State"] = type["addr1State"] = type["addr2State"] = type["fullnameState"] = type["emailState"] = type["phoneState"] = type["cmdState"] = type["chaufState"] = type["chauf_priceState"] = type["customer_priceState"] = "";
    type["date1"] = moment();
    type["date2"] = moment();
    type["addr1"] = "";
    type["addr2"] = "";
    type["fullname"] = "";
    type["email"] = "";
    type["phone"] = "";
    type["status"] = 0;
    type["chauf_price"] = "";
    type["customer_price"] = "";
    if (this.state.commands.length > 0)
    {
      if (this.state.order_id < 0)
        type["cmd"] = this.state.commands[0].id;
      else
        type["cmd"] = this.state.order_id;
    }
    else
      type["cmd"] = -1;
    type["chauf"] = -1;
    this.setState({ type });    
    this.setState({ editFullscreen: false });
    var error = this.state.error;

    error["chauf_price"] = "";
    error["customer_price"] = "";
    error["addr1"] = "";
    error["addr2"] = "";
    error["date1"] = "";
    error["date2"] = "";
    error["fullname"] = "";
    error["email"] = "";
    error["phone"] = "";
    error["status"] = "";
    error["command"] = "";

    this.setState({ error });
    this.toggle();              // launch modal.
  }

  // Launch edit modal.
  editToggle(obj) {
    this.setState({ curKey: obj.id });           // set id of current editing Transfert.
    this.setState({ modalType: "edit" });        // set modal type as "edit".
    var type = this.state.type;

    this.setState({ bMapUpdate : true });
    // set modal data
    type["date1"] = moment(obj.fulldate1);
    type["date2"] = moment(obj.fulldate2);
    type["addr1"] = obj.fulladdr1;
    type["addr2"] = obj.fulladdr2;
    type["fullname"] = obj.fullname;
    type["email"] = obj.email;
    type["phone"] = obj.phone;
    type["cmd"] = obj.cmd_id;
    type["status"] = obj.status;
    type["chauf_price"] = obj.chauf_price.toString();
    type["customer_price"] = obj.customer_price.toString();
    if (obj.chauf >= 0)
      type["chauf"] = obj.chauf;
    else
      type["chauf"] = -1;
    this.setState({ type });
    this.setState({ editFullscreen: false });

    var error = this.state.error;

    error["chauf_price"] = "";
    error["customer_price"] = "";
    error["addr1"] = "";
    error["addr2"] = "";
    error["date1"] = "";
    error["date2"] = "";
    error["fullname"] = "";
    error["email"] = "";
    error["phone"] = "";
    error["status"] = "";
    error["command"] = "";

    this.setState({ error });

    this.validationService.isFormValid();         // check the modal form if its data is valid. 
    this.toggle();              // launch modal.
  }

  showToggle() {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  showingToggle(obj) {
    var type = this.state.type;

    // set modal data
    type["showdate1"] = obj.fulldate1;
    type["showdate2"] = obj.fulldate2;
    type["showaddr1"] = obj.fulladdr1;
    type["showaddr2"] = obj.fulladdr2;
    type["fullname"] = obj.fullname;
    type["phone"] = obj.phone;
    type["email"] = obj.email;

    this.setState({ type });

    this.setState({
      showModal: !this.state.showModal
    });
  }

  // This method is called when we press "Add" button in add modal.
  addTransfert() {
    if (this.validationService.isFormValid())     // check the modal form if its data is valid.
    {
        var type = this.state.type;
        // call external api to add a new Transfert
        var date1 = type["date1"];
        date1 = moment(date1 + date1.utcOffset());
        var date2 = type["date2"];
        date2 = moment(date2 + date2.utcOffset());
        // add a new Transfert to table.
        this.TransfertService.add(date1.year(), date1.month() + 1, date1.date(), date1.hour(), date1.minute(),
            date2.year(), date2.month() + 1, date2.date(), date2.hour(), date2.minute(),
            type["addr1"], type["addr2"], type["fullname"], type["email"], type["phone"], type["cmd"], 
            parseInt(type["chauf_price"], 10), parseInt(type["customer_price"], 10), statusList[type["status"]], type["chauf"])
          .then(res => {
            var id = res.id;
            var data = this.state.data;
            var cm1 = type["date1"];
            var date1 = cm1.format("DD-MM-YY H:mm");
            var fulldate1 = cm1.format("YYYY-MM-DD hh:mm A");
            var cm2 = type["date2"];
            var date2 = cm2.format("DD-MM-YY H:mm");
            var fulldate2 = cm2.format("YYYY-MM-DD hh:mm A");
            var fulladdr1 = type["addr1"];
            var addr1 = fulladdr1.split(',').pop();
            var fulladdr2 = type["addr2"];
            var addr2 = fulladdr2.split(',').pop(); 
            var designation = "";
            var cm = "";
            if (this.state.commands.length > 0)
            {
              this.state.commands.map((prop, key) => {
                if (prop.id === type["cmd"]) {
                  designation = prop.designation;
                  cm = prop.date;
                }
                return prop.designation;
              });
            }
            var chauf_name = "";
            if (this.state.chauffeurs.length > 0)
            {
              this.state.chauffeurs.map((prop, key) => {
                if (prop.id === type["chauf"]) {
                  chauf_name = prop.contact;
                }
                return prop.contact;
              });
            }
            var vdate = moment(cm).format("YYYY-MM-DD");
            var vfulldate = moment(cm).format("YYYY-MM-DD hh:mm A");
            data.push( this.produceTransfert(id, type["cmd"], vdate, vfulldate, designation,
                    date1, fulldate1, date2, fulldate2, addr1, fulladdr1, addr2, fulladdr2, type["fullname"], 
                    type["email"], type["phone"], parseInt(type["chauf_price"], 10), parseInt(type["customer_price"], 10), type["status"], type["chauf"], chauf_name));
            this.setState({ data });
            var options = {};
            options = {
              place: "tr",
              message: "A new transfert is added successfully.",
              type: "info",
              icon: "now-ui-icons ui-1_bell-53",
              autoDismiss: 3
            };            
            this.setState({                 // close the modal
                modal: !this.state.modal
            }); 
            this.refs.notificationAlert.notificationAlert(options);
            this.calculateSums();
          })
          .catch(error => {
            if (error.response !== undefined && error.response.status === 400 && error.response.data.message === "Validation Failed")
              this.validationService.onError400(error.response.data);
          })
    }
  }

  editTransfert() {
    if (this.validationService.isFormValid())    // check the modal form if its data is valid.
    {
        var type = this.state.type;
        var key = this.state.curKey;
        var data = this.state.data;
        data.find((o, i) => {
            if (o.id === key) {
                // here you should add some custom code so you can delete the data
                // from this component and from your server as well

                // set a Transfert data.
                var date1 = type["date1"];
                date1 = moment(date1 + date1.utcOffset());
                var date2 = type["date2"];
                date2 = moment(date2 + date2.utcOffset());
                
                var fulldate1 = date1.format("YYYY-MM-DD h:mm A");
                var odate1 = date1.format("DD-MM-YY H:mm");
                var fulldate2 = date2.format("YYYY-MM-DD h:mm A");
                var odate2 = date2.format("DD-MM-YY H:mm");
                var fulladdr1 = type["addr1"];
                var addr1 = fulladdr1.split(',').pop();
                var fulladdr2 = type["addr2"];
                var addr2 = fulladdr2.split(',').pop();
                var fullname = type["fullname"];
                var email = type["email"];
                var phone = type["phone"];
                var cmd_id = type["cmd"];
                var chauf = type["chauf"];
                var chauf_price = parseInt(type["chauf_price"], 10);
                var customer_price = parseInt(type["customer_price"], 10);
                var status = type["status"];
                var statusString = statusList[status];

                this.TransfertService.edit(o.id, date1.year(), date1.month() + 1, date1.date(), date1.hour(), date1.minute(),
                date2.year(), date2.month() + 1, date2.date(), date2.hour(), date2.minute(),
                fulladdr1, fulladdr2, type["fullname"], type["email"], type["phone"], cmd_id, chauf_price, customer_price, statusString, chauf )  // call external api to edit a Transfert
                  .then(() => { 
                    var options = {};
                    options = {
                      place: "tr",
                      message: "The changed data is saved successfully.",
                      type: "info",
                      icon: "now-ui-icons ui-1_bell-53",
                      autoDismiss: 3
                    };
                    o.cmd_id = cmd_id;
                    if (this.state.commands.length > 0)
                    {
                      this.state.commands.map((prop, key) => {
                        if (prop.id === o.cmd_id) {
                          o.designation = prop.designation;
                        }
                        return prop.designation;
                      });
                    }
                    o.date1 = odate1;
                    o.fulldate1 = fulldate1;
                    o.date2 = odate2;
                    o.fulldate2 = fulldate2;
                    o.fulladdr1 = fulladdr1;
                    o.addr1 = (
                      <div>
                          <div data-tip data-for={'addr1Tooltip'+key} style={{ cursor: "default" }}>
                              { addr1 }
                          </div>
                          <ReactTooltip id={'addr1Tooltip'+key} place='bottom' effect='float'>
                              <span>{ o.fulladdr1 }</span>
                          </ReactTooltip>
                      </div>
                    );
                    o.fulladdr2 = fulladdr2;
                    o.addr2 = (
                      <div>
                          <div data-tip data-for={'addr1Tooltip'+key} style={{ cursor: "default" }}>
                              { addr2 }
                          </div>
                          <ReactTooltip id={'addr1Tooltip'+key} place='bottom' effect='float'>
                              <span>{ o.fulladdr2 }</span>
                          </ReactTooltip>
                      </div>
                    );
                    o.fullname = fullname;
                    o.email = email;
                    o.phone = phone;
                    o.chauf_price = chauf_price;
                    o.customer_price = customer_price;
                    o.status = status;
                    o.statusString = statusString;
                    o.chauf = chauf;
                    if (chauf >= 0 && this.state.chauffeurs.length > 0)
                    {
                      this.state.chauffeurs.map((prop, key) => {
                        if (prop.id === o.chauf) {
                          o.chauf_name = prop.contact;
                        }
                        return prop.contact;
                      });
                    }
                    else
                      o.chauf_name = "";
                    o.id_string = o.cmd_id + "-" + o.id;
                    this.setState({ data: data });
                    this.setState({
                        modal: !this.state.modal
                    });
                    this.refs.notificationAlert.notificationAlert(options);
                    this.calculateSums();
                  })
                  .catch(error => {
                    if (error.response !== undefined && error.response.status === 400 && error.response.data.message === "Validation Failed")
                      this.validationService.onError400(error.response.data);
                  })
                return true;
            }
            return false;
        });
    }
  }

  calculateSums() {
    var data = this.state.data;
    var chaufSum = 0, customerSum = 0;
    data.map((prop, key) => {
      chaufSum += prop.chauf_price;
      customerSum += prop.customer_price;
      return 0;
    });
    this.setState({ sum_chauf: chaufSum, sum_customer: customerSum });
  }
  
  onErrorAddr1() {
    let type = this.state.type;
    type["addr1State"] = "has-danger";
    this.setState({ type });
  }
  
  onErrorAddr2() {
    let type = this.state.type;
    type["addr2State"] = "has-danger";
    this.setState({ type });
  }

  print() {
    var buttons = document.getElementsByTagName('button');
    var displays = new Array(buttons.length);
    var i, button;
    for (i = 0; i < buttons.length; i++) {
        button = buttons[i];
        displays[i] = button.style.display;
        button.style.display = 'none';
    }
    window.print();
    for (i = 0; i < buttons.length; i++) {
        button = buttons[i];
        button.style.display = displays[i];
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

  render() { 
    return (
      <div >
        <NotificationAlert ref="notificationAlert" />
        <PanelHeader
          content={
            <div className="header text-center">
              <h2 className="title">Transfert</h2>
              <p className="category">
                You can add, edit, delete and show transferts here.
              </p>
            </div>
          }
        />
        <div className="content">
          <Row>
              <div className={"col-12 col-sm-6 col-md-6 col-lg-3"}>

              <Card className="card-stats" >
                  <CardBody>
                      <Statistics
                          horizontal
                          icon="sport_user-run"
                          iconState="success"
                          title={this.state.data.length}
                          subtitle={"Transfert".concat(this.state.data.length>1?'s':'')}
                      />
                  </CardBody>
                  <hr />
                  <CardFooter>

                  </CardFooter>
              </Card>
              </div>
              <div className={"col-12 col-sm-6 col-md-6 col-lg-3"}>
              <Card className="card-stats " >
                  <CardBody>
                      <Statistics
                          horizontal
                          icon="shopping_cart-simple"
                          iconState="primary"
                          title={this.state.sum_customer}
                          subtitle="THT CUSTOMER"
                      />
                  </CardBody>
                  <hr />
                  <CardFooter>

                  </CardFooter>
              </Card>
              </div>
              <div className={"col-12 col-sm-6 col-md-6 col-lg-3"}>
              <Card className="card-stats " >
                  <CardBody>
                      <Statistics
                          horizontal
                          icon="transportation_bus-front-12"
                          iconState="info"
                          title={this.state.sum_chauf}
                          subtitle="THT CHAUFFEUR"
                      />
                  </CardBody>
                  <hr />
                  <CardFooter>

                  </CardFooter>
              </Card>
              </div>
              <div className={"col-12 col-sm-6 col-md-6 col-lg-3"}>
              <Card className="card-stats " >
                  <CardBody>
                      <Statistics
                          horizontal
                          icon="business_money-coins"
                          iconState={(this.state.sum_customer - this.state.sum_chauf)>0?'success':'danger'}
                          title={this.state.sum_customer - this.state.sum_chauf}
                          subtitle="MARGE HT"
                      />
                  </CardBody>
                  <hr />
                  <CardFooter>

                  </CardFooter>
              </Card>
              </div>
            <Col xs={12} sm={12}>
              <Card>
                <CardHeader>
                    <Row>
                        <Col xs={4} md={4}>
                            <CardTitle>Transfert Table</CardTitle>
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
                              <span>Data format is Command id | Validated date | Designation | <br/>Date depart | Date depot | Depart | Depot | Transport fullname <br/>| Email | Phone | Chauffeur price | Customer price | Chauffeur.</span>
                            </ReactTooltip>
                            <Button color="success" className="pull-right"  style={{marginRight: 10}}
                                onClick={() => {
                                    this.redirectToCalendar();           // Launch the edit modal
                                }}
                                 >
                                <i className="fa fa-calendar" style={{marginRight: 5}}/> Calendar
                            </Button>
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
                        Header: "ID",
                        accessor: "id_string"
                      },
                      {
                        Header: "Date depart",
                        accessor: "date1"
                      },
                      {
                        Header: "Date depot",
                        accessor: "date2"
                      },
                      {
                        Header: "depart",
                        accessor: "addr1"
                      },
                      {
                        Header: "depot",
                        accessor: "addr2"
                      },
                      {
                        Header: "Chauffeur",
                        accessor: "chauf_name"
                      },
                      {
                        Header: "Customer price",
                        accessor: "customer_price",
                        show: this.props.userValue.roles.indexOf("ROLE_CHAUFFEUR") >= 0?false:true
                      },
                      {
                        Header: "Chauffer price",
                        accessor: "chauf_price"
                      },
                      {
                        Header: "Status",
                        accessor: "statusString"
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
          <ModalHeader toggle={this.toggle}>{ this.state.modalType==="add"?"New Transfert":"Edit Transfert" }</ModalHeader>
          <ModalBody className="edit-modal-input">
            <form>
              <Row style={{ marginRight: -30}}>
                <Col sm={12} md={8} style={ this.state.editFullscreen?{ display: 'none' }:{} }>
                <Row>
                    <Label sm={4}>Date Enlevement : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.date1State}>   {/* desc field */}
                            <DateTime
                            dateFormat="YYYY-MM-DD"
                            timeFormat="H:mm A"
                            value={this.state.type["date1"]}
                            onChange={e => this.validationService.typeDate1(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.date1 !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.date1}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Date Depot : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.date2State}>   {/* desc field */}
                            <DateTime
                            dateFormat="YYYY-MM-DD"
                            timeFormat="h:mm A"
                            value={this.state.type["date2"]}
                            onChange={e => this.validationService.typeDate2(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.date2 !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.date2}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Adresse depart : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.addr1State}>   {/* desc field */}
                        <SearchBar 
                            value={this.state.type["addr1"]}
                            onChange={e => this.validationService.typeAddr1(e)}
                            onError={this.onErrorAddr1}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.addr1 !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.addr1}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Adresse depot : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.addr2State}>   {/* desc field */}
                            <SearchBar  
                            value={this.state.type["addr2"]}
                            onChange={e => this.validationService.typeAddr2(e)}
                            onError={this.onErrorAddr2}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.addr2 !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.addr2}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Transport Fulle Name : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.fullnameState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["fullname"]}
                            onChange={e => this.validationService.typeFullname(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.fullname !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.fullname}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Transport Email : </Label>
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
                {
                  (this.state.error.email !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.email}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Transport Phone : </Label>
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
                {
                  (this.state.error.phone !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.phone}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Commande : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.cmdState}>   {/* desc field */}
                          <Select
                              name="selectCommande"
                              value={this.state.type.cmd}
                              onChange={e => this.validationService.typeCmd(e)}
                              options={
                                  this.state.commands.map((prop, key) => {
                                      return { value: prop.id, label: prop.designation };
                                  })
                              }
                              clearable={false}
                              style={this.state.type.cmdState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                          />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.command !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.command}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Chauffeur : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.chaufState}>   {/* desc field */}
                          <Select
                              name="selectChauffeur"
                              value={this.state.type.chauf}
                              onChange={e => this.validationService.typeChauf(e)}
                              options={
                                  this.state.chauffeurs.map((prop, key) => {
                                      return { value: prop.id, label: prop.contact };
                                  })
                              }
                              clearable={false}
                              style={this.state.type.chaufState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                          />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Label sm={4}>Chauffeur Price : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.chauf_priceState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["chauf_price"]}
                            onChange={e => this.validationService.typeChauf_price(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.chauf_price !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.chauf_price}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Customer Price : </Label>
                    <Col xs={12} sm={8}>
                        <FormGroup className={this.state.type.customer_priceState}>   {/* desc field */}
                            <Input                                                  
                            type="text"
                            value={this.state.type["customer_price"]}
                            onChange={e => this.validationService.typeCustomer_price(e)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.customer_price !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.customer_price}</Label>
                  </Row>))
                }
                <Row>
                    <Label sm={4}>Status : </Label>
                    <Col xs={12} sm={8}>
                      <FormGroup className={this.state.type.statusState}>   {/* desc field */}
                        <Select
                            name="selectStatus"
                            value={this.state.type.status}
                            onChange={e => this.validationService.typeStatus(e)}
                            options={
                                statusList.map((prop, key) => {
                                    return { value: key, label: prop };
                                })
                            }
                            clearable={false}
                            style={this.state.type.statusState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                        />
                      </FormGroup>
                    </Col>
                </Row>
                {
                  (this.state.error.status !== "" && 
                  (<Row>
                    <Col xs={12} sm={3}></Col>
                    <Label sm={9} style={{ color: 'red', fontSize: 12 }} >{this.state.error.status}</Label>
                  </Row>))
                }
                </Col>
                <Col sm={12} md={ this.state.editFullscreen?12:4 } style={{ minHeight: 400 }} >
                  <Button className="pull-left btn-sm btn-outline-dark" style={{ marginTop: -25, marginBottom: 3, marginLeft: -15, lineHeight: '1em' }} onClick={this.onFullScreen}>  {/* Add button */}
                    <i className="fa fa-bars"/>
                  </Button>
                  <Row style={{ width: '100%', height: '100%' }}>
                    <DirectionMap mapaddr1={this.state.type.addr1} mapaddr2={this.state.type.addr2} 
                    onError={() => {}} validData={ this.state.bMapUpdate } style={{ width: '100%', height: '100%' }} />
                  </Row>
                </Col>
              </Row>
            </form>
          </ModalBody>
          <ModalFooter className="justify-content-baseline" >
            {/* Set button text as "Add" if modal type is add or "Save" if modal type is edit. */}
            <DistanceView mapaddr1={this.state.type.addr1} mapaddr2={this.state.type.addr2} className="pull-right" validData={ this.state.bMapUpdate } style={{ marginRight: 100 }} />
            <Button color="info" className="pull-right" onClick={this.state.modalType==="add"?this.addTransfert:this.editTransfert}>{ this.state.modalType==="add"?"Add":"Save" }</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal id="section-to-print" isOpen={this.state.showModal} toggle={this.showToggle} className="modal-lg">     {/* Add or Edit modal */}
          <ModalHeader toggle={this.showToggle}>
              {this.state.type['fullname']}
              </ModalHeader>
              <ModalBody className="edit-modal-input">
                <Row>
                    <Col xs={12} sm={12}>
                        <p >
                            tel : {this.state.type['phone']}
                            {" | "} email : {this.state.type['email']}
                        </p>
                    </Col>
                    <Col xs={12} sm={12}>
                      <Label xs={12} sm={6}>
                          <i className="fa fa-clock-o" />
                          {" "}Pickup Time : {this.state.type["showdate1"]}
                              </Label>

                      <Label  xs={12} sm={6}>
                          <i className="fa fa-clock-o" />
                          {" "}DropOff Time : {this.state.type["showdate2"]}
                          </Label>
                    </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12}>
                    <Label xs={12} sm={6}>
                        <i className="fa fa-map-marker text-danger" />
                        {" "}{this.state.type["showaddr1"]}
                        </Label>

                    <Label xs={12} sm={6}>
                        <i className="fa fa-map-marker text-success" />
                        {" "}{this.state.type["showaddr2"]}
                        </Label>
                  </Col>
                </Row>

                <Row style={{ width: '100%', height: '300px' }} >
                  <DirectionMap mapaddr1={this.state.type["showaddr1"]} mapaddr2={this.state.type["showaddr2"]} validData={ true } onError={() => {}} style={{ width:'100%', height:'100%' }} />
                </Row>
                
          </ModalBody>
          <ModalFooter className="justify-content-baseline" >
            <DistanceView mapaddr1={this.state.type.showaddr1} mapaddr2={this.state.type.showaddr2} className="pull-right" validData={ true } style={{ marginRight: 100 }} />
            <Button id="section-no-print" color="success" onClick={() => this.print()}>Print</Button>
            <Button id="section-no-print" color="secondary" onClick={this.showToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


TransfertPage = Radium(TransfertPage);

const mapStateToProps = store => ({                   
  store: store,
  userValue: store.userReducer
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TransfertPage);      // connect redux store to this page.
