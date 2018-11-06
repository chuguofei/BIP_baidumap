<template>
  <tr @click="rowClicked" :class="['md-bip-data-rows',rowClass]" @dblclick="rowDblclick">
    <md-bip-grid-cell v-if="multiple" :selection="true">
      <md-checkbox v-model="selected" @change="handleSelected"></md-checkbox>
    </md-bip-grid-cell>
    <md-bip-grid-cell v-for="(column,index) in visibleColumns" :row="row" :key="index" :column="column"></md-bip-grid-cell>
  </tr>
</template>
<script>
import mdBipGridCell from './mdBipGridCell';
import { classList } from './helpers';
import getClosestVueParent from '@/components/core/utils/getClosestVueParent';
export default {
  props: ['columns', 'row', 'rowIndex'],

  components: {
    mdBipGridCell,
  },
  data() {
    return {
      parentTable: {},
      autoSelect: false,
      multiple: false,
      focused: false,
      selected: false,
      disabled: false,
      rowFocused: true,
      vueRowId: 'row-1',
      elType: 'bodyRow'
    };
  },
  watch: {
    'row.data.vueRowId' (v) {
      this.vueRowId = v;
    },
    'vueRowId' () {
      this.resetStatus();
    }
  },
  computed: {
    visibleColumns() {
      return this.columns && this.columns.filter(column => !column.hidden);
    },
    rowClass() {
      return {
        'focused': this.focused,
        'selected': this.selected,
        'disabled': this.disabled,
        'row-focused': this.rowFocused
      };
    }
  },
  methods: {
    resetStatus() {
      this.multiple = this.parentTable.multiple;
      this.autoSelect = this.parentTable.autoSelect;
      this.rowFocused = this.parentTable.rowFocused;
      this.focused = false;
      this.selected = this.row.data && this.parentTable.isSelected(this.row.data);
      this.disabled = false;
    },
    rowClicked() {
      if (!this.canFireEvents) return;
      if (this.autoSelect) {
        this.handleSelected(true);
      }
      this.handleFocused();
      this.parentTable.emitRowClick(this.row);
    },

    rowDblclick() {
      this.parentTable.emitRowDbClick(this.row);
    },
    setSelected(value) {
      this.selected = value;
      let items = this.parentTable.selectedRows[this.parentTable.pageCacheKey];
      if (!items) {
        items = {};
        this.parentTable.selectedRows[this.parentTable.pageCacheKey] = items;
      }
      if (value) {
        items[this.vueRowId] = this.row.data;
      } else {
        delete items[this.vueRowId];
      }
    },
    handleFocused() {
      if (!this.canFireEvents) return;
      if (!this.parentTable.focusRow || this.parentTable.focusRow.vueRowId != this.vueRowId) {
        if (this.parentTable.focusRow) this.parentTable.focusRow.focused = false;
        this.focused = true;
        this.parentTable.focusRow = this;
        this.parentTable.emitFocusRow();
      }
    },
    handleSelected(value) {
      if (!this.canFireEvents) return;
      if (!this.multiple && value) {
        this.parentTable.selectedRows = {};
        this.parentTable.$children.forEach((body, index) => {
          if (body.elType == 'body') {
            body.$children.forEach((row, index) => {
              if (row.elType == 'bodyRow' && row.vueRowId != this.vueRowId) {
                row.setSelected(false);
              }
            });
          }
        });
      }
      this.setSelected(value);

      this.parentTable.emitSeleced();
    }
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-bip-grid');
    this.multiple = this.parentTable.multiple;
    this.autoSelect = this.parentTable.autoSelect;
    this.rowFocused = this.parentTable.rowFocused;
    if (this.row && this.row.data.vueRowId) {
      this.vueRowId = this.row.data.vueRowId;
    }
    this.$nextTick(() => {
      this.canFireEvents = true;
    });
  },
};
</script>