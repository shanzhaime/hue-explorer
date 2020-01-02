// @flow strict

import Storage from 'versioned-storage';
import deviceId from './deviceId';

const STORAGE_NAME_PREFIX = 'bridge:';
const STORAGE_VERSION = 2;

const bridgePool = new Map();
const isLocalSupported = window.location.protocol === 'http:';

type PropertiesType = {
  username?: string,
  local?: boolean,
  remote?: boolean,
  protocol?: 'http' | 'https',
  host?: string,
  port?: number,

  // OAuth tokens
  tokenType?: string,
  refreshToken?: string,
  refreshTokenExpiresAt?: number,
  accessToken?: string,
  accessTokenExpiresAt?: number,
};

type StateType = {
  localReachable: boolean,
  localPingTimer: ?TimeoutID,
  localPingEnabled: boolean,
};

class HueBridge {
  id: string;
  properties: PropertiesType;
  state: StateType;
  storage: Storage<PropertiesType>;

  constructor(id: string, properties: PropertiesType = {}) {
    const canonicalId = id.toUpperCase();
    const sameHueBridge = bridgePool.get(canonicalId);
    if (sameHueBridge) {
      sameHueBridge.properties = {
        ...sameHueBridge.properties,
        ...properties,
      };
      sameHueBridge.store();
      return sameHueBridge;
    }

    bridgePool.set(canonicalId, this);
    this.id = canonicalId;
    this.state = {
      localReachable: false,
      localPingTimer: null,
      localPingEnabled: false,
    };
    this.storage = new Storage(
      STORAGE_NAME_PREFIX + canonicalId,
      STORAGE_VERSION,
    );
    const storedProperties = this.storage.read();
    this.properties = {
      ...storedProperties,
      ...properties,
      id: id,
    };

    this.store();
  }

  store(): void {
    this.storage.write(this.properties);
  }

  getUrls(
    priorities: Array<'local' | 'remote'> = ['local', 'remote'],
    ignoreReachability: boolean = false,
  ): ?{
    hostUrl: string,
    apiUrl: string,
    usernameUrl: ?string,
    remote: boolean,
  } {
    let hostUrl = null;
    let apiUrl = null;
    let usernameUrl = null;
    let remote = false;
    for (let priority of priorities) {
      if (this.properties[priority] === true) {
        switch (priority) {
          case 'local':
            if (!ignoreReachability && !this.state.localReachable) {
              break;
            }
            const protocol = this.properties.protocol;
            const host = this.properties.host;
            const port = this.properties.port;
            if (protocol !== 'http' && protocol !== 'https') {
              break;
            }
            if (!host || !port) {
              break;
            }
            const hidePort =
              (protocol === 'http' && port === 80) ||
              (protocol === 'https' && port === 443);
            hostUrl = hidePort
              ? `${protocol}://${host}`
              : `${protocol}://${host}:${port}`;
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
            remote,
          };
        }
      }
    }
  }

  async connectLocal(): Promise<boolean> {
    if (!this.properties.username) {
      const urls = this.getUrls(['local']);
      if (urls && urls.apiUrl) {
        const response = await fetch(urls.apiUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            devicetype: `Hue Explorer#${deviceId()}`.slice(0, 40), // Hue accepts only 40 characters for devicetype
          }),
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
      } else {
        return false;
      }
    }
    return true;
  }

  async connectRemote(): Promise<boolean> {
    throw new Error('Not yet implemented');
  }

  async startLocalPing(): Promise<void> {
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

  stopLocalPing(): void {
    this.state.localPingEnabled = false;
    if (this.state.localPingTimer) {
      clearTimeout(this.state.localPingTimer);
      this.state.localPingTimer = null;
    }
  }

  async fetch(path: string, options: RequestOptions = {}): Promise<?{}> {
    const urls = this.getUrls();
    if (urls && urls.usernameUrl) {
      if (urls.remote) {
        if (!this.properties.accessToken) {
          throw new Error(
            `Bridge has no access token for remote fetching: ${this.id}`,
          );
        }
        if (!(options.headers instanceof Headers)) {
          options.headers = new Headers(options.headers);
        }
        const headers = options.headers;
        headers.set('Authorization', `Bearer ${this.properties.accessToken}`);
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(urls.usernameUrl + path, options);
      const json = await response.json();
      if (json.fault) {
        throw new Error(`Fetch failure: ${json.fault.faultstring}`);
      }
      return json;
    }
    new Error(`Bridge has no URL with username for fetching: ${this.id}`);
  }

  static getById(id: string): ?HueBridge {
    if (!bridgePool.has(id.toUpperCase())) {
      return null;
    }
    return bridgePool.get(id.toUpperCase());
  }

  static getAuthorizedById(id: string): ?HueBridge {
    if (!bridgePool.has(id.toUpperCase())) {
      return null;
    }
    const bridge = bridgePool.get(id.toUpperCase());
    if (!bridge || !bridge.properties.username) {
      return null;
    }
    return bridge;
  }

  // Local connection isn't support when the web page is served over HTTPS,
  // because Hue Bridge's own server doesn't serve HTTPS with valid certificate.
  // This readonly static property provides a cached value for that purpose.
  static get isLocalSupported(): boolean {
    return isLocalSupported;
  }
}

export default HueBridge;
