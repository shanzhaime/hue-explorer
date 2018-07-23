// @flow strict

import type { Date } from '../../api/HueTimePattern';
import React, { Component } from 'react';

class DateEditor extends Component<{
  date: Date,
}> {
  static defaultProps = {
    date: {
      year: 1970,
      month: 1,
      day: 1,
    },
  };

  render() {
    const date = this.props.date;
    return (
      <span className="text-monospace">
        {date.year.toString().padStart(2, '0')}
        {'-'}
        {date.month.toString().padStart(2, '0')}
        {'-'}
        {date.day.toString().padStart(2, '0')}
      </span>
    );
  }
}

export default DateEditor;
