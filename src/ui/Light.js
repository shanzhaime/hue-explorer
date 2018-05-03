import HueColor from '../api/HueColor';
import React, { Component } from 'react';

class LightsView extends Component {
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
    return (
      <div className="col-md-4 col-lg-3">
        <div className="card my-3">
          {/*
          <div className="card-header">
          </div>
          */}
          <div className="card-body">
            <h5 className="card-title">
              {json.name}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {`${json.productname} (${json.manufacturername} ${json.modelid})`}
            </h6>
            <div className="input-group">
              <div className="input-group-prepend">
                <button
                  type="button"
                  className={'input-group-text btn btn-light' + (json.state.on ? ' active' : '')}
                >
                  {json.state.on ? 'On' : 'Off'}
                </button>
              </div>
              <input
                type="text"
                value={hex}
                style={{
                  backgroundColor: hex,
                  backgroundImage: `linear-gradient(90deg, ${hex} 0%, ${hex} ${brightness * 100}%, black ${brightness * 100}%, black 100%)`,
                  color: fontColor,
                }}
                className="form-control"
                placeholder="#ffffff"
                aria-label="Light color"
                aria-describedby="btnGroupAddon"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LightsView;
