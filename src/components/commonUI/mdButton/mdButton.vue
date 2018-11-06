<template>
  <button class="md-button" v-wave="!disabled" :class="[themeClass]" :type="type" :disabled="disabled" @click="$emit('click', $event)" v-if="!href">
    <slot></slot>
  </button>
  <a class="md-button" v-wave="!disabled" :class="[themeClass]" :href="href" :disabled="disabled" :target="target" :rel="newRel" @click="$emit('click', $event)" v-else>
    <slot></slot>
  </a>
</template>
<script>
  import theme from '../../core/components/mdTheme/mixin';
  export default {
    props: {
      href: String,
      target: String,
      rel: String,
      type: {
        type: String,
        default: 'button'
      },
      disabled: Boolean
    },
    mixins: [theme],
    computed: {
      newRel() {
        if (this.target === '_blank') {
          return this.rel || 'noopener';
        }
        return this.rel;
      }
    }
  };
</script>
