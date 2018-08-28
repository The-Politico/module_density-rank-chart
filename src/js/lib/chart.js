import d3 from './utils/d3';
import kernel from 'kernel-smooth';
import merge from 'lodash/merge';

import defaultData from './data/default.json';

export default () => ({

  /**
   * Develop your chart in this render function.
   *
   * For more details about this pattern, see Mike Bostock's proposal for
   * reusable charts: https://bost.ocks.org/mike/chart/
   */
  render() {
    /**
     * Set default chart properties in this object. Users can overwrite them
     * by passing a props object through the module's create or update methods.
     */
    let props = {
      densityFill: '#ddd',
      pointFill: '#333',
      height: 60,
      margin: {
        top: 15,
        right: 10,
        bottom: 0,
        left: 10,
      },
      axisLabels: {
        min: 'Least',
        max: 'Most',
      },
      title: 'Density',
      kernel: {
        function: kernel.fun.epanechnikov,
        bandwidth: 0.05,
      },
    };
    // The point we will highlight
    let point = 0.5;

    function chart(selection) {
      selection.each((data, i, elements) => {
        /**
         * YOUR D3 CODE HERE 📈 📊 🌐
         */
        const node = elements[i]; // the selected element
        const { width } = node.getBoundingClientRect();

        const { margin, height } = props;

        const extent = d3.extent(data);
        const offset = (extent[1] - extent[0]) / 100;

        const x = d3.scaleLinear()
          .domain([extent[0], extent[1]])
          .range([0, width - margin.right - margin.left]);

        const density = kernel.density(data, props.kernel.function, props.kernel.bandwidth);

        const densityPath = x.ticks(100).map((d) => {
          const x = d;
          const y = density(x);
          return [x, y];
        });
        // Always make density path start and end at the Y baseline
        densityPath.unshift([extent[0], 0]);
        densityPath.push([extent[1], 0]);

        const pointPath = [
          [point - offset, 0],
          [point - offset, density(point - offset)],
          [point + offset, density(point + offset)],
          [point + offset, 0],
        ];

        const y = d3.scaleLinear()
          .domain([0, d3.max(densityPath, d => d[1])])
          .range([height - margin.bottom - margin.top, 0]);

        d3.select(node)
          .appendSelect('h5')
          .style('text-align', 'center')
          .text(props.title);

        d3.select(node)
          .appendSelect('svg');

        const legend = d3.select(node)
          .appendSelect('div', 'legend');

        legend.appendSelect('span', 'min')
          .style('float', 'left')
          .text(props.axisLabels.min);

        legend.appendSelect('span', 'max')
          .style('float', 'right')
          .text(props.axisLabels.max);

        const g = d3.select(node)
          .appendSelect('svg') // see docs in ./utils/d3.js
          .attr('width', width)
          .attr('height', height)
          .appendSelect('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        g.appendSelect('path', 'density')
          .datum(densityPath)
          .attr('fill', props.densityFill)
          .attr('d', d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); }));

        g.appendSelect('path', 'highlight')
          .datum(pointPath)
          .attr('fill', props.pointFill)
          .attr('d', d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); }));

        const triangle = d3.symbol()
          .type(d3.symbolTriangle)
          .size(y(offset));

        g.appendSelect('path', 'pointer')
          .attr('fill', props.pointFill)
          .attr('d', triangle)
          .attr('transform', `
            rotate(180 ${x(point)} ${y(density(point))})
            translate(${x(point)}, ${y(density(point)) + 10})
            `);
      });
    }

    /**
     * Getter-setters merge any user-provided properties with the defaults.
     */
    chart.props = (obj) => {
      if (!obj) return props;
      props = merge(props, obj);
      return chart;
    };

    chart.point = (d) => {
      if (d === undefined) return point;
      point = d;
      return chart;
    };

    return chart;
  },

  /**
   * Draws the chart by calling the idempotent render function with
   * a selected element.
   */
  draw() {
    const chart = this.render()
      .point(this._point)
      .props(this._props);

    d3.select(this._selection)
      .datum(this._data)
      .call(chart);
  },

  /**
   * The following methods represent the external API of this chart module.
   *
   * See ../preview/App.jsx for an example of how they are used.
   */

  /**
   * Creates the chart initially.
   */
  create(selection, point, data, props = {}) {
    this._selection = selection;
    this._point = point || 0;
    this._data = data || defaultData.map(d => d.value);
    this._props = props;

    this.draw();
  },

  /**
   * Updates the chart with new data and/or props.
   */
  update(point, data, props = {}) {
    this._point = point;
    this._data = data || this._data;
    this._props = props;
    this.draw();
  },

  /**
   * Resizes the chart.
   */
  resize() {
    this.draw();
  },
});
