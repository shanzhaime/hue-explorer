import uuid from "uuid";
import Storage from "./Storage";

const STORAGE_NAME = "device_id";
const STORAGE_VERSION = 1;
const storage = new Storage(STORAGE_NAME, STORAGE_VERSION);

const deviceId = function() {
  const existingID = storage.read();
  if (!existingID) {
    const newID = uuid();
    storage.write(newID);
    return newID;
  }
  return existingID;
};

export default deviceId;
