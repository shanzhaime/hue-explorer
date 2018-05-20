import JsonEditor from './json/JsonEditor';
import HueColor from '../api/HueColor';
import React, { Component } from 'react';
import './Light.css';

class Light extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showJson: false,
    };
  }

  onJsonToggleClick(showJson) {
    this.setState({
      showJson,
    });
  }

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
        const cardBody = this.state.showJson ? (
          <div className="card-body">
            <JsonEditor json={json} />
          </div>
        ) : (
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
                ? `On (${hex.toUpperCase()} @ ${Math.round(brightness * 100)}%)`
                : 'Off'}
            </li>
          </ul>
        );
        return (
          <div className="card">
            <h5 className="card-header">
              {json.name}
              <button
                type="button"
                className={
                  'btn btn-secondary float-right px-2 py-0' +
                  (this.state.showJson ? ' active' : '')
                }
                data-toggle="button"
                aria-pressed="false"
                autoComplete="off"
                onClick={this.onJsonToggleClick.bind(
                  this,
                  !this.state.showJson,
                )}
              >
                <small>JSON</small>
              </button>
            </h5>
            {cardBody}
            <div className="card-footer text-muted">
              {`${json.productname} (${json.manufacturername} ${json.modelid})`}
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
      case 'circle':
        return (
          <div className="light" style={this.props.locations}>
            <div className="lightSquare">
              <div
                className="lightCircle"
                style={{
                  backgroundColor: hex,
                  backgroundImage: `radial-gradient(circle, ${hex} 0%, ${hex} ${brightness *
                    100}%, black ${brightness * 100}%, ${hex} 100%)`,
                  color: fontColor,
                }}
              />
            </div>
          </div>
        );
      default:
        throw new Error(`Unsupported rendering: ${this.props.rendering}`);
    }
  }
}

export default Light;
