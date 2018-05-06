// @flow

import HueBridge from './HueBridge';
import Storage from './Storage';

const STORAGE_NAME = 'active_bridge';
const STORAGE_VERSION = 1;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

function restoreActiveBridge(): void {
  const activeBridgeId = getActiveBridge();
  if (activeBridgeId) {
    const activeBridge = HueBridge.getById(activeBridgeId);
    if (activeBridge) {
      activeBridge.startLocalPing();
    }
  }
}

function selectActiveBridge(bridgeId: string): void {
  const activeBridge = HueBridge.getById(bridgeId);
  if (!activeBridge) {
    throw new Error(`Cannot set active bridge: ${bridgeId}`);
  }
  const previousActiveBridgeId = getActiveBridge();
  if (previousActiveBridgeId) {
    const previousActiveBridge = HueBridge.getById(previousActiveBridgeId);
    if (previousActiveBridge) {
      previousActiveBridge.stopLocalPing();
    }
  }
  activeBridge.startLocalPing();
  storage.write(bridgeId);
}

function getActiveBridge(): ?string {
  return storage.read();
}

const ActiveBridge = {
  restore: restoreActiveBridge,
  select: selectActiveBridge,
  get: getActiveBridge
};

export default ActiveBridge;
