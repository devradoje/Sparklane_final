import TypeValidationService from './TypeValidationService';

class ProfileValidation {
    constructor(parent) {
        this.parent = parent;
    }

// check modal form data.
     isFormValid = function() {
        // check if all fields are valid.
        if (this.parent.userRole === 0) {
            this.passwordValid();
            this.confirmValid();
            let type = this.parent.state.type;
            if (type["passwordState"] !== "has-success") type["passwordState"] = "has-danger";
            if (type["confirmState"] !== "has-success") type["confirmState"] = "has-danger";
            this.parent.setState({ type });
            // if all fields are valid, then return true, else return false.
            return (type["passwordState"] === "has-success" &&
                type["confirmState"] === "has-success");
        }
        else if (this.parent.userRole === 1) {
            this.societeValid();
            this.contactValid();
            this.emailValid();
            this.phoneValid();
            this.addrValid();
            this.parentValid();
            this.manufacturerValid();
            this.modelValid();
            this.immatriculationValid();
            this.statusValid();
            this.passwordValid();
            this.confirmValid();
            let type = this.parent.state.type;
            // if fileds' values are invalid, then set the status variables as "has-danger".
            if (type["societeState"] !== "has-success") type["societeState"] = "has-danger";
            if (type["contactState"] !== "has-success") type["contactState"] = "has-danger";
            if (type["emailState"] !== "has-success") type["emailState"] = "has-danger";
            if (type["phoneState"] !== "has-success") type["phoneState"] = "has-danger";
            if (type["addrState"] !== "has-success") type["addrState"] = "has-danger";
            if (type["parentState"] !== "has-success") type["parentState"] = "has-danger";
            if (type["manufacturerState"] !== "has-success") type["manufacturerState"] = "has-danger";
            if (type["modelState"] !== "has-success") type["modelState"] = "has-danger";
            if (type["immatriculationState"] !== "has-success") type["immatriculationState"] = "has-danger";
            if (type["statusState"] !== "has-success") type["statusState"] = "has-danger";
            if (type["passwordState"] !== "has-success") type["passwordState"] = "has-danger";
            if (type["confirmState"] !== "has-success") type["confirmState"] = "has-danger";
            this.parent.setState({ type });

            // if all fields are valid, then return true, else return false.
            return (type["societeState"] === "has-success" &&
                type["contactState"] === "has-success" &&
                type["emailState"] === "has-success" &&
                type["phoneState"] === "has-success" &&
                type["addrState"] === "has-success" &&
                type["parentState"] === "has-success" &&
                type["manufacturerState"] === "has-success" &&
                type["modelState"] === "has-success" &&
                type["immatriculationState"] === "has-success" &&
                type["passwordState"] === "has-success" &&
                type["confirmState"] === "has-success" &&
                type["statusState"] === "has-success");
        }
        else if (this.parent.userRole === 2) {
            this.nameValid();
            this.emailValid();           
            this.phoneValid();           
            this.statusValid();
            this.passwordValid();
            this.confirmValid();
            let type = this.parent.state.type;
            // if fileds' values are invalid, then set the status variables as "has-danger".
            if (type["nameState"] !== "has-success") type["nameState"] = "has-danger";
            if (type["emailState"] !== "has-success") type["emailState"] = "has-danger";
            if (type["phoneState"] !== "has-success") type["phoneState"] = "has-danger";
            if (type["statusState"] !== "has-success") type["statusState"] = "has-danger";
            if (type["passwordState"] !== "has-success") type["passwordState"] = "has-danger";
            if (type["confirmState"] !== "has-success") type["confirmState"] = "has-danger";
            this.parent.setState({ type });

            // if all fields are valid, then return true, else return false.
            return (type["nameState"] === "has-success" &&
                type["emailState"] === "has-success" &&
                type["phoneState"] === "has-success" &&
                type["passwordState"] === "has-success" &&
                type["confirmState"] === "has-success" &&
                type["statusState"] === "has-success");
        }

    };

// This method is called when name field is changed.
    typeName = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["name"] = e.target.value;
        this.parent.setState({ type });
        this.nameValid();
    };

// check if the name field is valid.
    nameValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["name"]);
        type["nameState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when societe field is changed.
    typeSociete = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["societe"] = e.target.value;
        this.parent.setState({ type });
        this.societeValid();
    };

// check if the societe field is valid.
     societeValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["societe"]);
        type["societeState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when contact field is changed.
    typeContact = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["contact"] = e.target.value;
        this.parent.setState({ type });
        this.contactValid();
    };

// check if the contact field is valid.
    contactValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["contact"]);
        type["contactState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when email field is changed.
    typeEmail = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["email"] = e.target.value;
        this.parent.setState({ type });
        this.emailValid();
    };

// check if the email field is valid.
     emailValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isEmail(type["email"]);
        type["emailState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when phone field is changed.
     typePhone = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["phone"] = e.target.value;
        this.parent.setState({ type });
        this.phoneValid();
    };

// check if the phone field is valid.
    phoneValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNumber(type["phone"]);
        type["phoneState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when address field is changed.
     typeAddr = function(e) {
        this.parent.enableMapUpdate();
        let type = this.parent.state.type;
        type["addr"] = e;
        this.parent.setState({ type });
        this.addrValid();
    };

// check if the address field is valid.
    addrValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["addr"]);
        type["addrState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when parent field is changed.
     typeParent = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        if (e === null)
            type["parent"] = -1;
        else
            type["parent"] = e.value;
        this.parent.setState({ type });
        this.parentValid();
    };

// check if the parent field is valid.
    parentValid = function() {
        let type = this.parent.state.type;
        var isValid = true;
        type["parentState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when manufacturer field is changed.
     typeManufacturer = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["manufacturer"] = e.target.value;
        this.parent.setState({ type });
        this.manufacturerValid();
    };

// check if the manufacturer field is valid.
    manufacturerValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["manufacturer"]);
        type["manufacturerState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when model field is changed.
    typeModel = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["model"] = e.target.value;
        this.parent.setState({ type });
        this.modelValid();
    };

// check if the model field is valid.
    modelValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["model"]);
        type["modelState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when immatriculation field is changed.
    typeImmatriculation = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["immatriculation"] = e.target.value;
        this.parent.setState({ type });
        this.immatriculationValid();
    };

// check if the immatriculation field is valid.
    immatriculationValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["immatriculation"]);
        type["immatriculationState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };

// This method is called when status field is changed.
    typeStatus = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        if (e === null)
            type["status"] = null;
        else
            type["status"] = e.value;
        this.parent.setState({ type });
        this.statusValid();
    };

// check if the status field is valid.
    statusValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotNull(type["status"]);
        type["statusState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when password field is changed.
    typePassword = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["password"] = e.target.value;
        this.parent.setState({ type });
        this.passwordValid();
    };

// check if the password field is valid.
    passwordValid = function() {
        let type = this.parent.state.type;
        var isValid = true;
        type["passwordState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
    
// This method is called when confirm field is changed.
    typeConfirm = function(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["confirm"] = e.target.value;
        this.parent.setState({ type });
        this.confirmValid();
    };

// check if the confirm field is valid.
    confirmValid = function() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isEqual(type["password"], type["confirm"]);
        type["confirmState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
}

export default  ProfileValidation;
