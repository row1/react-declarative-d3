import React from 'react';
import { scaleOrdinal, scaleLinear, scaleTime } from 'd3-scale';
import { tsvParse } from 'd3-dsv';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { timeParse } from 'd3-time-format';
import { line as d3Line, curveBasis } from 'd3-shape';
import { min, max, extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { easeLinear } from 'd3-ease';

import { animateWithEase } from 'drrr';

// Same as data.tsv
import dataTsv from './data';

import './chart.css';

const svgWidth = 960,
  svgHeight = 500;

//Note: getting width and height from a variable rather than the elements attribute e.g. svg.attr("width")
const margin = { top: 20, right: 80, bottom: 30, left: 50 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

const parseTime = timeParse('%Y%m%d');

const x = scaleTime().range([0, width]),
  y = scaleLinear().range([height, 0]),
  z = scaleOrdinal(schemeCategory10);

const line = d3Line()
  .curve(curveBasis)
  .x(d => x(d.date))
  .y(d => y(d.temperature));

const data = tsvParse(dataTsv, (d, _, columns) => {
  d.date = parseTime(d.date);
  for (let i = 1, n = columns.length, c; i < n; ++i)
    d[(c = columns[i])] = +d[c];
  return d;
});

const cities = data.columns.slice(1).map(id => {
  return {
    id,
    values: data.map(d => {
      return { date: d.date, temperature: d[id] };
    }),
  };
});

x.domain(extent(data, d => d.date));

y.domain([
  min(cities, c => min(c.values, d => d.temperature)),
  max(cities, c => max(c.values, d => d.temperature)),
]);

z.domain(cities.map(c => c.id));

const MultiSeriesLineChart = ({ data }) => (
  <svg width={svgWidth} height={svgHeight}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <g
        className="axis axis--x"
        transform={`translate(0, ${height})`}
        ref={node => select(node).call(axisBottom(x))}
      />
      <g className="axis axis--y" ref={node => select(node).call(axisLeft(y))}>
        <text transform="rotate(-90)" y="6" dy="0.71em" fill="#000">
          Temperature, ºF
        </text>
      </g>
      {data.map((city, i) => {
        // lastD needs to come from the last item in the full data and not the last in the current animation frame
        const [lastD] = cities[i].values.slice(-1);
        return (
          <g className="city" key={city.id}>
            <path
              className="line"
              d={line(city.values)}
              style={{ stroke: z(city.id) }}
            />
            <text
              transform={`translate(${x(lastD.date)}, ${y(lastD.temperature)})`}
              x={3}
              dy="0.35em"
              style={{ font: '10px sans-serif' }}
            >
              {city.id}
            </text>
          </g>
        );
      })}
    </g>
  </svg>
);

const easeData = (data, t) => {
  // Performing a basic left-right linear paint of the graph,
  // so use easeLinear to calculate how many items should be in the array rather than modify the actual values in the array
  return data.map(x => ({
    id: x.id,
    values: x.values.slice(0, Math.floor(x.values.length * easeLinear(t))),
  }));
};

export default animateWithEase(MultiSeriesLineChart, {
  easeData,
  duration: 500,
  delay: 500,
  interval: 10,
  data: cities,
});
