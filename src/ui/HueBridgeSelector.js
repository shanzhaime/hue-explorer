import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import Settings from '../api/Settings';
import React, { Component } from 'react';
import deviceId from '../api/deviceId';

class HueBridgeSelector extends Component {
  static defaultProps = {
    activeBridgeId: null,
    onActiveBridgeChange: function() {},
    onBridgeAuthorizationFailure: function() {},
  }

  constructor(props) {
    super(props);
    const settings = Settings.read();
    this.state = {
      bridges: [],
      settings,
      deviceId: deviceId(),
      hasAuthorizationFailure: false,
    }
  }

  loadBridgeList() {
    const bridgeIds = HueBridgeList.load();
    const bridges = Array.from(bridgeIds).map((id) => {
      const bridge = HueBridge.getById(id);
      return {
        ...bridge.properties,
      };
    });
    this.setState({
      bridges,
    });
  }

  updateBridgeList() {
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

  onBridgeClick(e) {
    const selectedBridgeId = e.target.value;
    const bridge = HueBridge.getById(selectedBridgeId);
    if (bridge.properties.username) {
      this.props.onActiveBridgeChange(selectedBridgeId);
    } else {
      bridge.connect().then((success) => {
        if (success) {
          this.updateBridgeList();
          this.props.onActiveBridgeChange(selectedBridgeId);
        } else {
          this.props.onBridgeAuthorizationFailure();
        }
      })
    }
  }

  componentDidMount() {
    this.loadBridgeList();
    this.updateBridgeList();
  }

  render() {
    return (
      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        {this.state.bridges.map((bridgeProperties) => {
          const hidePort =
            (bridgeProperties.protocol === 'http' && bridgeProperties.port === 80) ||
            (bridgeProperties.protocol === 'https' && bridgeProperties.port === 443);
          return (
            <button
              className={
                'dropdown-item' +
                  (bridgeProperties.id === this.props.activeBridgeId ? ' active' : '')
              }
              value={bridgeProperties.id}
              key={bridgeProperties.id}
              onClick={this.onBridgeClick.bind(this)}
            >
              {bridgeProperties.host}
              {hidePort ? '' : `:${bridgeProperties.port}`}
              {bridgeProperties.username ? ' (authorized)' : ''}
            </button>
          );
        })}
        <div className="dropdown-divider"></div>
        <a
          className="dropdown-item"
          rel="noopener noreferrer"
          target="_blank"
          href={`https://api.meethue.com/oauth2/auth?clientid=${this.state.settings.clientId}&appid=${this.state.settings.appId}&deviceid=${this.state.deviceId}&response_type=code&state=${this.state.deviceId}`}
        >
          Add remote bridges
        </a>
        <div className="dropdown-divider"></div>
        <button className="dropdown-item disabled">Add bridge manually</button>
      </div>
    );
  }
}

export default HueBridgeSelector;
