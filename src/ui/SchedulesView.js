import CenterCard from './CenterCard';
import LoadingIndicator from './LoadingIndicator';
import Schedule from './Schedule';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class SchedulesView extends Component {
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
    bridge.fetch('/schedules').then((json) => {
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
          No schedules.
        </div>
      );
    } else {
      return (
        <div className="card-columns my-3">
          {Object.keys(this.state.json).map((key) => {
            return (
              <Schedule
                json={this.state.json[key]}
                scheduleId={key}
                key={key}
              />
            );
          })}
        </div>
      );
    }
  }
}

export default SchedulesView;
