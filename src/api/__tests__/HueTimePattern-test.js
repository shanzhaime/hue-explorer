import HueTimePattern from '../HueTimePattern';

it('can parse absolute time', () => {
  expect(HueTimePattern.parse('2013-12-31T14:12:45')).toEqual({
    date: {
      year: 2013,
      month: 12,
      day: 31,
    },
    time: {
      hour: 14,
      minute: 12,
      second: 45,
    },
    timer: false,
  });
});

it('can parse randomized time', () => {
  expect(HueTimePattern.parse('2013-12-31T14:12:45A18:32:24')).toEqual({
    date: {
      year: 2013,
      month: 12,
      day: 31,
    },
    time: {
      start: {
        hour: 14,
        minute: 12,
        second: 45,
      },
      end: {
        hour: 18,
        minute: 32,
        second: 24,
      },
      randomized: true,
    },
    timer: false,
  });
});

it('can parse recurring times', () => {
  expect(HueTimePattern.parse('W124/T14:12:45')).toEqual({
    recurringDays: [true, true, true, true, true, false, false],
    time: {
      hour: 14,
      minute: 12,
      second: 45,
    },
    timer: false,
  });
});

it('can parse recurring randomized times', () => {
  expect(HueTimePattern.parse('W124/T14:12:45A18:32:24')).toEqual({
    recurringDays: [true, true, true, true, true, false, false],
    time: {
      start: {
        hour: 14,
        minute: 12,
        second: 45,
      },
      end: {
        hour: 18,
        minute: 32,
        second: 24,
      },
      randomized: true,
    },
    timer: false,
  });
});

it('can parse time intervals', () => {
  expect(HueTimePattern.parse('T14:12:45/T18:32:24')).toEqual({
    time: {
      start: {
        hour: 14,
        minute: 12,
        second: 45,
      },
      end: {
        hour: 18,
        minute: 32,
        second: 24,
      },
      randomized: false,
    },
    timer: false,
  });

  expect(HueTimePattern.parse('W003/T14:12:45/T18:32:24')).toEqual({
    recurringDays: [false, false, false, false, false, true, true],
    time: {
      start: {
        hour: 14,
        minute: 12,
        second: 45,
      },
      end: {
        hour: 18,
        minute: 32,
        second: 24,
      },
      randomized: false,
    },
    timer: false,
  });
});

it('can parse timers', () => {
  expect(HueTimePattern.parse('PT14:12:45')).toEqual({
    time: {
      hour: 14,
      minute: 12,
      second: 45,
    },
    timer: true,
  });

  expect(HueTimePattern.parse('PT14:12:45A18:32:24')).toEqual({
    time: {
      start: {
        hour: 14,
        minute: 12,
        second: 45,
      },
      end: {
        hour: 18,
        minute: 32,
        second: 24,
      },
      randomized: true,
    },
    timer: true,
  });

  expect(HueTimePattern.parse('R42/PT14:12:45')).toEqual({
    recurringTimes: 42,
    time: {
      hour: 14,
      minute: 12,
      second: 45,
    },
    timer: true,
  });

  expect(HueTimePattern.parse('R/PT14:12:45')).toEqual({
    recurringTimes: Infinity,
    time: {
      hour: 14,
      minute: 12,
      second: 45,
    },
    timer: true,
  });

  expect(HueTimePattern.parse('R42/PT14:12:45A18:32:24')).toEqual({
    recurringTimes: 42,
    time: {
      start: {
        hour: 14,
        minute: 12,
        second: 45,
      },
      end: {
        hour: 18,
        minute: 32,
        second: 24,
      },
      randomized: true,
    },
    timer: true,
  });
});
