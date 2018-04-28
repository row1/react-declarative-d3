import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { tsvParse } from 'd3-dsv';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { easeCubicInOut } from 'd3-ease';

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

export default class AnimatedBar extends React.Component {
  constructor() {
    super();
    // The normalised time (starts at 0 and goes to 1). See https://github.com/d3/d3-ease#d3-ease
    const t = 0;
    this.state = {
      t,
      // This starting data will all be zeroed for the start of the animation
      data: this.easeData(t),
      // The timestamp of the first animation frame
      animationStartTime: null,
      // The timestamp of the last frame -- used to only update per interval
      animationLastFrameTime: null,
    };
  }

  // Basic properties about the animation.
  // Having a delay is normally a good idea as there will be some skipped frames before the first call to render
  animation = {
    duration: 500,
    delay: 500,
    interval: 10,
  };

  animationStep = timestamp => {
    const { animation } = this;
    let { animationStartTime, animationLastFrameTime } = this.state;

    if (!animationStartTime) {
      animationStartTime = timestamp;
      // Subtract the interval on the first frame so that easeData() will get called below
      animationLastFrameTime = timestamp - animation.interval;
    }

    const progress = timestamp - animationStartTime;
    const t = progress / animation.duration;
    if (progress < animation.duration) {
      // Calling easeData() on each frame can be expensive, so only do it per interval
      const shouldEase =
        timestamp - animationLastFrameTime >= animation.interval;
      this.setState({
        t,
        data: shouldEase ? this.easeData(t) : this.state.data,
        animationStartTime,
        animationLastFrameTime: timestamp,
      });
      window.requestAnimationFrame(this.animationStep);
    } else {
      this.setState({
        t: 1,
        // Ensure that the correct data is used for the final frame.
        data: originalData,
      });
    }
  };

  // Calculates the data to be used in the current animation frame
  easeData(t) {
    return originalData.map(x => ({
      letter: x.letter,
      frequency: x.frequency * easeCubicInOut(t),
    }));
  }
  componentDidMount() {
    const { animation } = this;
    const start = () => window.requestAnimationFrame(this.animationStep);
    if (animation.delay) {
      window.setTimeout(start, animation.delay);
    } else {
      start();
    }
  }
  render() {
    return <Bar data={this.state.data} />;
  }
}

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
