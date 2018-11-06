import mdBipBi from './mdBipBi.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-bi', mdBipBi);
}
