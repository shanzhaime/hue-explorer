import Storage from './Storage';
import deviceID from './deviceID';

const STORAGE_NAME_PREFIX = 'bridge:';
const STORAGE_VERSION = 1;

const bridgePool = new Map();

class HueBridge {
	constructor(id, properties) {
		const sameHueBridge = bridgePool.get(id);
		if (sameHueBridge) {
			sameHueBridge.properties = {
				...sameHueBridge.properties,
				...properties,
			}
			sameHueBridge.store();
			return sameHueBridge;
		}

		bridgePool.set(id, this);
		this.id = id;
		this.storage = new Storage(STORAGE_NAME_PREFIX + id, STORAGE_VERSION);
		const storedProperties = this.storage.read();
		this.properties = {
			...storedProperties,
			...properties,
			id: id,
		};

		this.store();
	}

	store() {
		this.storage.write(this.properties);
	}

  getHostUrl() {
		const hidePort =
			(this.properties.protocol === 'http' && this.properties.port === 80) ||
			(this.properties.protocol === 'https' && this.properties.port === 443);
		return hidePort ?
			`${this.properties.protocol}://${this.properties.host}` :
			`${this.properties.protocol}://${this.properties.host}:${this.properties.port}`;
	}

	getApiUrl() {
		const hostUrl = this.getHostUrl();
		return hostUrl + '/api';
	}

	getUsernameUrl() {
		const apiUrl = this.getApiUrl();
		return apiUrl + `/${this.properties.username}`;
	}

	async connect() {
		if (!this.properties.username) {
			const response = await fetch(this.getApiUrl(), {
				method: 'POST',
				mode: 'cors',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					devicetype: `Hue Explorer#${deviceID()}`
						.slice(0, 40), // Hue accepts only 40 characters for devicetype
				}),
			})
			const json = await response.json();
			if (json[0].success) {
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

	async fetch(path, options) {
		const response = await fetch(this.getUsernameUrl() + path, options);
		const json = await response.json();
		return json;
	}

	static getById(id) {
		if (!bridgePool.has(id)) {
			return null;
		}
		return bridgePool.get(id);
	}

	static getAuthorizedById(id) {
		if (!bridgePool.has(id)) {
			return null;
		}
		const bridge = bridgePool.get(id);
		if (!bridge.properties.username) {
			return null;
		}
		return bridge;
	}
}

export default HueBridge;
