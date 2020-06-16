
class TypeValidationService {

    static isEmail(value) {
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRex.test(value);
    }

    static isNumber(value) {
        var numberRex = new RegExp("^[0-9]+$");
        return numberRex.test(value);
    }

    static isValidId(value) {
        return (value >= 0);
    }

    static isNotEmpty(value) {
        return value.length > 0;
    }

    static isDate(value) {
        var dateRex = /^([12]\d\d\d)-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]) ([AP]M)$/
        return dateRex.test(value);
    }

    static isNotNull(value) {
        return value !== null;
    }

    static getValidationClass(value) {
        return value?"has-success":"has-danger";
    }

    static isEqual(value1, value2) {
        return value1 === value2;
    }
}

export default TypeValidationService;