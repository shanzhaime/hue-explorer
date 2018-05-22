let HueBridge = require('../HueBridge').default;
import Settings from '../Settings';
import Storage from '../Storage';

jest.mock('../Settings');
jest.mock('../Storage');

const TEST_BRIDGE_ID = '0123456789ABCDEF';
const TEST_BRIDGE_PROPERTIES = {
  username: 'fedcba9876543210',
  remote: true,
};

beforeEach(() => {
  jest.resetModules();
  HueBridge = require('../HueBridge').default;

  let storedBridges = null;
  Storage.mock.instances[0].write = jest.fn().mockImplementation((bridges) => {
    storedBridges = bridges;
  });
  Storage.mock.instances[0].read = jest.fn().mockImplementation(() => {
    return storedBridges;
  });
});

describe('HueBridge constructor', () => {
  it('can be created with id', () => {
    const bridge = new HueBridge(TEST_BRIDGE_ID);
    expect(bridge).not.toBeNull();
    expect(bridge.id).toBe(TEST_BRIDGE_ID);
  });

  it('can be created with id and properties', () => {
    const bridge = new HueBridge(TEST_BRIDGE_ID, TEST_BRIDGE_PROPERTIES);
    expect(bridge).not.toBeNull();
    expect(bridge.id).toBe(TEST_BRIDGE_ID);
    expect(bridge.properties).toMatchObject(TEST_BRIDGE_PROPERTIES);
  });

  it('reuses the same instance when being created with the same id', () => {
    const firstBridge = new HueBridge(TEST_BRIDGE_ID);
    const secondBridge = new HueBridge(TEST_BRIDGE_ID, TEST_BRIDGE_PROPERTIES);
    expect(secondBridge).toBe(firstBridge);
  });

  it('overrides properties when the same instance is created for a second time', () => {
    const firstBridge = new HueBridge(TEST_BRIDGE_ID);
    expect(firstBridge.properties).not.toMatchObject(TEST_BRIDGE_PROPERTIES);

    const secondBridge = new HueBridge(TEST_BRIDGE_ID, TEST_BRIDGE_PROPERTIES);
    expect(firstBridge.properties).toMatchObject(TEST_BRIDGE_PROPERTIES);
  });

  it('can be stored', () => {
    const firstBridge = new HueBridge(TEST_BRIDGE_ID, TEST_BRIDGE_PROPERTIES);
    expect(firstBridge.storage.write).toHaveBeenCalledTimes(1);

    const secondBridge = new HueBridge(TEST_BRIDGE_ID);
    expect(secondBridge.storage.read).toHaveBeenCalledTimes(1);
    expect(secondBridge.properties).toMatchObject(TEST_BRIDGE_PROPERTIES);
  });
});

describe('HueBridge retrieval', () => {
  it('can be retrieved by id', () => {
    const firstBridge = new HueBridge(TEST_BRIDGE_ID, TEST_BRIDGE_PROPERTIES);
    const secondBridge = HueBridge.getById(TEST_BRIDGE_ID);
    expect(secondBridge.properties).toMatchObject(TEST_BRIDGE_PROPERTIES);
  });

  it('can be retrieved by id with username requirement (requirement met)', () => {
    const firstBridge = new HueBridge(TEST_BRIDGE_ID, TEST_BRIDGE_PROPERTIES);
    const secondBridge = HueBridge.getAuthorizedById(TEST_BRIDGE_ID);
    expect(secondBridge.properties).toMatchObject(TEST_BRIDGE_PROPERTIES);
  });

  it('can be retrieved by id with username requirement (requirement unmet)', () => {
    const bridge = new HueBridge(TEST_BRIDGE_ID);
    expect(HueBridge.getAuthorizedById(TEST_BRIDGE_ID)).toBeNull();
  });
});
