// @flow strict

import uuid from 'uuid';
import Storage from 'versioned-storage';

const STORAGE_NAME = 'device_id';
const STORAGE_VERSION = 1;
const storage: Storage<string> = new Storage(STORAGE_NAME, STORAGE_VERSION);

const deviceId = function(): string {
  const existingID = storage.read();
  if (existingID === null || existingID === undefined) {
    const newID: string = uuid();
    storage.write(newID);
    return newID;
  } else {
    return existingID;
  }
};

export default deviceId;
