import { createStore, combineReducers } from 'redux';
import * as reducers from './reducers';

const appReducer = combineReducers(reducers);

export const store = createStore(appReducer);
