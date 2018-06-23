// @flow strict

import React, { Component } from 'react';

class JsonNumber extends Component<{
  json: number,
}> {
  static defaultProps = {
    json: NaN,
  };

  render() {
    return <span>{this.props.json.toString(10)}</span>;
  }
}

export default JsonNumber;
