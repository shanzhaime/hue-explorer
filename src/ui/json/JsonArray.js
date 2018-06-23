// @flow strict

import React, { Component } from 'react';
import JsonObject from './JsonObject';
import JsonNumber from './JsonNumber';
import JsonString from './JsonString';
import JsonBoolean from './JsonBoolean';
import JsonNull from './JsonNull';

class JsonArray extends Component<{
  depth: number,
  json: Array<mixed>,
}> {
  static defaultProps = {
    depth: 0,
    json: [],
  };

  render() {
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
      <span className="jsonArray">
        {'['}
        {this.props.json.length === 0 ? null : (
          <ul>
            {this.props.json.map((value, index, values) => {
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
                <li key={index}>
                  {nextIndentation}
                  {jsonContent}
                  {index < values.length - 1 ? ',' : null}
                </li>
              );
            })}
          </ul>
        )}
        {currentIndentation}
        {']'}
      </span>
    );
  }
}

export default JsonArray;
