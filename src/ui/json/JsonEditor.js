import React, { Component } from 'react';
import './JsonEditor.css';
import JsonObject from './JsonObject';
import JsonArray from './JsonArray';
import JsonNumber from './JsonNumber';
import JsonString from './JsonString';
import JsonBoolean from './JsonBoolean';
import JsonNull from './JsonNull';

class JsonEditor extends Component {
  static defaultProps = {
    json: null,
  };

  render() {
    const json = this.props.json;
    switch (typeof json) {
      case 'object':
        if (json === null) {
          return <JsonNull />;
        } else if (Array.isArray(json)) {
          return <JsonArray json={json} />;
        }
        return <JsonObject json={json} />;
      case 'number':
        return <JsonNumber json={json} />;
      case 'string':
        return <JsonString json={json} />;
      case 'boolean':
        return <JsonBoolean json={json} />;
      default:
        throw new Error('Invalid json property');
    }
  }
}

export default JsonEditor;
