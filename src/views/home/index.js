import React from 'react';
import { Link } from 'react-router-dom';
export default () => (
  <div className="App-intro">
    <p>
      The following examples are conversions of offical D3 examples into a
      declarative format more suitable for React. The examples do their best to
      follow the order and methods used in the examples, but please note that it
      might not be an exact port e.g. ES2015+ alternatives are used where
      possible and CSV data is loaded from a variable rather than performing a
      network request.
    </p>
    <p>
      See the{' '}
      <a href="https://medium.com/technical-credit/declarative-d3-examples-in-react-6e736e526182">
        blog post
      </a>{' '}
      for an explanation of the background to this approach. If you are reading
      this online you can find the source code on{' '}
      <a href="https://github.com/row1/react-declarative-d3">Github</a>.
    </p>
    <h3>Examples:</h3>
    <ul>
      <li>
        <Link to="/bar-chart">Bar Chart</Link>
      </li>
      <li>
        <Link to="/donut-chart">Donut Chart</Link>
      </li>
      <li>
        <Link to="/multi-series-line-chart">Multi-Series Line Chart</Link>
      </li>
    </ul>
  </div>
);
