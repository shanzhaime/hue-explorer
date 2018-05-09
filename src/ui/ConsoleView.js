import JsonEditor from './json/JsonEditor';
import HueBridge from '../api/HueBridge';
import HueBridgeList from '../api/HueBridgeList';
import React, { Component } from 'react';

class ConsoleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bridge: null,
      method: 'get',
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

  onMethodClick(method) {
    this.setState({
      method,
    });
  }

  onSendClick() {}

  componentDidMount() {
    const bridge = this.getActiveBridge();
    this.setState({
      bridge,
    });
  }

  render() {
    return (
      <div className="card my-3">
        <div className="card-body">
          <div className="form-inline">
            <div
              className="input-group mb-2 mr-sm-2"
              style={{
                flex: '1 1 auto',
              }}
            >
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
        </div>
      </div>
    );
  }
}

export default ConsoleView;
