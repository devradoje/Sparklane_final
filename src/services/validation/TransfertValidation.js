import TypeValidationService from './TypeValidationService';

class TransfertValidation {
    constructor(parent) {
        this.parent = parent;
    }

    // check modal form data.
    isFormValid() {
        // check if all fields are valid.
        this.date1Valid();
        this.date2Valid();
        this.addr1Valid();
        this.addr2Valid();
        this.fullnameValid();
        this.emailValid();
        this.phoneValid();
        this.cmdValid();
        this.chaufValid();
        this.chauf_priceValid();
        this.customer_priceValid();
        this.statusValid();
        let type = this.parent.state.type;
        // if fileds' values are invalid, then set the status variables as "has-danger".
        if (type["date1State"] !== "has-success") type["date1State"] = "has-danger";
        if (type["date2State"] !== "has-success") type["date2State"] = "has-danger";
        if (type["addr1State"] !== "has-success") type["addr1State"] = "has-danger";
        if (type["addr2State"] !== "has-success") type["addr2State"] = "has-danger";
        if (type["fullnameState"] !== "has-success") type["fullnameState"] = "has-danger";
        if (type["emailState"] !== "has-success") type["emailState"] = "has-danger";
        if (type["phoneState"] !== "has-success") type["phoneState"] = "has-danger";
        if (type["cmdState"] !== "has-success") type["cmdState"] = "has-danger";
        if (type["chaufState"] !== "has-success") type["chaufState"] = "has-danger";
        if (type["chauf_priceState"] !== "has-success") type["chauf_priceState"] = "has-danger";
        if (type["customer_priceState"] !== "has-success") type["customer_priceState"] = "has-danger";
        if (type["statusState"] !== "has-success") type["statusState"] = "has-danger";
        this.parent.setState({ type });

        // if all fields are valid, then return true, else return false.
        if (type["date1State"] === "has-success" && 
            type["date2State"] === "has-success" && 
            type["addr1State"] === "has-success" && 
            type["addr2State"] === "has-success" && 
            type["fullnameState"] === "has-success" && 
            type["emailState"] === "has-success" && 
            type["phoneState"] === "has-success" && 
            type["cmdState"] === "has-success" && 
            type["chauf_priceState"] === "has-success" && 
            type["customer_priceState"] === "has-success" && 
            type["statusState"] === "has-success" && 
            type["chaufState"] === "has-success")
        {
            return true;
        }
        return false;
    }

    // This method is called when date field is changed.
    typeDate1(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["date1"] = e;
        this.parent.setState({ type });
        this.date1Valid();
    }

