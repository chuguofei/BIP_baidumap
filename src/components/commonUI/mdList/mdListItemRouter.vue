<template>
  <li class="md-list-item" :class="classes" :disabled="disabled" v-wave="!disabled">
    <slot />
  </li>
</template>

<script>
  export default {
    name: 'md-list-item',
    props: {
      disabled: Boolean
    },
    computed: {
      classes() {
        return {
          'md-disabled': this.disabled
        };
      }
    }
  };
</script>
