import RouterService from "./routerService";

const baseEntity = 'chauffeur';

class ChauffeurService {

    constructor(parent) {
        this.routerService = new RouterService(parent);
    }

    add(societe, contact, email, phone, adresse, manufacturer, model, immatriculation, parent_id, activated) {
        let parameters = {method: 'post', url: baseEntity, data:{
                "societe":societe,
                "contact":contact,
                "email":email,
                "telephone":phone,
                "adresse":adresse,
                "manufacturer": manufacturer,
                "model": model,
                "immatricualation": immatriculation,
                "parentChauffeur": parent_id<0?undefined:parent_id,
                "activated": activated
            }};
        return this.routerService.request(parameters);
    }

    edit(id, societe, contact, email, phone, adresse, manufacturer, model, immatriculation, parent_id, activated) {
        let uri = baseEntity.concat('/',id);
        let parameters = {method: 'patch', url: uri, data:{
                "societe":societe,
                "contact":contact,
                "email":email,
                "telephone":phone,
                "adresse":adresse,
                "manufacturer": manufacturer,
                "model": model,
                "immatricualation": immatriculation,
                "parentChauffeur": parent_id<0?undefined:parent_id,
                "activated": activated
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

export default ChauffeurService;