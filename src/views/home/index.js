import React from 'react';
import { Link } from 'react-router-dom';
export default () => (
  <div className="App-intro">
    <p>
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    <ul>
      <li>
        <Link to="/donut-chart">Donut Chart</Link>
      </li>
    </ul>
  </div>
);
