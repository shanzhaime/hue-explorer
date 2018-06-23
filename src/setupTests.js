import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const fetchMock = jest.fn().mockImplementation(() => {
  return {
    json: jest.fn().mockImplementation(() => {
      return [];
    }),
  };
});
global.fetch = fetchMock;
