import JsonString from '../JsonString';
import React from 'react';
import { shallow } from 'enzyme';

it('should render string value', () => {
  const wrapper = shallow(<JsonString json={'Hello, world!'} />);
  expect(wrapper.text()).toBe('"Hello, world!"');
});

it('should render empty string value', () => {
  const wrapper = shallow(<JsonString json={''} />);
  expect(wrapper.text()).toBe('""');
});

it('should render string value with single quote', () => {
  const wrapper = shallow(<JsonString json={"It's 42."} />);
  expect(wrapper.text()).toBe('"It\'s 42."');
});

it('should render string value with double quote', () => {
  const wrapper = shallow(<JsonString json={'alert("Hello")'} />);
  expect(wrapper.text()).toBe('"alert(\\"Hello\\")"');
});
