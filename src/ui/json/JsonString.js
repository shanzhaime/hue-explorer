// @flow strict

import React, { Component } from 'react';

class JsonString extends Component<{
  name: ?string,
  json: string,
}> {
  static defaultProps = {
    name: null,
    json: '',
  };

  render() {
    return (
      <div>
        {this.props.name ? `"${this.props.name}": ` : ''}
        {'"'}
        {this.props.json}
        {'"'}
      </div>
    );
  }
}

export default JsonString;
