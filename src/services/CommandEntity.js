import RouterService from "./routerService";

const baseEntity = 'commande';
class CommandService {

    constructor(parent) {
        this.routerService = new RouterService(parent);
    }
    
    add(desc, year, month, day, hour, minute, customer) {
        let parameters = {method: 'post', url: baseEntity, data:{
                "designation": desc,
                "validatedDate": {
                    "date": {
                        "year": year,
                        "month": month,
                        "day": day
                    },
                    "time": {
                        "hour": hour,
                        "minute": minute
                    }
                },
                "customer": customer
            }};
        return this.routerService.request(parameters);
    }

    edit(id, desc, year, month, day, hour, minute, customer) {
        let uri = baseEntity.concat('/',id);
        let parameters = {method: 'patch', url: uri, data:{
                "designation": desc,
                "validatedDate": {
                    "date": {
                        "year": year,
                        "month": month,
                        "day": day
                    },
                    "time": {
                        "hour": hour,
                        "minute": minute
                    }
                },
                "customer": customer
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


    fetchAllByCustomer(id) {
        let uri = 'commande/customer/'.concat(id);
        let parameters = {method: 'get', url: uri};
        return this.routerService.request(parameters);
    }
}

export default CommandService;