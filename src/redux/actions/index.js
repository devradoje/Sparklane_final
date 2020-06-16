import * as LoginActions from './login';
import * as TokenActions from './token';
import * as InfoActions from './info';
import * as UserActions from './user';

export const ActionCreators = Object.assign({},
    LoginActions,
    TokenActions,
    InfoActions,
    UserActions
);