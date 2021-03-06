import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';

import thunk from 'redux-thunk';
import { tasksReducer, themeReducer, languageReducer, secretReducer } from './reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  writeFailHandler: (err) => console.err(err),
}

const rootReducer = combineReducers({ 
  tasksReducer, 
  themeReducer, 
  languageReducer, 
  secretReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);