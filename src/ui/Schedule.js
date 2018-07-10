import JsonEditor from './json/JsonEditor';
import React, { Component } from 'react';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showJson: false,
    };
  }

  onJsonToggleClick(showJson) {
    this.setState({
      showJson,
    });
  }

  render() {
    const json = this.props.json;
    let cardBody;
    if (this.state.showJson) {
      cardBody = (
        <div className="card-body">
          <JsonEditor json={json} />
        </div>
      );
    } else {
      cardBody = (
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Time Pattern: {json.localtime}</li>
          <li className="list-group-item">Status: {json.status}</li>
          <li className="list-group-item">
            Command:
            <JsonEditor json={json.command} />
          </li>
        </ul>
      );
    }
    return (
      <div className="card">
        <h5 className="card-header">
          {json.name}
          <button
            type="button"
            className={
              'btn btn-secondary float-right px-2 py-0' +
              (this.state.showJson ? ' active' : '')
            }
            data-toggle="button"
            aria-pressed="false"
            autoComplete="off"
            onClick={this.onJsonToggleClick.bind(this, !this.state.showJson)}
          >
            <small>JSON</small>
          </button>
        </h5>
        {cardBody}
        <div className="card-footer text-muted">{json.description}</div>
      </div>
    );
  }
}

export default Schedule;
