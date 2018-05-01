import React, { Component } from 'react';

class JsonNull extends Component {
  static defaultProps = {
    json: null,
    name: null,
  }

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
