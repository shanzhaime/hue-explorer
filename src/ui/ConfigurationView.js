import React, { Component } from 'react';

class ConfigurationView extends Component {
  render() {
    console.log(this.props.match.params.id);
    return (
      <div>
        ConfigurationView
      </div>
    );
  }
}

export default ConfigurationView;
