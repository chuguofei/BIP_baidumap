<template>
  <li class="md-subheader" :class="[themeClass]" v-if="$parent.$options._componentTag === 'md-list'">
    <slot></slot>
  </li>

  <div class="md-subheader" :class="[themeClass]" v-else>
   <span><slot></slot></span>
  </div>
</template>

<script>
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    mixins: [theme]
  };
</script>
