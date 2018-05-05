import HueBridge from './api/HueBridge';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';
import App from './App';
import Settings from './api/Settings';
import deviceId from './api/deviceId';
import registerServiceWorker from './registerServiceWorker';

function oauthFailure() {
  alert('OAuth failure');
  window.location.href = '/';
  debugger;
  throw new Error('OAuth failure');
}

if (window.location.search) {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (code && state && state === deviceId()) {
    const settings = Settings.read();
    const hash = btoa(`${settings.clientId}:${settings.clientSecret}`);
    let bridgeId = null;

    fetch(`/oauth2/token?code=${code}&grant_type=authorization_code`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${hash}`,
      },
    }).then((response) => {
      return response.json();
    }).then((json) => {
      console.log(json);
      if (json.fault) {
        oauthFailure();
      }

      settings.accessToken = json.access_token;
      settings.refreshToken = json.refresh_token;
      settings.tokenType = json.token_type;
      Settings.write(settings);

      return fetch(`/bridge/0/config`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.accessToken}`,
        },
      });
    }).then((response) => {
      return response.json();
    }).then((json) => {
      bridgeId = json.bridgeid;
      if (!bridgeId) {
        oauthFailure();
      }
      const bridge = HueBridge.getById(bridgeId);
      if (bridge) {
        bridge.properties.remote = true;
        bridge.store();
        window.location.href = '/';
      } else {
        return fetch(`/bridge/0/config`, {
          method: 'PUT',
          body: JSON.stringify({
            linkbutton: true,
          }),
          headers: {
            Authorization: `Bearer ${settings.accessToken}`,
            'content-type': 'application/json',
          },
        })
      }
    }).then((response) => {
      return response.json();
    }).then((json) => {
      console.log(json);
      if (!json[0] || !json[0].success) {
        oauthFailure();
      }
      return fetch(`/bridge`, {
        method: 'POST',
        body: JSON.stringify({
          devicetype: settings.appId,
        }),
        headers: {
          Authorization: `Bearer ${settings.accessToken}`,
          'content-type': 'application/json',
        },
      });
    }).then((response) => {
      return response.json();
    }).then((json) => {
      if (!json[0] || !json[0].success) {
        oauthFailure();
      }
      const bridge = new HueBridge(bridgeId, {
        username: json[0].success.username,
        remote: true,
      });
      bridge.store();
      window.location.href = '/';
    });
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

window.HueBridge = HueBridge;
