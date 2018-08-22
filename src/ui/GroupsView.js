import LoadingCard from './LoadingCard';
import Group from './Group';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class GroupsView extends Component {
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
    Promise.all([bridge.fetch('/groups'), bridge.fetch('/lights')]).then(
      (results) => {
        const [json, lights] = results;
        console.log(json);
        this.setState({
          json,
          lights,
          loading: false,
        });
      },
      () => {},
    );
  }

  render() {
    if (this.state.loading) {
      return <LoadingCard />;
    } else if (
      this.state.json === null ||
      Object.keys(this.state.json).length === 0
    ) {
      return (
        <div className="alert alert-info my-3" role="alert">
          No groups.
        </div>
      );
    } else {
      return (
        <div className="card-columns my-3">
          {Object.keys(this.state.json).map((key) => {
            return (
              <Group
                json={this.state.json[key]}
                groupId={key}
                lights={this.state.lights}
                key={key}
              />
            );
          })}
        </div>
      );
    }
  }
}

export default GroupsView;
