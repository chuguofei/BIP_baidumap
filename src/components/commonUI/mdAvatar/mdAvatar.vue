<template>
  <div class="md-avatar" :class="[themeClass]">
    <slot></slot>
  </div>
</template>
<script>
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    mixins: [theme]
  };
</script>
