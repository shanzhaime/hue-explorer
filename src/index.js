import HueBridge from './api/HueBridge';
import HueBridgeList from './api/HueBridgeList';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';
import App from './App';
import Settings from './api/Settings';
import registerServiceWorker from './registerServiceWorker';

function oauthSuccess(url) {
  window.location.href = url;
  debugger;
}

function oauthFailure(url) {
  alert('OAuth failure');
  window.location.href = url;
  debugger;
  throw new Error('OAuth failure');
}

if (window.location.search) {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (code && state) {
    const settings = Settings.read();
    const hash = btoa(`${settings.clientId}:${settings.clientSecret}`);
    let bridgeId = null;
    let additionalBridgeProperties = {};

    fetch(`/oauth2/token?code=${code}&grant_type=authorization_code`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${hash}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (json.fault) {
          oauthFailure(state);
        }

        additionalBridgeProperties.accessToken = json.access_token;
        additionalBridgeProperties.refreshToken = json.refresh_token;
        additionalBridgeProperties.tokenType = json.token_type;
        additionalBridgeProperties.accessTokenExpiresAt =
          Date.now() + parseInt(json.access_token_expires_in, 10);
        additionalBridgeProperties.refreshTokenExpiresAt =
          Date.now() + parseInt(json.refresh_token_expires_in, 10);

        return fetch(`/bridge/0/config`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${additionalBridgeProperties.accessToken}`,
          },
        });
      })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        bridgeId = json.bridgeid;
        if (!bridgeId) {
          oauthFailure(state);
        }
        HueBridgeList.load();
        const bridge = HueBridge.getById(bridgeId);
        if (bridge && bridge.properties.username) {
          // If the bridge was authorized before, e.g. locally, add remote properties.
          bridge.properties = {
            ...bridge.properties,
            ...additionalBridgeProperties,
            remote: true,
          };
          bridge.store();
          oauthSuccess(state);
        } else {
          // If the bridge was never seen before, authorize through remote API.
          fetch(`/bridge/0/config`, {
            method: 'PUT',
            body: JSON.stringify({
              linkbutton: true,
            }),
            headers: {
              Authorization: `Bearer ${additionalBridgeProperties.accessToken}`,
              'content-type': 'application/json',
            },
          })
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              console.log(json);
              if (!json[0] || !json[0].success) {
                oauthFailure(state);
              }
              return fetch(`/bridge`, {
                method: 'POST',
                body: JSON.stringify({
                  devicetype: additionalBridgeProperties.appId,
                }),
                headers: {
                  Authorization: `Bearer ${
                    additionalBridgeProperties.accessToken
                  }`,
                  'content-type': 'application/json',
                },
              });
            })
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              if (!json[0] || !json[0].success) {
                oauthFailure(state);
              }
              const bridge = new HueBridge(bridgeId, {
                username: json[0].success.username,
                remote: true,
              });
              bridge.store();
              HueBridgeList.add(bridgeId);
              oauthSuccess(state);
            });
        }
      });
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

window.HueBridge = HueBridge;
window.HueBridgeList = HueBridgeList;
window.Settings = Settings;
