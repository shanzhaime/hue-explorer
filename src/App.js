import LightsView from './ui/LightsView';
import GroupsView from './ui/GroupsView';
import SchedulesView from './ui/SchedulesView';
import ScenesView from './ui/ScenesView';
import SensorsView from './ui/SensorsView';
import RulesView from './ui/RulesView';
import ConfigurationView from './ui/ConfigurationView';
import ResourceLinksView from './ui/ResourceLinksView';
import CapabilitiesView from './ui/CapabilitiesView';
import ConsoleView from './ui/ConsoleView';
import SettingsView from './ui/SettingsView';
import HueBridgeSelector from './ui/HueBridgeSelector';
import ActiveBridge from './api/ActiveBridge';
import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';

class App extends Component {
  onBridgeAuthorizationFailure() {
    alert(
      'Please press the link button on the Hue Bridge before trying to connect.',
    );
  }

  render() {
    const activeBridgeId = ActiveBridge.get();
    return (
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
              Hue Explorer
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="###"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Bridges
                  </a>
                  <HueBridgeSelector
                    onBridgeAuthorizationFailure={this.onBridgeAuthorizationFailure.bind(
                      this,
                    )}
                    key={Math.random()}
                  />
                </li>
                {activeBridgeId ? (
                  <React.Fragment>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/lights/${activeBridgeId}`}
                      >
                        Lights
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/groups/${activeBridgeId}`}
                      >
                        Groups
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/schedules/${activeBridgeId}`}
                      >
                        Schedules
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/scenes/${activeBridgeId}`}
                      >
                        Scenes
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/sensors/${activeBridgeId}`}
                      >
                        Sensors
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/rules/${activeBridgeId}`}
                      >
                        Rules
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/configuration/${activeBridgeId}`}
                      >
                        Configuration
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/resourcelinks/${activeBridgeId}`}
                      >
                        Resource Links
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/capabilities/${activeBridgeId}`}
                      >
                        Capabilities
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        activeClassName="active"
                        to={`/console/${activeBridgeId}`}
                      >
                        Console
                      </NavLink>
                    </li>
                  </React.Fragment>
                ) : null}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="###"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Settings
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <NavLink
                      className="dropdown-item"
                      activeClassName="active"
                      to="/settings/oauth"
                    >
                      OAuth
                    </NavLink>
                    <NavLink
                      className="dropdown-item"
                      activeClassName="active"
                      to="/settings/reset"
                    >
                      Reset
                    </NavLink>
                  </div>
                </li>
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
            <Route path="/lights/:id" component={LightsView} />
            <Route path="/groups/:id" component={GroupsView} />
            <Route path="/schedules/:id" component={SchedulesView} />
            <Route path="/scenes/:id" component={ScenesView} />
            <Route path="/sensors/:id" component={SensorsView} />
            <Route path="/rules/:id" component={RulesView} />
            <Route path="/configuration/:id" component={ConfigurationView} />
            <Route path="/resourcelinks/:id" component={ResourceLinksView} />
            <Route path="/capabilities/:id" component={CapabilitiesView} />
            <Route path="/console/:id" component={ConsoleView} />
            <Route path="/settings/:dialog" component={SettingsView} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
