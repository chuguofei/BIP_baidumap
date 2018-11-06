import Vue from 'vue';
// import App from './App'
import router from './router';
import lodash from 'lodash';
Vue.prototype._ = lodash;

import Components from './components';
import App from './views/app/myApp';
import VuejsDialog from "vuejs-dialog"
import "babel-polyfill";
import 'font-awesome/css/font-awesome.css';
import './sass/app.scss';
import './js/bip-common-js.js';
import './js/bipcfg.js';
import utils from './js/bip-utils-js';
import bipDateUtil from './js/bip-date-js';
Vue.use(utils)
Vue.use(bipDateUtil)
Vue.config.productionTip = false;
Vue.use(Components)

Vue.use(VuejsDialog);


new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
 