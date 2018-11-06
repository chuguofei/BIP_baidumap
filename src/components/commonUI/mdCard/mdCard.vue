<template>
  <div class="md-card" :class="[themeClass, classes]">
    <slot></slot>
  </div>
</template>
<script>
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    props: {
      mdWithHover: Boolean
    },
    mixins: [theme],
    computed: {
      classes() {
        return {
          'md-with-hover': this.mdWithHover
        };
      }
    }
  };
</script>
