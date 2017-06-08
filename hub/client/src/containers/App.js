import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { mapStateToProps } from '../reducers'

import Overview from './Overview'
import Node from './Node'

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        menu: [],
        processRequestConfig:false,
        processRequestData:false,
        loadIndex: -1,
        loadType:null,
      };
  }

  storeChange(){
    if(this._isMounted){
      let {store} = this.context;
      let app = store.getState().app;
      var self = this;

      if(this.state.processRequestConfig){
        if(app.config!=null){
          this.setState({processRequestConfig:false});
          this.updateMenu();
          this.loadContent();
        }
      }
      if(this.state.processRequestData){
        if(!app['fetching'+this.state.loadType]){
            this.setState({processRequestData:false});
            setTimeout(function(){self.loadContent()},app.config.refreshIntervalMilliseconds);
        }
      }
    }
  }

  componentDidMount() {
    let {store} = this.context;
    this._isMounted = true;
    this.onChangeSubscription = store.subscribe(this.storeChange.bind(this));

    this.setState({processRequestConfig:true});
    let {getConfig,appDataInvalidateAll} = this.props;
    appDataInvalidateAll();
    getConfig();
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.onChangeSubscription();
  }

  loadContent(){
    let loadIndex = this.state.loadIndex + 1;
    var loadType;
    switch(loadIndex%3){
      case 0:
        loadType = 'Temperature';
        break;
      case 1:
        loadType = 'Humidity';
        break;
      case 2:
        loadType = 'Moisture';
        break;
      default:
        // do nothing
        break;
    }
    if(loadType){
      this.setState({loadIndex,loadType,processRequestData:true})
      let {getData} = this.props;
      getData(loadType);
    }
  }


  updateMenu(){
    let {store} = this.context;
    let app = store.getState().app;
    var list = [<li key={9999} role="presentation" className="active"><Link to="/">Overview</Link></li>];
    for(let i = 0; i < app.config.nodes.length; i++){
      let node = app.config.nodes[i];
      if(node.design){
        list.push(<li key={i} role="presentation"><Link to={"/nodes/"+node.id}>{node.name}</Link></li>);
      }
    }
    this.setState({menu:list});
  }


  render() {
    return (
      <Router>
        <div>
          <ul className="nav nav-pills">
            {this.state.menu}
          </ul>

          <Route exact path="/" component={Overview}/>
          <Route exact path="/nodes/:id" component={Node}/>

        </div>
      </Router>
    );
  }
}
App.contextTypes = {
  store: PropTypes.object
};
export default connect(mapStateToProps,mapDispatchToProps)(App);
