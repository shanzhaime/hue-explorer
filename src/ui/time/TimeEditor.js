// @flow strict

import type { Time } from '../../api/HueTimePattern';
import React, { Component } from 'react';

class TimeEditor extends Component<{
  time: Time,
}> {
  static defaultProps = {
    time: {
      hour: 0,
      minute: 0,
      second: 0,
    },
  };

  render() {
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
