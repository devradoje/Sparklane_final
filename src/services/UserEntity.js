import RouterService from "./routerService";

const baseEntity = 'user';

class UserService {

    constructor(parent) {
        this.routerService = new RouterService(parent);
    }

    add(username, password, isactive) {
        let parameters = {method: 'post', url: baseEntity, data:{
                'email': username,
                'password': password,
                'isActive': isactive
            }};
        return this.routerService.request(parameters);
    }

    edit(id, username, password, isactive) {
        let uri = baseEntity.concat('/',id);
        let parameters = {method: 'patch', url: uri, data:{
                'email': username,
                'password': password===""?undefined:password,
                'isActive': isactive
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

    getProfile() {
        let uri =  baseEntity.concat('/profil/information');
        let parameters = {method: 'get', url: uri};
        return this.routerService.request(parameters);
    }
}

export default UserService;