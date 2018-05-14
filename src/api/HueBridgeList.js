// @flow strict

import ActiveBridge from './ActiveBridge';
import HueBridge from './HueBridge';
import Storage from './Storage';

const STORAGE_NAME = 'bridges';
const STORAGE_VERSION = 4;
const storage: Storage<Array<string>> = new Storage(
  STORAGE_NAME,
  STORAGE_VERSION,
);

const NUPNP_URL = 'https://www.meethue.com/api/nupnp';

function readStoredBridges(): Array<HueBridge> {
  const bridgeIds = storage.read() || [];
  return bridgeIds.map((id) => {
    return new HueBridge(id);
  });
}

function addBridge(bridgeId: string): void {
  const bridgeIds = storage.read() || [];
  bridgeIds.push(bridgeId);
  storage.write(bridgeIds);
}

async function discoverLocalBridges(): Promise<Array<HueBridge>> {
  const response = await fetch(NUPNP_URL);
  const json = await response.json();
  return json.map((item) => {
    return new HueBridge(item.id, {
      protocol: 'http',
      host: item.internalipaddress,
      port: 80,
      local: true,
    });
  });
}

function loadBridges(): Array<string> {
  const storedBridges = readStoredBridges();
  ActiveBridge.restore();
  const storedBridgeIds = storedBridges.map((bridge) => {
    return bridge.id;
  });
  return storedBridgeIds;
}

async function fetchBridges(): Promise<Array<string>> {
  const storedBridges = readStoredBridges();
  const localBridges = await discoverLocalBridges();

  const storedBridgeIds = storedBridges.map((bridge) => {
    return bridge.id;
  });
  const localBridgeIds = localBridges.map((bridge) => {
    return bridge.id;
  });
  const allBridgeIds = Array.from(
    new Set([...storedBridgeIds, ...localBridgeIds]),
  );
  storage.write(allBridgeIds);
  ActiveBridge.restore();
  return allBridgeIds;
}

const HueBridgeList = {
  add: addBridge,
  load: loadBridges,
  fetch: fetchBridges,
};

export default HueBridgeList;
