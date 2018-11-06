
import mdTree from './mdTree.vue';
import mdTreeNode from './mdTreeNode.vue';
import mdTreeView from './mdTreeView.vue';

export default function install(Vue) {
  Vue.component('mdTree', mdTree);
  Vue.component('mdTreeNode', mdTreeNode);
  Vue.component('mdTreeView', mdTreeView);
}
