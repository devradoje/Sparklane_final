import React, {Component} from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import {
    Card, CardBody, CardHeader, CardTitle, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Input, Label, FormGroup
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import Radium from 'radium';
import {PanelHeader, Button} from "components";
import ReactFileReader from 'react-file-reader';
import {connect} from 'react-redux';
import Select from "react-select";
import 'react-select/dist/react-select.css';
import Papa from 'papaparse';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../redux/actions/index';
import ReactTooltip from 'react-tooltip'
import CustomerServiceAPI from '../../services/CustomerEntity';    // import this.CustomerService
import ValidationService from '../../services/validation/CustomerValidation';    // import validationService

import "../../assets/css/mstyle.css";

let dataTable = [];   // All customer table data is stored here.

// This component is for Customer Page.
class CustomerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: [],
            customers: [],
            type: {
                required: "",       // current form name data
                email: "",          // current form email data
                number: "",         // current form phone data
                activated: false,
                requiredState: "",  // has-success or has-danger, this represents whether the name is valid.
                emailState: "",     // has-success or has-danger, this represents whether the email is valid.
                numberState: "",    // has-success or has-danger, this represents whether the phone is valid.
                activatedState: ""
            },
            modalType: "",        // add or edit, this represents whether the modal is for adding or editing.
            curKey: 0             // This is the id of current editing customer.
        };

        this.CustomerService = new CustomerServiceAPI(this);
        this.validationService = new ValidationService(this); // create an instance of validation

        this.toggle = this.toggle.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.addToggle = this.addToggle.bind(this);
        this.editToggle = this.editToggle.bind(this);
        this.initData = this.initData.bind(this);
        this.initDataFromCSV = this.initDataFromCSV.bind(this);
    }

    componentWillMount() {
        this.getAllCustomers();      // Get all customers from external api.
    }

    // Get all customers from external api.
    getAllCustomers() {
        this.CustomerService.fetchAll()
            .then(data => {
                dataTable = data;                      // set received data to dataTable so that
                if (data !== undefined) {
                    dataTable.sort(function (a, b) {
                        return a.id > b.id
                    });
                    this.initData();                          //    initData() method can init table with it.    
                }
            });
    }

    // Get a specified customer from database.
    getCustomer(id) {
        this.CustomerService.fetch(id)
            .then(data => {
            });
    }

    // init table with received data from external api
    initData() {
        this.setState({
            data: dataTable.map((prop, key) => {
                return this.produceCustomer(prop.id, prop.contact, prop.email, prop.telephone, prop.activated, prop.commandes.length);
            })
        });
    }

    // init table with loaded data from CSV file
    initDataFromCSV() {
        this.setState({
            data: dataTable.map((prop, key) => {
                return this.produceCustomer(prop[0], prop[1], prop[2], prop[3], 0);
            })
        });
    }

    // Read and parse a CSV file.
    handleCSV = files => {
        let object = this;
        Papa.parse(files[0], {
            complete: function (results) {
                dataTable = results.data;
                object.initDataFromCSV();
            }
        });
    };

    onShow(obj) {
        const {history} = this.props;
        history.push("/command-page/customer/" + obj.id);
    }

    // Produce a customer element from data to add into customer table.
    produceCustomer(id, vname, vemail, vphone, activated, nbcommand) {
        let key = id;
        // remove all spaces
        vname = vname.trim();
        vemail = vemail.trim();
        vphone = vphone.trim();
        return {
            id: key,
            name: vname,
            email: vemail,
            phone: vphone,
            activated: activated?true:false,
            activatedString: activated?"Active":"Inactive",
            nbcommand: nbcommand,
            actions: (
                // we've added some custom button actions
                <div className="actions-right">
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
                                    this.CustomerService.delete(o.id).then(res => {
                                        var options = {};
                                        options = {
                                            place: "tr",
                                            message: "One customer is deleted.",
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
                    </Button>
                </div>
            )
        };
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
        let type = this.state.type;
        type["requiredState"] = type["emailState"] = type["numberState"] = type["activatedState"] = "";
        type["required"] = type["email"] = type["number"] = "";   // init modal data.
        type["activated"] = false;
        this.setState({type});
        this.toggle();              // launch modal.
    }

    // Launch edit modal.
    editToggle(obj) {
        this.setState({curKey: obj.id});           // set id of current editing customer.
        this.setState({modalType: "edit"});        // set modal type as "edit".
        let type = this.state.type;

        // set modal data
        type["required"] = obj.name;
        type["email"] = obj.email;
        type["number"] = obj.phone;
        type["activated"] = obj.activated;
        this.setState({type});

        this.validationService.isFormValid();         // check the modal form if its data is valid.
        this.toggle();              // launch modal.
    }

    // This method is called when we press "Add" button in add modal.
    addCustomer() {
        if (this.validationService.isFormValid())     // check the modal form if its data is valid.
        {
            let type = this.state.type;
            // call external api to add a new customer
            this.CustomerService.add(type["required"], type["email"], type["number"], type["activated"])
                .then(res => {
                    var id = res.id;
                    let data = this.state.data;
                    data.push(this.produceCustomer(id, type["required"], type["email"], type["number"], type["activated"], 0));
                    this.setState({data});
                    let options = {
                        place: "tr",
                        message: "A new customer is added successfully.",
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

    editCustomer() {
        if (this.validationService.isFormValid())    // check the modal form if its data is valid.
        {
            let type = this.state.type;
            let key = this.state.curKey;
            let data = this.state.data;
            data.find((o, i) => {
                if (o.id === key) {
                    o.name = type["required"];
                    o.email = type["email"];
                    o.phone = type["number"];
                    o.activated = type["activated"];
                    o.activatedString = o.activated?"Active":"Inactive";
                    this.CustomerService.edit(o.id, o.name, o.email, o.phone, o.activated)  // call external api to edit a customer
                        .then(() => {
                            let options = {
                                place: "tr",
                                message: "The changed data is saved successfully.",
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
            this.setState({
                modal: !this.state.modal
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
                            <h2 className="title">Customer</h2>
                            <p className="category">
                                You can add, edit, delete customers here.
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
                                            <CardTitle>Customer Table</CardTitle>
                                        </Col>
                                        <Col xs={8} md={8}>
                                            <Button color="info" className="pull-right"
                                                    onClick={this.addToggle}>  {/* Add button */}
                                                <i className="fa fa-plus" style={{marginRight: 5}}/> Add
                                            </Button>
                                            <ReactFileReader handleFiles={this.handleCSV} fileTypes={'.csv'}
                                                             multipleFiles={false}>
                                                <Button data-tip data-for='csvTooltip' color="primary"
                                                        className="pull-right" style={{marginRight: 10}}
                                                > {/* Load from CSV button */}
                                                    <i className="fa fa-download" style={{marginRight: 5}}/> From CSV
                                                </Button>
                                            </ReactFileReader>
                                            <ReactTooltip id='csvTooltip' place='bottom' effect='solid'>
                                                <span>Data format is name | email | telephone.</span>
                                            </ReactTooltip>
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
                                                Header: "Name",
                                                accessor: "name",
                                            },
                                            {
                                                Header: "Email",
                                                accessor: "email"
                                            },
                                            {
                                                Header: "Phone",
                                                accessor: "phone"
                                            },
                                            {
                                                Header: "Commande",
                                                accessor: "nbcommand"
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
                <Modal isOpen={this.state.modal} toggle={this.toggle}
                       className={this.props.className}>     {/* Add or Edit modal */}
                    <ModalHeader
                        toggle={this.toggle}>{this.state.modalType === "add" ? "New Customer" : "Edit Customer"}</ModalHeader>
                    <ModalBody className="edit-modal-input">
                        <form>
                            <Row>
                                <Label sm={2}>Name</Label>
                                <Col xs={12} sm={10}>
                                    <FormGroup className={this.state.type.requiredState}>   {/* Name field */}
                                        <Input
                                            type="text"
                                            value={this.state.type["required"]}
                                            onChange={e => this.validationService.typeRequired(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={2}>Email</Label>
                                <Col xs={12} sm={10}>
                                    <FormGroup className={this.state.type.emailState}>      {/* Email field */}
                                        <Input
                                            type="email"
                                            value={this.state.type["email"]}
                                            onChange={e => this.validationService.typeEmail(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={2}>Phone</Label>
                                <Col xs={12} sm={10}>
                                    <FormGroup className={this.state.type.numberState}>     {/* Phone field */}
                                        <Input
                                            type="text"
                                            value={this.state.type["number"]}
                                            onChange={e => this.validationService.typeNumber(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={2}>Status</Label>
                                <Col xs={12} sm={10}>
                                    <FormGroup className={this.state.type.activatedState}>   {/* Name field */}
                                        <Select
                                            name="selectStatus"
                                            value={this.state.type.activated}
                                            onChange={e => this.validationService.typeActivated(e)}
                                            options={[
                                                {value: true, label: "Active"},
                                                {value: false, label: "Inactive"}
                                            ]}
                                            clearable={false}
                                            style={this.state.type.activatedState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        {/* Set button text as "Add" if modal type is add or "Save" if modal type is edit. */}
                        <Button color="info"
                                onClick={this.state.modalType === "add" ? this.addCustomer : this.editCustomer}>{this.state.modalType === "add" ? "Add" : "Save"}</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


CustomerPage = Radium(CustomerPage);

const mapStateToProps = store => ({
    store: store,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);      // connect redux store to this page.
