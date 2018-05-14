// @flow strict

function get(key: string): ?string {
  let value = null;
  try {
    value = localStorage.getItem(key);
  } catch (error) {
    throw new error('localStorage not accessible');
  }
  return value;
}

function set(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    throw new error('localStorage not accessible');
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    throw new error('localStorage not accessible');
  }
}

class Storage<T> {
  name: string;
  version: number;

  constructor(name: string, version: number) {
    this.name = name;
    this.version = version;

    const previousVersion = parseInt(get(name), 10) || 0;
    if (version > previousVersion) {
      remove(`${name}:${previousVersion}`);
      set(name, version.toString(10));
    }
  }

  read(): ?T {
    const key = `${this.name}:${this.version}`;
    const jsonString = get(key);

    let value: ?T = null;
    if (jsonString) {
      try {
        value = JSON.parse(jsonString);
      } catch (error) {
        // Remove corrupted item
        remove(key);
      }
    }

    return value;
  }

  write(value: T) {
    const key = `${this.name}:${this.version}`;
    const jsonString = JSON.stringify(value);
    set(key, jsonString);
  }

  static reset(): void {
    localStorage.clear();
  }
}

export default Storage;
