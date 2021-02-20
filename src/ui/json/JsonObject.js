// @flow strict

import React, { Component } from 'react';
import JsonArray from './JsonArray';
import JsonNumber from './JsonNumber';
import JsonString from './JsonString';
import JsonBoolean from './JsonBoolean';
import JsonNull from './JsonNull';

import type {Element} from "React";

class JsonObject extends Component<{
  depth: number,
  json: {},
}> {
  static defaultProps: {|depth: number, json: {...}|} = {
    depth: 0,
    json: {},
  };

  render(): Element<"span"> {
    const currentIndentation = (
      <pre
        dangerouslySetInnerHTML={{ __html: '  '.repeat(this.props.depth) }}
      />
    );
    const nextIndentation = (
      <pre
        dangerouslySetInnerHTML={{ __html: '  '.repeat(this.props.depth + 1) }}
      />
    );
    return (
      <span className="jsonObject">
        {'{'}
        {Object.keys(this.props.json).length === 0 ? null : (
          <ul>
            {Object.keys(this.props.json).map((key, index, keys) => {
              const value = this.props.json[key];
              let jsonContent;
              switch (typeof value) {
                case 'object':
                  if (value === null) {
                    jsonContent = <JsonNull />;
                    break;
                  } else if (Array.isArray(value)) {
                    jsonContent = (
                      <JsonArray json={value} depth={this.props.depth + 1} />
                    );
                    break;
                  }
                  jsonContent = (
                    <JsonObject json={value} depth={this.props.depth + 1} />
                  );
                  break;
                case 'number':
                  jsonContent = <JsonNumber json={value} />;
                  break;
                case 'string':
                  jsonContent = <JsonString json={value} />;
                  break;
                case 'boolean':
                  jsonContent = <JsonBoolean json={value} />;
                  break;
                default:
                  throw new Error('Invalid json property');
              }
              return (
                <li key={key}>
                  {nextIndentation}
                  {`"${key.replace(/"/g, '\\"')}": `}
                  {jsonContent}
                  {index < keys.length - 1 ? ',' : null}
                </li>
              );
            })}
          </ul>
        )}
        {Object.keys(this.props.json).length === 0 ? null : currentIndentation}
        {'}'}
      </span>
    );
  }
}

export default JsonObject;
