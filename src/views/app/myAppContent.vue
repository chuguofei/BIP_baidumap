<template>
  <router-view></router-view>
</template>
<script>
  export default {
    props: {
      mdToken: String,
      mdTitle: String
    },
    data() {
      return {
        test: null
      };
    },
    computed: {
    }
  };
</script>
