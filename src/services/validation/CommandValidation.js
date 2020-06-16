import TypeValidationService from './TypeValidationService';

class CommandValidation {
    constructor(parent) {
        this.parent = parent;
    }

    // check modal form data.
    isFormValid() {
        // check if all fields are valid.
        this.descValid();
        this.dateValid();
        this.customerValid();
        var type = this.parent.state.type;
        // if fileds' values are invalid, then set the status variables as "has-danger".
        if (type["descState"] !== "has-success") type["descState"] = "has-danger";
        if (type["dateState"] !== "has-success") type["dateState"] = "has-danger";
        if (type["customerState"] !== "has-success") type["customerState"] = "has-danger";
        this.parent.setState({type});

        // if all fields are valid, then return true, else return false.
        if (type["descState"] === "has-success" &&
            type["customerState"] === "has-success" &&
            type["dateState"] === "has-success") {
            return true;
        }
        return false;
    }

    // This method is called when name field is changed.
    typedesc(e) {
        var type = this.parent.state.type;
        type["desc"] = e.target.value;
        this.parent.setState({type});
        this.descValid();
    }

    // check if the name field is valid.
    descValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["desc"]);
        type["descState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({type});
    }

    // This method is called when date field is changed.
    typedate(e) {
        var type = this.parent.state.type;
        type["date"] = e;
        this.parent.setState({type});
        this.dateValid();
    }

    // check if the date field is valid.
    dateValid() {
        var type = this.parent.state.type;
        var dateStr = "";
        if (typeof type["date"] === "object")
            dateStr = type["date"].format("YYYY-MM-DD h:mm A");
        else
            dateStr = type["date"];
        var isValid = TypeValidationService.isDate(dateStr);
        type["dateState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({type});
    }

    typeCustomer(e) {
        let type = this.parent.state.type;
        if (e === null)
            type["customer"] = -1;
        else
            type["customer"] = e.value;
        this.parent.setState({ type });
        this.customerValid();
    }

    // check if the name field is valid.
    customerValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isValidId(type["customer"]);
        type["customerState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }
}

export default  CommandValidation;
