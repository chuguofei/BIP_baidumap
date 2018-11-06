<template>
  <div class="md-bip-grid-head">
    <table class="md-bip-grid-table" :width="width" :style="tableStyle">
      <thead>
        <md-bip-grid-empty-row :columns="columns"></md-bip-grid-empty-row>
      </thead>
      <tbody>
        <tr>
          <md-bip-grid-cell v-if="multiple" :selection="true">
            <md-checkbox v-model="selected" @change="handleSelected"></md-checkbox>
          </md-bip-grid-cell>
          <md-bip-grid-cell v-for="column in visibleColumns" :key="column.field" @click="clicked(column)" :class="headerClass(column)">
            {{ column.label||column.field }}
          </md-bip-grid-cell>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import mdBipGridCell from './mdBipGridCell';
import mdBipGridEmptyRow from './mdBipGridEmptyRow';
import { classList } from './helpers';
import getClosestVueParent from '@/components/core/utils/getClosestVueParent';
export default {
  props: ['columns', 'width', 'isSelectedPage', 'scrollLeft'],

  components: {
    mdBipGridCell,
    mdBipGridEmptyRow
  },
  data() {
    return {
      parentTable: {},
      sort: {
        field: '',
        order: '',
      },
      selected: false,
      multiple: false
    };
  },
  watch: {
    isSelectedPage(v) {
      this.selected = v;
    }
  },
  computed: {
    visibleColumns() {
      return this.columns && this.columns.filter(column => !column.hidden);
    },
    tableStyle() {
      return {
        left: (0-(parseInt(this.scrollLeft) || 0)) + 'px'
      }
    },
  },
  methods: {
    headerClass(column) {
      if (!column.isSortable()) {
        return classList(column.headerClass);
      }

      if (column.field !== this.sort.field) {
        return classList('has-sort', column.headerClass);
      }
      return classList(`has-sort sort-${this.sort.order}`, column.headerClass);
    },
    emitSort(column) {
      if (!this.canFireEvents) return;
      if (this.sort.field !== column.field) {
        this.sort.field = column.field;
        this.sort.order = 'asc';
      } else {
        this.sort.order = (this.sort.order === 'asc' ? 'desc' : 'asc');
      }
      this.$emit('sort', this.sort);
    },
    clicked(column) {
      if (!this.canFireEvents) return;
      if (column.isSortable()) {
        this.emitSort(column);
      }
      this.$emit('click', column);
    },
    handleSelected(value) {
      if (this.multiple) {
        this.parentTable.$children.forEach((body, index) => {
          if (body.elType == 'body') {
            body.$children.forEach((row, index) => {
              if (row.elType == 'bodyRow') {
                row.setSelected(value);
              }
            });
          }
        });
        this.parentTable.emitSeleced();
      }
    },
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-bip-grid');
    this.multiple = this.parentTable.multiple;
    this.$nextTick(() => {
      this.canFireEvents = true;
    });
  },
};
</script>