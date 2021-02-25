// @flow strict

import React, { Component } from 'react';
import './JsonEditor.css';
import JsonObject from './JsonObject';
import JsonArray from './JsonArray';
import JsonNumber from './JsonNumber';
import JsonString from './JsonString';
import JsonBoolean from './JsonBoolean';
import JsonNull from './JsonNull';

import type { Element } from 'React';

class JsonEditor extends Component<{
  json: mixed,
}> {
  static defaultProps: {| json: null |} = {
    json: null,
  };

  render(): Element<'div'> {
    const json = this.props.json;
    let jsonContent;
    switch (typeof json) {
      case 'object':
        if (json === null) {
          jsonContent = <JsonNull />;
          break;
        } else if (Array.isArray(json)) {
          jsonContent = <JsonArray json={json} />;
          break;
        }
        jsonContent = <JsonObject json={json} />;
        break;
      case 'number':
        jsonContent = <JsonNumber json={json} />;
        break;
      case 'string':
        jsonContent = <JsonString json={json} />;
        break;
      case 'boolean':
        jsonContent = <JsonBoolean json={json} />;
        break;
      default:
        throw new Error('Invalid json property');
    }
    return <div className="text-monospace">{jsonContent}</div>;
  }
}

export default JsonEditor;
