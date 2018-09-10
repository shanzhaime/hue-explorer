// @flow strict

export type Date = {|
  year: number,
  month: number,
  day: number,
|};

export type Time = {|
  hour: number,
  minute: number,
  second: number,
|};

export type TimeInterval = {|
  start: Time,
  end: Time,
  randomized: boolean,
|};

export type RecurringDays = [
  boolean, // Monday
  boolean, // Tuesday
  boolean, // Wednesday
  boolean, // Thursday
  boolean, // Friday
  boolean, // Saturday
  boolean, // Sunday
];

export type TimePattern = {|
  date?: Date,
  recurringTimes?: number,
  recurringDays?: RecurringDays,
  time: Time | TimeInterval,
  timer: boolean,
|};

const dateRegExpString = '\\d{4}-\\d{2}-\\d{2}';
const recurringDaysRegExpString = 'W\\d{3}';
const recurringTimesRegExpString = 'R(\\d{2})?';
const timeRegExpString = '\\d{2}:\\d{2}:\\d{2}';
const recurringDaysOrTimesRegExpString = `((${recurringDaysRegExpString})|(${recurringTimesRegExpString}))`;
const dateOrRecurringRegExpString = `((${dateRegExpString})|${recurringDaysOrTimesRegExpString}\\/)?`;
const timePatternRegExpString = `${dateOrRecurringRegExpString}(P)?T(${timeRegExpString})((A|\\/T)(${timeRegExpString}))?`;
const timePatternRegExp = new RegExp(timePatternRegExpString);

const dateRegExp = /(\d{4})-(\d{2})-(\d{2})/;
const recurringDaysRegExp = /W(\d{3})/;
const recurringTimesRegExp = /R(\d{2})?/;
const timeRegExp = /(\d{2}):(\d{2}):(\d{2})/;

function parseDate(string: string): Date {
  const matches = dateRegExp.exec(string);
  if (!matches) {
    throw new Error(`Invalid date: ${string}`);
  }

  const [year, month, day] = matches.slice(1);
  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
  };
}

function parseRecurringDays(string: string): RecurringDays {
  const matches = recurringDaysRegExp.exec(string);
  if (!matches) {
    throw new Error(`Invalid recurring days: ${string}`);
  }

  const bitmaskString = matches[1];
  let bitmask = parseInt(bitmaskString, 10);
  const sunday = !!(bitmask % 2);
  const saturday = !!((bitmask >>= 1) % 2);
  const friday = !!((bitmask >>= 1) % 2);
  const thursday = !!((bitmask >>= 1) % 2);
  const wednesday = !!((bitmask >>= 1) % 2);
  const tuesday = !!((bitmask >>= 1) % 2);
  const monday = !!((bitmask >>= 1) % 2);
  return [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
}

function parseRecurringTimes(string: string): number {
  const matches = recurringTimesRegExp.exec(string);
  if (!matches) {
    throw new Error(`Invalid recurring days: ${string}`);
  }

  const times = matches[1];
  if (times) {
    return parseInt(times, 10);
  } else {
    return Infinity;
  }
}

function parseTime(string: string): Time {
  const matches = timeRegExp.exec(string);
  if (!matches) {
    throw new Error(`Invalid recurring days: ${string}`);
  }

  const [hour, minute, second] = matches.slice(1);
  return {
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
    second: parseInt(second, 10),
  };
}

const HueTimePattern = {
  parse: function(string: string): TimePattern {
    const matches = timePatternRegExp.exec(string);
    if (!matches) {
      throw new Error(`Invalid time pattern: ${string}`);
    }

    const dateString = matches[2];
    const recurringDaysString = matches[4];
    const recurringTimesString = matches[5];
    const timerString = matches[7];
    const startTimeString = matches[8];
    const randomizedString = matches[10];
    const endTimeString = matches[11];

    let result: TimePattern = {
      time: endTimeString
        ? {
            start: parseTime(startTimeString),
            end: parseTime(endTimeString),
            randomized: randomizedString === 'A',
          }
        : parseTime(startTimeString),
      timer: timerString === 'P',
    };
    if (dateString) {
      result.date = parseDate(dateString);
    }
    if (recurringDaysString) {
      result.recurringDays = parseRecurringDays(recurringDaysString);
    }
    if (recurringTimesString) {
      result.recurringTimes = parseRecurringTimes(recurringTimesString);
    }

    return result;
  },
};

export default HueTimePattern;
