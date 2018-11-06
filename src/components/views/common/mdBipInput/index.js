import mdBipInputComm from './mdBipInputComm'
import mdBipInputDate from './mdBipInputDate'
import mdBipInputFile from './mdBipInputFile'
import mdBipInputList from './mdBipInputList'
import mdBipInput from './mdBipInput.vue';
import mdBipInputRef from './mdBipInputRef.vue';
import mdBipDia from './mdBipDia.vue';
import mdBipInputEntity from './mdBipInputEntity'
// import mdBipInputFileTmp from './mdBipInputFileTmp'
import mdBipInputFileTmp from './mdBipInputFileUp'
export default function install(Vue) {
  if (install.installed) {
    console.warn('Vue core is already installed.');
    return;
  }
  Vue.component('md-bip-input-comm',mdBipInputComm);
  Vue.component('md-bip-input-date',mdBipInputDate);
  Vue.component('md-bip-input-file',mdBipInputFile);
  Vue.component('md-bip-input-list',mdBipInputList);
  Vue.component('md-bip-dia', mdBipDia);
  Vue.component('md-bip-input-ref', mdBipInputRef);
  Vue.component('md-bip-input', mdBipInput);
  Vue.component('md-bip-input-entity',mdBipInputEntity);
  Vue.component('md-bip-input-file-tmp',mdBipInputFileTmp);

}
