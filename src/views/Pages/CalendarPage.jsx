import React from "react";
import { Card, CardBody, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Label } from "reactstrap";
// react component used to create a calendar with events on it
import BigCalendar from "react-big-calendar";
// dependency plugin for react-big-calendar
import moment from "moment";
// react component used to create alerts
import NotificationAlert from "react-notification-alert";
import { PanelHeader, Button } from "components";
import TransfertServiceAPI from '../../services/TransfertEntity';    // import TransfertService
import ChauffeurServiceAPI from '../../services/ChauffeurEntity';    // import ChauffeurService
import DirectionMap from '../../googlemap/DirectionMap';
import DistanceView from '../../googlemap/DistanceView';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

var dataTable = [];   // All Transfert table data is stored here.

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          type: {
            phone: "",
            email: "",
            showdate1: "",
            showdate2: "",
            showaddr1: "",
            showaddr2: "",
            fullname: ""
          },
          order_id: -1,
          chauf_id: -1,
          events: [],
          showModal: false
      };
      this.TransfertService = new TransfertServiceAPI(this);
      this.ChauffeurService = new ChauffeurServiceAPI(this);
      this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    if (this.props.match.params.order_id !== undefined) {
        let order_id = parseInt(this.props.match.params.order_id, 10);
        this.getTransfertsByOrderId(order_id);      // Get all Transferts from external api.
        this.setState({ order_id: order_id});
    }
    else if (this.props.match.params.chauf_id !== undefined) {
        let chauf_id = parseInt(this.props.match.params.chauf_id, 10);
        this.getTransfertsByChauffeurId(chauf_id);      // Get all Transferts from external api.
        this.setState({ chauf_id: chauf_id});
    }
    else {
        this.getAllTransferts();      // Get all Transferts from external api.  
    }
    // this.getAllChauffeurs();
  }

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

  // Get all Transferts with Cmd id.
  getTransfertsByOrderId(order_id) {
    this.TransfertService.fetchByOrderId(order_id)
      .then(data => {
        dataTable = data;                         // set received data to dataTable so that
        dataTable.sort(function(a, b){return a.id > b.id});
        this.initData();                          // initData() method can init table with it.
      });
  }

  // Get all Transferts with Cmd id.
  getTransfertsByChauffeurId(chauf_id) {
    this.ChauffeurService.fetch(chauf_id)
      .then(data => {
        if (data !== undefined) {
          var chaufs = data.chauffeurs;
          this.TransfertService.fetchAll()
          .then(data => {
            if (data !== undefined) {
              dataTable = [];
              data.map((prop, key) => {
                if (prop.chauffeur !== undefined) {
                  if (prop.chauffeur.id === chauf_id)
                    dataTable.push(prop);
                  for (var i = 0; i < chaufs.length; i++) {
                    if (prop.chauffeur.id === chaufs[i].id)
                      dataTable.push(prop);
                  }
                }
                return 0;
              });
              dataTable.sort(function(a, b){return a.id > b.id});
              this.initData();                          //    initData() method can init table with it.
            }
          });          
        }
      })
    
  }

  initData() {
    this.setState({ events: dataTable.map((prop, key) => {
        
        var cm1 = moment(prop.date_enlevement).utc();
        // var date1 = cm1.format("DD-MM-YY H:mm");
        var fulldate1 = cm1.format("YYYY-MM-DD hh:mm A");
        var cm2 = moment(prop.date_depot).utc();
        // var date2 = cm2.format("DD-MM-YY H:mm");
        var fulldate2 = cm2.format("YYYY-MM-DD hh:mm A");
        var fulladdr1 = prop.addresse_depart;
        var fulladdr2 = prop.addresse_arriver;

        return this.produceEvent(prop.id, fulldate1, fulldate2, fulladdr1, fulladdr2, prop.transport_fullname, 
                    prop.transport_email, prop.transport_phone);
      }) });
  }

  produceEvent(id, fulldate1, fulldate2, fulladdr1, fulladdr2, fullname, email, phone) {
      return {
        id: id,
        title: fullname,
        start: new Date(fulldate1),
        end: new Date(fulldate1),
        color: "azure",
        date1: fulldate1,
        date2: fulldate2,
        addr1: fulladdr1,
        addr2: fulladdr2,
        email: email,
        phone: phone
      }
  }

  toggle() {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  showToggle(obj) {
    var type = this.state.type;

    // set modal data
    type["showdate1"] = obj.date1;
    type["showdate2"] = obj.date2;
    type["showaddr1"] = obj.addr1;
    type["showaddr2"] = obj.addr2;
    type["fullname"] = obj.title;
    type["phone"] = obj.phone;
    type["email"] = obj.email;

    this.setState({ type });

    this.setState({
      showModal: !this.state.showModal
    });
  }

  eventColors(event, start, end, isSelected) {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
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

  render() {
    return (
      <div>
        <NotificationAlert ref="notificationAlert"/>
        <PanelHeader
          content={
            <div className="header text-center">
              <h2 className="title">Transfert Calendar</h2>
              <p className="category">
                Here are transfert starting dates in a calendar.
              </p>
            </div>
          }
        />
        <div className="content">
          {this.state.alert}
          <Row>
            <Col xs={12} md={10} className="ml-auto mr-auto">
              <Card className="card-calendar">
                <CardBody>
                  <BigCalendar
                    selectable
                    events={this.state.events}
                    defaultView="month"
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={event => this.showToggle(event)}
                    eventPropGetter={this.eventColors}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal id="section-to-print" isOpen={this.state.showModal} toggle={this.toggle} className="modal-lg">     {/* Add or Edit modal */}
            <ModalHeader toggle={this.toggle}>
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

                        <Label xs={12} sm={6}>
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
                    <DirectionMap mapaddr1={this.state.type["showaddr1"]} mapaddr2={this.state.type["showaddr2"]} validData={true} onError={() => { }} style={{ width: '100%', height: '100%' }} />
                </Row>

            </ModalBody>
            <ModalFooter className="justify-content-baseline" >
                <DistanceView mapaddr1={this.state.type.showaddr1} mapaddr2={this.state.type.showaddr2} className="pull-right" validData={true} style={{ marginRight: 100 }} />
                <Button id="section-no-print" color="success" onClick={() => this.print()}>Print</Button>
                <Button id="section-no-print" color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CalendarPage;