    // check if the date field is valid.
    date1Valid() {
        let type = this.parent.state.type;
        var dateStr = "";
        if (typeof type["date1"] === "object")
            dateStr = type["date1"].format("YYYY-MM-DD h:mm A");
        else
            dateStr = type["date1"];
        var isValid = TypeValidationService.isDate(dateStr);
        type["date1State"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when date field is changed.
    typeDate2(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["date2"] = e;
        this.parent.setState({ type });
        this.date2Valid();
    }

    // check if the date field is valid.
    date2Valid() {
        let type = this.parent.state.type;
        var dateStr = "";
        if (typeof type["date2"] === "object")
            dateStr = type["date2"].format("YYYY-MM-DD h:mm A");
        else
            dateStr = type["date2"];
        var isValid = TypeValidationService.isDate(dateStr);
        type["date2State"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeAddr1(e) {
        this.parent.enableMapUpdate();
        let type = this.parent.state.type;
        type["addr1"] = e;
        this.parent.setState({ type });
        this.addr1Valid();
    }

    // check if the name field is valid.
    addr1Valid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["addr1"]);
        type["addr1State"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeAddr2(e) {
        this.parent.enableMapUpdate();
        let type = this.parent.state.type;
        type["addr2"] = e;
        this.parent.setState({ type });
        this.addr2Valid();
    }

    // check if the name field is valid.
    addr2Valid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["addr2"]);
        type["addr2State"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeFullname(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["fullname"] = e.target.value;
        this.parent.setState({ type });
        this.fullnameValid();
    }

    // check if the name field is valid.
    fullnameValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNotEmpty(type["fullname"]);
        type["fullnameState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when email field is changed.
    typeEmail(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["email"] = e.target.value;
        this.parent.setState({ type });
        this.emailValid();
    }

    // check if the email field is valid.
    emailValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isEmail(type["email"]);
        type["emailState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when phone field is changed.
    typePhone(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["phone"] = e.target.value;
        this.parent.setState({ type });
        this.phoneValid();
    }

    // check if the phone field is valid.
    phoneValid() {
        // reg expression to check phone.
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNumber(type["phone"]);
        type["phoneState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeCmd(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        if (e === null)
            type["cmd"] = -1;
        else
            type["cmd"] = e.value;
        this.parent.setState({ type });
        this.cmdValid();
    }

    // check if the name field is valid.
    cmdValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isValidId(type["cmd"]);
        type["cmdState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }
    
    // This method is called when name field is changed.
    typeChauf(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;  
        if (e === null)
            type["chauf"] = -1;
        else
            type["chauf"] = e.value;
        this.parent.setState({ type });
        this.chaufValid();
    }

    // check if the name field is valid.
    chaufValid() {
        let type = this.parent.state.type;
        type["chaufState"] = "has-success";
        this.parent.setState({ type });
    }

    typeChauf_price(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["chauf_price"] = e.target.value;
        this.parent.setState({ type });
        this.chauf_priceValid();
    }

    // check if the chauf_price field is valid.
    chauf_priceValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNumber(type["chauf_price"]);
        type["chauf_priceState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }
    
    typeCustomer_price(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        type["customer_price"] = e.target.value;
        this.parent.setState({ type });
        this.customer_priceValid();
    }

    // check if the customer_price field is valid.
    customer_priceValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isNumber(type["customer_price"]);
        type["customer_priceState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    // This method is called when name field is changed.
    typeStatus(e) {
        this.parent.disableMapUpdate();
        let type = this.parent.state.type;
        if (e === null)
            type["status"] = -1;
        else
            type["status"] = e.value;
        this.parent.setState({ type });
        this.statusValid();
    }

    // check if the name field is valid.
    statusValid() {
        let type = this.parent.state.type;
        var isValid = TypeValidationService.isValidId(type["status"]);
        type["statusState"] = TypeValidationService.getValidationClass(isValid);
        this.parent.setState({ type });
    }

    onError400(errorMessage) {
        var error = this.parent.state.error;
        var type = this.parent.state.type;
        if (errorMessage.errors.children.chauffeurPrice.errors !== undefined) {
          error["chauf_price"] = errorMessage.errors.children.chauffeurPrice.errors[0];
          type["chauf_priceState"] = "has-danger";
        }
        else {
          error["chauf_price"] = "";
        }
        if (errorMessage.errors.children.customerPrice.errors !== undefined) {
          error["customer_price"] = errorMessage.errors.children.customerPrice.errors[0];
          type["customer_priceState"] = "has-danger";
        }
        else {
          error["customer_price"] = "";
        }
        if (errorMessage.errors.children.addresse_depart.errors !== undefined) {
          error["addr1"] = errorMessage.errors.children.addresse_depart.errors[0];
          type["addr1State"] = "has-danger";
        }
        else {
          error["addr1"] = "";
        }
        if (errorMessage.errors.children.addresse_arriver.errors !== undefined) {
          error["addr2"] = errorMessage.errors.children.addresse_arriver.errors[0];
          type["addr2State"] = "has-danger";
        }
        else {
          error["addr2"] = "";
        }
        if (errorMessage.errors.children.transport_fullname.errors !== undefined) {
          error["fullname"] = errorMessage.errors.children.transport_fullname.errors[0];
          type["fullnameState"] = "has-danger";
        }
        else {
          error["fullname"] = "";
        }
        if (errorMessage.errors.children.transport_email.errors !== undefined) {
          error["email"] = errorMessage.errors.children.transport_email.errors[0];
          type["emailState"] = "has-danger";
        }
        else {
          error["email"] = "";
        }
        if (errorMessage.errors.children.transport_phone.errors !== undefined) {
          error["phone"] = errorMessage.errors.children.transport_phone.errors[0];
          type["phoneState"] = "has-danger";
        }
        else {
          error["phone"] = "";
        }
        if (errorMessage.errors.children.status.errors !== undefined) {
          error["status"] = errorMessage.errors.children.status.errors[0];
          type["statusState"] = "has-danger";
        }
        else {
          error["status"] = "";
        }
        if (errorMessage.errors.children.commande.errors !== undefined) {
          error["command"] = errorMessage.errors.children.commande.errors[0];
          type["cmdState"] = "has-danger";
        }
        else {
          error["command"] = "";
        }
        if (errorMessage.errors.children.dateEnlevement.errors !== undefined) {
          error["date1"] = errorMessage.errors.children.dateEnlevement.errors[0];
          type["date1State"] = "has-danger";
        }
        else {
          error["date1"] = "";
        }
        if (errorMessage.errors.children.dateDepot.errors !== undefined) {
          error["date2"] = errorMessage.errors.children.dateDepot.errors[0];
          type["date2State"] = "has-danger";
        }
        else {
          error["date2"] = "";
        }
        this.parent.setState({ type });
        this.parent.setState({ error });
      }
}

export default  TransfertValidation;
