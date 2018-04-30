import HueBridge from './HueBridge';
import Storage from './Storage';

const STORAGE_NAME = 'bridges';
const STORAGE_VERSION = 3;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

const NUPNP_URL = 'https://www.meethue.com/api/nupnp';

function readStoredBridges() {
  const bridgeIds = storage.read() || [];
	return bridgeIds.map((id) => {
		return new HueBridge(id);
	});
}

async function fetchRemoteBridges() {
  return []; // Not implemented
}

async function fetchLocalBridges() {
  const response = await fetch(NUPNP_URL);
  const json = await response.json();
  return json.map((item) => {
    return new HueBridge(item.id, {
      host: item.internalipaddress,
      port: 443,
      connection: 'local',
    });
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

	const storedBridgeIds = storedBridges.map((bridge) => { return bridge.id; });
	const remoteBridgesIds = remoteBridges.map((bridge) => { return bridge.id; });
	const localBridgesIds = localBridges.map((bridge) => { return bridge.id; });
	const allBridgeIds = new Set(storedBridgeIds.concat(remoteBridgesIds).concat(localBridgesIds));
	storage.write(Array.from(allBridgeIds));

	return allBridgeIds;
}

const HueBridgeList = {
	fetch: fetchBridges,
}

export default HueBridgeList;
