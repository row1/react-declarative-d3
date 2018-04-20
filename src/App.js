import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import Home from './views/home';
import BarChart from './views/bar-chart';
import DonutChart from './views/donut-chart';
import MultiSeriesLineChart from './views/multi-series-line-chart';

import reactLogo from './react-logo.svg';
import d3Logo from './d3-logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={reactLogo} className="App-logo" alt="React logo" />
            <img src={d3Logo} alt="D3 logo" />
            <h1 className="App-title">React Declarative D3 Examples</h1>
          </header>
          <nav className="App-nav">
            <Link to="/">Home</Link>{' '}
            <a href="https://medium.com/technical-credit/declarative-d3-examples-in-react-6e736e526182">
              Blog Post
            </a>
          </nav>
          <Route exact path="/" component={Home} />
          <Route exact path="/bar-chart" component={BarChart} />
          <Route exact path="/donut-chart" component={DonutChart} />
          <Route
            exact
            path="/multi-series-line-chart"
            component={MultiSeriesLineChart}
          />
          <footer className="App-footer">
            &copy; 2018 <a href="https://github.com/row1">Rowan Youngson</a>.
            Code samples available under MIT License.
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
