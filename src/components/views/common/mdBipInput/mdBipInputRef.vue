<template>
  <md-input-container>
    <div class="md-input-ref layout layout-row">
      <label>{{cell.labelString}}</label>
        <md-input v-model="refValue" @focus="onFocus" @blur="onBlur" :required="cell.isReq" :disabled="disabled"></md-input>
        <md-button class="md-icon-button md-ref-filter" @click="openRef()" :disabled="disabled">
          <md-icon>search</md-icon>
        </md-button>
        <md-bip-dia ref="ref" :mdRefId="cell.editName" :multiple="multiple" :mdSelection="false" @close="onRefClose" :disabled="disabled"></md-bip-dia>
    </div>
  </md-input-container>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  props:{multiple:{type: Boolean,default:false}},
  data(){
    return{
      refValue:'',
      refData:{}
    }
  },
  mounted(){
    if(this.modal){
      var bb = this.modal[this.cell.id];
      if(bb){
        this.oldValue = this.modal[this.cell.id];
      }else{
        this.oldValue = '';
      }
    }
    this.initVV();
  },
  methods:{
    initVV(){
      // console.log('modc')
      var defv = this.modal[this.cell.id];
      if(defv){
        this.refValue = defv;
        this.onBlur();
      }else{
        this.refValue='';
        this.refData = {};
        // console.log(this.refData);
      }
    },
    openRef(){
      this.$refs['ref'].open()
    },
    onRefClose(data){
      if(data){
        data.cellId = this.cell.id;
        this.refData = data;
        this.refData.value = data.value[0];
        // console.log(this.refData.value[this.refData.cols[0]],this.oldValue);
        if(this.refData.value[this.refData.cols[0]] !== this.oldValue){
          // this.oldValue = this.refData.value[this.refData.cols[0]] ;
          this.refData.oldValue = this.oldValue;
          this.$set(this.modal,this.cell.id,this.refData.value[this.refData.cols[0]]);
          // console.log(data);
          this.$emit('change',data);
          this.makeRefInput(data);
        }
      }
    },
    makeRefInput(data){
      // console.log(this.cell);
      if (this.cell.refValue) {
        this.refValue = data.value[data.cols[1]];
      } else {
        this.refValue = data.value[data.cols[0]];
      }
    },
    onFocus(){
      if (this.refData.cols){
        this.refValue=this.refData.value[this.refData.cols[0]];
      }
    },
    onBlur(){
      console.log('fdsfds',this.refData);
      if (this.refData.cols){
        if(this.refValue ===''){
          this.refData.value[this.refData.cols[0]]="";
          this.refData.value[this.refData.cols[1]]="";
          this.refData.oldValue = this.oldValue;
          // if(this.refData.value[this.refData.cols[0]] !== this.oldValue){
          this.$set(this.modal,this.cell.id,'');
          
          this.$emit('change',this.refData);
          // }
        }else{
          if(this.refValue==this.refData.value[this.refData.cols[0]]){
            this.$set(this.modal,this.cell.id,this.refValue);
            if(this.cell.refValue)
              this.refValue=this.refData.value[this.refData.cols[1]];
            else{
              this.refValue=this.refData.value[this.refData.cols[0]];
            }
              
          }else{
            if(this.cell.editName)
              this.getAssistDataByAPICout(this.cell.editName,this.refValue,this.getCallBack,this.getCallError);
          }   
        }
      }else{
        if(this.refValue !== ''){
          // console.log(this.cell.refValue,this.refValue)
          // console.log(this.cell);
          if(this.cell.editName)
            this.getAssistDataByAPICout(this.cell.editName,this.refValue,this.getCallBack,this.getCallError);
        }else{
          this.modal[this.cell.id]='';
        }
      }
    },
    getCallBack(res){
      var data = res.data;
      if(data.code == 1) {
        var refBackData = {
          cols:[],
          value:[],
          multiple:false
        };
        refBackData.cols = data.allCols;
        refBackData.cellId = this.cell.id;
        refBackData.multiple = this.multiple;
        if (this.multiple){
          refBackData.value = data.values;
        }else{
          refBackData.value = data.values[0];
        }
        this.refData = refBackData;
        // console.log(this.oldValue,this.modal[this.cell.id],this.refData.value[this.refData.cols[0]]);
        var newValue = this.refData.value[this.refData.cols[0]];
        this.refData.oldValue = this.oldValue;
        if(newValue !== this.oldValue){
          // this.oldValue = newValue;
          this.$emit('change',this.refData);
        }
        this.$set(this.modal,this.cell.id,newValue);
        this.makeRefInput(this.refData);
      }else if(data.code == 0){
        if(this.refData.cols){
          this.makeRefInput(this.refData);
        }else{
          this.refValue='';
        }
        this.$notify.warning({content: data.message});
      }else{
        this.$notify.danger({content: data.message});
      }
    },
    getCallError(res){
      this.$notify.danger({content: res.data.message});
    },
  }, 
  watch:{
    modal(){
      this.oldValue = this.modal[this.cell.id];
      this.initVV();
    },
  } 
}
</script>
