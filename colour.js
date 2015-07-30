var colours = ['', '#004fb0', '#002d63', '#197ffc', '#634000', '#b07200', '#000000', '#ffffff'];

$(function() {
    for(var i = 1; i <= 5; ++i) {
        $('#input-' + i).val(colours[i]);
    }

    setHSLsFromColours();
    setBlocksFromColours();

    $('.colour-input').blur( function() {
        for(var i = 1; i <= 5; ++i) {
            colours[i] = $('#input-' + i).val();
        }

        setHSLsFromColours();
        setBlocksFromColours()
    });

    $('.colour-block p').click( function() {
        var $this = $(this);

        $('#text-display').css({
            'backgroundColor': $this.css('background-color'),
            'color': $this.css('color')
        });
    });
});

function setHSLsFromColours() {
    for(var i = 1; i <= 5; ++i) {
        var rgb = rgbStrToArray(colours[i])

//        $('#hs-' + i).val('R: ' + rgb[1] + ', G: ' + rgb[2] + ', B: ' + rgb[3]);

        hsv = RGBtoHSV(rgb[0], rgb[1], rgb[2]);

        var rgb_text = 'RGB: ' + rjust(rgb[0], 3) +
                       ', ' + rjust(rgb[1], 3) +
                       ', ' + rjust(rgb[2], 3) +
                       ', Luma: ' + rjust(luma(rgb), 5)

        var hs_text = 'H: ' + rjust(Math.round(hsv[0]), 3)  +
                      ', S: ' + rjust(Math.round(hsv[1]), 3) +
                      ', V: ' + rjust(Math.round(hsv[2]), 3);

        $('#hs-' + i).val(rgb_text + ' :: ' + hs_text);
    }
}

function setBlocksFromColours() {
    for(var bg = 1; bg <= 7; ++bg) {
        for(var fg = 1; fg <= 7; ++fg) {
            var $block = $('#block-' + bg + fg + ' p');

            var rgbB    = rgbStrToArray(colours[bg]),
                rgbF    = rgbStrToArray(colours[fg]),
                lumaB   = luma(rgbB),
                lumaF   = (fg == bg) ? luma([255, 255, 255]) : luma(rgbF),
                lumaD   = Math.round(Math.abs(lumaB - lumaF) * 10) / 10,
                lumaStr = '<br />' + lumaD;

            $block.css('background-color', colours[bg])

            if(fg != bg) {
                $block.css('color', colours[fg]);
            }

            $block.html(colours[bg] + '<br/>' + colours[fg] + lumaStr);
        }
    }
}

function rgbStrToArray(colour) {
    var rgb = colour.match(/#?(..)(..)(..)/);

    for(var i = 0; i < 3; ++i) {
        rgb[i] = parseInt(rgb[i+1], 16);
    }

    return rgb;
}

function rjust(value, width) {
    var str = value.toString();

    while(str.length < width) {
        str = ' ' + str;
    }

    return str;
}

function luma(rgb) {
    var rawl = 0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]
    return Math.round(rawl * 10) / 10
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h as 0 to 360, and s and v as percentage.
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */

function RGBtoHSV(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max * 100;      // V = MAX

    var d = max - min;
    s = (max == 0) ? 0 : (d / max) * 100;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
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

    return [h, s, v];
}


/* These functions are not used, but are retained so that they're all in one place.
 * HSV/B seems to make more sense that HSL.
 */

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */

function RGBtoHSL(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;  // L = Midpoint

    if(max == min) {
        h = s = 0;      // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch(max) {
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

    return [h, s, l];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function HSVtoRGB(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function HSLtoRGB(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

