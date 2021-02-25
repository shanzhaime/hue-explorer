// @flow strict

import React, { Component } from 'react';

import type { Element } from 'React';
import type { RecurringDays } from '../../api/HueTimePattern';

class RecurringDaysEditor extends Component<{
  recurringDays: RecurringDays,
}> {
  static defaultProps: {| recurringDays: RecurringDays |} = {
    recurringDays: [false, false, false, false, false, false, false],
  };

  render(): Element<'span'> {
    const recurringDays = this.props.recurringDays;
    return (
      <span>
        <span
          className={`text-monospace text-${
            recurringDays[0] ? 'success' : 'muted'
          }`}
          disabled
        >
          M
        </span>
        <span
          className={`text-monospace text-${
            recurringDays[1] ? 'success' : 'muted'
          }`}
          disabled
        >
          T
        </span>
        <span
          className={`text-monospace text-${
            recurringDays[2] ? 'success' : 'muted'
          }`}
          disabled
        >
          W
        </span>
        <span
          className={`text-monospace text-${
            recurringDays[3] ? 'success' : 'muted'
          }`}
          disabled
        >
          T
        </span>
        <span
          className={`text-monospace text-${
            recurringDays[4] ? 'success' : 'muted'
          }`}
          disabled
        >
          F
        </span>
        <span
          className={`text-monospace text-${
            recurringDays[5] ? 'success' : 'muted'
          }`}
          disabled
        >
          S
        </span>
        <span
          className={`text-monospace text-${
            recurringDays[6] ? 'success' : 'muted'
          }`}
          disabled
        >
          S
        </span>
      </span>
    );
  }
}

export default RecurringDaysEditor;
