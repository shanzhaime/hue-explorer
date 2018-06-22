// @flow strict

import React, { Component } from 'react';

class JsonBoolean extends Component<{
  json: boolean,
}> {
  static defaultProps = {
    json: false,
  };

  render() {
    return <span>{this.props.json.toString()}</span>;
  }
}

export default JsonBoolean;
