<template>
  <td @click="handleClick" :class="[objClass]">
    <md-bip-grid-cell-edit v-if="status=='editor'" class="md-bip-grid-cell-container" :column="column" :row="row">
      <template v-if="column&&column.templateEditor">
        <slot name="editor"></slot>
      </template>
      <template v-else-if="column&&column.dataType=='entity'">
        <md-input-container>
          <md-bip-input-entity :mdRefId="column.refId||column.refType" @init="on_init_ref" v-model="row.data[column.field]"></md-bip-input-entity>
        </md-input-container>
      </template>
      <template v-else-if="column&&column.dataType=='enum'">
        <md-input-container>
          <md-bip-enum :md-enum-id="column.refId||column.refType" v-model="row.data[column.field]"></md-bip-enum>
        </md-input-container>
      </template>
      <template v-else-if="column&&column.dataType=='date'">
        <md-input-container>
          <md-date v-model="row.data[column.field]"></md-date>
        </md-input-container>
      </template>
      <template v-else>
        <md-input-container>
          <md-input v-model="row.data[column.field]"></md-input>
        </md-input-container>
      </template>
    </md-bip-grid-cell-edit>
    <md-bip-grid-cell-show v-else class="md-bip-grid-cell-container" :column="column" :row="row">
      <slot></slot>
    </md-bip-grid-cell-show>
  </td>
</template>
<script>
import getClosestVueParent from '@/components/core/utils/getClosestVueParent';
import mdBipGridCellShow from './mdBipGridCellShow';
import mdBipGridCellEdit from './mdBipGridCellEdit';
import billState from '../../classes/billState';
export default {
  components: {
    mdBipGridCellShow,
    mdBipGridCellEdit
  },
  props: {
    column: { type: Object },
    row: { type: Object },
    selection: { default: false, type: Boolean },
    type: { default: 'td', type: String },
  },
  computed: {
    objClass() {
      return {
        'is-tool': this.column && this.column.isTool,
        'md-bip-grid-selection': this.selection,
        'cell-focused': this.focused,
        'multiple': this.column && this.column.multiple
      };
    },
    editable() {
      return (this.row && this.row.data) && (!this.selection) && this.column && (this.column.templateEditor || this.column.editable);
    }
  },
  data() {
    return {
      parentTable: {},
      status: 'display',
      focused: false,
      oldValue: {}
    };
  },
  methods: {
    handleFocused() {
      if (this.parentTable && this.parentTable.focusCell) {
        this.parentTable.focusCell.focused = false;
      }
      this.focused = true;
    },
    handleClick(event) {
      if (!this.canFireEvents) return;
      this.handleFocused();
      this.$emit('click', event);
      this.beginEdit();
    },
    beginEdit() {
      if (!this.editable) {
        if (this.parentTable.focusCell) {
          this.parentTable.focusCell.endEdit();
        }
        this.parentTable.focusCell = this;
        return;
      }
      if (this.status == 'display') {
        if (this.parentTable.focusCell) {
          this.parentTable.focusCell.endEdit();
        }
        this.oldValue = this.row.getValueKey(this.column.field);
        this.parentTable.focusCell = this;
        this.status = 'editor';
      }
    },
    endEdit() {
      // console.log('endEdit',this.status,this.column.field);
      if (this.status == 'editor') {
        let newValue = this.row.getValueKey(this.column.field);
        if(this.column.dataType == 'numeric'){
          newValue = new Number(newValue).toFixed(this.column.ccPoint);
          this.$set(this.row.data,this.column.field,newValue);
        }
        // console.log(newValue,'newValue',this.column.field,this.oldValue);
        if (newValue != this.oldValue && (newValue || this.oldValue)) {
          this.checkGS();
          this.row.data.sys_updated = true;
          this.row.data.sys_stated = this.row.data.sys_stated | billState.EDITED;
          this.parentTable.rowChange(this.row.data,this.column);
        }
      }
      this.status = 'display'
    },
    on_init_ref(options, event) {
      this.column && this.row && this.column.refInit && this.column.refInit(options, this.row.data, event);
    },
    checkGS(){
      const attr = this.column.attr;
      if((attr&0x100000)>0){
        this.checkMulCols();      
      }
      _.forEach(this.row.columns,col => {
        let scstr = col.script;
        if(scstr&&scstr.indexOf('=:')===0){
          scstr = scstr.replace('=:','');
          // 公式计算
          this.row.scriptProc.execute(scstr,null,col);
          // console.log(vl,this.row.data,col.field);
          // this.data[col.field] = vl;
          // this.$set(this.row.data,col.field,vl);
        }
      })
      // console.log(this.row);
    },
    // 多列计算
    checkMulCols(){
      var script = this.column.script;
      if(script){
        script = script.split('&');
        var cols = script[0].split(',');
        var _indexs = script[1].split(',');
        var refValues = this.column.refValues;
        var id = this.row.data[this.column.field];
        var refInfo;
        if(refValues){
          _.forEach(refValues.values,(item ,n)=> {
            if(item[refValues.cols[0]] === id){
              refInfo = item;
            }
          });
        }
        if(refInfo){
          _.forEach(cols,(col,n)=>{
            var vv = refInfo[refValues.cols[_indexs[n]]];
            // console.log(vv,col);
            if(vv){
              var cl = this.row.getColumn(col);
              if ( cl.dataType == 'numeric' ) {
                vv = new Number(vv).toFixed(cl.ccPoint);
              }
              vv+='';
              this.$set(this.row.data,col,vv)
            }
          });
        }
      }
    }
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-bip-grid');
    this.$nextTick(() => {
      this.canFireEvents = true;
    });
  },
};
</script>