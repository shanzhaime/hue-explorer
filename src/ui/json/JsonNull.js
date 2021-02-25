// @flow strict

import React, { Component } from 'react';

import type { Element } from 'React';

class JsonNull extends Component<{}> {
  static defaultProps: {} = {};

  render(): Element<'span'> {
    return <span>null</span>;
  }
}

export default JsonNull;
