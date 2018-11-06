import mdBipTaskApplet from './billTaskApp.vue';
import mdBipBillTaskApplet from './billInfoTaskApplet.vue';
import mdBipMobileTaskApplet from './mobileBillTaskInfo.vue';
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-task-applet', mdBipTaskApplet);
  Vue.component('md-bip-bill-task-applet', mdBipBillTaskApplet);
  Vue.component('md-bip-mobile-task-applet', mdBipMobileTaskApplet);
}
