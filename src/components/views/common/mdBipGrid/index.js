import mdBipGrid from './mdBipGrid.vue';
import mdBipGridColumn from './mdBipGridColumn.vue';
import mdBipPagination from './mdBipPagination.vue';

// import mdGridTest from './mdGridTest.vue';

export default function install(Vue) {
  Vue.component('md-bip-grid', mdBipGrid);
  Vue.component('md-bip-grid-column', mdBipGridColumn);
  Vue.component('md-bip-pagination', mdBipPagination);

  // Vue.component('md-grid-test', mdGridTest);
}