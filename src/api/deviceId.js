// @flow strict

import uuid from 'uuid';
import Storage from './Storage';

const STORAGE_NAME = 'device_id';
const STORAGE_VERSION = 1;
const storage: Storage<string> = new Storage(STORAGE_NAME, STORAGE_VERSION);

const deviceId = function(): string {
  const existingID = String(storage.read());
  if (!existingID) {
    const newID: string = uuid();
    storage.write(newID);
    return newID;
  }
  return existingID;
};

export default deviceId;
