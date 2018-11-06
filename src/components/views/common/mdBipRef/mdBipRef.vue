<template>
  <div class="md-bip-ref">
    <template v-if="bpk"><a @click="pkclick">{{refData.name | formartObj(bipRefId,refData.name)}}</a></template>
    <template v-else>
      {{refData.name | formartObj(bipRefId,refData.name)}}
    </template>
  </div>
</template>
<script>
import common from '../../commonModal.js'
export default {
  data () {
    return {
      refData: {
        code:'',
        name: ''
      },
      showCols:''
    }
  },
  mixins:[common],
  props: {'inputValue':null,'bipRefId':Object,mdNumeric: Boolean},
  mounted () {
    // if(this.inputValue)
      this.initValue();
  },
  computed:{
    bpk(){
      if(this.bipRefId){
        if((this.bipRefId.attr&1)>0){
          return true;
        }
      }
        return false;
    }
  },
  watch: {
    'inputValue': function () {
      this.initValue();
    }
  },
  methods: {
    pkclick(){
      console.log(11);
      this.$emit('pkclick');
    },
    initValue(){
      this.refData.code = this.inputValue;
      this.refData.name = this.inputValue;
      if (this.bipRefId && this.bipRefId.refValue) {
        this.makeRefValue();
      }
    },
    async makeRefValue(){
      var s0 = this.bipRefId.refValue;
      if(s0 == '{&DATETIME}' || s0=='{&DATE}'){
        return ;
      }
      // if(s0&&s0.indexOf('$')>0){
      if(this.bipRefId.refCl){
        var cldata = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue));
        if(cldata){
          this.makeRef(cldata);
        }
      }else{
        if(!this.refData.code){
          return ;
        }
        var cldata = JSON.parse(window.sessionStorage.getItem(this.bipRefId.refValue+"."+this.refData.code));
        if(cldata){
          this.refData.name = cldata.value[cldata.allCols[1]];
        }else{
          var cc = await this.getCLByAPI({'assistid':this.bipRefId.refValue,'cont':this.refData.code});
          //  console.log('1111',cc);
          if(cc.data.code==1){
            cldata = {'allCols':cc.data.allCols,'value':cc.data.values[0]};
            this.refData.name = cldata.value[cldata.allCols[1]];
            if(!window.sessionStorage.getItem(this.bipRefId.refValue+"."+this.refData.code))
              window.sessionStorage.setItem(this.bipRefId.refValue+"."+this.refData.code,JSON.stringify(cldata));
          }
        }
      }
    },

    makeRef(cldata){
      _.find(cldata.values,(item)=>{
        // console.log(item,'fdsfds');
        if(item[cldata.allCols[0]]==this.refData.code){
          this.refData.name=item[cldata.allCols[1]];
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.md-bip-ref{
  width: 100%;
  height: 100%;
  a{
    color: rgba(10, 61, 83, 0.76);
    // text-decoration-line: underline;
  }
  a:hover{
    color: red;
    font-weight:bold;
  }
}
</style>

