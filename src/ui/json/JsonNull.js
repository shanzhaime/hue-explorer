// @flow strict

import React, { Component } from 'react';

class JsonNull extends Component<{
  name: ?string,
}> {
  static defaultProps = {
    name: null,
  };

  render() {
    return (
      <div>
        {this.props.name ? `"${this.props.name}": ` : ''}
        null
      </div>
    );
  }
}

export default JsonNull;
