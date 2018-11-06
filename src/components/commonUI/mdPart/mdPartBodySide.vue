<template>
  <div class="md-part-side" :class="classes">
    <slot></slot>
    <md-button class="md-fab md-navigation md-primary" @click.native="toggle">
      <md-icon v-if="mdActive">chevron_left</md-icon>
      <md-icon v-else>chevron_right</md-icon>
    </md-button>
  </div>
</template>
<script>
  export default {
    props: {
    },
    data() {
      return {
        mdActive: true
      };
    },
    computed: {
      classes() {
        const s={};
        s['md-active']=this.mdActive;
        return s;
      },
    },
    methods: {
      toggle(){
        this.mdActive=!this.mdActive;
      }
    },
  };
</script>
