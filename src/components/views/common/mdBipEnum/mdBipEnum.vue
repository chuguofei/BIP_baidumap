<template>
  <md-select 
    :name="name" 
    :id="id" 
    :required="required" 
    :disabled="disabled" 
    :placeholder="placeholder"
    :multiple="multiple"
    v-model="selectedValue" >
      <md-option v-for="(item,index) in enumInfo.fields" :key="index" :value="item.id">{{item.comment}}</md-option>
    </md-select>
</template>

<script>
import enumCache from '../../../core/utils/enumCache';
  export default {
    props: {
      name: String,
      id: String,
      required: Boolean,
      multiple: Boolean,
      value: [String, Number,Array],
      disabled: Boolean,
      placeholder: String,
      mdEnumId:String
    },
    data() {
      return {
        selectedValue: null,
        options: {},
        enumInfo:{}
      };
    },
    watch: {
      value(value) {
        this.setTextAndValue(value);
      },
      selectedValue(value) {
        this.$emit('input', value);
        this.$emit('change',value);
      }
    },
    methods: {
      setTextAndValue(modelValue) {
        // console.log(modelValue);
        this.selectedValue=modelValue;
      },
      loadData(enumID){
        // console.log(enumID);
        if(!window.gmfEnums){
          window.gmfEnums={};
        }
        if(enumID){
          if(enumCache.get(enumID)){
            this.enumInfo = enumCache.get(enumID);
            // console.log(this.enumInfo);
          // if(window.gmfEnums&&window.gmfEnums[enumID]){
            // this.enumInfo=window.gmfEnums&&window.gmfEnums[enumID];
          }else{
            if(enumID.indexOf(';')>0){
              var list = enumID.split(';');
              // console.log(list);
              this.enumInfo.fields = [];
              _.forEach(list,(item,n)=>{
                var info = item.split(':');
                // console.log(info);
                var field = {id:info[0],name:info[0],comment:info[1]};
                this.enumInfo.fields.push(field);
              });
              // window.gmfEnums[enumID] = this.enumInfo;
              this.enumInfo.name = enumID;
              enumCache.set(this.enumInfo);
              // console.log(window.gmfEnums);
            }else{
              this.enumInfo.name = enumID;
              if(enumID.indexOf('$')>0){
                var returnData = JSON.parse(window.sessionStorage.getItem(enumID));
                var showCel = [];
                if(returnData.allCols.length>1) {
                  showCel[0] = returnData.allCols[0];
                  showCel[1] = returnData.allCols[1];
                }
                var fields = [];
                _.forEach(returnData.values,(item,n)=>{
                  var field = {id:item[showCel[0]]+'',name:item[showCel[0]]+'',comment:item[showCel[1]]};
                  fields.push(field);
                });
                this.$set(this.enumInfo,'fields',fields);
                enumCache.set(this.enumInfo);
                window.gmfEnums[this.enumInfo.name] = this.enumInfo;
              }else{
                this.getAssistDataByAPI(enumID,this.getCallBack,this.getCallError);
              }
            }
          }
        }else{
          this.enumInfo={};
        }
      },
      getCallBack(res){
        var returnData = res.data;
        var showCel = [];
        if(returnData.allCols.length>1) {
          showCel[0] = returnData.allCols[0];
          showCel[1] = returnData.allCols[1];
        }
        var fields = [];
        _.forEach(returnData.values,(item,n)=>{
           var field = {id:item[showCel[0]],name:item[showCel[0]],comment:item[showCel[1]]};
           fields.push(field);
        });
        this.$set(this.enumInfo,'fields',fields);
        enumCache.set(this.enumInfo);
        window.gmfEnums[this.enumInfo.name] = this.enumInfo;
      },
      getCallError(res){

      }
    },
    created(){
      this.loadData(this.mdEnumId);
    },
    mounted() {
      this.value&&this.setTextAndValue(this.value);
    },
    beforeDestroy() {
    }
  };
</script>
