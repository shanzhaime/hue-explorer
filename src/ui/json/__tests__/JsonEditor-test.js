import JsonEditor from '../JsonEditor';
import React from 'react';
import { shallow } from 'enzyme';

it('should render null', () => {
  const wrapper = shallow(<JsonEditor json={null} />);
  expect(wrapper.text()).toBe('<JsonNull />');
});

it('should render boolean', () => {
  const wrapper = shallow(<JsonEditor json={true} />);
  expect(wrapper.text()).toBe('<JsonBoolean />');
});

it('should render number', () => {
  const wrapper = shallow(<JsonEditor json={42} />);
  expect(wrapper.text()).toBe('<JsonNumber />');
});

it('should render string', () => {
  const wrapper = shallow(<JsonEditor json={''} />);
  expect(wrapper.text()).toBe('<JsonString />');
});

it('should render array', () => {
  const wrapper = shallow(<JsonEditor json={[]} />);
  expect(wrapper.text()).toBe('<JsonArray />');
});

it('should render object', () => {
  const wrapper = shallow(<JsonEditor json={{}} />);
  expect(wrapper.text()).toBe('<JsonObject />');
});

it('should not render other types', () => {
  expect(() => {
    shallow(<JsonEditor json={function () {}} />);
  }).toThrow();
});
