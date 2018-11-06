<template>
  <div class="md-bottom-bar" :class="[themeClass, classes]">
    <slot></slot>
  </div>
</template>

<script>
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    props: {
      mdShift: Boolean
    },
    mixins: [theme],
    computed: {
      classes() {
        return this.mdShift ? 'md-shift' : 'md-fixed';
      }
    },
    methods: {
      setActive(item) {
        this.$children.forEach((child) => {
          child.active = child === item;
        });
        this.$emit('change', this._.findIndex(this.$children,(i) => i === item));
      }
    }
  };
</script>
