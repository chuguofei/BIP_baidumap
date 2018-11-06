import mdBipApplet from './baseApplet.vue';
import mdBipBillApplet from './billInfoApplet.vue';
import mdBipBillListApplet from './billListApplet.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-bill-applet', mdBipBillApplet);
  Vue.component('md-bip-bill-list-applet', mdBipBillListApplet);
  Vue.component('md-bip-applet', mdBipApplet);
}
