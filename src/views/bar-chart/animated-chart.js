import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { tsvParse } from 'd3-dsv';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { easeCubicInOut } from 'd3-ease';

import { animateWithEase } from 'drrr';

import dataTsv from './data';

import './chart.css';

const svgWidth = 960,
  svgHeight = 500;

const margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

const x = scaleBand()
    .rangeRound([0, width])
    .padding(0.1),
  y = scaleLinear().rangeRound([height, 0]);

// The original data to be animated to
const originalData = tsvParse(dataTsv, d => {
  d.frequency = +d.frequency;
  return d;
});

x.domain(originalData.map(d => d.letter));
y.domain([0, max(originalData, d => d.frequency)]);

const Bar = ({ data }) => (
  <svg width={svgWidth} height={svgHeight}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <g
        className="axis axis--x"
        transform={`translate(0, ${height})`}
        ref={node => select(node).call(axisBottom(x))}
      />
      <g className="axis axis--y">
        <g ref={node => select(node).call(axisLeft(y).ticks(10, '%'))} />
        <text transform="rotate(-90)" y="6" dy="0.71em" textAnchor="end">
          Frequency
        </text>
      </g>
      {data.map(d => (
        <rect
          key={d.letter}
          className="bar"
          x={x(d.letter)}
          y={y(d.frequency)}
          width={x.bandwidth()}
          height={height - y(d.frequency)}
        />
      ))}
    </g>
  </svg>
);

const easeData = (data, t) => {
  return data.map(x => ({
    letter: x.letter,
    frequency: x.frequency * easeCubicInOut(t),
  }));
};

export default animateWithEase(Bar, {
  easeData,
  duration: 500,
  delay: 500,
  interval: 10,
  data: originalData,
});
