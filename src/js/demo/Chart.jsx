import React from 'react';
import debounce from 'lodash/debounce';

import Chart from '../lib/chart.js';

class ChartContainer extends React.Component {
  constructor(props) {
    super(props);
    // Create a new instance of our chart and attach it to this component
    this.chart = new Chart();
  }
  componentDidMount() {
    // Create the chart on mount
    this.createChart(0.29, null, {
      kernel: { bandwidth: 0.07 },
    });
    // Add a listener to resize chart with the window
    window.addEventListener('resize', debounce(this.resizeChart, 250));
  }

  componentDidUpdate() {
    // Update the chart with the component
    this.updateChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.resizeChart, 250));
  }

  createChart = (point = 0, data = null, props = null) => {
    this.chart.create('#chart', point, data, props);
  }

  updateChart = (data = null, props = null) => {
    this.chart.update(data, props);
  }

  resizeChart = () => {
    this.chart.resize();
  }

  render() {
    return (
      <div className='chart-container'>
        <div id='chart' />
      </div>
    );
  }
}

export default ChartContainer;
