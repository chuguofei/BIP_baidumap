<template>
  <md-select 
    :name="name" 
    :id="id" 
    :required="required" 
    :disabled="disabled" 
    :placeholder="placeholder"
    :multiple="multiple"
    v-model="selectedValue" >
      <md-option v-for="item in enumInfo.fields" :key="item.id" :value="item.name">{{item.comment}}</md-option>
    </md-select>
</template>

<script>
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
        this.selectedValue=modelValue;
      },
      loadData(enumID){
        if(!window.gmfEnums){
          window.gmfEnums={};
        }
        if(enumID){
          if(window.gmfEnums&&window.gmfEnums[enumID]){
            this.enumInfo=window.gmfEnums&&window.gmfEnums[enumID];
          }else{
            this.$http.get('sys/enums/'+enumID).then(response => {
              this.enumInfo = response.data.data;
              window.gmfEnums[enumID]=response.data.data;
            }, response => {
              // console.log(response);
            });
          }
        }else{
          this.enumInfo={};
        }
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
