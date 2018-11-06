<template>
  <div class="md-bip-grid-body">
    <table class="md-bip-grid-table" :width="width">
      <thead>
        <md-bip-grid-empty-row :columns="columns"></md-bip-grid-empty-row>
      </thead>
      <tbody>
        <md-bip-grid-body-row v-for="row in rows" :key="row.vueRowId" @click="rowClicked" :row="row" :columns="columns"></md-bip-grid-body-row>
      </tbody>
    </table>
    <div v-if="rows.length === 0" class="md-bip-grid-body-empty layout layout-align-center-center">
      <template v-if="showAdd">
        <md-button class="md-fab md-fab-center-center" @click.native="onAdd()">
          <md-icon>add</md-icon>
        </md-button>
      </template>
      <template v-if="filterNoResults">
        {{ filterNoResults }}
      </template>
    </div>
  </div>
</template>
<script>
import mdBipGridBodyRow from './mdBipGridBodyRow';
import mdBipGridEmptyRow from './mdBipGridEmptyRow';
import { classList } from './helpers';
import getClosestVueParent from '@/components/core/utils/getClosestVueParent';
export default {
  props: {
    columns: { },
    rows: {  },
    filterNoResults: { type: String },
    width: {  },
    showAdd: { default: false, type: Boolean },
  },
  components: {
    mdBipGridEmptyRow,
    mdBipGridBodyRow,
  },
  data() {
    return {
      parentTable: {},
      multiple: false,
      elType: 'body'
    };
  },
  computed: {

  },
  methods: {
    rowClicked(row) {
      if (this.canFireEvents) {
        this.$emit('click', row);
      }
    },
    onAdd() {
      if (!this.canFireEvents) return;
      this.parentTable.onAdd();
    },
  },
  mounted() {
    this.parentTable = getClosestVueParent(this.$parent, 'md-bip-grid');
    this.multiple = this.parentTable.multiple;
    this.$el.addEventListener('scroll', () => {
      this.parentTable.scrollLeft = this.$el.scrollLeft;
    }, false);
    this.$nextTick(() => {
      this.canFireEvents = true;
      this.parentTable.scrollLeft = this.$el.scrollLeft;
    });
  },
};
</script>