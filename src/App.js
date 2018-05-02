import LightsView from './ui/LightsView';
import GroupsView from './ui/GroupsView';
import SchedulesView from './ui/SchedulesView';
import ScenesView from './ui/ScenesView';
import SensorsView from './ui/SensorsView';
import RulesView from './ui/RulesView';
import ConfigurationView from './ui/ConfigurationView';
import HueBridgeSelector from './ui/HueBridgeSelector';
import Storage from './api/Storage';
import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';

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
      <BrowserRouter>
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
                {
                  this.state.activeBridgeId ?
                  <React.Fragment>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/lights/${this.state.activeBridgeId}`}
                      >
                        Lights
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/groups/${this.state.activeBridgeId}`}
                      >
                        Groups
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/schedules/${this.state.activeBridgeId}`}
                      >
                        Schedules
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/scenes/${this.state.activeBridgeId}`}
                      >
                        Scenes
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/sensors/${this.state.activeBridgeId}`}
                      >
                        Sensors
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/rules/${this.state.activeBridgeId}`}
                      >
                        Rules
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/configuration/${this.state.activeBridgeId}`}
                      >
                        Configuration
                      </NavLink>
                    </li>
                  </React.Fragment> : null
                }
              </ul>
              {/*
              <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
              */}
            </div>
          </nav>
          <div className="container-fluid">
            <Route path="/lights/:id" component={LightsView}></Route>
            <Route path="/groups/:id" component={GroupsView}></Route>
            <Route path="/schedules/:id" component={SchedulesView}></Route>
            <Route path="/scenes/:id" component={ScenesView}></Route>
            <Route path="/sensors/:id" component={SensorsView}></Route>
            <Route path="/rules/:id" component={RulesView}></Route>
            <Route path="/configuration/:id" component={ConfigurationView}></Route>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
