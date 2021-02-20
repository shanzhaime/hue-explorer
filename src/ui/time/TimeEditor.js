// @flow strict

import React, { Component } from 'react';

import type {Element} from "React";
import type { Time } from '../../api/HueTimePattern';

class TimeEditor extends Component<{
  time: Time,
}> {
  static defaultProps: {|time: Time|} = {
    time: {
      hour: 0,
      minute: 0,
      second: 0,
    },
  };

  render(): Element<"span"> {
    const time = this.props.time;
    return (
      <span className="text-monospace">
        {time.hour.toString().padStart(2, '0')}
        {':'}
        {time.minute.toString().padStart(2, '0')}
        {':'}
        {time.second.toString().padStart(2, '0')}
      </span>
    );
  }
}

export default TimeEditor;
