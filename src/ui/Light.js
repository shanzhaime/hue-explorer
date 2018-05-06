import JsonEditor from './json/JsonEditor';
import HueColor from '../api/HueColor';
import React, { Component } from 'react';

class Light extends Component {
  render() {
    const json = this.props.json;
    let rgb = [
      HueColor.RGB_MAX_VALUE,
      HueColor.RGB_MAX_VALUE,
      HueColor.RGB_MAX_VALUE,
    ];
    switch (json.state.colormode) {
      case 'hs':
        // Not yet supported;
        break;
      case 'xy':
        rgb = HueColor.fromXyToRgb(json.state.xy, json.state.bri);
        break;
      case 'ct':
        // Not yet supported;
        break;
      default:
        throw new Error(`Unsupported colormode: ${json.state.colormode}`);
    }
    if (!json.state.on) {
      rgb = [0, 0, 0];
    }
    const hex = HueColor.fromRgbToHex(rgb);
    const grayscale = HueColor.fromColorToGrayscale(rgb);
    const fontColor = grayscale < 128 ? 'white' : 'black';
    const brightness = json.state.bri / HueColor.MAX_BRIGHTNESS;
    switch (this.props.rendering) {
      case 'card':
        return (
          <div className="col-md-4 col-lg-3">
            <div className="card my-3">
              <div className="card-header">{json.name}</div>
              <ul className="list-group list-group-flush">
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: hex,
                    backgroundImage: `linear-gradient(90deg, ${hex} 0%, ${hex} ${brightness *
                      100}%, black ${brightness * 100}%, black 100%)`,
                    color: fontColor,
                  }}
                >
                  {json.state.on
                    ? `On (${hex.toUpperCase()} @ ${Math.round(
                        brightness * 100,
                      )}%)`
                    : 'Off'}
                </li>
              </ul>
              <div className="card-footer text-muted">
                {`${json.productname} (${json.manufacturername} ${
                  json.modelid
                })`}
              </div>
            </div>
          </div>
        );
      case 'item':
        return (
          <li
            className="list-group-item"
            style={{
              backgroundColor: hex,
              backgroundImage: `linear-gradient(90deg, ${hex} 0%, ${hex} ${brightness *
                100}%, black ${brightness * 100}%, black 100%)`,
              color: fontColor,
            }}
          >
            {json.name}
          </li>
        );
      default:
        return <JsonEditor json={json} />;
    }
  }
}

export default Light;
