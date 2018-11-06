<template>
  <li class="md-list-item" :class="classes" v-wave="!disabled">
    <a class="md-list-item-container md-button" :href="href" :target="target" :disabled="disabled">
      <slot />
    </a>
  </li>
</template>

<script>
  export default {
    name: 'md-list-item',
    props: {
      href: String,
      target: String,
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
