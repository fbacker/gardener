import {APP_LOADED_STORAGE,APP_CONFIG,
APP_DATA_INVALIDATE_ALL,APP_DATA_INVALIDATE,APP_DATA_REQUEST,APP_DATA_RESPONSE,
APP_NODE_INVALIDATE,APP_NODE_REQUEST,APP_NODE_RESPONSE} from '../actions/app'

import moment from 'moment'

const initialState = {
    loadedStorageComplete: false,
    config: null,
    fetchingTemperature: false,
    fetchingHumidity: false,
    fetchingMoisture: false,
    dataTemperature:{},
    dataHumidity:{},
    dataMoisture:{},
    dateTemperature:null,
    dateHumidity:null,
    dateMoisture:null,
    nodes:{}
}

export default function app(state = initialState, action){
    var obj;
    switch(action.type){

      case APP_LOADED_STORAGE:
        return  Object.assign({}, state, {
            loadedStorageComplete: true,
            nodes:{},
        })

      case APP_CONFIG:
        return  Object.assign({}, state, {
            config: action.config,
        })

      case APP_DATA_INVALIDATE_ALL:
        return  Object.assign({}, state, {
            fetchingTemperature: false,
            fetchingHumidity: false,
            fetchingMoisture: false,
        })

      case APP_DATA_INVALIDATE:
        obj = Object.assign({}, state);
        obj['fetching'+action.dataType] = false;
        return obj;

      case APP_DATA_REQUEST:
        obj = Object.assign({}, state);
        obj['fetching'+action.dataType] = true;
        return obj;

      case APP_DATA_RESPONSE:
        obj = Object.assign({}, state)
        obj['data'+action.dataType] = action.data;
        obj['date'+action.dataType] = moment().unix();
        return obj;

      case APP_NODE_INVALIDATE:
        obj = Object.assign({}, state);
        if(!obj.nodes[action.nodeId]){
            obj.nodes[action.nodeId] = {isFetching:false,data:null,date:null};
        }
        obj.nodes[action.nodeId].isFetching = false;
        return obj;

      case APP_NODE_REQUEST:
        obj = Object.assign({}, state);
        if(!obj.nodes[action.nodeId]){
            obj.nodes[action.nodeId] = {isFetching:false,data:null,date:null};
        }
        obj.nodes[action.nodeId].isFetching = true;
        return obj;

      case APP_NODE_RESPONSE:
        obj = Object.assign({}, state);
        if(!obj.nodes[action.nodeId]){
            obj.nodes[action.nodeId] = {isFetching:false,data:null,date:null};
        }
        obj.nodes[action.nodeId] = Object.assign({},obj.nodes[action.nodeId],{data:action.data,date:moment().unix()});
        return obj;

      default:
        return state;
    }
}
