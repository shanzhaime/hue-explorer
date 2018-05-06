import React, { Component } from 'react';

class JsonBoolean extends Component {
  static defaultProps = {
    json: null,
    name: null
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
