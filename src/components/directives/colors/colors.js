import colorPalettes from '../../core/components/mdTheme/palette';
import rgba from '../../core/components/mdTheme/rgba';

import common from '../../core/utils/common';


function parseColor(color) {
    var colorValue = colorPalettes[color.palette][color.hue];
    return rgba(colorValue, color.opacity);
}

function interpolateColors(themeColors) {
    var rgbColors = {};
    _.forEach(themeColors, function(value, key) {
        var color = extractColorOptions(value);
        rgbColors[key] = parseColor(color);
    });
    return rgbColors;
}

function extractColorOptions(expression) {
    var parts = expression.split('-');
    return {
        palette: extractPalette(parts),
        hue: extractHue(parts),
        opacity: parts[2] || 1
    };
}

function extractPalette(parts) {
    if (parts[0] === 'primary' && Vue.material && Vue.material.colors && Vue.material.colors.primary) {
        return Vue.material.colors.primary;
    }
    if (parts[0] === 'accent' && Vue.material && Vue.material.colors && Vue.material.colors.accent) {
        return Vue.material.colors.accent;
    }
    if (parts[0] === 'background' && Vue.material && Vue.material.colors && Vue.material.colors.background) {
        return Vue.material.colors.background;
    }
    if (parts[0] === 'warn' && Vue.material && Vue.material.colors && Vue.material.colors.warn) {
        return Vue.material.colors.warn;
    }

    var isTwoWord = parts.length > 1 && common.isDefined(colorPalettes[parts[1]]);
    var palette = parts[0].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    if (isTwoWord) palette = parts[0] + '-' + parts.splice(1, 1);
    return palette;
}

function extractHue(parts) {
    if (parts[1] === 'hue') {
        var hueNumber = parseInt(parts.splice(2, 1)[0], 10);
        parts[1] = 'hue-' + hueNumber;
    }
    return parts[1] || 500;
}


function applyStyle(el, colors) {
    try {
        if (colors) {
            var st = interpolateColors(colors);
            common.style(el, st);
        }
    } catch (e) {
        console.log(e.message);
    }
}
export default {
    bind: function(el, binding) {
        applyStyle(el, binding.value);
    },
    inserted: function(el, binding) {
        applyStyle(el, binding.value);
    },
    update: function(el, binding) {
        applyStyle(el, binding.value);
    },
    componentUpdated: function(el, binding) {
        applyStyle(el, binding.value);
    }
};
