import TypeValidationService from './TypeValidationService';

class CustomerValidation {
    constructor(parent) {
        this.parent = parent;
    }


// check modal form data.
     isFormValid = function() {
        // check if all fields are valid.
        this.requireValid();
        this.emailValid();
        this.numberValid();
        this.activatedValid();
        let type = this.parent.state.type;
        // if fileds' values are invalid, then set the status variables as "has-danger".
        if (type["requiredState"] !== "has-success") type["requiredState"] = "has-danger";
        if (type["emailState"] !== "has-success") type["emailState"] = "has-danger";
        if (type["numberState"] !== "has-success") type["numberState"] = "has-danger";
        if (type["activatedState"] !== "has-success") type["activatedState"] = "has-danger";
        this.parent.setState({ type });

        // if all fields are valid, then return true, else return false.
        return (type["requiredState"] === "has-success" &&
            type["emailState"] === "has-success" &&
            type["activatedState"] === "has-success" &&
            type["numberState"] === "has-success");

    };

// This method is called when name field is changed.
     typeRequired = function(e) {
        let type = this.parent.state.type;
        type["required"] = e.target.value;
        this.parent.setState({ type });
        this.requireValid();
    };

// check if the name field is valid.
     requireValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["required"]);
        type["requiredState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when email field is changed.
     typeEmail = function(e) {
        let type = this.parent.state.type;
        type["email"] = e.target.value;
        this.parent.setState({ type });
        this.emailValid();
    };

// check if the email field is valid.
     emailValid =function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isEmail(type["email"]);
        type["emailState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when phone field is changed.
     typeNumber = function(e) {
        let type = this.parent.state.type;
        type["number"] = e.target.value;
        this.parent.setState({ type });
        this.numberValid();
    };

// check if the phone field is valid.
     numberValid = function() {
        // reg expression to check phone.
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNumber(type["number"]);
        type["numberState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when isactive field is changed.
     typeActivated = function(e) {
        let type = this.parent.state.type;
        if (e === null)
            type["activated"] = null;
        else
            type["activated"] = e.value;
        this.parent.setState({ type });
        this.activatedValid();
    };

// check if the isactive field is valid.
    activatedValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotNull(type["activated"]);
        type["activatedState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
}

export default  CustomerValidation;
