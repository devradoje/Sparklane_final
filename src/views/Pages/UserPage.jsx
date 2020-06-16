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
import Select from "react-select";
import 'react-select/dist/react-select.css';
import ReactFileReader from 'react-file-reader';
import {connect} from 'react-redux';
import Papa from 'papaparse';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../redux/actions/index';
import ReactTooltip from 'react-tooltip'
import UserServiceAPI from '../../services/UserEntity';    // import this.UserService
import ValidationService from '../../services/validation/UserValidation';    // import validationService

let dataTable = [];   // All User table data is stored here.

// This component is for User Page.
class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: [],
            Users: [],
            type: {
                username: "",       // current form name data
                isactive: "",          // current form email data
                password: "",
                confirm: "",
                usernameState: "",  // has-success or has-danger, this represents whether the name is valid.
                isactiveState: "",     // has-success or has-danger, this represents whether the email is valid.
                passwordState: "",
                confirmState: ""
            },
            modalType: "",        // add or edit, this represents whether the modal is for adding or editing.
            curKey: 0             // This is the id of current editing User.
        };

        this.UserService = new UserServiceAPI(this);
        this.validationService = new ValidationService(this); // create an instance of validation

        this.toggle = this.toggle.bind(this);
        this.addUser = this.addUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.addToggle = this.addToggle.bind(this);
        this.editToggle = this.editToggle.bind(this);
        this.initData = this.initData.bind(this);
        this.initDataFromCSV = this.initDataFromCSV.bind(this);
    }

    componentWillMount() {
        this.getAllUsers();      // Get all Users from external api.
    }

    // Get all Users from external api.
    getAllUsers() {
        this.UserService.fetchAll()
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

    // Get a specified User from database.
    getUser(id) {
        this.UserService.fetch(id)
            .then(data => {
            });
    }

    // init table with received data from external api
    initData() {
        this.setState({
            data: dataTable.map((prop, key) => {
                return this.produceUser(prop.id, prop.username, prop.is_active);
            })
        });
    }

    // init table with loaded data from CSV file
    initDataFromCSV() {
        this.setState({
            data: dataTable.map((prop, key) => {
                return this.produceUser(prop[0], prop[1], prop[2]);
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

    // Produce a User element from data to add into User table.
    produceUser(id, vname, isactive) {
        let key = id;
        // remove all spaces
        vname = vname.trim();
        return {
            id: key,
            username: vname,
            isactive: isactive,
            isactiveStr: isactive?"Active":"Inactive",
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
                                    this.UserService.delete(o.id).then(res => {
                                        var options = {};
                                        options = {
                                            place: "tr",
                                            message: "One user is deleted.",
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
        type["usernameState"] = type["passwordState"] = type["confirmState"] = type["isactiveState"] = "";
        type["username"] = "";   // init modal data.
        type["password"] = "";
        type["confirm"] = "";
        type["isactive"] = false;
        this.setState({type});
        this.toggle();              // launch modal.
    }

    // Launch edit modal.
    editToggle(obj) {
        this.setState({curKey: obj.id});           // set id of current editing User.
        this.setState({modalType: "edit"});        // set modal type as "edit".
        let type = this.state.type;

        // set modal data
        type["username"] = obj.username;
        type["isactive"] = obj.isactive;
        type["password"] = "";
        type["confirm"] = "";
        this.setState({type});

        this.validationService.isFormValid();         // check the modal form if its data is valid.
        this.toggle();              // launch modal.
    }

    // This method is called when we press "Add" button in add modal.
    addUser() {
        if (this.validationService.isFormValid())     // check the modal form if its data is valid.
        {
            let type = this.state.type;
            // call external api to add a new User
            this.UserService.add(type["username"], type["password"], type["isactive"])
                .then(res => {
                    var id = res.id;
                    let data = this.state.data;
                    data.push(this.produceUser(id, type["username"], type["isactive"]));
                    this.setState({data});
                    let options = {
                        place: "tr",
                        message: "A new User is added successfully.",
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

    editUser() {
        if (this.validationService.isFormValid())    // check the modal form if its data is valid.
        {
            let type = this.state.type;
            let key = this.state.curKey;
            let data = this.state.data;
            data.find((o, i) => {
                if (o.id === key) {
                    o.username = type["username"];
                    o.isactive = type["isactive"];
                    o.isactiveStr = o.isactive?"Active":"Inactive";
                    this.UserService.edit(o.id, o.username, type["password"], o.isactive)  // call external api to edit a User
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
                            <h2 className="title">User</h2>
                            <p className="category">
                                You can add, edit, delete Users here.
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
                                            <CardTitle>User Table</CardTitle>
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
                                                <span>Data format is username | is_active.</span>
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
                                                Header: "User Name",
                                                accessor: "username",
                                            },
                                            {
                                                Header: "Status",
                                                accessor: "isactiveStr"
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
                        toggle={this.toggle}>{this.state.modalType === "add" ? "New User" : "Edit User"}</ModalHeader>
                    <ModalBody className="edit-modal-input">
                        <form>
                            <Row>
                                <Label sm={3}>User Name</Label>
                                <Col xs={12} sm={9}>
                                    <FormGroup className={this.state.type.usernameState}>   {/* Name field */}
                                        <Input
                                            type="text"
                                            value={this.state.type["username"]}
                                            onChange={e => this.validationService.typeUsername(e)}
                                            readOnly
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={3}>Password</Label>
                                <Col xs={12} sm={9}>
                                    <FormGroup className={this.state.type.passwordState}>   {/* Name field */}
                                        <Input
                                            type="password"
                                            value={this.state.type["password"]}
                                            onChange={e => this.validationService.typePassword(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={3}>Confirm</Label>
                                <Col xs={12} sm={9}>
                                    <FormGroup className={this.state.type.confirmState}>   {/* Name field */}
                                        <Input
                                            type="password"
                                            value={this.state.type["confirm"]}
                                            onChange={e => this.validationService.typeConfirm(e)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Label sm={3}>Status</Label>
                                <Col xs={12} sm={9}>
                                    <FormGroup className={this.state.type.isactiveState}>   {/* Name field */}
                                        <Select
                                            name="selectStatus"
                                            value={this.state.type.isactive}
                                            onChange={e => this.validationService.typeIsactive(e)}
                                            options={[
                                                {value: true, label: "Active"},
                                                {value: false, label: "Inactive"}
                                            ]}
                                            clearable={false}
                                            style={this.state.type.statusState==="has-danger"?{ borderColor: "#ff3636", borderRadius: 30 }:{ borderColor: "#e3e3e3", borderRadius: 30 }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        {/* Set button text as "Add" if modal type is add or "Save" if modal type is edit. */}
                        <Button color="info"
                                onClick={this.state.modalType === "add" ? this.addUser : this.editUser}>{this.state.modalType === "add" ? "Add" : "Save"}</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


UserPage = Radium(UserPage);

const mapStateToProps = store => ({
    store: store,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);      // connect redux store to this page.
