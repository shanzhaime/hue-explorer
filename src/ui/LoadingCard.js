// @flow strict

import CenterCard from './CenterCard';
import LoadingIndicator from './LoadingIndicator';
import React, { PureComponent } from 'react';

class LoadingCard extends PureComponent<{}> {
  render() {
    return (
      <CenterCard>
        <h5 className="card-header">Loading...</h5>
        <div className="card-body">
          <LoadingIndicator />
        </div>
      </CenterCard>
    );
  }
}

export default LoadingCard;
