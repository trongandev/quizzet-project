import {combineReducers} from 'redux';
import loginReducer from './login';
import registerReducer from './register';

const allReducers = combineReducers({
    loginReducer,
    registerReducer
})

export default allReducers