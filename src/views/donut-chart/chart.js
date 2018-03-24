import React from 'react';
import { scaleOrdinal as d3Ordinal } from 'd3-scale';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import './chart.css';

const width = 960,
  height = 500,
  radius = Math.min(width, height) / 2;

const color = d3Ordinal().range([
  '#98abc5',
  '#8a89a6',
  '#7b6888',
  '#6b486b',
  '#a05d56',
  '#d0743c',
  '#ff8c00',
]);

const arc = d3Arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70);

const pie = d3Pie()
  .sort(null)
  .value(function(d) {
    return d.population;
  });

const d = (age, population) => ({ age, population });

const csvData = [
  d('<5', 2704659),
  d('5-13', 4499890),
  d('14-17', 2159981),
  d('18-24', 3853788),
  d('25-44', 14106543),
  d('45-64', 8819342),
  d('≥65', 612463),
];

const data = pie(csvData);

export default () => {
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {data.map(d => (
          <g className="arc" key={`a${d.data.age}`}>
            <path d={arc(d)} fill={color(d.data.age)} />
            <text transform={`translate(${arc.centroid(d)})`} dy=".35em">
              {d.data.age}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};
