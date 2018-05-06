import Settings from '../api/Settings';
import React, { Component } from 'react';

class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = Settings.read();
  }

  onSaveClick() {
    const settings = {
      appId: this.appIdInput.value,
      clientId: this.clientIdInput.value,
      clientSecret: this.clientSecretInput.value
    };
    Settings.write(settings);
    this.setState(settings);
  }

  render() {
    return (
      <div className="row justify-content-md-center">
        <div className="col col-md-6 col-lg-4">
          <div className="card my-3">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="appId">App ID</label>
                <input
                  defaultValue={this.state.appId}
                  type="text"
                  className="form-control"
                  id="appId"
                  placeholder="App ID"
                  ref={input => {
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
                  ref={input => {
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
                  ref={input => {
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
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsView;
