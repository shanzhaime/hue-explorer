// @flow strict

import DateEditor from './DateEditor';
import TimeEditor from './TimeEditor';
import RecurringDaysEditor from './RecurringDaysEditor';
import React, { Component } from 'react';

import type { Element } from 'React';
import type { TimePattern } from '../../api/HueTimePattern';

class TimePatternEditor extends Component<{
  timePattern: TimePattern,
}> {
  static defaultProps: {|
    timePattern: TimePattern,
  |} = {
    timePattern: {
      time: {
        hour: 0,
        minute: 0,
        second: 0,
      },
      timer: false,
    },
  };

  render(): Element<'span'> {
    const timePattern = this.props.timePattern;
    const startTime = timePattern.time.start
      ? timePattern.time.start
      : timePattern.time;
    const endTime = timePattern.time.end ? timePattern.time.end : null;

    const dateEditor = timePattern.date ? (
      <DateEditor date={timePattern.date} />
    ) : null;
    const recurringDaysEditor = timePattern.recurringDays ? (
      <RecurringDaysEditor recurringDays={timePattern.recurringDays} />
    ) : null;
    const startTimeEditor = <TimeEditor time={startTime} />;
    const endTimeEditor = endTime ? <TimeEditor time={endTime} /> : null;

    return (
      <span>
        {dateEditor}
        {timePattern.date ? ' ' : null}
        {timePattern.time.start ? (
          timePattern.time.randomized ? (
            <React.Fragment>
              random in between
              {startTimeEditor}
              and
              {endTimeEditor}
            </React.Fragment>
          ) : (
            <React.Fragment>
              from
              {startTimeEditor}
              to
              {endTimeEditor}
            </React.Fragment>
          )
        ) : (
          startTimeEditor
        )}
        {timePattern.timer ||
        timePattern.recurringTimes ||
        timePattern.recurringDays
          ? ' '
          : null}
        {timePattern.timer ? 'timer' : null}
        {timePattern.recurringTimes
          ? timePattern.recurringTimes === Infinity
            ? 'repeat indefinitely'
            : `repeat ${timePattern.recurringTimes} time(s)`
          : null}
        {recurringDaysEditor}
      </span>
    );
  }
}

export default TimePatternEditor;
