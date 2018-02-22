let colours = [
  '',
  '#2020b0',
  '#6820b0',
  '#b020b0',
  '#b02068',
  '#b02020',
  '#000000',
  '#ffffff'
];

const CONST = {
  ratio_threshold: 4.4 // Officially, it's 4.5:1
};

for (let i = 1; i <= 5; ++i) {
  const inp = document.getElementById(`input-${i}`);

  if (inp.textContent == '') {
    inp.value = colours[i];
  }
}

setTableFromColours();
setBlocksFromColours();

document.querySelectorAll('.colour-input').forEach(inp =>
  inp.addEventListener('blur', () => {
    for (let i = 1; i <= 5; ++i) {
      colours[i] = document.querySelector(`#input-${i}`).value;
    }

    setTableFromColours();
    setBlocksFromColours();
  })
);

document.getElementById('suppress').addEventListener('change', setBlocksFromColours);

document
  .querySelectorAll('.colour-block p')
  .forEach(para => para.addEventListener('click', colourTextDisplay));

function colourTextDisplay(event) {
  const td = document.getElementById('text-display');

  td.style.backgroundColor = event.target.style.backgroundColor;
  td.style.color = event.target.style.color;
}

function setTableFromColours() {
  for (let i = 1; i <= 5; ++i) {
    const rgb = rgbStrToArray(colours[i]);
    const hsv = RGBtoHSV(rgb[0], rgb[1], rgb[2]);
    const hsl = HSVtoHSL(hsv[0], hsv[1], hsv[2]);
    const row = document.querySelector(`tr#line-${i}`);

    row.querySelector('td.r').textContent = rgb[0];
    row.querySelector('td.g').textContent = rgb[1];
    row.querySelector('td.b').textContent = rgb[2];

    row.querySelector('td.luma').textContent = sRGBLuminance(rgb).toFixed(3);

    row.querySelector('td.h').innerHTML = hsv[0] + '&deg;';
    row.querySelector('td.s').textContent = hsv[1] + '%';
    row.querySelector('td.v').textContent = hsv[2] + '%';
    row.querySelector('td.sls').textContent = hsl[1] + '%';
    row.querySelector('td.sll').textContent = hsl[2] + '%';
  }
}

function setBlocksFromColours() {
  const suppress = document.querySelector('input:checked');

  for (let bg = 1; bg <= 7; ++bg) {
    for (let fg = 1; fg <= 7; ++fg) {
      const block = document.querySelector(`#block-${bg}${fg} p`);

      const rgbB = rgbStrToArray(colours[bg]);
      const rgbF = rgbStrToArray(colours[fg]);
      const lumaD = contrastRatio(rgbB, rgbF);
      const lumaStr = `<br />${lumaD}:1`;

      if ((suppress && lumaD < CONST.ratio_threshold) || fg === bg) {
        block.style.backgroundColor = '#888';
        block.style.color = '#888';
      } else {
        if (colours[bg][0] !== '#') colours[bg] = `#${colours[bg]}`;

        block.style.backgroundColor = colours[bg];

        if (fg !== bg) {
          if (colours[fg][0] !== '#') colours[fg] = `#${colours[fg]}`;

          block.style.color = colours[fg];
        }

        block.innerHTML = `${colours[bg]}<br/>${colours[fg]}${lumaStr}`;
      }
    }
  }
}

function rgbStrToArray(colour) {
  const rgb = colour.match(/#?(..)(..)(..)/);

  for (let i = 0; i < 3; ++i) {
    rgb[i] = parseInt(rgb[i + 1], 16);
  }

  return rgb;
}

// Relative luminance = (Lighter + 0.05) / (Darker + 0.05)

function contrastRatio(rgbA, rgbB) {
  const a = sRGBLuminance(rgbA) + 0.05;
  const b = sRGBLuminance(rgbB) + 0.05;

  if (a > b) return (a / b).toFixed(2);

  return (b / a).toFixed(2);
}

// The relative brightness of any point in a colourspace, normalised to 0 for
// darkest black and 1 for lightest white.

// Note 1: For the sRGB colourspace, the relative luminance of a colour is defined as
//   L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:

// if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
// if GsRGB <= 0.03928 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
// if BsRGB <= 0.03928 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4
// and RsRGB, GsRGB, and BsRGB are defined as:

// RsRGB = R8bit / 255
// GsRGB = G8bit / 255
// BsRGB = B8bit / 255

function sRGBLuminance(rgb) {
  const r = mapColour(rgb[0] / 255);
  const g = mapColour(rgb[1] / 255);
  const b = mapColour(rgb[2] / 255);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mapColour(value) {
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

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
