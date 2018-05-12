// @flow strict

import Settings from '../api/Settings';
import Storage from '../api/Storage';
import React, { Component } from 'react';

type PropsType = {
  match: {
    params: {
      dialog: string,
    },
  },
};

type StateType = {
  appId: ?string,
  clientId: ?string,
  clientSecret: ?string,
};

class SettingsView extends Component<PropsType, StateType> {
  appIdInput: ?HTMLInputElement;
  clientIdInput: ?HTMLInputElement;
  clientSecretInput: ?HTMLInputElement;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      appId: null,
      clientId: null,
      clientSecret: null,
      ...Settings.read(),
    };
  }

  onSaveClick() {
    const settings = {
      appId: this.appIdInput && this.appIdInput.value,
      clientId: this.clientIdInput && this.clientIdInput.value,
      clientSecret: this.clientSecretInput && this.clientSecretInput.value,
    };
    Settings.write(settings);
    this.setState(settings);
  }

  onResetClick() {
    const resetConfirmed = window.confirm(
      'This will remove all authorized bridges and delete all settings. Are you sure about this?',
    );
    if (resetConfirmed) {
      Storage.reset();
    }
  }

  render() {
    const dialog =
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.dialog;

    let dialogBody = null;
    switch (dialog) {
      case 'oauth':
        dialogBody = (
          <React.Fragment>
            <h5 className="card-header">OAuth Settings</h5>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="appId">App ID</label>
                <input
                  defaultValue={this.state.appId}
                  type="text"
                  className="form-control"
                  id="appId"
                  placeholder="App ID"
                  ref={(input) => {
                    this.appIdInput = input;
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientId">Client ID</label>
                <input
                  defaultValue={this.state.clientId}
                  type="text"
                  className="form-control"
                  id="clientId"
                  placeholder="Client ID"
                  ref={(input) => {
                    this.clientIdInput = input;
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="clientSecret">Client Secret</label>
                <input
                  defaultValue={this.state.clientSecret}
                  type="password"
                  className="form-control"
                  id="clientSecret"
                  placeholder="Client Secret"
                  ref={(input) => {
                    this.clientSecretInput = input;
                  }}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={this.onSaveClick.bind(this)}
              >
                Save
              </button>
            </div>
          </React.Fragment>
        );
        break;
      case 'reset':
        dialogBody = (
          <React.Fragment>
            <h5 className="card-header">Reset Hue Explorer</h5>
            <div className="card-body">
              <button
                id="reset"
                className="btn btn-danger"
                onClick={this.onResetClick.bind(this)}
              >
                Reset
              </button>
            </div>
          </React.Fragment>
        );
        break;
      default:
        throw new Error(`Unsupported settings dialog: ${dialog}`);
    }
    return (
      <div className="row justify-content-md-center">
        <div className="col col-md-6 col-lg-4">
          <div className="card my-3">{dialogBody}</div>
        </div>
      </div>
    );
  }
}

export default SettingsView;
