import TypeValidationService from './TypeValidationService';

class UserValidation {
    constructor(parent) {
        this.parent = parent;
    }


// check modal form data.
     isFormValid = function() {
        // check if all fields are valid.
        this.usernameValid();
        this.isactiveValid();
        this.passwordValid();
        this.confirmValid();
        let type = this.parent.state.type;
        // if fileds' values are invalid, then set the status variables as "has-danger".
        if (type["usernameState"] !== "has-success") type["usernameState"] = "has-danger";
        if (type["isactiveState"] !== "has-success") type["isactiveState"] = "has-danger";
        if (type["passwordState"] !== "has-success") type["passwordState"] = "has-danger";
        if (type["confirmState"] !== "has-success") type["confirmState"] = "has-danger";
        this.parent.setState({ type });

        // if all fields are valid, then return true, else return false.
        return (type["usernameState"] === "has-success" &&
                type["passwordState"] === "has-success" &&
                type["confirmState"] === "has-success" &&
                type["isactiveState"] === "has-success");

    };

// This method is called when name field is changed.
     typeUsername = function(e) {
        let type = this.parent.state.type;
        type["username"] = e.target.value;
        this.parent.setState({ type });
        this.usernameValid();
    };

// check if the name field is valid.
     usernameValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isEmail(type["username"]);
        type["usernameState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when isactive field is changed.
     typeIsactive = function(e) {
        let type = this.parent.state.type;
        if (e === null)
            type["isactive"] = null;
        else
            type["isactive"] = e.value;
        this.parent.setState({ type });
        this.isactiveValid();
    };

// check if the isactive field is valid.
    isactiveValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotNull(type["isactive"]);
        type["isactiveState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

    typePassword = function(e) {
        let type = this.parent.state.type;
        type["password"] = e.target.value;
        this.parent.setState({ type });
        this.passwordValid();
    };

// check if the name field is valid.
    passwordValid = function() {
        let type = this.parent.state.type;
        type["passwordState"] = "has-success";
        this.parent.setState({ type });
    };
    
    typeConfirm = function(e) {
        let type = this.parent.state.type;
        type["confirm"] = e.target.value;
        this.parent.setState({ type });
        this.confirmValid();
    };

// check if the name field is valid.
    confirmValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isEqual(type["password"], type["confirm"]);
        type["confirmState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

}

export default UserValidation;
