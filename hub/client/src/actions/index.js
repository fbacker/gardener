
import {appLoadedStorage,getConfig,appDataInvalidateAll,getData,getNodeData} from './app'

export function mapDispatchToProps(dispatch) {
    return {

      appLoadedStorage: () => {dispatch(appLoadedStorage());},
      getConfig: () => {dispatch(getConfig());},

      appDataInvalidateAll: () => {dispatch(appDataInvalidateAll());},
      getData: (dataType) => {dispatch(getData(dataType));},

      getNodeData: (nodeId) => {dispatch(getNodeData(nodeId));},
    };
}
