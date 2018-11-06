<template>
  <div class="md-input-ref layout layout-row" @click.native="applyInputFocus">
      <md-input-value
        v-for="(chip ,columnIndex) in selectedValues"
        :md-deletable="!disabled"
        :disabled="disabled"
        :key="columnIndex"
        @delete="deleteChip(chip)">
        <slot :value="chip"><span>{{ chip.name }}</span></slot>
      </md-input-value>
      <md-input
        v-show="canEdit"
        v-model="currentInputValue"
        type="text"
        :placeholder="placeholder"
        :id="inputId"
        :name="name"
        :disabled="disabled"
        :required="required"
        @keydown.native.delete="deleteLastChip"
        @keydown.native.prevent.enter="addInputChip"
        @keydown.native.prevent.186="addInputChip"
        @dblclick.native="openRef()"
        tabindex="0"
        md-container=""
        ref="input">
      </md-input>
      <md-button class="md-icon-button md-ref-filter" @click.native="openRef()">
        <md-icon>search</md-icon>
      </md-button>
      <md-ref ref="ref" :options="refOptions" :multiple="!!multiple" :md-ref-id="mdRefId" @open="onRefOpen" @close="onRefClose"></md-ref>
  </div>
</template>

<script>
  import getClosestVueParent from '../../core/utils/getClosestVueParent';
  import common from '../../core/utils/common';
  import commonInput from './common';
  export default {
    props: {
      id: String,
      name: String,
      multiple: {
        type: Boolean,
        default: false
      },
      mdRefId: String,
      mdKeyField:String,
      mdNameField:String,
      maxlength:{
        type: [Number, String],
        default: 1
      }
    },
    mixins: [commonInput],
    data() {
      return {
        currentInputValue: null,
        selectedValues:[],
        inputId: this.id || 'refs-' + common.uniqueId(),
        refInfo:{},
        refData:[],
        loading:0,
        canEdit:true,
        refIsOpened:false,
        refOptions:{wheres:{},orders:{}}
      };
    },
    watch: {
      value(value) {
        if(!common.isObject(value)){
          value=null;
        }
        this.setValue(value);
      },
      selectedValues(v){
        if(this.multiple){
          this.canEdit=this.maxlength>1?this.selectedValues.length<this.maxlength:true;
        }else{
           this.canEdit=this.selectedValues.length<1;
        }
        this.setParentValue(v);
      }
    },
    methods: {
      setValue(value){
        if(!common.isObject(value)){
          value=null;
        }
        if(!value){
           this.selectedValues=[];
        }else{
          if(common.isArray(value)){
            this.selectedValues=value;
          }else{
            this.selectedValues=[value];
          }
        }
        this.setParentValue(this.selectedValues);
      },
      openRef() {
        this.refIsOpened=true;
        this.$emit('init', this.refOptions);
        this.$refs['ref'].open();
      },
      onRefOpen(type) {
      },
      onRefClose(data) {
        this.refIsOpened=false;
        if(!data||data.length==0)return;
        if(!this.multiple)this.selectedValues=[];
        data&&data.forEach((row, index) =>{
            this.addValue(row);
        });
      },
      applyInputFocus() {
        this.$nextTick(() => {
          this.$refs.input.$el.focus();
        });
      },
      addValue(value){
        if(!value||!value.id){
          return;
        }
        if(this.multiple&&this.maxlength>1&&this.selectedValues.length>= this.maxlength){
          return;
        }
        if(!this.multiple&&this.selectedValues.length>1){
          return;
        }
        const index=this.getValueIndex(value);
        if(index<0){
          this.selectedValues.push(value);
          const nv=this.formatValue();
          this.$emit('input', nv);
          this.$emit('change',nv);
          this.applyInputFocus();
        }
      },
      addInputChip() {
        if (this.currentInputValue) {
          const value ={name:this.currentInputValue.trim()};
          value.id=value.name;
          this.currentInputValue = null;
          this.addValue(value);
        }
      },
      deleteChip(chip) {
        const index=this.getValueIndex(chip);
        if(index>=0){
          this.selectedValues.splice(index, 1);
          const nv=this.formatValue();
          this.$emit('input', nv);
          this.$emit('change',nv);
          this.applyInputFocus();
        }
      },
      getValueIndex(value){
        for (var i = 0; i < this.selectedValues.length; i++) {
          if(value.id&&this.selectedValues[i].id==value.id){
            return i;
          }
          if(value.code&&this.selectedValues[i].code==value.code){
            return i;
          }
        }
        return -1;
      },
      deleteLastChip() {
        if (!this.currentInputValue) {
          if(this.selectedValues.length){
            this.selectedValues.pop();
            const nv=this.formatValue();
            this.$emit('input', nv);
            this.$emit('change',nv);
            this.applyInputFocus();
          }
        }
      },
      formatValue(){
        if(!this.multiple){
          return this.selectedValues.length?this.selectedValues[0]:null;
        }
        return this.selectedValues;
      },
    },
    mounted() {
      this.setValue(this.value);
      this.$nextTick(() => {
        this.parentContainer = getClosestVueParent(this.$parent, 'md-input-container');
        this.updateValues(this.formatValue());
        this.setParentDisabled();
        this.setParentRequired();
      });
      this.$refs['ref'].cancel();
    }
  };
</script>
