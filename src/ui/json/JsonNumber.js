import React, { Component } from 'react';

class JsonNumber extends Component {
  static defaultProps = {
    json: null,
    name: null,
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
