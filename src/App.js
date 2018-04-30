import HueBridgeSelector from './ui/HueBridgeSelector'
import Storage from './api/Storage';
import React, { Component } from 'react';

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

  onBridgeAuthorizationFailure() {
    alert('Please press the link button on the Hue Bridge before trying to connect.');
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="###">Hue Explorer</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="###" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Bridges
                </a>
                {
                  <HueBridgeSelector
                    activeBridgeId={this.state.activeBridgeId}
                    onActiveBridgeChange={this.onActiveBridgeChange.bind(this)}
                    onBridgeAuthorizationFailure={this.onBridgeAuthorizationFailure.bind(this)}
                  />
                }
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Lights</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Groups</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Schedules</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Scenes</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Sensors</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Rules</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="###">Configuration</a>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
        <div className="container-fluid">

        </div>
      </div>
    );
  }
}

export default App;
