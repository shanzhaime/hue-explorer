import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HueBridgeSelector extends Component {
  static defaultProps = {
    activeBridgeId: null,
    onActiveBridgeChange: function() {},
  }

  constructor(props) {
    super(props);
    this.state = {
      bridges: [],
      hasAuthorizationFailure: false,
    }
  }

  componentDidMount() {
    HueBridgeList.fetch().then((bridgeIds) => {
      const bridges = Array.from(bridgeIds).map((id) => {
        const bridge = HueBridge.getById(id);
        return {
          ...bridge.properties,
        };
      });
      this.setState({
        bridges,
      });
    });
  }

  onButtonClick(e) {
    const selectedBridgeId = e.target.value;
    const bridge = HueBridge.getById(selectedBridgeId);
    if (bridge.properties.username) {
      this.setState({
        hasAuthorizationFailure: false,
      })
      this.props.onActiveBridgeChange(selectedBridgeId);
    } else {
      bridge.connect().then((success) => {
        if (success) {
          this.setState({
            hasAuthorizationFailure: false,
          })
          this.props.onActiveBridgeChange(selectedBridgeId);
        } else {
          this.setState({
            hasAuthorizationFailure: true,
          });
        }
      })
    }
  }

  render() {
    let authorizationFailureAlert = null;
    if (this.state.hasAuthorizationFailure) {
      authorizationFailureAlert = (
        <div className="alert alert-danger" role="alert">
          Please press the link button on the Hue Bridge before trying to connect.
        </div>
      );
    }
    return (
      <div>
        {authorizationFailureAlert}
        <div className="list-group">
          {this.state.bridges.map((bridgeProperties) => {
            return (
              <button
                type="button"
                className={
                  'list-group-item list-group-item-action' +
                    (bridgeProperties.id === this.props.activeBridgeId ? ' active' : '')
                }
                value={bridgeProperties.id}
                key={bridgeProperties.id}
                onClick={this.onButtonClick.bind(this)}
              >
                {bridgeProperties.host}
                {bridgeProperties.port === 443 ? '' : `:${bridgeProperties.port}`}
                {bridgeProperties.username ? ' (authorized)' : ''}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default HueBridgeSelector;
