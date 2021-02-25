import HueBridge from './api/HueBridge';
import HueBridgeList from './api/HueBridgeList';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import './index.css';
import App from './App';
import Settings from './api/Settings';
import ActiveBridge from './api/ActiveBridge';
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

function oauthRedirect(url, code) {
  const destinationURL = new URL(url);
  destinationURL.searchParams.append('code', code);
  destinationURL.searchParams.append('state', url);
  window.location.href = destinationURL.href;
  debugger;
}

if (window.location.search) {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (code && state) {
    const thisURL = new URL(window.location.href);
    const thatURL = new URL(state);
    if (
      thisURL.protocol !== thatURL.protocol ||
      thisURL.host !== thatURL.host
    ) {
      oauthRedirect(state, code);
    } else {
      const settings = Settings.read();
      const hash =
        settings.clientId && settings.clientSecret
          ? btoa(`${settings.clientId}:${settings.clientSecret}`)
          : null;
      let bridgeId = null;
      let bridgeOAuthProperties;

      fetch(`/oauth2/token?code=${code}&grant_type=authorization_code`, {
        method: 'POST',
        headers: {
          Authorization: hash ? `Basic ${hash}` : null,
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

          bridgeOAuthProperties = {
            accessToken: json.access_token,
            refreshToken: json.refresh_token,
            tokenType: json.token_type,
            accessTokenExpiresAt:
              Date.now() + parseInt(json.access_token_expires_in, 10),
            refreshTokenExpiresAt:
              Date.now() + parseInt(json.refresh_token_expires_in, 10),
          };

          return fetch(`/bridge/0/config`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${bridgeOAuthProperties.accessToken}`,
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
              ...bridgeOAuthProperties,
              remote: true,
            };
            bridge.store();
            ActiveBridge.select(bridgeId);
            oauthSuccess(state);
          } else {
            // If the bridge was never seen before, authorize through remote API.
            fetch(`/bridge/0/config`, {
              method: 'PUT',
              body: JSON.stringify({
                linkbutton: true,
              }),
              headers: {
                Authorization: `Bearer ${bridgeOAuthProperties.accessToken}`,
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
                    devicetype:
                      settings.appId || process.env.REACT_APP_OAUTH_APP_ID,
                  }),
                  headers: {
                    Authorization: `Bearer ${bridgeOAuthProperties.accessToken}`,
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
                  ...bridgeOAuthProperties,
                });
                bridge.store();
                HueBridgeList.add(bridgeId);
                ActiveBridge.select(bridgeId);
                oauthSuccess(state);
              });
          }
        });
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

console.log('NODE_ENV', process.env.NODE_ENV);
window.HueBridge = HueBridge;
window.HueBridgeList = HueBridgeList;
window.Settings = Settings;
