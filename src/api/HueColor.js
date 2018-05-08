// @flow strict

const MAX_BRIGHTNESS: number = 254;
const MIN_BRIGHTNESS: number = 1;
const RGB_MAX_VALUE: number = 255;

function padStart(string: string, length: number, padding: string): string {
  if (string.length >= length) {
    return string;
  } else {
    const remainingLength = length - string.length;
    return (
      padding
        .repeat(remainingLength / padding.length)
        .slice(0, remainingLength) + string
    );
  }
}

const HueColor = {
  MAX_BRIGHTNESS,
  MIN_BRIGHTNESS,
  RGB_MAX_VALUE,

  fromRgbToHex: function(rgb: [number, number, number]): string {
    const [r, g, b] = rgb;
    return `#${padStart(r.toString(16), 2, '0')}${padStart(
      g.toString(16),
      2,
      '0',
    )}${padStart(b.toString(16), 2, '0')}`;
  },

  fromHexToRgb: function(hex: string): [number, number, number] {
    const matches = hex.match(
      /^#(([0-9a-f])([0-9a-f])([0-9a-f])|([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2}))$/i,
    );
    if (!matches) {
      throw new Error(`Invalid hex code: ${hex}`);
    }
    const [, , r, g, b, rr, gg, bb] = matches;
    if (r && g && b) {
      return [parseInt(r, 16) * 17, parseInt(g, 16) * 17, parseInt(b, 16) * 17];
    } else if (rr && gg && bb) {
      return [parseInt(rr, 16), parseInt(gg, 16), parseInt(bb, 16)];
    } else {
      throw new Error(`Invalid hex code: ${hex}`);
    }
  },

  fromColorToGrayscale: function(rgb: [number, number, number]): number {
    // Formula: http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
    const [r, g, b] = rgb;
    return 0.3 * r + 0.59 * g + 0.11 * b;
  },

  // Algorithms: https://developers.meethue.com/documentation/color-conversions-rgb-xy
  fromXyToRgb: function(
    xy: [number, number],
    brightness: number = MAX_BRIGHTNESS,
  ): [number, number, number] {
    const [x, y] = xy;
    const z = 1 - x - y;

    const Y = brightness / MAX_BRIGHTNESS;
    const X = Y / y * x;
    const Z = Y / y * z;

    let r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    let b = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

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

    r = r <= 0.0031308 ? 12.92 * r : (1 + 0.055) * Math.pow(r, 1 / 2.4) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1 + 0.055) * Math.pow(g, 1 / 2.4) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1 + 0.055) * Math.pow(b, 1 / 2.4) - 0.055;

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
      Math.round(r * RGB_MAX_VALUE) + +0,
      Math.round(g * RGB_MAX_VALUE) + +0,
      Math.round(b * RGB_MAX_VALUE) + +0,
    ];
  },

  // Algorithms: https://developers.meethue.com/documentation/color-conversions-rgb-xy
  fromRgbToXy: function(
    rgb: [number, number, number],
  ): [number, number, number] {
    const [r, g, b] = rgb;

    let red = r / RGB_MAX_VALUE;
    let green = g / RGB_MAX_VALUE;
    let blue = b / RGB_MAX_VALUE;

    red =
      red > 0.04045 ? Math.pow((red + 0.055) / (1 + 0.055), 2.4) : red / 12.92;
    green =
      green > 0.04045
        ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4)
        : green / 12.92;
    blue =
      blue > 0.04045
        ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4)
        : blue / 12.92;

    const X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    const Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    const Z = red * 0.000088 + green * 0.07231 + blue * 0.986039;

    const x = X / (X + Y + Z) || 0; // If (X + Y + Z) = 0 then return 0
    const y = Y / (X + Y + Z) || 0; // If (X + Y + Z) = 0 then return 0

    return [x, y, Y * MAX_BRIGHTNESS];
  },
};

export default HueColor;
