<template>
    <md-input-container>
      <label>{{cell.labelString}}</label>
      <md-date v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled" :btime="cell.type==93" @change="dataChange"></md-date>
    </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  data(){
    return {
      upData:''
    }
  },
  mixins:[comm],
  methods:{
    dataChange(value){
      // console.log(value+'');
      var refBackData = {
          cellId:this.cell.id,
          value:value,
          oldValue:this.oldValue,
          multiple:false
      };
      // console.log('321321',this.oldValue);
      if(value !== this.oldValue&&value!==this.upData){
        this.upData = value;
        this.$emit('change',refBackData);
      }
    }
  },
  mounted(){
    if(this.modal&&this.modal[this.cell.id]!=undefined)
      this.oldValue = this.modal[this.cell.id];
      this.upData = this.modal[this.cell.id];
  }
}
</script>
