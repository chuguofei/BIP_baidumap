<template>
  <td @click="handleClick" :class="[objClass]">
    <md-grid-cell-edit v-if="status=='editor'" class="md-grid-cell-container" :column="column" :row="row">
      <template v-if="column&&column.templateEditor">
        <slot name="editor"></slot>
      </template>
      <template v-else-if="column&&column.dataType=='entity'">
        <md-input-container>
          <md-input-ref :md-ref-id="column.refId||column.refType" @init="on_init_ref" v-model="row.data[column.field]"></md-input-ref>
        </md-input-container>
      </template>
      <template v-else-if="column&&column.dataType=='enum'">
        <md-input-container>
          <md-enum :md-enum-id="column.refId||column.refType" v-model="row.data[column.field]"></md-enum>
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
    </md-grid-cell-edit>
    <md-grid-cell-show v-else class="md-grid-cell-container" :column="column" :row="row">
      <slot></slot>
    </md-grid-cell-show>
  </td>
</template>
<script>
import getClosestVueParent from '../../core/utils/getClosestVueParent';
import mdGridCellShow from './mdGridCellShow';
import mdGridCellEdit from './mdGridCellEdit';
export default {
  components: {
    mdGridCellShow,
    mdGridCellEdit
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
        'md-grid-selection': this.selection,
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
        if (!this.row.data.sys_updated) {
          this.oldValue = this.row.getValueKey(this.column.field);
        }
        this.parentTable.focusCell = this;
        this.status = 'editor';
      }
    },
    endEdit() {
      if (this.status == 'editor') {
        const newValue = this.row.getValueKey(this.column.field);
        if (newValue != this.oldValue) {
          this.row.data.sys_updated = true;
        }
      }
      this.status = 'display'
    },
    on_init_ref(options, event) {
      this.column && this.row && this.column.refInit && this.column.refInit(options, this.row.data, event);
    },
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-grid');
    this.$nextTick(() => {
      this.canFireEvents = true;
    });
  },
};
</script>