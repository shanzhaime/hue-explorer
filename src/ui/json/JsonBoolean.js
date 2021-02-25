// @flow strict

import React, { Component } from 'react';

import type { Element } from 'React';

class JsonBoolean extends Component<{
  json: boolean,
}> {
  static defaultProps: {| json: boolean |} = {
    json: false,
  };

  render(): Element<'span'> {
    return <span>{this.props.json.toString()}</span>;
  }
}

export default JsonBoolean;
