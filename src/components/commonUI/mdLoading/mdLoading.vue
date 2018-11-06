<template>
  <div class="md-loading layout layout-align-center-center" v-if="loading">
    <md-spinner md-indeterminate></md-spinner>
  </div>
</template>

<script>
  export default {
    props: {
      loading: Number,
    },
    data() {
      return {
        isFinished: null,
      };
    }
  };
</script>
