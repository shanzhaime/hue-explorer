import Settings from './Settings';
import Storage from './Storage';
import deviceId from './deviceId';

const STORAGE_NAME_PREFIX = 'bridge:';
const STORAGE_VERSION = 2;

const bridgePool = new Map();
const settings = Settings.read();

class HueBridge {
  constructor(id, properties) {
    const sameHueBridge = bridgePool.get(id.toUpperCase());
    if (sameHueBridge) {
      sameHueBridge.properties = {
        ...sameHueBridge.properties,
        ...properties
      };
      sameHueBridge.store();
      return sameHueBridge;
    }

    bridgePool.set(id.toUpperCase(), this);
    this.id = id.toUpperCase();
    this.state = {
      localReachable: false,
      localPingTimer: null,
      localPingEnabled: false
    };
    this.storage = new Storage(STORAGE_NAME_PREFIX + id, STORAGE_VERSION);
    const storedProperties = this.storage.read();
    this.properties = {
      ...storedProperties,
      ...properties,
      id: id
    };

    this.store();
  }

  store() {
    this.storage.write(this.properties);
  }

  getUrls(priorities = ['local', 'remote'], ignoreReachability = false) {
    let hostUrl = null;
    let apiUrl = null;
    let usernameUrl = null;
    let remote = null;
    for (let priority of priorities) {
      if (this.properties[priority] === true) {
        switch (priority) {
          case 'local':
            if (!ignoreReachability && !this.state.localReachable) {
              break;
            }
            const hidePort =
              (this.properties.protocol === 'http' &&
                this.properties.port === 80) ||
              (this.properties.protocol === 'https' &&
                this.properties.port === 443);
            hostUrl = hidePort
              ? `${this.properties.protocol}://${this.properties.host}`
              : `${this.properties.protocol}://${this.properties.host}:${
                  this.properties.port
                }`;
            apiUrl = hostUrl + '/api';
            break;
          case 'remote':
            hostUrl = `${window.location.protocol}//${window.location.host}`;
            apiUrl = hostUrl + '/bridge';
            remote = true;
            break;
          default:
            throw new Error(`Unrecognized priority: ${priority}`);
        }
        if (hostUrl) {
          if (this.properties.username) {
            usernameUrl = apiUrl + `/${this.properties.username}`;
          }
          return {
            hostUrl,
            apiUrl,
            usernameUrl,
            remote
          };
        }
      }
    }
  }

  async connectLocal() {
    if (!this.properties.username) {
      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          devicetype: `Hue Explorer#${deviceId()}`.slice(0, 40) // Hue accepts only 40 characters for devicetype
        })
      });
      const json = await response.json();
      if (json[0] && json[0].success) {
        this.properties.username = json[0].success.username;
        this.store();
        return true;
      } else {
        // json[0].error.type === 101: link button not pressed
        return false;
      }
    }
    return true;
  }

  async connectRemote() {}

  async startLocalPing() {
    if (this.state.localPingEnabled) {
      return;
    }
    this.state.localPingEnabled = true;
    const localPingLooper = async () => {
      if (this.properties.local) {
        const urls = this.getUrls(['local'], true);
        if (urls && urls.apiUrl) {
          const descriptionUrl = `${urls.apiUrl}/0/config`;
          try {
            const response = await fetch(descriptionUrl);
            const json = await response.json();
            if (
              typeof json.bridgeid === 'string' &&
              json.bridgeid.toUpperCase() === this.id
            ) {
              this.state.localReachable = true;
            } else {
              this.state.localReachable = false;
            }
          } catch (_) {
            this.state.localReachable = false;
          }
        } else {
          this.state.localReachable = false;
        }
        this.state.localPingTimer = setTimeout(localPingLooper, 5 * 1000);
      }
    };
    localPingLooper();
  }

  stopLocalPing() {
    this.state.localPingEnabled = false;
    if (this.state.localPingTimer) {
      clearTimeout(this.state.localPingTimer);
      this.state.localPingTimer = null;
    }
  }

  async fetch(path, options = {}) {
    const urls = this.getUrls();
    if (urls && urls.usernameUrl) {
      if (urls.remote) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${settings.accessToken}`,
          'content-type': 'application/json'
        };
      }

      const response = await fetch(urls.usernameUrl + path, options);
      const json = await response.json();
      if (json.fault) {
        throw new Error(`Fetch failure: ${json.fault.faultstring}`);
      }
      return json;
    }
    throw new Error(`Bridge has no URL for fetching: ${this.id}`);
  }

  static getById(id) {
    if (!bridgePool.has(id.toUpperCase())) {
      return null;
    }
    return bridgePool.get(id.toUpperCase());
  }

  static getAuthorizedById(id) {
    if (!bridgePool.has(id.toUpperCase())) {
      return null;
    }
    const bridge = bridgePool.get(id.toUpperCase());
    if (!bridge.properties.username) {
      return null;
    }
    return bridge;
  }
}

export default HueBridge;
