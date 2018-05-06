import React, { Component } from 'react';

class JsonString extends Component {
  static defaultProps = {
    json: null,
    name: null
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
