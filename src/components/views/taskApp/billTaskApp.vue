<template>
  <md-part>
    <template v-if="bbb">
      <md-bip-bill-task-applet :dsm="dsm" :dsext="dsext" :opera="opera" @gotask="goTask" ></md-bip-bill-task-applet>
    </template>
    <template v-if="!bbb">
      <md-bip-mobile-task-applet :dsm="dsm" :dsext="dsext" :opera="opera" @gotask="goTask"></md-bip-mobile-task-applet>
    </template>
  </md-part>
</template>
<script>
export default {
  props: { dsm: Object, dsext: Array, opera: Object },
  data(){
    return {
      bbb:this.ISPC()
    }
  },
  methods:{
    goTask(){
      this.$emit('gotask');
    }
  }
}
</script>

