// @flow strict

import React, { PureComponent } from 'react';

import type { Element } from 'React';

class LoadingIndicator extends PureComponent<{}> {
  render(): Element<'div'> {
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
