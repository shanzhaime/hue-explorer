import JsonArray from '../JsonArray';
import React from 'react';
import { mount } from 'enzyme';

it('should render empty value', () => {
  const wrapper = mount(<JsonArray json={[]} />);
  expect(wrapper.text()).toBe('[]');
});

it('should render value with null', () => {
  const wrapper = mount(<JsonArray json={[null, null, null]} />);
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  null,',
    '  null,',
    '  null',
    ']'
  ].join(''));
});

it('should render value with boolean', () => {
  const wrapper = mount(<JsonArray json={[true, false, true]} />);
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  true,',
    '  false,',
    '  true',
    ']'
  ].join(''));
});

it('should render value with number', () => {
  const wrapper = mount(<JsonArray json={[42, 0, -42]} />);
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  42,',
    '  0,',
    '  -42',
    ']'
  ].join(''));
});

it('should render value with string', () => {
  const wrapper = mount(
    <JsonArray json={['Hello, world!', '', 'Let\'s say "yes".']} />,
  );
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  "Hello, world!",',
    '  "",',
    '  "Let\'s say \\"yes\\"."',
    ']'
  ].join(''));
});

it('should render value with array', () => {
  const wrapper = mount(<JsonArray json={[[], [42], [[42]]]} />);
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  [',
    '  ],',
    '  [',
    '    42',
    '  ],',
    '  [',
    '    [',
    '      42',
    '    ]',
    '  ]',
    ']'
  ].join(''));
});

it('should render value with object', () => {
  const wrapper = mount(
    <JsonArray json={[{ x: 42, y: 0, z: -42 }, {}, { x: { y: { z: 42 } } }]} />,
  );
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  {',
    '    "x": 42,',
    '    "y": 0,',
    '    "z": -42',
    '  },',
    '  {',
    '  },',
    '  {',
    '    "x": {',
    '      "y": {',
    '        "z": 42',
    '      }',
    '    }',
    '  }',
    ']'
  ].join(''));
});

it('should render value in mixed types', () => {
  const wrapper = mount(
    <JsonArray
      json={[null, true, 42, 'Hello, world!', [false, -42], { value: NaN }]}
    />,
  );
  // prettier-ignore
  expect(wrapper.text()).toBe([
    '[',
    '  null,',
    '  true,',
    '  42,',
    '  "Hello, world!",',
    '  [',
    '    false,',
    '    -42',
    '  ],',
    '  {',
    '    "value": NaN',
    '  }',
    ']'
  ].join(''));
});
