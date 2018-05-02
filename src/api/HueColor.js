export const MAX_BRIGHTNESS = 254;
export const MIN_BRIGHTNESS = 1;

const HueColor = {
  fromRgbToHex: function(rgb) {
    const [r, g, b] = rgb;
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  fromHexToRgb: function(hex) {
    throw new Error('Not implemented');
  },

  fromColorToGrayscale: function(rgb) {
    // Formula: http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
    const [r, g, b] = rgb;
    return 0.3 * r + 0.59 * g + 0.11 * b;
  },

  // Algorithms: https://developers.meethue.com/documentation/color-conversions-rgb-xy
  fromXyToRgb: function(xy, brightness = MAX_BRIGHTNESS) {
    const [x, y] = xy;
    const z = 1 - x - y;

    const Y = brightness / MAX_BRIGHTNESS;
    const X = (Y / y) * x;
    const Z = (Y / y) * z;

    let r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    let b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

    if (r >= g && r >= b && r > 1) {
      g = g / r;
      b = b / r;
      r = 1;
    } else if (g >= r && g >= b && g > 1) {
      r = r / g;
      b = b / g;
      g = 1;
    } else if (b >= r && b >= g && b > 1) {
      r = r / b;
      g = g / b;
      b = 1;
    }

    r = r <= 0.0031308 ? 12.92 * r : (1 + 0.055) * Math.pow(r, (1 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1 + 0.055) * Math.pow(g, (1 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1 + 0.055) * Math.pow(b, (1 / 2.4)) - 0.055;

    if (r >= g && r >= b && r > 1) {
      g = g / r;
      b = b / r;
      r = 1;
    } else if (g >= r && g >= b && g > 1) {
      r = r / g;
      b = b / g;
      g = 1;
    } else if (b >= r && b >= g && b > 1) {
      r = r / b;
      g = g / b;
      b = 1;
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
    ];
  },

  // Algorithms: https://developers.meethue.com/documentation/color-conversions-rgb-xy
  fromRgbToXy: function(rgb) {
    throw new Error('Not implemented');
  },
};

export default HueColor;
