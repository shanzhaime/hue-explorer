import Light from './Light';
import React, { Component } from 'react';

class Group extends Component {
  render() {
    const json = this.props.json;
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

export default Group;
