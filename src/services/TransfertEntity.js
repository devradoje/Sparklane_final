import RouterService from "./routerService";

const baseEntity = 'transfert';

class TransfertService {

    constructor(parent) {
        this.routerService = new RouterService(parent);
    }
    
    add(year1, month1, day1, hour1, minute1, year2, month2, day2, hour2, minute2,
        addr1, addr2, fullname, email, phone, cmd, chauf_price, customer_price, status, chauf_id) {
        
        let parameters = {method: 'post', url: baseEntity, data:{
                "dateEnlevement": {
                    "date": {
                        "year": year1,
                        "month": month1,
                        "day": day1
                    },
                    "time": {
                        "hour": hour1,
                        "minute": minute1
                    }
                },
                "dateDepot": {
                    "date": {
                        "year": year2,
                        "month": month2,
                        "day": day2
                    },
                    "time": {
                        "hour": hour2,
                        "minute": minute2
                    }
                },
                "addresse_depart" : addr1,
                "addresse_arriver" : addr2,
                "transport_fullname" : fullname,
                "transport_email" : email,
                "transport_phone" : phone,
                "chauffeurPrice": chauf_price,
                "customerPrice": customer_price,
                "status": status,
                "commande": cmd,
                "chauffeur": chauf_id<0?undefined:chauf_id
            }};
        return this.routerService.request(parameters);
    }

    edit(id, year1, month1, day1, hour1, minute1, year2, month2, day2, hour2, minute2,
        addr1, addr2, fullname, email, phone, cmd, chauf_price, customer_price, status, chauf_id) {
        
        let uri = baseEntity.concat('/',id);
        let parameters = {method: 'patch', url: uri, data:{
                "dateEnlevement": {
                    "date": {
                        "year": year1,
                        "month": month1,
                        "day": day1
                    },
                    "time": {
                        "hour": hour1,
                        "minute": minute1
                    }
                },
                "dateDepot": {
                    "date": {
                        "year": year2,
                        "month": month2,
                        "day": day2
                    },
                    "time": {
                        "hour": hour2,
                        "minute": minute2
                    }
                },
                "addresse_depart" : addr1,
                "addresse_arriver" : addr2,
                "transport_fullname" : fullname,
                "transport_email" : email,
                "transport_phone" : phone,
                "chauffeurPrice": chauf_price,
                "customerPrice": customer_price,
                "status": status,
                "commande": cmd,
                "chauffeur": chauf_id<0?undefined:chauf_id
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

    fetchByOrderId(id) {
        let uri = 'transfert/commande/'.concat(id);
        let parameters = {method: 'get', url: uri};
        return this.routerService.request(parameters);
    }
}

export default TransfertService;