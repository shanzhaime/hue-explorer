import JsonNull from '../JsonNull';
import React from 'react';
import { shallow } from 'enzyme';

it('should render the value', () => {
  const wrapper = shallow(<JsonNull />);
  expect(wrapper.text()).toBe('null');
});
