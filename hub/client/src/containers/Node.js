import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { mapStateToProps } from '../reducers'

import Utils from '../utils/index'
import ItemMoisture from '../components/ItemMoisture'
import ItemHumidity from '../components/ItemHumidity'
import ItemTemperature from '../components/ItemTemperature'
//import LineChart from './LineChart'

class Node extends Component {

  constructor(props) {
      super(props);
      this.state = {
        id:null,
        config:null,
        processRequestData:false,
        date:null,
      };
  }

  storeChange(){
    if(this._isMounted){
      if(!this.state.config){
        this.refreshStartup();
      }
      if(this.state.processRequestData&&this.state.id){
        let {store} = this.context;
        let app = store.getState().app;
        let node = app.nodes[this.state.id];
        if(node){
          if(!node.isFetching){
            this.setState({processRequestData:false,date:node.date});
            this.refreshData(node);
          }
        }
      }
    }
  }

  componentDidMount() {
    let {store} = this.context;
    this._isMounted = true;
    this.onChangeSubscription = store.subscribe(this.storeChange.bind(this));

    this.refreshStartup();
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.onChangeSubscription();
  }

  refreshStartup(){
    let {store} = this.context;
    var app = store.getState().app;
    var id = parseInt(this.props.match.params.id,10);
    let config = app.config.nodes.filter((node) => {
      return (node.id===id);
    })[0];
    this.setState({id,config,processRequestData:true});

    let {getNodeData} = this.props;
    getNodeData(id);
  }

  refreshData(obj){
    for(let i = 0; i < obj.data.length; i++){
      var node = obj.data[i];
      let name = node.type+node.device;
      var item = this.refs[name];
      if(item){
        item.setData(node);
      }
    }

    let {store} = this.context;
    var app = store.getState().app;
    var id = this.state.id;
    var {getNodeData} = this.props;
    var self = this;

    setTimeout(function(){
      self.setState({processRequestData:true});
      getNodeData(id);
    },app.config.refreshIntervalNodeMilliseconds);
  }

  renderItem(designList,CustomComponent,namePrefix){
    var list = [];
    var styleMain = {position:'absolute'};
    for(let i = 0; i < designList.length; i++){
      let design = designList[i];
      let style = Object.assign({},styleMain);
      let name = namePrefix+design.device;
      style.left = design.x;
      style.top = design.y;
      list.push(<CustomComponent ref={name} style={style} key={i} />);
    }
    return list;
  }


  render() {
    var body;
    //var style = {position:'absolute',left:0,top:0};

    if(this.state.config){
      var design = this.state.config.design;
      body = <div>
        <div>{this.state.config.name}</div>
        <div style={{position:'relative'}}>
          <img alt='overview' src={Utils.getURL()+'images/'+this.state.config.design.image} />
          {this.renderItem(design.moisture,ItemMoisture,'m')}
          {this.renderItem(design.humidity,ItemHumidity,'h')}
          {this.renderItem(design.temperature,ItemTemperature,'t')}
        </div>
      </div>;
    }

    return (

        <div className="subpage">
          {body}
        </div>

    );
  }
}
Node.contextTypes = {
  store: PropTypes.object
};
export default connect(mapStateToProps,mapDispatchToProps)(Node);
