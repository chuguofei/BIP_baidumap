<template>
  <md-layout md-flex-xsmall="100" :md-flex-small="callsmall" :md-flex-medium="callmedium" :md-flex-large="calllarge" v-if="cell.isShow">
    <slot name="editor"></slot>
    <template v-if="inputType == INPUT_COMMON" >
      <md-bip-input-comm :cell="cell" :modal="modal"  :ref="cell.id" @change="dataChange"></md-bip-input-comm>
    </template>
    <template v-if="inputType == INPUT_DATE" >
      <md-bip-input-date :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-date>
    </template>
    <template v-if="inputType == INPUT_REF">
      <md-bip-input-ref  :cell="cell" :modal="modal" @change="dataChange" :ref="cell.id"></md-bip-input-ref>
    </template>
    <template v-if="inputType == INPUT_LIST">
      <md-bip-input-list :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-list>
    </template>
    <template v-if="inputType == INPUT_FILE">
      <md-bip-input-file-tmp :cell="cell" :modal="modal" :ref="cell.id" @change="dataChange"></md-bip-input-file-tmp>
    </template>
  </md-layout>
</template>
<script>
import comm from './modal.js';
export default {
  mixins:[comm],
  data () {
    return {
      inputType: 0
    }
  },
  created () {
    this.initType();
  },
  watch:{
    'cell': function(){
      this.initType();
    },
    'modal':function(){
      // console.log('modal input');
      // this.onBlur();
    }
  },
  computed:{
    callsmall(){
      if(this.cell){
        const w = this.cell.ccHorCell>0?this.cell.ccHorCell:1;
        if(w === 1) {
          return "50";
        }else{
          return "100";
        }
      }
    },
    callmedium(){
      if(this.cell){
        const w = this.cell.ccHorCell>0?this.cell.ccHorCell:1;
        if(w === 1) {
          return "33";
        }else if(w===2){
          return "66";
        }else{
          return "100";
        }
      }
    },
    calllarge(){
      const i = 25;
      if(this.cell){
        const w = this.cell.ccHorCell>0?this.cell.ccHorCell:1;
        const t = w*i;
        return t>100?"100":t+'';
      }
    }

  },
  methods: {
    dataChange (data) {
      this.$emit('change',data);
    },
    initType(){
      this.inputType = 0;
      if (this.cell) {
        if (this.cell.type === 91 || this.cell.type === 93 || this.cell.editName == 'DATE' ) {
            if(this.btj){
              this.inputType = 0;
            }else{
              this.inputType = this.INPUT_DATE;
            }
            return ;
        }
        if (this.cell.assist){
          if (this.cell.editName == 'UPDOWN') {
            this.inputType = this.INPUT_FILE;
            return ;
          }else if(this.cell.editName == 'COPY'){
            this.inputType = this.INPUT_COMMON;
          }else {
            if(this.cell.editType==1){
              this.inputType = this.INPUT_LIST;
            }else{
              this.inputType = this.INPUT_REF;
            }
            return ;
          }
        } else {
          this.inputType = this.INPUT_COMMON;
          var refv = this.cell.refValue;
          if(refv == '{&DATETIME}'){
            this.inputType = this.INPUT_COMMON;
            return ;
          }
          if (refv !== undefined &&refv !=='') {
            var _index = refv.indexOf('&');
            if (_index>0){
              this.inputType = this.INPUT_REF;
              return ;
            }
            this.inputType = this.INPUT_LIST;
              return ;
          }
        }
      }
    },
    list(){
      this.$emit('list');
    }
  }
}
</script>

