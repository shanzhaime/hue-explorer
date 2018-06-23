import JsonBoolean from '../JsonBoolean';
import React from 'react';
import { shallow } from 'enzyme';

it('should render true value', () => {
  const wrapper = shallow(<JsonBoolean json={true} />);
  expect(wrapper.text()).toBe('true');
});

it('should render false value', () => {
  const wrapper = shallow(<JsonBoolean json={false} />);
  expect(wrapper.text()).toBe('false');
});
