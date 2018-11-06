<template>
  <div class="md-grid-body">
    <table class="md-grid-table" :width="width">
      <thead>
        <md-grid-empty-row :columns="columns"></md-grid-empty-row>
      </thead>
      <tbody>
        <md-grid-body-row v-for="row in rows" :key="row.vueRowId" @click="rowClicked" :row="row" :columns="columns"></md-grid-body-row>
      </tbody>
    </table>
    <div v-if="rows.length === 0" class="md-grid-body-empty layout layout-align-center-center">
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
import mdGridBodyRow from './mdGridBodyRow';
import mdGridEmptyRow from './mdGridEmptyRow';
import { classList } from './helpers';
import getClosestVueParent from '../../core/utils/getClosestVueParent';
export default {
  props: {
    columns: { },
    rows: {  },
    filterNoResults: { type: String },
    width: {  },
    showAdd: { default: false, type: Boolean },
  },
  components: {
    mdGridEmptyRow,
    mdGridBodyRow,
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
    this.parentTable = getClosestVueParent(this.$parent, 'md-grid');
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