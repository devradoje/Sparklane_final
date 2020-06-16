import axios from 'axios';
import {api_data} from "../variables/general";
import store from "../redux/createStore";

class routerService {

    options = {
        headers: {}
    };

    api = axios.create({
        baseURL: api_data.baseUrl
    });

    constructor(parent) {
        this.parent = parent;
        this.onError = this.onError.bind(this);
    }

    onError(error) {
        if (error.response !== undefined) {
            switch (error.response.status) {
                case 401:
                    store.dispatch({ type : 'SETINFO', info : 'token_error' });
                    store.dispatch({ type : 'SIGNOUT' });
                    break;
                case 404:
                    break;
                default:
                    break;
            }
        }

        if (this.parent.refs !== undefined && this.parent.refs.notificationAlert !== undefined) {

            var notificationOptions = {};
            notificationOptions = {
                place: "tr",
                message: "An error was occurred during API call.",
                type: "primary",
                icon: "now-ui-icons ui-1_bell-53",
                autoDismiss: 5
            };  

            this.parent.refs.notificationAlert.notificationAlert(notificationOptions);
        }   
        
        
        return Promise.reject(error);
    }

    onSuccess(response) {
        return Promise.resolve(response.data);
    };

    request(parameters)
    {
        let config = {'Authorization':''};
        const token = store.getState().tokenReducer;
        config.Authorization = 'Bearer ' + token;
        this.options.headers = config;

        return this.api(Object.assign({},this.options,parameters))
            .then(this.onSuccess)
            .catch(this.onError);
    }
}

export default routerService;