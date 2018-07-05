import ActiveBridge from '../api/ActiveBridge';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import Settings from '../api/Settings';
import React, { Component } from 'react';
import deviceId from '../api/deviceId';

class HueBridgeSelector extends Component {
  static defaultProps = {
    onBridgeAuthorizationFailure: function() {},
  };

  constructor(props) {
    super(props);
    const settings = Settings.read();
    this.state = {
      bridges: [],
      settings,
      deviceId: deviceId(),
      hasAuthorizationFailure: false,
    };
  }

  loadBridgeList() {
    const bridgeIds = HueBridgeList.load();
    const bridges = Array.from(bridgeIds).map((id) => {
      return HueBridge.getById(id);
    });
    this.setState({
      bridges,
    });
  }

  updateBridgeList() {
    HueBridgeList.fetch().then((bridgeIds) => {
      const bridges = bridgeIds.map((id) => {
        return HueBridge.getById(id);
      });
      this.setState({
        bridges,
      });
    });
  }

  onBridgeClick(event) {
    const selectedBridgeId = event.target.value;
    const bridge = HueBridge.getById(selectedBridgeId);
    if (bridge.properties.username) {
      ActiveBridge.select(selectedBridgeId);
    } else {
      bridge.connectLocal().then((success) => {
        if (success) {
          this.updateBridgeList();
          ActiveBridge.select(selectedBridgeId);
        } else {
          this.props.onBridgeAuthorizationFailure();
        }
      });
    }
  }

  componentDidMount() {
    this.loadBridgeList();
    this.updateBridgeList();
  }

  render() {
    const activeBridgeId = ActiveBridge.get();
    return (
      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        {this.state.bridges.map((bridge) => {
          const hidePort =
            (bridge.properties.protocol === 'http' &&
              bridge.properties.port === 80) ||
            (bridge.properties.protocol === 'https' &&
              bridge.properties.port === 443);
          const localName =
            bridge.properties.host +
            (hidePort ? '' : `:${bridge.properties.port}`);
          return (
            <button
              className={
                'dropdown-item' +
                (bridge.properties.id === activeBridgeId ? ' active' : '')
              }
              value={bridge.properties.id}
              key={bridge.properties.id}
              onClick={this.onBridgeClick.bind(this)}
            >
              {bridge.properties.local ? localName : 'Remote Bridge'} ({bridge
                .properties.local && bridge.state.localReachable
                ? bridge.properties.username
                  ? 'local connection'
                  : 'local discovery'
                : 'remote connection'})
            </button>
          );
        })}
        <div className="dropdown-divider" />
        <a
          className="dropdown-item"
          rel="noopener noreferrer"
          target="_blank"
          href={`https://api.meethue.com/oauth2/auth?clientid=${this.state
            .settings.clientId ||
            process.env.REACT_APP_OAUTH_CLIENT_ID}&appid=${this.state.settings
            .appId || process.env.REACT_APP_OAUTH_APP_ID}&deviceid=${
            this.state.deviceId
          }&response_type=code&state=${window.location.pathname}`}
        >
          Add remote bridges
        </a>
        <div className="dropdown-divider" />
        <button className="dropdown-item disabled">Add bridge manually</button>
      </div>
    );
  }
}

export default HueBridgeSelector;
