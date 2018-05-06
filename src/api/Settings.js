import Storage from './Storage';

const STORAGE_NAME = 'settings';
const STORAGE_VERSION = 1;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

function read() {
  return storage.read() || {};
}

function write(settings) {
  storage.write(settings);
}

const Settings = {
  read,
  write
};

export default Settings;
