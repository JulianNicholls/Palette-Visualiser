var colours = ['', '#004fb0', '#002d63', '#197ffc', '#634000', '#b07200', '#000000', '#ffffff'];

var CONST = {
    ratio_threshold: 4.4,     // Officially it's actually 4.5:1
};

$(function () {
    for(var i = 1; i <= 5; ++i) {
        var $input = $('#input-' + i);

        if($input.val() == '')
            $input.val(colours[i]);
    }

    setTableFromColours();
    setBlocksFromColours();

    $('.colour-input').on('blur', function () {
        for(var i = 1; i <= 5; ++i) {
            colours[i] = $('#input-' + i).val();
        }

        setTableFromColours();
        setBlocksFromColours()
    });

    $('#suppress').on('change', function () {
        setBlocksFromColours();
    });

    $('.colour-block p').on('click', function () {
        var $this = $(this);

        $('#text-display').css({
            'backgroundColor': $this.css('background-color'),
            'color': $this.css('color')
        });
    });
});

function setTableFromColours() {
    for(var i = 1; i <= 5; ++i) {
        var rgb     = rgbStrToArray(colours[i]),
            hsv     = RGBtoHSV(rgb[0], rgb[1], rgb[2]),
            $row    = $('tr#line-' + i);

        $row.find("td.r").text(rgb[0]);
        $row.find("td.g").text(rgb[1]);
        $row.find("td.b").text(rgb[2]);

        $row.find("td.luma").text(sRGBLuminance(rgb).toFixed(4));

        $row.find("td.h").text(Math.round(hsv[0]));
        $row.find("td.s").text(Math.round(hsv[1]));
        $row.find("td.v").text(Math.round(hsv[2]));
    }
}

function setBlocksFromColours() {
    for(var bg = 1; bg <= 7; ++bg) {
        for(var fg = 1; fg <= 7; ++fg) {
            var $block = $('#block-' + bg + fg + ' p');

            var rgbB     = rgbStrToArray(colours[bg]),
                rgbF     = rgbStrToArray(colours[fg]),
                lumaD    = contrastRatio(rgbB, rgbF),
                suppress = $('input:checked').length === 1,
                lumaStr  = '<br />' + lumaD + ':1';

            if((suppress && lumaD < CONST.ratio_threshold) || fg == bg) {
                $block.css({
                  'background-color': '#888',
                  'color': '#888'}
                );
            }
            else {
                var bgStr = colours[bg][0] == '#' ? colours[bg] : '#' + colours[bg];
                $block.css('background-color', bgStr)

                if(fg != bg) {
                    var fgStr = colours[fg][0] == '#' ? colours[fg] : '#' + colours[fg];
                    $block.css('color', fgStr);
                }

                $block.html(colours[bg] + '<br/>' + colours[fg] + lumaStr);
            }
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

// The relative brightness of any point in a colorspace, normalized to 0 for
// darkest black and 1 for lightest white.

// Note 1: For the sRGB colorspace, the relative luminance of a color is defined as
//   L = 0.2126 * R + 0.7152 * G + 0.0722 * B where R, G and B are defined as:

// if RsRGB <= 0.03928 then R = RsRGB/12.92 else R = ((RsRGB+0.055)/1.055) ^ 2.4
// if GsRGB <= 0.03928 then G = GsRGB/12.92 else G = ((GsRGB+0.055)/1.055) ^ 2.4
// if BsRGB <= 0.03928 then B = BsRGB/12.92 else B = ((BsRGB+0.055)/1.055) ^ 2.4
// and RsRGB, GsRGB, and BsRGB are defined as:

// RsRGB = R8bit/255
// GsRGB = G8bit/255
// BsRGB = B8bit/255

function sRGBLuminance(rgb) {
    var rsrgb = rgb[0] / 255,
        gsrgb = rgb[1] / 255,
        bsrgb = rgb[2] / 255

    var r = (rsrgb <= 0.03928) ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4),
        g = (gsrgb <= 0.03928) ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4),
        b = (bsrgb <= 0.03928) ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4)

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Relative luminance = (Lighter + 0.05) / (Darker + 0.05)

function contrastRatio(rgbA, rgbB) {
    var a = sRGBLuminance(rgbA) + 0.05,
        b = sRGBLuminance(rgbB) + 0.05;

    if(a > b)
        return (a / b).toFixed(2)

    return (b / a).toFixed(2)
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

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        v   = max * 100,      // V = MAX
        d   = max - min,
        s   = (max == 0) ? 0 : (d / max) * 100,
        h;

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
