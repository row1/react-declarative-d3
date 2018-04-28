import React from 'react';
import PropTypes from 'prop-types';

const animationTypes = {
  easeData: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
  data: PropTypes.any.isRequired,
  delay: PropTypes.number,
  interval: PropTypes.number.isRequired,
  dataPropName: PropTypes.string,
};

export default function animateWithEase(WrappedComponent, animationConfig) {
  PropTypes.checkPropTypes(
    animationTypes,
    animationConfig,
    'config',
    'makeAnimated'
  );

  const { data, easeData, interval, duration, delay } = animationConfig;

  if (!animationConfig.dataPropName) {
    animationConfig.dataPropName = 'data';
  }

  return class Animated extends React.Component {
    constructor() {
      super();
      // The normalised time (starts at 0 and goes to 1). See https://github.com/d3/d3-ease#d3-ease
      const t = 0;
      this.state = {
        t,
        // This starting data will all be zeroed for the start of the animation
        intermediateData: easeData(data, t),
        // The timestamp of the first animation frame
        animationStartTime: null,
        // The timestamp of the last frame -- used to only update per interval
        animationLastFrameTime: null,
      };
    }

    animationStep = timestamp => {
      let { animationStartTime, animationLastFrameTime } = this.state;

      if (!animationStartTime) {
        animationStartTime = timestamp;
        // Subtract the interval on the first frame so that easeData() will get called below
        animationLastFrameTime = timestamp - interval;
      }

      const progress = timestamp - animationStartTime;
      const t = progress / duration;
      if (progress < duration) {
        // Calling easeData() on each frame can be expensive, so only do it per interval
        const shouldEase = timestamp - animationLastFrameTime >= interval;
        this.setState({
          t,
          intermediateData: shouldEase
            ? easeData(data, t)
            : this.state.intermediateData,
          animationStartTime,
          animationLastFrameTime: timestamp,
        });
        window.requestAnimationFrame(this.animationStep);
      } else {
        this.setState({
          t: 1,
          // Ensure that the correct data is used for the final frame.
          data,
        });
      }
    };

    componentDidMount() {
      const start = () => window.requestAnimationFrame(this.animationStep);
      if (delay) {
        window.setTimeout(start, delay);
      } else {
        start();
      }
    }

    render() {
      const props = {
        [animationConfig.dataPropName]: this.state.intermediateData,
        ...this.props,
      };
      return <WrappedComponent {...props} />;
    }
  };
}
