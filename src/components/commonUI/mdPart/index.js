import mdPart from './mdPart.vue';
import mdPartBody from './mdPartBody.vue';
import mdPartBodySide from './mdPartBodySide.vue';


import mdPartToolbar from './mdPartToolbar.vue';
import mdPartToolbarCrumbs from './mdPartToolbarCrumbs.vue';
import mdPartToolbarCrumb from './mdPartToolbarCrumb.vue';
import mdPartToolbarGroup from './mdPartToolbarGroup.vue';
import mdPartToolbarPager from './mdPartToolbarPager.vue';

export default function install(Vue) {
    Vue.component('mdPart', mdPart);
    Vue.component('mdPartBody', mdPartBody);
    Vue.component('mdPartBodySide', mdPartBodySide);
    Vue.component('mdPartToolbar', mdPartToolbar);
    Vue.component('mdPartToolbarCrumbs', mdPartToolbarCrumbs);
    Vue.component('mdPartToolbarCrumb', mdPartToolbarCrumb);
    Vue.component('mdPartToolbarGroup', mdPartToolbarGroup);
    Vue.component('mdPartToolbarPager', mdPartToolbarPager);
}
