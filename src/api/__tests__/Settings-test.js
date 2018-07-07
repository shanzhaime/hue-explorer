import Settings from '../Settings';
import Storage from '../Storage';

jest.mock('../Storage');

beforeEach(() => {
  let storedSettings = null;
  Storage.mock.instances[0].write = jest.fn().mockImplementation((settings) => {
    storedSettings = settings;
  });
  Storage.mock.instances[0].read = jest.fn().mockImplementation(() => {
    return storedSettings;
  });
});

it('reads settings previously written', () => {
  expect(Storage.mock.instances).toHaveLength(1);
  const storageInstance = Storage.mock.instances[0];

  const firstSettings = {
    appId: Math.random().toString(),
    clientId: Math.random().toString(),
    clientSecret: Math.random().toString(),
  };

  Settings.write(firstSettings);
  expect(storageInstance.write).toHaveBeenCalledTimes(1);
  expect(Settings.read()).toEqual(firstSettings);
  expect(storageInstance.read).toHaveBeenCalledTimes(1);

  const secondSettings = {
    appId: Math.random().toString(),
    clientId: Math.random().toString(),
    clientSecret: Math.random().toString(),
  };

  Settings.write(secondSettings);
  expect(storageInstance.write).toHaveBeenCalledTimes(2);
  expect(Settings.read()).toEqual(secondSettings);
  expect(storageInstance.read).toHaveBeenCalledTimes(2);

  const thirdSettings = {
    appId: Math.random().toString(),
    clientId: Math.random().toString(),
    clientSecret: Math.random().toString(),
  };

  Settings.write(thirdSettings);
  expect(storageInstance.write).toHaveBeenCalledTimes(3);
  expect(Settings.read()).toEqual(thirdSettings);
  expect(storageInstance.read).toHaveBeenCalledTimes(3);
});

it('returns blank state if not written before', () => {
  expect(Settings.read()).toEqual({});
});
