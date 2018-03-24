import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './views/home';
import DonutChart from './views/donut-chart';
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
            <Link to="/">Home</Link>
          </nav>
          <Route exact path="/" component={Home} />
          <Route exact path="/donut-chart" component={DonutChart} />
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
