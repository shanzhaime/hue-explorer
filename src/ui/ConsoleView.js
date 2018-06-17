// @flow strict

import JsonEditor from './json/JsonEditor';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import Settings from '../api/Settings';
import React, { Component } from 'react';

type PropsType = {
  match: {
    params: {
      id: string,
    },
  },
};

type StateType = {
  bridge: ?HueBridge,
  method: string,
  path: string,
  body: ?string,
  json: ?{},
};

class ConsoleView extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const settings = Settings.read();
    this.state = {
      bridge: null,
      method: settings.lastConsoleMethod || 'get',
      path: settings.lastConsolePath || '/config',
      body: null,
      json: null,
    };
  }

  getActiveBridge() {
    const acitveBridgeId =
      this.props &&
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id;
    if (!acitveBridgeId) {
      return null;
    }

    const maybeBridge = HueBridge.getById(acitveBridgeId);
    if (maybeBridge) {
      return maybeBridge;
    } else {
      HueBridgeList.load();
      return HueBridge.getAuthorizedById(acitveBridgeId);
    }
  }

  onMethodClick(method: string) {
    const settings = Settings.read();
    settings.lastConsoleMethod = method;
    Settings.write(settings);
    this.setState({
      method,
    });
  }

  onPathChange(event: SyntheticInputEvent<HTMLInputElement>) {
    const path = event.target.value;
    const settings = Settings.read();
    settings.lastConsolePath = path;
    Settings.write(settings);
    this.setState({
      path,
    });
  }

  onBodyChange(event: SyntheticInputEvent<HTMLInputElement>) {
    this.setState({
      body: event.target.value,
    });
  }

  onSendClick() {
    if (this.state.bridge) {
      this.state.bridge
        .fetch(this.state.path, {
          method: this.state.method.toUpperCase(),
          body: this.state.body,
        })
        .then((json) => {
          console.log(json);
          this.setState({
            json,
          });
        });
    }
  }

  componentDidMount() {
    const bridge = this.getActiveBridge();
    this.setState({
      bridge,
    });
  }

  render() {
    return (
      <div>
        <div className="card my-3">
          <div className="card-body">
            <div className="form-inline">
              <div className="input-group mb-2 mr-sm-2 flex-fill">
                <div className="input-group-prepend">
                  <button
                    id="method"
                    type="button"
                    className="input-group-text btn btn-light dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.state.method.toUpperCase()}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="method">
                    <button
                      className={
                        'dropdown-item' +
                        (this.state.method === 'get' ? ' active' : '')
                      }
                      onClick={this.onMethodClick.bind(this, 'get')}
                    >
                      GET
                    </button>
                    <button
                      className={
                        'dropdown-item' +
                        (this.state.method === 'post' ? ' active' : '')
                      }
                      onClick={this.onMethodClick.bind(this, 'post')}
                    >
                      POST
                    </button>
                    <button
                      className={
                        'dropdown-item' +
                        (this.state.method === 'put' ? ' active' : '')
                      }
                      onClick={this.onMethodClick.bind(this, 'put')}
                    >
                      PUT
                    </button>
                    <button
                      className={
                        'dropdown-item' +
                        (this.state.method === 'delete' ? ' active' : '')
                      }
                      onClick={this.onMethodClick.bind(this, 'delete')}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
                <label className="sr-only" htmlFor="path">
                  Path
                </label>
                <input
                  type="text"
                  defaultValue={this.state.path}
                  onChange={this.onPathChange.bind(this)}
                  className="form-control"
                  placeholder="/config"
                  aria-label="Path"
                />
              </div>
              <button
                className="btn btn-primary mb-2"
                onClick={this.onSendClick.bind(this)}
              >
                Send
              </button>
            </div>
            {this.state.method !== 'get' ? (
              <div className="form-inline">
                <label htmlFor="body" className="sr-only">
                  Body
                </label>
                <textarea
                  id="body"
                  onChange={this.onBodyChange.bind(this)}
                  className="form-control flex-fill"
                  rows="3"
                  placeholder="{ body: 'in json' }"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="card my-3">
          <div className="card-header">Response</div>
          <div className="card-body">
            <JsonEditor json={this.state.json} />
          </div>
        </div>
      </div>
    );
  }
}

export default ConsoleView;
