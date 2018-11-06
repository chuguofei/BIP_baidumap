// const _ = require('lodash');
const isArray = _.isArray;
const bind = _.bind;
const spread = _.spread;
const merge = _.merge;
const extend = _.extend;
const forEach = _.forEach;
const isString = _.isString;
const isNumber = _.isNumber;
const isUndefined = _.isUndefined;
const isObject = _.isObject;
const isDate = _.isDate;
const debounce = _.debounce;

import moment from 'moment';

function isFile(val) {
    return toString.call(val) === '[object File]';
}

function isBlob(val) {
    return toString.call(val) === '[object Blob]';
}

function isFunction(val) {
    return toString.call(val) === '[object Function]';
}

function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
}

function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};
const uniqueId = () => {
    return Math.random().toString(36).slice(4);
};

const supplant = function(str, o) {
    return str.replace(/\{([^{}]*)\}/g, function(a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
    })
}
const isDefined = function(value) {
    return typeof value !== 'undefined';
}
const css = function(element, name, value) {
    if (isDefined(value)) {
        element.style[name] = value;
    } else {
        return element.style[name];
    }
}
const style = function(el, st) {
        _.forEach(st, function(value, key) {
            css(el, key, value);
        });
    }
    //驼峰命名法
const snakeCase = function(name, separator) {
    var regexp = /[A-Z.]/g;
    separator = separator || '-';
    name = name.replace(regexp, function(letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
    return name.replace(/\./g, '');
};
const now=function(format){
    format=format||'YYYY-MM-DD HH:mm:ss';
    return moment().format(format);
}
const getDate = function(value,format){
    format=format||'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(format);
}
function fTime(time) {
    if (!time) return '未知..';
    //获取time距离当前的秒 
    var ct =0,tu=(new Date()).getTime()/1000,fu=tu;
    if(isNumber(time)){
     fu= time;
    }
    else if(isString(time)){
     fu= (new Date(time.replace(/-/g, '/'))).getTime()/1000;
    }
    ct=parseInt(tu-fu);
    var lb = "前";
    if (ct < 0) {
        lb = "后";
        ct = Math.abs(ct);
    }
    if (ct == 0) {
        return "刚刚";
    }
    if (ct > 0 && ct < 60) {
        return ct + "秒" + lb;
    }
    if (ct >= 60 && ct < 3600) {
        return parseInt(ct / 60) + "分钟" + lb;
    }
    if (ct >= 3600 && ct < 86400)
        return parseInt(ct / 3600) + "小时" + lb;
    if (ct >= 86400 && ct < 2592000) { //86400 * 30  
        return parseInt(ct / 86400) + "天" + lb;
    }
    if (ct >= 2592000 && ct < 31104000) { //86400 * 30  
        return parseInt(ct / 2592000) + "月" + lb;
    }
    return parseInt(ct / 31104000) + "年" + lb;
}
const formatDecimal = function(num, options) {
    //precision:精度，保留的小数位数
    //unit:单位，0个，1十，2百，3千
    //quantile:分位数，默认3，表示千分位
    options = extend({}, { precision: 2, unit: 0, quantile: 3 }, options);

    num = parseFloat(num);
    if (options.unit) {
        num = num / Math.pow(10, options.unit);
    }
    var vv = Math.pow(10, options.precision);
    num = Math.round(num * vv) / vv;

    const groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec('' + num);
    // 获取符号(正/负数)
    const sign = groups[1];
    //整数部分
    const integers = (groups[2] || "").split("");
    // 求出小数位数值
    var cents = groups[3] || ".0";
    while (cents.length <= options.precision) {
        cents = cents + '0';
    }
    cents = options.precision ? cents.substring(0, options.precision + 1) : '';
    var temp = integers.join('');
    if (options.quantile > 0) {
        var remain = integers.length % options.quantile;
        temp = integers.reduce(function(previousValue, currentValue, index) {
            if (index + 1 === remain || (index + 1 - remain) % options.quantile === 0) {
                return previousValue + currentValue + ",";
            } else {
                return previousValue + currentValue;
            }
        }, "").replace(/\,$/g, "");
    }

    const rtn = sign + temp + cents;
    if (options.quantile < 1) {
        return parseFloat(rtn);
    }
    return rtn;
};

const common = {
    isArray,
    uniqueId,
    debounce,
    supplant,
    isDefined,
    isAbsoluteURL,
    combineURLs,
    css,
    style,
    snakeCase,
    formatDecimal,
    merge: merge,
    forEach: forEach,
    isString,
    isNumber,
    isObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    extend,
    trim,
    spread,
    fTime,
    now,
    uid:uniqueId,
    getDate
};
export default common;
