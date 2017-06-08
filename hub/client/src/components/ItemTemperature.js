import React, { Component } from 'react'

class ItemTemperature extends Component {


  constructor(props) {
      super(props);
      this.state = {
        value: '',
      };
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  setData(data){
    this.setState({value:data.value})
  }

  render() {

    var style = Object.assign({},this.props.style,{backgroundColor:'green'});

    return (

      <div style={style}>
        {this.state.value}
      </div>

    );
  }
}
export default ItemTemperature;
