// @flow strict

import Storage from './Storage';

const STORAGE_NAME = 'settings';
const STORAGE_VERSION = 1;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

function read(): {} {
  const settings = storage.read();
  if (typeof settings === 'object' && settings !== null) {
    return settings;
  } else {
    return {};
  }
}

function write(settings: {}) {
  storage.write(settings);
}

const Settings = {
  read,
  write,
};

export default Settings;
