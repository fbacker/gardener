import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-localstorage'

import rootReducer from '../reducers'
import Utils from '../utils'
import {APP_LOADED_STORAGE,appLoadedStorage} from '../actions/app'

export default function configureStore(initialState) {

    const engine = createEngine('mst34bd432!');
    const storageEngineMiddleware = storage.createMiddleware(engine,[APP_LOADED_STORAGE]);

    const reducer = storage.reducer(combineReducers(rootReducer));
    let store = createStore(
        reducer,
        initialState,
        compose(applyMiddleware(thunk,storageEngineMiddleware),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()),
        );

    Utils.setURL('http://127.0.0.1:8000/');


    const load = storage.createLoader(engine);
    load(store)
      .then((newState) => {
        //console.log('Loaded state:', newState);
        store.dispatch(appLoadedStorage());
      })
      .catch(() => {
        console.log('Failed to load previous state');
        store.dispatch(appLoadedStorage());
      });
    return store;
}
