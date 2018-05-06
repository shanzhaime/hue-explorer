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
    });
    Promise.all([bridge.fetch('/groups'), bridge.fetch('/lights')]).then(
      (results) => {
        const [json, lights] = results;
        console.log(json);
        this.setState({
          json,
          lights,
        });
      },
      () => {},
    );
  }

  render() {
    return (
      <div className="card-columns my-3">
        {this.state.json === null
          ? 'No groups'
          : Object.keys(this.state.json).map((key) => {
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

export default GroupsView;
