// @flow strict

import React, { Component } from 'react';

class JsonString extends Component<{
  json: string,
}> {
  static defaultProps = {
    json: '',
  };

  render() {
    return <span>{JSON.stringify(this.props.json)}</span>;
  }
}

export default JsonString;
