import Light from './Light';
import React, { Component } from 'react';
import './Group.css';

class Group extends Component {
  render() {
    const json = this.props.json;
    switch (json.type) {
      case 'Entertainment':
        return (
          <div className="card">
            <div className="card-header">{json.name}</div>
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
            <div className="card-footer text-muted">
              {json.type}
              {typeof json.class === 'string' ? `: ${json.class}` : ''}
            </div>
          </div>
        );
      default:
        return (
          <div className="card">
            <div className="card-header">{json.name}</div>
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
            <div className="card-footer text-muted">
              {json.type}
              {typeof json.class === 'string' ? `: ${json.class}` : ''}
            </div>
          </div>
        );
    }
  }
}

export default Group;
