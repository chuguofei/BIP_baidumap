<template>
<div class="md-tree-node layout-row layout-align-start-center" :class="[classes]" v-wave @click="click">
  <md-checkbox v-model="checkbox" v-if="!!mdSelection" @change="select"></md-checkbox>
  <div class="md-tree-node-name">
    <slot :value="node">{{node.name}}</slot>
  </div>
</div>
</template>
<script>
  import getClosestVueParent from '../../core/utils/getClosestVueParent';
  export default {
    props: {
      node: {
        type:Object,
        default:{}
      },
      mdAutoSelect:Boolean,
      mdSelection:Boolean
    },
    data() {
      return {
        checkbox:false,
        selectedRows:[],
        isActive:false,
        isOpened:false,
      };
    },
    computed: {
      classes() {
        return {
          'is-active':this.isActive,
          'is-opened':this.isOpened
        };
      },
      status(){
        if(!this.node.nodes||this.node.nodes.length==0)return 'leafed';
        return this.isOpened?'opened':'closed';
      }
    },
    methods: {
      toggle(){
        this.isOpened=!this.isOpened;
      },
      click(){
        this.parentContainer&&this.parentContainer.setCurrent(this);
        this.isActive=true;
      },
      outCurrent(){
        this.isActive=false;
      },
      select(selected){
        this.parentContainer&&this.parentContainer.selectItem(this.node,!selected);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.parentContainer = getClosestVueParent(this.$parent, 'md-tree-view');
        if (!this.parentContainer) {
          this.$destroy();
          throw new Error('You should wrap the md-tree in a md-tree-view');
        }
      });
    }
  };
</script>
