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
      <React.Fragment>
        {Array.from(new Array(this.props.depth).keys()).map((_) => {
          return <React.Fragment>&nbsp; </React.Fragment>;
        })}
      </React.Fragment>
    );
    const nextIndentation = (
      <React.Fragment>&nbsp; {currentIndentation}</React.Fragment>
    );
    return (
      <span className="jsonArray">
        {'['}
        {this.props.json.length === 0 ? null : (
          <ul>
            {this.props.json.map((value, index) => {
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
                  {','}
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
