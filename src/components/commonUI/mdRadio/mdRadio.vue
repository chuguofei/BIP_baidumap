<template>
  <div class="md-radio" :class="[themeClass, classes]">
    <div class="md-radio-container" @click="toggleCheck" v-wave="!disabled">
      <input type="radio" :name="name" :id="id" :disabled="disabled" :value="value">
    </div>

    <label :for="id || name" class="md-radio-label" v-if="$slots.default">
      <slot></slot>
    </label>
  </div>
</template>

<script>
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    props: {
      name: String,
      id: String,
      value: [String, Boolean, Number],
      mdValue: {
        type: [String, Boolean, Number],
        required: true
      },
      disabled: Boolean
    },
    mixins: [theme],
    computed: {
      classes() {
        return {
          'md-checked': typeof this.value !== 'undefined' && this.mdValue.toString() === this.value.toString(),
          'md-disabled': this.disabled
        };
      }
    },
    methods: {
      toggleCheck($event) {
        if (!this.disabled) {
          this.$emit('change', this.mdValue, $event);
          this.$emit('input', this.mdValue, $event);
        }
      }
    }
  };
</script>
