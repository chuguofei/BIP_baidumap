import mdGrid from './mdGrid.vue';
import mdGridColumn from './mdGridColumn.vue';
import mdPagination from './mdPagination.vue';

// import mdGridTest from './mdGridTest.vue';

export default function install(Vue) {
  Vue.component('md-grid', mdGrid);
  Vue.component('md-grid-column', mdGridColumn);
  Vue.component('md-pagination', mdPagination);

  // Vue.component('md-grid-test', mdGridTest);
}