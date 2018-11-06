import mdApp from './mdApp';
// import mdAppContent from './mdAppContent.vue';
// import mdAppFooter from './mdAppFooter.vue';
// import mdAppMenu from './mdAppMenu.vue';
import mdAppToolbar from './mdAppToolbar';

export default function install(Vue) {
    Vue.component('app', mdApp);
    // Vue.component('appContent', mdAppContent);
    // Vue.component('appFooter', mdAppFooter);
    // Vue.component('appMenu', mdAppMenu);
    Vue.component('appToolbar', mdAppToolbar);
}