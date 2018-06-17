// @flow strict

import * as React from 'react';
import { Component } from 'react';

class CenterCard extends Component<{ children?: React.Node }> {
  render() {
    return (
      <div className="row justify-content-md-center">
        <div className="col col-md-6 col-lg-4">
          <div className="card my-3">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default CenterCard;
