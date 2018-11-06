<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <!-- <md-input v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled"  @blur="onBlur"></md-input> -->
       <md-input v-if="cell.ccLeng<35" v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled"  @blur="onBlur" :maxlength="(!disabled&&getType=='string')?cell.ccLeng:''" :type="getType"></md-input>
      <md-textarea v-else v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled"  @blur="onBlur" :maxlength="!disabled?cell.ccLeng:''"></md-textarea>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  watch:{
    modal(){
      // console.log('modal change')
    }
  },
  methods:{
    onBlur(){
      if(this.oldValue != this.modal[this.cell.id]){
        var data = {};
        data.cellId = this.cell.id;
        data.value = this.modal[this.cell.id];
        data.oldValue = this.oldValue;
        data.multiple = false;
        // this.oldValue = this.modal[this.cell.id];
        // console.log('datachange');
        this.$emit('change',data);
      }
    },
  },
  mounted(){
    if(this.modal&&this.modal[this.cell.id]!=undefined)
      this.oldValue = this.modal[this.cell.id];
  },
  computed:{
    getType(){
      if(this.cell.type<12){
        return "number";
      }else if(this.cell.type === 91 || this.cell.type===93){
        return 'dates';
      }
      return "string";
    }
  }

}
</script>

<style scoped>
textarea.md-input{max-height:.32rem !important;overflow: auto !important;}
</style>