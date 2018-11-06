<template>
  <div class="layout-fill flex md-part-body" :class="classes">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      direction:{
        type:String,
        default:'column'
      }
    },
    computed: {
      classes() {
        const s={};
        s['layout-'+this.direction]=true;
        return s;
      },
    },
  };
</script>
