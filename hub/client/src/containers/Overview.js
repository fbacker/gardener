import React, { Component } from 'react';



import LineChart from '../components/LineChart'

class Overview extends Component {

  constructor(props) {
      super(props);
      this.state = {

      };
  }


  render() {
    return (

        <div className="subpage">
          <LineChart title="Temperatures" type="Temperature" />
          <LineChart title="Humidity" type="Humidity" />
          <LineChart title="Moisture" type="Moisture" />
        </div>

    );
  }
}
export default Overview;
