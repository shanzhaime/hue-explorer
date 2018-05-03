import HueColor from '../HueColor';

it('converts xy color to rgb color', () => {
  expect(HueColor.fromXyToRgb([0.32272672086556803, 0.32902290955907926], 253.99974600000002)).toEqual([255, 255, 255]);
  expect(HueColor.fromXyToRgb([0.32272672086556803, 0.3290229095590793], 53.90655847655765)).toEqual([127, 127, 127]);
  expect(HueColor.fromXyToRgb([0.7006062331309042, 0.2993009868421053], 72.105774)).toEqual([255, 0, 0]);
  expect(HueColor.fromXyToRgb([0.1724161431490603, 0.7467966085220437], 169.78198200000003)).toEqual([0, 255, 0]);
  expect(HueColor.fromXyToRgb([0.13550301400290363, 0.03987867049354716], 12.111989999999999)).toEqual([0, 0, 255]);
});

it('converts rgb color to xy color', () => {
  expect(HueColor.fromRgbToXy([255, 255, 255])).toEqual([0.32272672086556803, 0.32902290955907926, 253.99974600000002]);
  expect(HueColor.fromRgbToXy([0, 0, 0])).toEqual([0, 0, 0]);
  expect(HueColor.fromRgbToXy([127, 127, 127])).toEqual([0.32272672086556803, 0.3290229095590793, 53.90655847655765]);
  expect(HueColor.fromRgbToXy([255, 0, 0])).toEqual([0.7006062331309042, 0.2993009868421053, 72.105774]);
  expect(HueColor.fromRgbToXy([0, 255, 0])).toEqual([0.1724161431490603, 0.7467966085220437, 169.78198200000003]);
  expect(HueColor.fromRgbToXy([0, 0, 255])).toEqual([0.13550301400290363, 0.03987867049354716, 12.111989999999999]);
});

it('converts rgb color to hex code', () => {
  expect(HueColor.fromRgbToHex([255, 255, 255])).toBe('#ffffff');
  expect(HueColor.fromRgbToHex([0, 0, 0])).toBe('#000000');
  expect(HueColor.fromRgbToHex([127, 127, 127])).toBe('#7f7f7f');
  expect(HueColor.fromRgbToHex([255, 0, 0])).toBe('#ff0000');
  expect(HueColor.fromRgbToHex([0, 255, 0])).toBe('#00ff00');
  expect(HueColor.fromRgbToHex([0, 0, 255])).toBe('#0000ff');
});

it('converts hex code to rgb color', () => {
  expect(HueColor.fromHexToRgb('#ffffff')).toEqual([255, 255, 255]);
  expect(HueColor.fromHexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
  expect(HueColor.fromHexToRgb('#fff')).toEqual([255, 255, 255]);
  expect(HueColor.fromHexToRgb('#FFF')).toEqual([255, 255, 255]);
  expect(HueColor.fromHexToRgb('#7f7f7f')).toEqual([127, 127, 127]);
  expect(HueColor.fromHexToRgb('#000000')).toEqual([0, 0, 0]);
  expect(HueColor.fromHexToRgb('#000')).toEqual([0, 0, 0]);
  expect(HueColor.fromHexToRgb('#ff0000')).toEqual([255, 0, 0]);
  expect(HueColor.fromHexToRgb('#f00')).toEqual([255, 0, 0]);
  expect(HueColor.fromHexToRgb('#00ff00')).toEqual([0, 255, 0]);
  expect(HueColor.fromHexToRgb('#0f0')).toEqual([0, 255, 0]);
  expect(HueColor.fromHexToRgb('#0000ff')).toEqual([0, 0, 255]);
  expect(HueColor.fromHexToRgb('#00f')).toEqual([0, 0, 255]);
});

it('converts rgb color to grayscale', () => {
  expect(HueColor.fromColorToGrayscale([255, 255, 255])).toBe(255);
  expect(HueColor.fromColorToGrayscale([0, 0, 0])).toBe(0);
  expect(HueColor.fromColorToGrayscale([127, 127, 127])).toBe(127);
  expect(HueColor.fromColorToGrayscale([255, 0, 0])).toBe(76.5);
  expect(HueColor.fromColorToGrayscale([0, 255, 0])).toBe(150.45);
  expect(HueColor.fromColorToGrayscale([0, 0, 255])).toBe(28.05);
});
