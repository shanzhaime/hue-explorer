import React, { Component } from 'react';
import JsonArray from './JsonArray';
import JsonNumber from './JsonNumber';
import JsonString from './JsonString';
import JsonBoolean from './JsonBoolean';
import JsonNull from './JsonNull';

class JsonObject extends Component {
  static defaultProps = {
    json: null,
    name: null,
  }

  render() {
    return (
      <div className='jsonObject'>
        {this.props.name ? `"${this.props.name}": ` : ''}
        {'{'}
        {Object.keys(this.props.json).map((key) => {
          const value = this.props.json[key];
          switch (typeof value) {
            case 'object':
              if (value === null) {
                return <JsonNull name={key} key={key} />;
              } else if (Array.isArray(value)) {
                return <JsonArray json={value} name={key} key={key} />;
              };
              return <JsonObject json={value} name={key} key={key} />;
            case 'number':
              return <JsonNumber json={value} name={key} key={key} />;
            case 'string':
              return <JsonString json={value} name={key} key={key} />;
            case 'boolean':
              return <JsonBoolean json={value} name={key} key={key} />;
            default:
              throw new Error('Invalid json property');
          }
        })}
        {'}'}
      </div>
    );
  }
}

export default JsonObject;
