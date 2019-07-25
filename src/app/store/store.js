import { createStore, combineReducers } from 'redux';
import * as reducers from './reducers';

const appReducer = combineReducers(reducers);

const store = createStore(appReducer);

export default store;
