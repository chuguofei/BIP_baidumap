import mdMobileBillInfo from './mobileBillInfo.vue'
import mdMobileBillList from './mobileBillList.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-mobile-bill-info', mdMobileBillInfo);
  Vue.component('md-mobile-bill-list', mdMobileBillList);
}
