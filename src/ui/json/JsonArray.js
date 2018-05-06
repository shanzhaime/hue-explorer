import React, { Component } from 'react';
import JsonObject from './JsonObject';
import JsonNumber from './JsonNumber';
import JsonString from './JsonString';
import JsonBoolean from './JsonBoolean';
import JsonNull from './JsonNull';

class JsonArray extends Component {
  static defaultProps = {
    json: null,
    name: null
  };

  render() {
    return (
      <div className="jsonArray">
        {this.props.name ? `"${this.props.name}": ` : ''}
        {'['}
        {this.props.json.map((value, index) => {
          switch (typeof value) {
            case 'object':
              if (value === null) {
                return <JsonNull key={index} />;
              } else if (Array.isArray(value)) {
                return <JsonArray json={value} key={index} />;
              }
              return <JsonObject json={value} key={index} />;
            case 'number':
              return <JsonNumber json={value} key={index} />;
            case 'string':
              return <JsonString json={value} key={index} />;
            case 'boolean':
              return <JsonBoolean json={value} key={index} />;
            default:
              throw new Error('Invalid json property');
          }
        })}
        {']'}
      </div>
    );
  }
}

export default JsonArray;
