// @flow strict

import React, { Component } from 'react';

class JsonNumber extends Component<{
  name: ?string,
  json: number,
}> {
  static defaultProps = {
    name: null,
    json: NaN,
  };

  render() {
    return (
      <div>
        {this.props.name ? `"${this.props.name}": ` : ''}
        {this.props.json.toString()}
      </div>
    );
  }
}

export default JsonNumber;
