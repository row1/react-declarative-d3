import React from 'react';

export default () => {
  return (
    <div className="App-intro">
      <p>
        This example is a declarative port of the official D3{' '}
        <a href="https://bl.ocks.org/mbostock/3885304">Bar Chart</a> example.
        Note that we are kind of copping out in this example as{' '}
        <code>axisBottom()</code> and <code>axisLeft</code> are being used and
        these will draw an axis for us by directly manipulating the DOM.
      </p>
    </div>
  );
};
