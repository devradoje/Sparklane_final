import RouterService from "./routerService";

const baseEntity = 'customer';

class CustomerService {

    constructor(parent) {
        this.routerService = new RouterService(parent);
    }

    add(name, email, phone, activated) {
        let parameters = {method: 'post', url: baseEntity, data:{
                'societe': 'klh-competence',
                'contact': name,
                'telephone': phone,
                'email': email,
                'adresse': '1 rue gallieni',
                'cdp': '92240',
                'ville': 'Malakoff',
                'pays': 'France',
                'activated': activated
            }};
        return this.routerService.request(parameters);
    }

    edit(id, name, email, phone, activated) {
        let uri = baseEntity.concat('/',id);
        let parameters = {method: 'patch', url: uri, data:{
                'contact': name,
                'telephone': phone,
                'email': email,
                'activated': activated
            }};
        return this.routerService.request(parameters);
    }

    delete(id) {
        let uri =  baseEntity.concat('/',id);
        let parameters = {method: 'delete', url: uri};
        return this.routerService.request(parameters);
    }

    fetch(id) {
        let uri =  baseEntity.concat('/',id);
        let parameters = {method: 'get', url: uri};
        return this.routerService.request(parameters);
    }

    fetchAll() {
        let parameters = {method: 'get', url: baseEntity};
        return this.routerService.request(parameters);
    }
}

export default CustomerService;