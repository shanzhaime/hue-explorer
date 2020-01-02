import ActiveBridge from '../ActiveBridge';
import HueBridge from '../HueBridge';
import Storage from 'versioned-storage';

jest.mock('../HueBridge');
jest.mock('versioned-storage');

const TEST_BRIDGE_1_ID = '0123456789ABCDEF';
const TEST_BRIDGE_1 = new HueBridge();
const TEST_BRIDGE_2_ID = '1234567890FEDCBA';
const TEST_BRIDGE_2 = new HueBridge();
const NON_EXISTENT_BRIDGE_ID = '1357924680FFFFFF';

HueBridge.getById = jest.fn().mockImplementation((id) => {
  switch (id) {
    case TEST_BRIDGE_1_ID:
      return TEST_BRIDGE_1;
    case TEST_BRIDGE_2_ID:
      return TEST_BRIDGE_2;
    default:
      return null;
  }
});

HueBridge.isLocalSupported = true;

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
  ActiveBridge.select(TEST_BRIDGE_1_ID);
  expect(Storage.mock.instances).toHaveLength(1);
  const storageInstance = Storage.mock.instances[0];
  expect(storageInstance.write).toHaveBeenCalledTimes(1);
  expect(storageInstance.write).toHaveBeenCalledWith(TEST_BRIDGE_1_ID);
});

it('can get stored active bridge', () => {
  expect(ActiveBridge.get()).toBe(null);

  ActiveBridge.select(TEST_BRIDGE_1_ID);
  expect(Storage.mock.instances).toHaveLength(1);
  const storageInstance = Storage.mock.instances[0];

  storageInstance.read.mockClear();
  const activeBridgeId = ActiveBridge.get();
  expect(storageInstance.read).toHaveBeenCalledTimes(1);
  expect(activeBridgeId).toBe(TEST_BRIDGE_1_ID);
});

it('can start active bridge local ping at selection time', () => {
  TEST_BRIDGE_1.startLocalPing.mockClear();
  ActiveBridge.select(TEST_BRIDGE_1_ID);
  expect(TEST_BRIDGE_1.startLocalPing).toHaveBeenCalledTimes(1);
});

it('can start active bridge local ping at restoration time', () => {
  ActiveBridge.select(TEST_BRIDGE_1_ID);

  TEST_BRIDGE_1.startLocalPing.mockClear();
  ActiveBridge.restore();
  expect(TEST_BRIDGE_1.startLocalPing).toHaveBeenCalledTimes(1);
});

it('can stop previous active bridge ping at selection change', () => {
  ActiveBridge.select(TEST_BRIDGE_1_ID);
  ActiveBridge.select(TEST_BRIDGE_2_ID);
  expect(TEST_BRIDGE_1.stopLocalPing).toHaveBeenCalledTimes(1);
});

it('throws if bridge does not exist', () => {
  expect(() => {
    ActiveBridge.select(NON_EXISTENT_BRIDGE_ID);
  }).toThrow();
});
