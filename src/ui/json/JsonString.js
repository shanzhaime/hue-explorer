// @flow strict

import React, { Component } from 'react';

import type { Element } from 'React';

class JsonString extends Component<{
  json: string,
}> {
  static defaultProps: {| json: string |} = {
    json: '',
  };

  render(): Element<'span'> {
    return <span>{JSON.stringify(this.props.json)}</span>;
  }
}

export default JsonString;
