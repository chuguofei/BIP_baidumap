<template>
  <div class="md-bip-grid-foot">
    <table class="md-bip-grid-table" :width="width" v-if="showSum">
      <thead>
        <md-bip-grid-empty-row :columns="columns"></md-bip-grid-empty-row>
      </thead>
      <tbody>
        <tr>
          <md-bip-grid-cell v-if="multiple" :selection="true">
          </md-bip-grid-cell>
          <md-bip-grid-cell v-for="column in visibleColumns" :key="column.field">
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
  props: ['columns', 'width', 'showSum'],

  components: {
    mdBipGridCell,
    mdBipGridEmptyRow
  },
  data() {
    return {
      parentTable: {},
      selected: false,
      multiple: false
    };
  },
  computed: {
    visibleColumns() {
      return this.columns && this.columns.filter(column => !column.hidden);
    },
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-grid');
    this.multiple = this.parentTable.multiple;
    this.$nextTick(() => {
      this.canFireEvents = true;
    });

  },
};
</script>