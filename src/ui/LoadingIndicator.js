// @flow strict

import React, { Component } from 'react';

class LoadingIndicator extends Component<{}> {
  render() {
    return (
      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: '100%' }}
        />
      </div>
    );
  }
}

export default LoadingIndicator;
