import deviceId from '../deviceId';
import Storage from '../Storage';

jest.mock('../Storage');
jest.dontMock('uuid');

beforeEach(() => {
  let storedId = null;
  Storage.mock.instances[0].write = jest.fn().mockImplementation((id) => {
    storedId = id;
  });
  Storage.mock.instances[0].read = jest.fn().mockImplementation(() => {
    return storedId;
  });
});

it('returns the same device id no matter how many times it is called', () => {
  expect(Storage.mock.instances).toHaveLength(1);
  const storageInstance = Storage.mock.instances[0];

  const firstDeviceId = deviceId();
  expect(storageInstance.read).toHaveBeenCalledTimes(1);
  expect(storageInstance.write).toHaveBeenCalledTimes(1);

  const secondDeviceId = deviceId();
  expect(storageInstance.read).toHaveBeenCalledTimes(2);
  expect(storageInstance.write).toHaveBeenCalledTimes(1);
  expect(secondDeviceId).toBe(firstDeviceId);

  const thirdDeviceId = deviceId();
  expect(storageInstance.read).toHaveBeenCalledTimes(3);
  expect(storageInstance.write).toHaveBeenCalledTimes(1);
  expect(thirdDeviceId).toBe(firstDeviceId);
});
