import HueBridgeSelector from './ui/HueBridgeSelector'
import Storage from './api/Storage';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const STORAGE_NAME = 'app';
const STORAGE_VERSION = 1;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = storage.read() || {
      activeBridgeId: null,
    };
  }

  onActiveBridgeChange(activeBridgeId) {
    this.setState({
      activeBridgeId,
    }, () => {
      storage.write(this.state);
    })
  }

  render() {
    return (
      <div className="container-fluid">
        {this.state.isConnected ?
          null :
          <HueBridgeSelector
            activeBridgeId={this.state.activeBridgeId}
            onActiveBridgeChange={this.onActiveBridgeChange.bind(this)}
          />}
      </div>
    );
  }
}

export default App;
