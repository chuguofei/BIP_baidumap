import Vue from 'vue'
import mdBipMsgDialog from './mdBipMsgDialog'

function open (propsData) {
  const DialogComponent = Vue.extend(mdBipMsgDialog);
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