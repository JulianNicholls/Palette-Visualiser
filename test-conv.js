/**
 * Converts an RGB colour value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 *
 * @param   Number  r       The red colour value    0..255
 * @param   Number  g       The green colour value  0..255
 * @param   Number  b       The blue colour value   0..255
 * @return  Array           The HSV representation  [0..360, 0..100%, 0..100%]
 */

function RGBtoHSV(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max * 100; // V = MAX
  const d = max - min;
  const s = max == 0 ? 0 : d / max * 100;

  let h = 0;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return [Math.round(h), Math.round(s), Math.round(v)];
}

/**
 * Converts an HSV colour value to HSL. Conversion formula
 * adapted from Bob's answer on
 * https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
 *
 * @param   Number  h       Hue                 0..360
 * @param   Number  s       Saturation          0..100%
 * @param   Number  v       Value / Brightness  0..100%
 * @return  Array           The HSL representation [0..360, 0..100%, 0..100%]
 */

function HSVtoHSL(h, s, v) {
  s /= 100;
  v /= 100;

  const l = (2 - s) * v / 2; // l -> 0..1

  if (l != 0) {
    if (l == 1) {
      s = 0;
    } else if (l < 0.5) {
      s = s * v / (l * 2);
    } else {
      s = s * v / (2 - l * 2);
    }
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Converts an HSL colour value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 *
 * @param   Number  h       Hue         0..360
 * @param   Number  s       Saturation  0..100%
 * @param   Number  l       Luminance   0..100%
 * @return  Array           The RGB representation [0..255, 0..255, 0..255]
 */

function HSLtoRGB(h, s, l) {
  s /= 100; // % -> 0..1
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60.0;
  const x = c * (1 - Math.abs(hp % 2 - 1));
  const m = l - c / 2;

  let r, g, b;

  if (hp >= 0 && hp <= 1) {
    [r, g, b] = [c, x, 0];
  } else if (hp >= 1 && hp <= 2) {
    [r, g, b] = [x, c, 0];
  } else if (hp >= 2 && hp <= 3) {
    [r, g, b] = [0, c, x];
  } else if (hp >= 3 && hp <= 4) {
    [r, g, b] = [0, x, c];
  } else if (hp >= 4 && hp <= 5) {
    [r, g, b] = [x, 0, c];
  } else if (hp >= 5 && hp <= 6) {
    [r, g, b] = [c, 0, x];
  } else {
    [r, g, b] = [0.9, 0.9, 0.9];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

let rgbi = [105, 32, 177];

if (process.argv[2]) {
  rgbi = [
    parseInt(process.argv[2]),
    parseInt(process.argv[3]),
    parseInt(process.argv[4])
  ];
}

const hsv = RGBtoHSV(rgbi[0], rgbi[1], rgbi[2]);
const hsl = HSVtoHSL(hsv[0], hsv[1], hsv[2]);
const rgbo = HSLtoRGB(hsl[0], hsl[1], hsl[2]);

console.log('RGB in:   ', rgbi[0], rgbi[1], rgbi[2]);
console.log('HSV / HSL:', hsv[0], hsv[1], hsv[2], '|', hsl[0], hsl[1], hsl[2]);
console.log('RGB out:  ', rgbo[0], rgbo[1], rgbo[2]);
