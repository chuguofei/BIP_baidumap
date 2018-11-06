import axios from 'axios';
import utils from './common';

const defaults = {
    headers: {
        common: {
            //'X-CSRF-TOKEN': '', //window.Laravel.csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            //'Authorization': 'Bearer YXBpOnBhc3N3b3Jk',
        },
        post: {
            'Content-Type': 'application/json'
        }
    }
};

function Http(instanceConfig) {
    this.defaults = instanceConfig;
    this.Cancel = axios.Cancel;
    this.CancelToken = axios.CancelToken;
    this.isCancel = axios.isCancel;
    this.spread = axios.spread;
}
Http.prototype.request = function request(config) {
    if (typeof config === 'string') {
        config = utils.merge({ url: arguments[0] }, arguments[1]);
    }
    config = utils.merge({}, defaults, this.defaults, { method: 'get' }, config);
    if (utils.isAbsoluteURL(config.url) || /^\//g.test(config.url)) {
        config.baseURL = '';
    }
    return axios.request(config);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Http.prototype[method] = function(url, config) {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url
        }));
    };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Http.prototype[method] = function(url, data, config) {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
});

function createInstance(defaultConfig) {
    var instance = new Http(defaultConfig);
    return instance;
}

var instancedefaults = {}
const instance = createInstance(instancedefaults);

instance.create = function create(instanceConfig) {
    return createInstance(instanceConfig);
};

export default instance;
