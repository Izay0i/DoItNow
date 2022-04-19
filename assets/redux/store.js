import { createStore, combineReducers, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import tasksReducer from './reducers';

const rootReducer = combineReducers({tasksReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));