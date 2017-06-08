
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { mapStateToProps } from '../reducers'

import App from './App'

class AppAwait extends Component {

  constructor(props) {
      super(props);
      this.state = {
        isLoaded: false,
      };
      this._isMounted = false;
      this.onChangeSubscription = null;
  }

  storeChange(){
    if(this._isMounted){
      if(!this.state.isLoaded){
        let {store} = this.context;
        let app = store.getState().app;
        if(app.loadedStorageComplete){
          this.setState({isLoaded:true});
          this.onChangeSubscription();
        }
      }
    }
  }

  componentDidMount() {

    let {store} = this.context;
    this._isMounted = true;
    this.onChangeSubscription = store.subscribe(this.storeChange.bind(this));

    this.storeChange();
  }

  componentWillUnmount(){
    this._isMounted  = false;
    this.onChangeSubscription();
  }

  render() {
    var content = (this.state.isLoaded) ? <App /> : <div>Laddar</div>;
    return (
        <div>{content}</div>
    );
  }
}
AppAwait.contextTypes = {
  store: PropTypes.object
};
export default connect(mapStateToProps,mapDispatchToProps)(AppAwait);
