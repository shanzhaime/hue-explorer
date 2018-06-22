// @flow strict

import React, { Component } from 'react';

class JsonString extends Component<{
  json: string,
}> {
  static defaultProps = {
    json: '',
  };

  render() {
    return (
      <span>
        {'"'}
        {this.props.json.replace(/"/g, '\\"')}
        {'"'}
      </span>
    );
  }
}

export default JsonString;
