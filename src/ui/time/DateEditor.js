// @flow strict

import React, { Component } from 'react';

import type {Element} from "React";
import type { Date } from '../../api/HueTimePattern';

class DateEditor extends Component<{
  date: Date,
}> {
  static defaultProps: {|date: Date|} = {
    date: {
      year: 1970,
      month: 1,
      day: 1,
    },
  };

  render(): Element<"span"> {
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
