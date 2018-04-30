import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class HueBridgeSelector extends Component {
  static defaultProps = {
    activeBridgeId: null,
    onActiveBridgeChange: function() {},
    onBridgeAuthorizationFailure: function() {},
  }

  constructor(props) {
    super(props);
    this.state = {
      bridges: [],
      hasAuthorizationFailure: false,
    }
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

  componentDidMount() {
    this.updateBridgeList();
  }

  onButtonClick(e) {
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
              onClick={this.onButtonClick.bind(this)}
            >
              {bridgeProperties.host}
              {hidePort ? '' : `:${bridgeProperties.port}`}
              {bridgeProperties.username ? ' (authorized)' : ''}
            </button>
          );
        })}
        <div className="dropdown-divider"></div>
        <button className="dropdown-item disabled">Add bridge manually</button>
      </div>
    );
  }
}

export default HueBridgeSelector;
