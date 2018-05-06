function get(key) {
  let value = null;
  try {
    value = localStorage.getItem(key);
  } catch (error) {
    const storageError = new StorageError("localStorage not accessible");
    throw storageError;
  }
  return value;
}

function set(key, value) {
  try {
    value = localStorage.setItem(key, value);
  } catch (error) {
    const storageError = new StorageError("localStorage not accessible");
    throw storageError;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    const storageError = new StorageError("localStorage not accessible");
    throw storageError;
  }
}

class Storage {
  constructor(name, version) {
    this.name = name;
    this.version = version;

    const previousVersion = parseInt(get(name), 10) || 0;
    if (version > previousVersion) {
      remove(`${name}:${previousVersion}`);
      set(name, version);
    }
  }

  read() {
    const key = `${this.name}:${this.version}`;
    const jsonString = get(key);

    let value = null;
    try {
      value = JSON.parse(jsonString);
    } catch (error) {
      // Remove corrupted item
      remove(key);
    }

    return value;
  }

  write(value) {
    const key = `${this.name}:${this.version}`;
    const jsonString = JSON.stringify(value);
    set(key, jsonString);
  }
}

class StorageError extends Error {
  constructor(...params) {
    super(...params);

    // Error stack trace for v8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }
  }
}
Storage.StorageError = StorageError;

export default Storage;
