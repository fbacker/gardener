import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { mapStateToProps } from '../reducers'

import Chart from 'chart.js'

class LineChart extends Component {


  constructor(props) {
      super(props);
      this.state = {
        ...props,
        lastUpdated:null
      };
  }

  storeChange(){
    if(this._isMounted){
      let {store} = this.context;
      let app = store.getState().app;
      let last = app['date'+this.state.type];
      if(last!==this.state.lastUpdated){
        this.setState({lastUpdated:last});
        var list = app['data'+this.state.type];
        if(list!=null&&list.datasets!=null)
        this.setGraphData(list);
      }
    }
  }


  componentDidMount(){
    var canvas = this.refs.canvas;
    this._graph = new Chart(canvas,{
      type: 'line',
      data: [],
      options: {
        responsiveAnimationDuration:50,
        tooltips:{
          callbacks: {
            title: function (tooltipItem, data) {
              return 'Degrees';
             },
            label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ': '+ tooltipItem.yLabel;
            }
          }
        },
        scales: {
            xAxes: [{
                type: 'time',
                position: 'bottom',
            }]
        }
      }
    });
    let {store} = this.context;
    this._isMounted = true;
    this.onChangeSubscription = store.subscribe(this.storeChange.bind(this));
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.onChangeSubscription();
  }

  setGraphData(data){
    let list = [];
    for(let i = 0; i < data.datasets.length; i++){
      list.push(Object.assign({},data.datasets[i]));
    }
    this._graph.data.datasets = list;
    this._graph.update();
  }

  render() {

    return (

      <div>
        <h1>{this.props.title}</h1>
        <canvas width="960" height="500" ref="canvas"></canvas>
      </div>

    );
  }
}
LineChart.contextTypes = {
  store: PropTypes.object
};
export default connect(mapStateToProps,mapDispatchToProps)(LineChart);
