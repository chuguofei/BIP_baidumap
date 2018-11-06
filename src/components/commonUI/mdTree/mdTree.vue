<template>
  <ul>
    <li v-for="(node,index) in nodes" :key="index" >
      <md-tree-node :node="node" :md-selection="mdSelection" :md-auto-select="mdAutoSelect">
        <slot :value="node"></slot>
      </md-tree-node>
      <md-tree v-if="node.childs&&node.childs.length" :nodes="node.childs" :md-selection="mdSelection" :md-auto-select="mdAutoSelect"></md-tree>
    </li>
  </ul>
</template>
<script>
  export default {
    props: {
      nodes: {
        type:Array,
        default:[]
      },
      mdAutoSelect:Boolean,
      mdSelection:Boolean
    },
    methods: {
    },
    beforeCreate: function () {
      this.$options.components.mdTree = require('./mdTree.vue');
    }
  };
</script>
