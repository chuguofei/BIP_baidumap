<template>
  <div class="md-checkbox" :class="[themeClass, classes]">
    <div class="md-checkbox-container" @click.stop="toggleCheck" tabindex="0">
      <input type="checkbox" :name="name" :id="id" :disabled="disabled" :value="value" :checked="checked" tabindex="-1">
    </div>
    <label :for="id || name" class="md-checkbox-label" v-if="$slots.default">
      <slot></slot>
    </label>
  </div>
</template>
<script>
import theme from "../../core/components/mdTheme/mixin";

export default {
  props: {
    name: String,
    value: [String, Boolean, Number, Array],
    id: String,
    disabled: Boolean,
    mdValue: [String]
  },
  mixins: [theme],
  data() {
    return {
      checked: this.value
    };
  },
  computed: {
    classes() {
      return {
        "md-checked": this.checked,
        "md-disabled": this.disabled
      };
    }
  },
  watch: {
    value() {
      this.checked = this.value ? 1 : 0;
    }
  },
  methods: {
    // toggleCheck($event) {
    //   if (!this.disabled) {
    //     this.checked = this.checked ? 0 : 1;
    //     this.$emit('change', this.checked, $event);
    //     this.$emit('input', this.checked, $event);
    //   }
    // }

    toggleCheck($event) {
      if (!this.disabled) {
        if (this.isArray()) {
          let index = this.value.indexOf(this.mdValue);

          if (index >= 0) {
            this.value.splice(index, 1);
          } else {
            this.value.push(this.mdValue);
          }

          this.$emit("change", this.value, $event);
          this.$emit("input", this.value, $event);
        } else {
          this.checked = !this.checked;
          this.$emit("change", this.checked, $event);
          this.$emit("input", this.checked, $event);
        }
      }
    },

    isArray() {
      return Array.isArray(this.value);
    }
  }
};
</script>