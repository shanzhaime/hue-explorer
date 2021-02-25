// @flow strict

import React, { Component } from 'react';

import type { Element } from 'React';

class JsonNumber extends Component<{
  json: number,
}> {
  static defaultProps: {| json: number |} = {
    json: NaN,
  };

  render(): Element<'span'> {
    return <span>{this.props.json.toString(10)}</span>;
  }
}

export default JsonNumber;
