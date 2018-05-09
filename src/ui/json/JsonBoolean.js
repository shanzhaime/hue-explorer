// @flow strict

import React, { Component } from 'react';

class JsonBoolean extends Component<{
  name: ?string,
  json: boolean,
}> {
  static defaultProps = {
    name: null,
    json: false,
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

export default JsonBoolean;
