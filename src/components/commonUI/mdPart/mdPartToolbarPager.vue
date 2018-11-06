<template>
  <md-part-toolbar-group class="md-part-toolbar-pager">
    <md-button :disabled="!options.firstId" @click.native="paging(options.firstId)">首页</md-button>
    <md-button :disabled="!options.prevId" @click.native="paging(options.prevId)">上页</md-button>
    <md-button :disabled="!options.nextId" @click.native="paging(options.nextId)">下页</md-button>
    <md-button :disabled="!options.lastId" @click.native="paging(options.lastId)">末页</md-button>
  </md-part-toolbar-group>
</template>
<script>
  export default {
    props: {
      options:{
        type:Object,
        default(){
          return {
            firstId:'',
            lastId:'',
            prevId:'',
            nextId:'',
          }
        }
      }
    },
    methods: {
      paging(id){
        this.$emit('paging',id);
      }
    },
    mounted() {
    },
  };
</script>
