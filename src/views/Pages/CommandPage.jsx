import React, {Component} from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import {
    Card, CardBody, CardHeader, CardTitle, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Input, Label, FormGroup
} from "reactstrap";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import NotificationAlert from "react-notification-alert";
import Radium from 'radium';
import {PanelHeader, Button} from "components";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactToPrint from "react-to-print";
import {ActionCreators} from '../../redux/actions/index';
import CommandServiceAPI from '../../services/CommandEntity';    // import CommandService
import CustomerServiceAPI from '../../services/CustomerEntity';    // import CustomerService
import ValidationService from '../../services/validation/CommandValidation';    // import validationService
import DateTime from 'react-datetime';
import moment from 'moment';
import OrderPrintTemplate from '../../PrintTemplates/OrderPrintTemplate.jsx';

import "../../assets/css/mstyle.css";

var dataTable = [];   // All Command table data is stored here.

// This component is for Command Page.
class CommandPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            date: new Date(),
            data: [],
            Commands: [],
            customers: [],
            customer_id: -1,
            type: {
                desc: "",       // current form description data
                date: "",          // current form date data
                customer: "",
                descState: "",  // has-success or has-danger, this represents whether the description is valid.
                dateState: "",     // has-success or has-danger, this represents whether the date is valid.
                customerState: ""
            },
            modalType: "",        // add or edit, this represents whether the modal is for adding or editing.
            curKey: 0             // This is the id of current editing Command.
        };
        
        this.CommandService = new CommandServiceAPI(this);
        this.CustomerService = new CustomerServiceAPI(this);
        this.validationService = new ValidationService(this); // create an instance of validation
        this.componentRef = {};

        this.toggle = this.toggle.bind(this);
        this.addCommand = this.addCommand.bind(this);
        this.editCommand = this.editCommand.bind(this);
        this.addToggle = this.addToggle.bind(this);
        this.editToggle = this.editToggle.bind(this);
        this.initData = this.initData.bind(this);
        this.initRawData = this.initRawData.bind(this);
    }

    componentWillMount() {
        this.getAllCustomers();
        if (this.props.match.params.id === undefined) {
            this.getAllCommands();
        }
        else {
            let customer_id = parseInt(this.props.match.params.id, 10);
            this.fetchAllByCustomer(customer_id);      // Get all Transferts from external api.
            this.setState({customer_id: customer_id});
        }
    }

    // Get all Customers from external api.
    getAllCustomers() {
        this.CustomerService.fetchAll()
            .then(data => {
                data.sort(function (a, b) {
                    return a.id > b.id
                });
                this.setState({ customers : data });
            });
    }

    // Get all Commands from external api.
    getAllCommands() {
        this.CommandService.fetchAll()
            .then(data => {
                dataTable = data;                         // set received data to dataTable so that
                dataTable.sort(function (a, b) {
                    return a.id > b.id
                });
                this.initData();                          //    initData() method can init table with it.
            });
    }

    // Get all command with order id.
    fetchAllByCustomer(customer_id) {
        this.CommandService.fetchAllByCustomer(customer_id)
            .then(data => {
                dataTable = data;                         // set received data to dataTable so that
                dataTable.sort(function(a, b){return a.id > b.id});
                this.initData();                          //    initData() method can init table with it.
            });
    }

    // Get a specified Command from database.
    getCommand(id) {
        this.CommandService.fetch(id)
            .then(data => {
            });
    }

    // init table with received data from external api
    initData() {
        this.setState({
            data: dataTable.map((prop, key) => {
                let cm = moment(prop.validated_date).utc();
                let vdate = cm.format("YYYY-MM-DD");
                let vfulldate = cm.format("YYYY-MM-DD hh:mm A");
                let customer = -1, customer_name = "";
                if (prop.customer !== undefined) {
                    customer = prop.customer.id;
                    customer_name = prop.customer.contact;
                }
                return this.produceCommand(prop.id, prop.designation, vdate, vfulldate,prop.transferts.length, customer, customer_name, prop.status);
            })
        });
    }

    // init table with received data from external api
    initRawData() {
        this.setState({
            data: dataTable.map((prop, key) => {
                return this.produceCommand(prop[0], prop[1], prop[2], 0);
            })
        });
    }

    // Produce a Command element from data to add into Command table.
    produceCommand(id, vdesc, vdate, vfulldate, nbtransfert, customer, customer_name, status) {
        var key = id;
        // remove all spaces
        return {
            id: key,
            id_string: key.toString(),
            fulldate: vfulldate,
            customer: customer,
            customer_name: customer_name,
            desc: vdesc,
            date: vdate,
            nbtransfert: nbtransfert,
            status: status,
            actions: (
                // we've added some custom button actions
                <div className="actions-right">    
                    <div style={{ display: "none" }}>
                        <OrderPrintTemplate ref={el => (this.componentRef[key.toString()] = el)} order_id={key} />
                    </div>
                    <ReactToPrint
                        trigger={() => <Button color="success" size="sm" round icon onClick={() => {}}><i className="fa fa-print"/></Button>}
                        content={() => this.componentRef[key.toString()]}
                    />
                    {" "}
                    {/* use this button to add a edit kind of action */}
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
                        <i className="fa fa-edit"/>
                    </Button>{" "}
                    {/* use this button to remove the data row */}
                    <Button
                        onClick={() => {
                            var data = this.state.data;
                            data.find((o, i) => {
                                if (o.id === key) {
                                    data.splice(i, 1);                      // Delete from table.
                                    this.CommandService.delete(o.id).then(res => {
                                        var options = {};
                                        options = {
                                            place: "tr",
                                            message: "One command is deleted.",
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
                            this.setState({data: data});
                        }}
                        color="danger"
                        size="sm"
                        round
                        icon
                    >
                        <i className="fa fa-times"/>
                    </Button>{" "}
                    <Button
                        onClick={() => {
                            let obj = this.state.data.find(o => o.id === key);
                            this.onShow(obj);
                        }}
                        color="info"
                        size="sm"
                        round
                        icon
                    >
                        <i className="fa fa-eye"/>
                    </Button>{" "}
                </div>
            )
        };
    }

    onShow(obj) {
        const {history} = this.props;
        history.push("/transfert-page/order/" + obj.id);
    }

    // Invert the modal status.
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    // Launch add modal.
    addToggle() {
        this.setState({modalType: "add"});      // set modal type as "add".
        var type = this.state.type;
        type["descState"] = type["dateState"] = type["customerState"] = "";
        // init modal data.
        type["desc"] = "";
        type["date"] = moment();
        type["customer"] = -1;
        this.setState({type});
        this.toggle();              // launch modal.
    }

    // Launch edit modal.
    editToggle(obj) {
        this.setState({curKey: obj.id});           // set id of current editing Command.
        this.setState({modalType: "edit"});        // set modal type as "edit".
        var type = this.state.type;

        // set modal data
        type["desc"] = obj.desc;
        type["date"] = moment(obj.fulldate);
        type["customer"] = obj.customer;
        this.setState({type});

        this.validationService.isFormValid();         // check the modal form if its data is valid.
        this.toggle();              // launch modal.
    }

    // This method is called when we press "Add" button in add modal.
    addCommand() {
        if (this.validationService.isFormValid())     // check the modal form if its data is valid.
        {
            var type = this.state.type;
            // call external api to add a new Command
            var vdate = type["date"];
            vdate = moment(vdate + vdate.utcOffset());
            // add a new Command to table.
            this.CommandService.add(type["desc"],
                vdate.year(),
                vdate.month() + 1,
                vdate.date(),
                vdate.hour(),
                vdate.minute(),
                type["customer"])
                .then(res => {
                    var id = res.id;
                    var data = this.state.data;
                    var customer_name = "";
                    this.state.customers.map((prop, key) => {
                        if (prop.id === type["customer"]) {
                            customer_name = prop.contact;
                        }
                        return prop.contact;
                    });
                    data.push(this.produceCommand(id, type["desc"], vdate.format("YYYY-MM-DD"), vdate.format("YYYY-MM-DD h:mm A"), 0, type["customer"], customer_name, "Validated"));
                    this.setState({data});
                    var options = {};
                    options = {
                        place: "tr",
                        message: "A new command is added successfully.",
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

    editCommand() {
        if (this.validationService.isFormValid())    // check the modal form if its data is valid.
        {
            var type = this.state.type;
            var key = this.state.curKey;
            var data = this.state.data;
            data.find((o, i) => {
                if (o.id === key) {
                    // here you should add some custom code so you can delete the data
                    // from this component and from your server as well

                    // set a Command data.
                    var vdate = type["date"];
                    vdate = moment(vdate + vdate.utcOffset());
                    this.CommandService.edit(o.id, type["desc"],
                        vdate.year(),
                        vdate.month() + 1,
                        vdate.date(),
                        vdate.hour(),
                        vdate.minute(),
                        type["customer"])  // call external api to edit a Command
                        .then(() => {
                            o.desc = type["desc"];
                            o.fulldate = vdate.format("YYYY-MM-DD h:mm A");
                            o.date = vdate.format("YYYY-MM-DD");
                            o.customer = type["customer"];
                            var customer_name = "";
                            this.state.customers.map((prop, key) => {
                                if (prop.id === o.customer) {
                                    customer_name = prop.contact;
                                }
                                return prop.contact;
                            });
                            o.customer_name = customer_name;
                            var options = {};
                            options = {
                                place: "tr",
                                message: "The changed data is saved successfully.",
                                type: "info",
                                icon: "now-ui-icons ui-1_bell-53",
                                autoDismiss: 3
                            };
                            this.setState({data: data});
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

    render() {
        return (
            <div>
                <NotificationAlert ref="notificationAlert"/>
                <PanelHeader
                    content={
                        <div className="header text-center">
                            <h2 className="title">Order</h2>
                            <p className="category">
                                You can add, edit, delete and show orders here.
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
                                            <CardTitle>Order Table</CardTitle>
                                        </Col>
                                        <Col xs={8} md={8}>
                                            <Button color="info" className="pull-right"
                                                    onClick={this.addToggle}>  {/* Add button */}
                                                <i className="fa fa-plus" style={{marginRight: 5}}/> Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.data}        // set data to react table.
                                        filterable
                                        defaultFilterMethod={(filter, row) => {
                                            const id = filter.pivotId || filter.id;
                                            return row[id] !== undefined ? String(row[id]).toLowerCase().includes(filter.value.toLowerCase()) : true
                                        }}
                                        columns={[
                                            {
                                                Header: "ID",
                                                accessor: "id_string",
                                                width: 100
                                            },                                            
                                            {
                                                Header: "Description",
                                                accessor: "desc"
                                            },
                                            {
                                                Header: "Validated date",
                                                accessor: "date"
                                            },
                                            {
                                                Header: "Customer",
                                                accessor: "customer_name"
                                            },
                                            {
                                                Header: "Transfert",
                                                accessor: "nbtransfert"
                                            },
                                            {
                                                Header: "Status",
                                                accessor: "status"
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
                <Modal isOpen={this.state.modal} toggle={this.toggle}
                       className={this.props.className}>     {/* Add or Edit modal */}
                    <ModalHeader
                        toggle={this.toggle}>{this.state.modalType === "add" ? "New order" : "Edit order"}</ModalHeader>
                    <ModalBody className="edit-modal-input">
                        <form>
                            <Row>
                                <Label sm={4}>Description</Label>
                                <Col xs={12} sm={8}>
                                    <FormGroup className={this.state.type.descState}>   {/* desc field */}
                                        <Input
                                            type="text"
                                            value={this.state.type["desc"]}
                                            onChange={e => this.validationService.typedesc(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={4}>Validated date</Label>
                                <Col xs={12} sm={8}>
                                    <FormGroup className={this.state.type.dateState}>      {/* date field */}
                                        <DateTime
                                            dateFormat="YYYY-MM-DD"
                                            timeFormat="h:mm A"
                                            value={this.state.type["date"]}
                                            onChange={e => this.validationService.typedate(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={4}>Customer : </Label>
                                <Col xs={12} sm={8}>
                                    <FormGroup className={this.state.type.customerState}>   {/* desc field */}
                                    <Select
                                        name="selectCustomer"
                                        value={this.state.type.customer}
                                        onChange={e => this.validationService.typeCustomer(e)}
                                        options={
                                            this.state.customers.map((prop, key) => {
                                                return { value: prop.id, label: prop.contact };
                                            })
                                        }
                                        clearable={false}
                                        style={this.state.type.customerState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                                    />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </ModalBody>
                    <ModalFooter className="justify-content-baseline">
                        {/* Set button text as "Add" if modal type is add or "Save" if modal type is edit. */}
                        <Button color="info" className="pull-right"
                                onClick={this.state.modalType === "add" ? this.addCommand : this.editCommand}>{this.state.modalType === "add" ? "Add" : "Save"}</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


CommandPage = Radium(CommandPage);

const mapStateToProps = store => ({
    store: store,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandPage);      // connect redux store to this page.
