import Vue from 'vue'
import mdBipMapDialog from './mdBipMapDialog'

function open (propsData) {
  const DialogComponent = Vue.extend(mdBipMapDialog);
  return new DialogComponent({
    el: document.createElement('div'),
    propsData
  });
} 
export default {
  open (params) {
    const defaultParam = {}
    const propsData = Object.assign(defaultParam, params)
    return open(propsData)
  }
}