import CenterCard from './CenterCard';
import LoadingIndicator from './LoadingIndicator';
import Light from './Light';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class LightsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bridge: null,
      json: null,
      loading: false,
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
      bridge,
      loading: true,
    });
    bridge.fetch('/lights').then((json) => {
      console.log(json);
      this.setState({
        json,
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <CenterCard>
          <h5 className="card-header">Loading...</h5>
          <div className="card-body">
            <LoadingIndicator />
          </div>
        </CenterCard>
      );
    } else if (
      this.state.json === null ||
      Object.keys(this.state.json).length === 0
    ) {
      return (
        <div className="alert alert-info my-3" role="alert">
          No lights.
        </div>
      );
    } else {
      return (
        <div className="card-columns my-3">
          {Object.keys(this.state.json).map((key) => {
            return (
              <Light
                rendering="card"
                json={this.state.json[key]}
                lightId={key}
                key={key}
              />
            );
          })}
        </div>
      );
    }
  }
}

export default LightsView;
