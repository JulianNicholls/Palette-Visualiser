# Palette Visualiser

Displays the five colours in every combination from an Adobe palette created
at the site now called [Adobe Color CC](color.adobe.com), previously Kuler.
In addition, the five colours are shown on Black and White backgrounds and
with Black and White text.

The contrast ratio is displayed, the calculation is on the
[w3.org](http://www.w3.org/TR/WCAG20/#contrast-ratiodef) site.
It is possible to suppress combinations with insufficient contrast, 4.5:1 in
the above spec, 4.4:1 here.

In addition to HSB/V, HSL is now displayed. Fairly obviously, these are the
values which are entered into an hsl() or hsla() CSS colour specification.
See this [Wikipedia page](http://en.wikipedia.org/wiki/HSV_color_space)
for more information about colourspaces.

It is now possible to edit the H, S, and L values directly.

The colours are now stored in localStorage so that the last colours used are
retrieved when the page is loaded.
