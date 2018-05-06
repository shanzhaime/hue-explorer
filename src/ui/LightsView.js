import Light from './Light';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class LightsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bridge: null,
      json: null
    };
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
      bridge
    });
    bridge.fetch('/lights').then(json => {
      console.log(json);
      this.setState({
        json
      });
    });
  }

  render() {
    return (
      <div className="row">
        {this.state.json === null
          ? 'No lights'
          : Object.keys(this.state.json).map(key => {
              return (
                <Light json={this.state.json[key]} lightId={key} key={key} />
              );
            })}
      </div>
    );
  }
}

export default LightsView;
