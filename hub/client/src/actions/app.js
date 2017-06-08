
import fetchRun from '../utils/server';
import Utils from '../utils/index';

export const APP_LOADED_STORAGE = 'APP_LOADED_STORAGE';
export const APP_CONFIG = 'APP_CONFIG';

export const APP_DATA_INVALIDATE_ALL = 'APP_DATA_INVALIDATE_ALL';
export const APP_DATA_INVALIDATE = 'APP_DATA_INVALIDATE';
export const APP_DATA_REQUEST = 'APP_DATA_REQUEST';
export const APP_DATA_RESPONSE = 'APP_DATA_RESPONSE';

export const APP_NODE_INVALIDATE = 'APP_NODE_INVALIDATE';
export const APP_NODE_REQUEST = 'APP_NODE_REQUEST';
export const APP_NODE_RESPONSE = 'APP_NODE_RESPONSE';

export function appLoadedStorage() {
  return {
    type: APP_LOADED_STORAGE
  }
}

function appConfig(config) {
  return {
      type: APP_CONFIG,
      config
  }
}
export function appDataInvalidateAll(){
  return {
    type: APP_DATA_INVALIDATE_ALL
  }
}
function appDataInvalidate(dataType){
  return {
    type: APP_DATA_INVALIDATE,
    dataType
  }
}
function appDataRequest(dataType){
  return {
    type: APP_DATA_REQUEST,
    dataType
  }
}
function appDataResponse(dataType,data){
  return {
    type: APP_DATA_RESPONSE,
    dataType,
    data
  }
}
function appNodeInvalidate(nodeId){
  return {
    type: APP_NODE_INVALIDATE,
    nodeId
  }
}
function appNodeRequest(nodeId){
  return {
    type: APP_NODE_REQUEST,
    nodeId
  }
}
function appNodeResponse(nodeId,data){
  return {
    type: APP_NODE_RESPONSE,
    nodeId,
    data
  }
}

export function getConfig() {
  return function (dispatch:()=>void, getState:()=>Object) {
    return fetchRun(Utils.getURL()+'config').then(
        result => {
          return result.json();
        }).then(
          json => {
            dispatch(appConfig(json));
          }
        ).catch(function(err) {
          console.error("catch",err);
    });

  }
}

export function getData(type) {
  return function (dispatch:()=>void, getState:()=>Object) {

    var state = getState().app;
    if( state['fetching'+type] ) // we are already grabbing data
        return;

    dispatch(appDataRequest(type));

    return fetchRun(Utils.getURL()+'statistics?type='+type+'&days=15').then(
        result => {
          return result.json();
        }).then(
          json => {
            dispatch(appDataResponse(type,json));
            dispatch(appDataInvalidate(type));
          }
        ).catch(function(err) {
          dispatch(appDataInvalidate(type));
          console.error("catch",err);
    });

  }
}


export function getNodeData(nodeId) {
  return function (dispatch:()=>void, getState:()=>Object) {

    var state = getState().app;
    if( state.nodes[nodeId] && state.nodes[nodeId].isFetching ) // we are already grabbing data
        return;

    dispatch(appNodeRequest(nodeId));

    return fetchRun(Utils.getURL()+'nodes/'+nodeId).then(
        result => {
          return result.json();
        }).then(
          json => {
            dispatch(appNodeResponse(nodeId,json));
            dispatch(appNodeInvalidate(nodeId));
          }
        ).catch(function(err) {
          dispatch(appNodeInvalidate(nodeId));
          console.error("catch",err);
    });

  }
}
