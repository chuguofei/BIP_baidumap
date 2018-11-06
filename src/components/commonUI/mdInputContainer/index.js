import mdInputContainer from './mdInputContainer.vue';
import mdInput from './mdInput.vue';
import mdTextarea from './mdTextarea.vue';

import mdInputRef from './mdInputRef.vue';
import mdInputVue from './mdInputVue.vue';

import mdInputContainerTheme from './mdInputContainer.theme';

import mdDate from './mdDate.vue';

export default function install(Vue) {
  Vue.component('md-input-container', mdInputContainer);
  Vue.component('md-input', mdInput);
  Vue.component('md-textarea', mdTextarea);
  Vue.component('md-input-ref', mdInputRef);
  Vue.component('md-input-value', mdInputVue);

   Vue.component('md-date', mdDate);
  Vue.material.styles.push(mdInputContainerTheme);

}
