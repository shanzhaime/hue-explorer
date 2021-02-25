import JsonObject from '../JsonObject';
import React from 'react';
import { mount } from 'enzyme';

it('should render empty value', () => {
  const wrapper = mount(<JsonObject json={{}} />);
  expect(wrapper.text()).toBe('{}');
});

it('should render value in mixed types', () => {
  const wrapper = mount(
    <JsonObject
      json={{
        a: null,
        b: true,
        c: false,
        d: 42,
        e: NaN,
        f: 'Let\'s say "yes".',
        g: [3.14, 2.22],
        h: { x: { y: { z: 42, w: {} } } },
      }}
    />,
  );
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '{',
    '  "a": null,',
    '  "b": true,',
    '  "c": false,',
    '  "d": 42,',
    '  "e": NaN,',
    '  "f": "Let\'s say \\"yes\\".",',
    '  "g": [',
    '    3.14,',
    '    2.22',
    '  ],',
    '  "h": {',
    '    "x": {',
    '      "y": {',
    '        "z": 42,',
    '        "w": {}',
    '      }',
    '    }',
    '  }',
    '}'
  ].join(''));
});

it('should not render other types', () => {
  expect(() => {
    mount(<JsonObject json={{ value: function () {} }} />);
  }).toThrow();
});
