<template>
  <div class="md-backdrop" @click="close" @keyup.esc="close"></div>
</template>
<script>
  export default {
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
</script>
