<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-file v-model="modal[cell.id]" multiple @selected="getFile"></md-file>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  data () {
    return {
      file:''
    }
  },
  methods:{
    getFile(file){
      // console.log(file);
    }
  }
}
</script>