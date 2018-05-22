import JsonEditor from './json/JsonEditor';
import Light from './Light';
import React, { Component } from 'react';
import './Group.css';

class Group extends Component {
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
      switch (json.type) {
        case 'Entertainment':
          cardBody = (
            <div className="groupSquare">
              <div className="groupEntertainmentArea">
                {json.lights.map((key) => {
                  const locations = json.locations[key];
                  const left = (locations[0] + 1) / 2;
                  const bottom = (locations[1] + 1) / 2;
                  return (
                    <Light
                      rendering="circle"
                      locations={{
                        left: left * 100 + '%',
                        bottom: bottom * 100 + '%',
                      }}
                      json={this.props.lights[key]}
                      lightId={key}
                      key={key}
                    />
                  );
                })}
              </div>
            </div>
          );
          break;
        default:
          cardBody = (
            <ul className="list-group list-group-flush">
              {json.lights.map((key) => {
                return (
                  <Light
                    rendering="item"
                    json={this.props.lights[key]}
                    lightId={key}
                    key={key}
                  />
                );
              })}
            </ul>
          );
          break;
      }
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
        <div className="card-footer text-muted">
          {json.type}
          {typeof json.class === 'string' ? `: ${json.class}` : ''}
        </div>
      </div>
    );
  }
}

export default Group;
