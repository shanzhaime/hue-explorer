// @flow strict

import Storage from './Storage';

type SettingsType = {
  // OAuth settings
  appId?: string,
  clientId?: string,
  clientSecret?: string,

  // Console last state
  lastConsoleMethod?: string,
  lastConsolePath?: string,
};

const STORAGE_NAME = 'settings';
const STORAGE_VERSION = 1;
const storage: Storage<SettingsType> = new Storage(
  STORAGE_NAME,
  STORAGE_VERSION,
);

function read(): SettingsType {
  const settings = storage.read();
  if (typeof settings === 'object' && settings !== null) {
    return settings;
  } else {
    return {};
  }
}

function write(settings: SettingsType) {
  storage.write(settings);
}

const Settings = {
  read,
  write,
};

export default Settings;
