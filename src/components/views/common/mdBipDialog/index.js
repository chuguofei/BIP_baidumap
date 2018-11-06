import Vue from 'vue'
import Dialog from './mdBipDialog'

// export default function install(Vue) {
//   if (install.installed) {
//     console.warn('Vue core is already installed.');
//     return;
//   }
//   Vue.component('bip-dialog',mdBipDialog);
  
// }

function open (propsData) {
  const DialogComponent = Vue.extend(Dialog);
  return new DialogComponent({
    el: document.createElement('div'),
    propsData
  });
} 
export default {
  open (params) {
    // console.log(params)
    const defaultParam = {}
    const propsData = Object.assign(defaultParam, params)
    return open(propsData)
  }
}