import JsonEditor from './json/JsonEditor'
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class ConfigurationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bridge: null,
      json: null,
    }
  }

  getActiveBridge() {
    const acitveBridgeId =
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id;
    if (!acitveBridgeId) {
      return null;
    }

    const maybeBridge = HueBridge.getById(acitveBridgeId);
    if (maybeBridge) {
      return maybeBridge;
    } else {
      HueBridgeList.load();
      return HueBridge.getAuthorizedById(acitveBridgeId);
    }
  }

  componentDidMount() {
    const bridge = this.getActiveBridge();
    this.setState({
      bridge,
    });
    bridge.fetch('/config').then((json) => {
      console.log(json);
      this.setState({
        json,
      });
    });
  }

  render() {
    return (
      <div>
        <JsonEditor json={this.state.json} />
      </div>
    );
  }
}

export default ConfigurationView;
