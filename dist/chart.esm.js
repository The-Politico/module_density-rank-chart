import * as d3 from 'd3';
import { selection } from 'd3';
import kernel from 'kernel-smooth';
import merge from 'lodash/merge';

selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

selection.prototype.moveToBack = function () {
  return this.each(function () {
    var firstChild = this.parentNode.firstChild;

    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
}; // ... and the important addition. ⬇️⬇️⬇️

/**
 * appendSelect either selects a matching child element of your current
 * selection if one exists or appends that child and selects it. It's useful
 * for writing idempotent chart functions.
 *
 * Use it like this:
 *
 * selection.appendSelect(<element selector>, <class string>)
 *
 * It can be chained like any normal d3 selection:
 *
 * const g = d3.select(myNode).appendSelect('g', 'viz-group');
 * g.appendSelect('rect')
 *   .attr('x', 0); etc.
 *
 * @param  {string} el  String representation of element to be appended/selected.
 * @param  {string} cls Class string (w/out dots) of element to be appended/
 *                      selected. Can pass none or multiple separated by whitespace.
 * @return {object}     d3 selection of child element
 */


selection.prototype.appendSelect = function (el, cls) {
  var selected = cls ? this.select("".concat(el, ".").concat(cls.split(' ').join('.'))) : this.select(el);

  if (selected.size() === 0) {
    return cls ? this.append(el).classed(cls, true) : this.append(el);
  }

  return selected;
};

var defaultData = [76067, 74444, 73702, 72935, 71977, 71755, 70954, 68485, 66149, 63783, 63217, 62848, 62520, 62518, 61017, 60741, 59196, 59143, 59114, 58387, 56104, 54895, 54727, 54610, 54570, 54384, 53571, 53270, 53094, 52078, 51340, 51037, 50826, 50803, 50674, 50433, 49593, 49174, 48900, 48380, 48256, 48038, 46898, 46574, 45674, 45652, 44811, 44758, 42644, 42336, 40528];

var chart = (function () {
  return {
    /**
     * Develop your chart in this render function.
     *
     * For more details about this pattern, see Mike Bostock's proposal for
     * reusable charts: https://bost.ocks.org/mike/chart/
     */
    render: function render() {
      /**
       * Set default chart properties in this object. Users can overwrite them
       * by passing a props object through the module's create or update methods.
       */
      var props = {
        densityFill: '#ddd',
        pointFill: '#333',
        height: 60,
        margin: {
          top: 15,
          right: 10,
          bottom: 0,
          left: 10
        },
        axisLabels: {
          min: 'Least',
          max: 'Most'
        },
        title: 'Density',
        kernel: {
          func: kernel.fun.epanechnikov,
          bandwidth: 0.05
        }
      }; // The point we will highlight

      var point = 45000;

      function chart(selection$$1) {
        selection$$1.each(function (data, i, elements) {
          /**
           * YOUR D3 CODE HERE 📈 📊 🌐
           */
          var node = elements[i]; // the selected element

          var _node$getBoundingClie = node.getBoundingClientRect(),
              width = _node$getBoundingClie.width;

          var _props = props,
              margin = _props.margin,
              height = _props.height;
          var extent = d3.extent(data);
          var min = extent[0];
          var max = extent[1];
          var offset = 1 / 200; // We normalize data to fit in a range 0 - 1

          var normalize = function normalize(d) {
            return (d - min) / (max - min);
          };

          var normalizedData = data.map(function (d) {
            return normalize(d);
          });
          var normalPoint = normalize(point);
          var x = d3.scaleLinear().domain([0, 1]).range([0, width - margin.right - margin.left]);
          var density = kernel.density(normalizedData, props.kernel.func, props.kernel.bandwidth);
          var densityPath = x.ticks(100).map(function (d) {
            var x = d;
            var y = density(x);
            return [x, y];
          }); // Always make density path start and end at the Y baseline

          densityPath.unshift([0, 0]);
          densityPath.push([1, 0]);
          var pointPath = [[normalPoint - offset, 0], [normalPoint - offset, density(normalPoint - offset)], [normalPoint + offset, density(normalPoint + offset)], [normalPoint + offset, 0]];
          var y = d3.scaleLinear().domain([0, d3.max(densityPath, function (d) {
            return d[1];
          })]).range([height - margin.bottom - margin.top, 0]);
          d3.select(node).appendSelect('h5').style('text-align', 'center').text(props.title);
          d3.select(node).appendSelect('svg');
          var legend = d3.select(node).appendSelect('div', 'legend');
          legend.appendSelect('span', 'min').style('float', 'left').text(props.axisLabels.min);
          legend.appendSelect('span', 'max').style('float', 'right').text(props.axisLabels.max);
          var g = d3.select(node).appendSelect('svg') // see docs in ./utils/d3.js
          .attr('width', width).attr('height', height).appendSelect('g').attr('transform', "translate(".concat(margin.left, ", ").concat(margin.top, ")"));
          g.appendSelect('path', 'density').datum(densityPath).attr('fill', props.densityFill).attr('d', d3.line().curve(d3.curveBasis).x(function (d) {
            return x(d[0]);
          }).y(function (d) {
            return y(d[1]);
          }));
          g.appendSelect('path', 'highlight').datum(pointPath).attr('fill', props.pointFill).attr('d', d3.line().curve(d3.curveMonotoneX).x(function (d) {
            return x(d[0]);
          }).y(function (d) {
            return y(d[1]);
          }));
          var triangle = d3.symbol().type(d3.symbolTriangle).size(y(offset));
          g.appendSelect('path', 'pointer').attr('fill', props.pointFill).attr('d', triangle).attr('transform', "\n            rotate(180 ".concat(x(normalPoint), " ").concat(y(density(normalPoint)), ")\n            translate(").concat(x(normalPoint), ", ").concat(y(density(normalPoint)) + 10, ")\n            "));
        });
      }
      /**
       * Getter-setters merge any user-provided properties with the defaults.
       */


      chart.props = function (obj) {
        if (!obj) return props;
        props = merge(props, obj);
        return chart;
      };

      chart.point = function (d) {
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
    draw: function draw() {
      var chart = this.render().point(this._point).props(this._props);
      d3.select(this._selection).datum(this._data).call(chart);
    },

    /**
     * The following methods represent the external API of this chart module.
     *
     * See ../preview/App.jsx for an example of how they are used.
     */

    /**
     * Creates the chart initially.
     */
    create: function create(selection$$1, point, data) {
      var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      this._selection = selection$$1;
      this._point = point || 0;
      this._data = data || defaultData;
      this._props = props;
      this.draw();
    },

    /**
     * Updates the chart with new data and/or props.
     */
    update: function update(point, data) {
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this._point = point;
      this._data = data || this._data;
      this._props = props;
      this.draw();
    },

    /**
     * Resizes the chart.
     */
    resize: function resize() {
      this.draw();
    }
  };
});

export default chart;
