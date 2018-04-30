import HueBridge from './HueBridge';
import Storage from './Storage';

const STORAGE_NAME = 'bridges';
const STORAGE_VERSION = 2;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

const NUPNP_URL = 'https://www.meethue.com/api/nupnp';

function readStoredBridges() {
  return storage.read() || [];
}

function writeStoredBridges(bridges) {
  storage.write(bridges);
}

async function fetchRemoteBridges() {
  return []; // Not implemented
}

async function fetchLocalBridges() {
  const response = await fetch(NUPNP_URL);
  const json = await response.json();
  return json.map((item) => {
    return {
      host: item.internalipaddress,
      port: 443,
      id: item.id,
      connection: 'local',
    };
  });
}

async function fetchBridges() {
  const [
    storedBridges,
    remoteBridges,
    localBridges,
  ] = await Promise.all([
    readStoredBridges(),
    fetchRemoteBridges(),
    fetchLocalBridges(),
  ]);

  const allBridges = new Map();
  storedBridges.concat(remoteBridges).concat(localBridges).forEach((bridge) => {
    allBridges.set(bridge.id || `${bridge.host}:${bridge.port}`, bridge);
  });

  const updatedStoredBridges = [];
  allBridges.forEach((value) => {
    updatedStoredBridges.push({
      ...value,
      stored: true,
    });
  });
  writeStoredBridges(updatedStoredBridges);

  return allBridges;
}

const HueBridgeList = {
	fetch: fetchBridges,
}

export default HueBridgeList;
