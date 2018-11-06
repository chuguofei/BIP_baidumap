<template>
  <div class="md-part-toolbar-crumb" :class="classes"><slot></slot></div>
</template>
<script>
  export default {
    props: {
      mdUri:{
        type:String
      }
    },
    computed: {
      classes() {
        const s={};
        if(this.mdUri){
          s['md-uri']=true;
        }
        return s;
      },
    },
    methods: {
      goNav(item){

      },
    },
    mounted() {
    },
  };
</script>
