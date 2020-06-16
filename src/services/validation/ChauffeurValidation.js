import TypeValidationService from './TypeValidationService';

class ChauffeurValidation {
    constructor(parent) {
        this.parent = parent;
    }
        
    // check modal form data.
    isFormValid() {
        // check if all fields are valid.
        this.addrValid();
        this.emailValid();
        this.phoneValid();
        this.contactValid();
        this.societeValid();
        this.manufacturerValid();
        this.modelValid();
        this.immatriculationValid();
        this.parentValid();
        this.activatedValid();
        var type = this.parent.state.type;
        // if fileds' values are invalid, then set the status variables as "has-danger".
        if (type["addrState"] !== "has-success") type["addrState"] = "has-danger";
        if (type["contactState"] !== "has-success") type["contactState"] = "has-danger";
        if (type["societeState"] !== "has-success") type["societeState"] = "has-danger";
        if (type["phoneState"] !== "has-success") type["phoneState"] = "has-danger";
        if (type["emailState"] !== "has-success") type["emailState"] = "has-danger";
        if (type["manufacturerState"] !== "has-success") type["manufacturerState"] = "has-danger";
        if (type["modelState"] !== "has-success") type["modelState"] = "has-danger";
        if (type["immatriculationState"] !== "has-success") type["immatriculationState"] = "has-danger";
        if (type["parentState"] !== "has-success") type["parentState"] = "has-danger";
        if (type["activatedState"] !== "has-success") type["activatedState"] = "has-danger";
        this.parent.setState({ type });

        // if all fields are valid, then return true, else return false.
        if (type["addrState"] === "has-success" && 
            type["contactState"] === "has-success" && 
            type["societeState"] === "has-success" && 
            type["phoneState"] === "has-success" && 
            type["manufacturerState"] === "has-success" && 
            type["modelState"] === "has-success" && 
            type["immatriculationState"] === "has-success" && 
            type["parentState"] === "has-success" && 
            type["activatedState"] === "has-success" && 
            type["emailState"] === "has-success")
        {
            return true;
        }
        return false;
    }

    // This method is called when name field is changed.
    typeAddr(e) {
        this.parent.enableMapUpdate();
        var type = this.parent.state.type;
        type["addr"] = e;
        this.parent.setState({ type });
        this.addrValid();
    }

    // check if the name field is valid.
    addrValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["addr"]);
        type["addrState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }


    // This method is called when name field is changed.
    typeSociete(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["societe"] = e.target.value;
        this.parent.setState({ type });
        this.societeValid();
    }

    // check if the name field is valid.
    societeValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["societe"]);
        type["societeState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when email field is changed.
    typeEmail(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["email"] = e.target.value;
        this.parent.setState({ type });
        this.emailValid();
    }

    // check if the email field is valid.
    emailValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isEmail(type["email"]);
        type["emailState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when phone field is changed.
    typePhone(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["phone"] = e.target.value;
        this.parent.setState({ type });
        this.phoneValid();
    }

    // check if the phone field is valid.
    phoneValid() {
        // reg expression to check phone.
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNumber(type["phone"]);
        type["phoneState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeContact(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["contact"] = e.target.value;
        this.parent.setState({ type });
        this.contactValid();
    }

    // check if the name field is valid.
    contactValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["contact"]);
        type["contactState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }
    
    // This method is called when name field is changed.
    typeManufacturer(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["manufacturer"] = e.target.value;
        this.parent.setState({ type });
        this.manufacturerValid();
    }

    // check if the name field is valid.
    manufacturerValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["manufacturer"]);
        type["manufacturerState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeModel(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["model"] = e.target.value;
        this.parent.setState({ type });
        this.modelValid();
    }

    // check if the name field is valid.
    modelValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["model"]);
        type["modelState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeImmatriculation(e) {
        this.parent.disableMapUpdate();
        var type = this.parent.state.type;
        type["immatriculation"] = e.target.value;
        this.parent.setState({ type });
        this.immatriculationValid();
    }

    // check if the name field is valid.
    immatriculationValid() {
        var type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["immatriculation"]);
        type["immatriculationState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }
    
    // This method is called when name field is changed.
    typeParent(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        if (e === null)
            type["parent"] = -1;
        else
            type["parent"] = e.value;
        this.parent.setState({ type });
        this.parentValid();
    }

    // check if the name field is valid.
    parentValid() {
        let type = this.parent.state.type;
        type["parentState"] = "has-success";
        this.parent.setState({ type });
    }
    
    // This method is called when isactive field is changed.
    typeActivated(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        if (e === null)
            type["activated"] = null;
        else
            type["activated"] = e.value;
        this.parent.setState({ type });
        this.activatedValid();
    };

    // check if the isactive field is valid.
    activatedValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotNull(type["activated"]);
        type["activatedState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    };
}

export default  ChauffeurValidation;
