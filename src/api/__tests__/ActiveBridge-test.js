import ActiveBridge from '../ActiveBridge';
import HueBridge from '../HueBridge';
import Storage from '../Storage';

jest.mock('../HueBridge');
jest.mock('../Storage');

const TEST_BRIDGE_ID = '0123456789ABCDEF';
const TEST_BRIDGE = new HueBridge();

HueBridge.getById = jest.fn().mockImplementation((id) => {
  if (id === TEST_BRIDGE_ID) {
    return TEST_BRIDGE;
  }
});

beforeEach(() => {
  let storedId = null;
  Storage.mock.instances[0].write = jest.fn().mockImplementation((id) => {
    storedId = id;
  });
  Storage.mock.instances[0].read = jest.fn().mockImplementation(() => {
    return storedId;
  });
});

it('can store selected active bridge', () => {
  ActiveBridge.select(TEST_BRIDGE_ID);
  expect(Storage.mock.instances).toHaveLength(1);
  const storageInstance = Storage.mock.instances[0];
  expect(storageInstance.write).toHaveBeenCalledTimes(1);
  expect(storageInstance.write).toHaveBeenCalledWith(TEST_BRIDGE_ID);
});

it('can get stored active bridge', () => {
  expect(ActiveBridge.get()).toBe(null);

  ActiveBridge.select(TEST_BRIDGE_ID);
  expect(Storage.mock.instances).toHaveLength(1);
  const storageInstance = Storage.mock.instances[0];

  storageInstance.read.mockClear();
  const activeBridgeId = ActiveBridge.get();
  expect(storageInstance.read).toHaveBeenCalledTimes(1);
  expect(activeBridgeId).toBe(TEST_BRIDGE_ID);
});

it('can start active bridge local ping', () => {
  ActiveBridge.select(TEST_BRIDGE_ID);

  TEST_BRIDGE.startLocalPing.mockClear();
  ActiveBridge.restore();
  expect(TEST_BRIDGE.startLocalPing).toHaveBeenCalledTimes(1);
});
