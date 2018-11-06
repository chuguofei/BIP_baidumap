<template>
  <div class="md-bip-grid layout layout-full flex">
    <div v-if="showFilter && filterableColumnExists" class="md-bip-grid-filter">
      <input type="text" v-model="filter" :placeholder="filterPlaceholder">
      <a v-if="filter" @click="filter = ''" class="md-bip-grid-filter-clear">×</a>
    </div>
    <div class="md-bip-grid-wrapper layout layout-column">
      <md-bip-grid-head :columns="columns" :is-selected-page="isSelectedPage" :scrollLeft="scrollLeft" @sort="onSorting" :width="width"></md-bip-grid-head>
      <md-bip-grid-body :columns="columns" :rows="displayedRows" :width="width" :showAdd="showAdd" :filter-no-results="filterNoResults" class="flex"></md-bip-grid-body>
      <md-bip-grid-foot :columns="columns" v-if="showSum" :scrollLeft="scrollLeft" :width="width"></md-bip-grid-foot>
      <md-bip-grid-actions :pager-info="pager" :showQuery="showQuery" :showAdd="showAdd" :showInsert="showInsert" :showRemove="showRemove" :showReload="showReload" :showConfirm="showConfirm" :showCancel="showCancel" @pagination="onPagination" @onQuery="onQuery" @onAdd="onAdd" @onInsert="onInsert" @onRemove="onRemove" @onReload="onReload" @onConfirm="onConfirm" @onCancel="onCancel">
      </md-bip-grid-actions>
    </div>
    <div style="display:none;">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Column from './classes/Column';
import localCache from '@/components/core/utils/localCache';
import billState from '../../classes/billState';
import Row from './classes/Row';
import mdBipGridHead from './mdBipGridHead';
import mdBipGridBody from './mdBipGridBody';
import mdBipGridFoot from './mdBipGridFoot';
import mdBipGridActions from './mdBipGridActions';
import { classList } from './helpers';
import mdBipGridCell from './mdBipGridCell';

export default {
  components: {
    mdBipGridHead,
    mdBipGridBody,
    mdBipGridFoot,
    mdBipGridCell,
    mdBipGridActions
  },

  props: {
    datas: { default: () => [], type: [Array, Function] },
    autoSelect: { default: false, type: Boolean },
    autoLoad: { default: false, type: Boolean },
    multiple: { default: true, type: Boolean },
    showFilter: { default: false, type: Boolean },
    showSum: { default: false, type: Boolean },
    showQuery: { default: false, type: Boolean },
    showAdd: { default: false, type: Boolean },
    showInsert: { default: false, type: Boolean },
    showRemove: { default: false, type: Boolean },
    showReload: { default: true, type: Boolean },
    showConfirm: { default: false, type: Boolean },
    showCancel: { default: false, type: Boolean },

    rowFocused: { default: true, type: Boolean },

    sortBy: { default: '', type: String },
    sortOrder: { default: '', type: String },

    cacheKey: { default: null },
    cacheLifetime: { default: 5 },
    filterPlaceholder: { default: 'Filter table…' },
    filterNoResults: { default: '暂无数据！' },
    pagerSize: { default: 20, type: Number },
  },

  data: () => ({
    columns: [],
    rows: [], //当前页数据
    displayedRows: [],
    filter: '',
    sort: {
      field: '',
      order: '',
    },
    pager: {
      page: 1,
      size: 20,
      total: 0
    },
    focusRow: false,
    focusCell: false,
    selectedRows: {}, //选择的数据
    cacheRows: {},
    width: '',
    scrollLeft: 0,
    isSelectedPage: false,
    pageCacheKey: 'p1'
  }),
  watch: {
    pagerSize(v){
      this.pager.size=v;
    },
    filter() {
      this.mapDataToRows();
      this.saveState();
    },
    'pager.page' (v) {
      this.pageCacheKey = 'p' + v;
    },
    datas() {
      if (this.usesLocalData) {
        this.cleanCache();
        this.mapDataToRows();
      }
    },
    columns() {
      this.width = this.getWidth();
    },
    rows() {
      this.refreshDisplayRow();
    }
  },

  computed: {
    usesLocalData() {
      return this._.isArray(this.datas);
    },
    filterableColumnExists() {
      return this.columns.filter(c => c.isFilterable()).length > 0;
    },
    storageKey() {
      return this.cacheKey ?
        `md-bip-grid.${this.cacheKey}` :
        `md-bip-grid.${window.location.host}${window.location.pathname}${this.cacheKey}`;
    },

  },
  methods: {
    onConfirm() {
      if (!this.canFireEvents) return;
      var options = {};
      this.$emit('onConfirm', options);
    },
    onCancel() {
      if (!this.canFireEvents) return;
      var options = {};
      this.$emit('onCancel', options);
    },
    onQuery() {
      if (!this.canFireEvents) return;
      var options = {};
      this.$emit('onQuery', options);
    },
    onAdd() {
      if (!this.canFireEvents) return;
      var options = {};
      this.$emit('onAdd', options);
      this.refreshDisplayRow();
    },
    onInsert() {
      if (!this.canFireEvents) return;
      var options = {};
      this.$emit('onInsert', options);
      this.refreshDisplayRow();
    },
    onRemove() {
      if (!this.canFireEvents) return;
      let rs = this.getSelectedDatas();
      rs.forEach(r => {
        r.sys_deleted = true;
      });
      var options = {};
      options.data = rs;
      this.$emit('onRemove', options);
      this.refreshDisplayRow();
    },
    onReload() {
      if (!this.canFireEvents) return;
      var options = {};
      this.refresh();
      this.$emit('onReload', options);
    },
    emitRowClick(row) {
      if (!this.canFireEvents) return;
      var options = {};
      options.data = row.data;
      this.$emit('click', options);
    },
    emitRowDbClick(row) {
      if (!this.canFireEvents) return;
      var options = {};
      options.data = row.data;
      this.$emit('dblclick', options);
    },
    emitSeleced() {
      if (!this.canFireEvents) return;
      var options = {};
      options.data = this.getSelectedDatas(true);
      this.$emit('select', options);
      this.refreshStatus();

    },
    emitFocusRow() {
      if (!this.canFireEvents) return;
      var options = {};
      options.data = this.focusRow ? this.focusRow.row.data : null;
      this.$emit('focus', options);
      this.refreshStatus();
    },
    endEdit() {
      this.focusCell && this.focusCell.endEdit();
    },
    refreshStatus() {
      this.isSelectedPage = this.rows &&
        this.rows.length &&
        this.selectedRows[this.pageCacheKey] &&
        this.rows.length == Object.keys(this.selectedRows[this.pageCacheKey]).length;
    },
    refreshDisplayRow() {
      this.displayedRows = this.rows.filter(row => row.displayed());
    },
    cleanCache() {
      this.cacheRows = {};
      this.selectedRows = {};
      this.refreshStatus();
    },
    async onPagination(pager) {
      if (this.pager.size != pager.size) {
        this.cleanCache();
      }
      this.pager.page = pager.page;
      this.pager.size = pager.size;
      await this.mapDataToRows();
      this.refreshStatus();
    },

    formatDataToRow(data) {
      data.vueRowId = data.vueRowId || this._.uniqueId('row');
      data.sys_deleted = data.sys_deleted || false;
      data.sys_updated = data.sys_updated || false;
      data.sys_created = data.sys_created || false;
      data.sys_stated = data.sys_stated || billState.DICT;
      return new Row(data, this.columns);
    },

    async mapDataToRows() {
      if (this.cacheRows[this.pager.page]) {
        const rs = this.cacheRows[this.pager.page];
        if (rs && rs.length) {
          this.rows = rs;
          return;
        }
      }
      const data = this.usesLocalData ?
        this.fetchLocalData() :
        await this.fetchServerData();
      this.rows = data
        .map(rowData => this.formatDataToRow(rowData))
        .filter(row => row.displayed());

      this.cacheRows[this.pager.page] = this.rows;
    },

    fetchLocalData() {
      var allDatas = this.datas.filter(r => !r.sys_deleted);

      if (this.columns.length && this.showFilter && this.filter && this.columns.filter(column => column.isFilterable()).length) {
        // allDatas = this.allDatas.filter((row) => {
        //   var r = new Row(row, this.columns);
        //   return r.passesFilter(this.filter);
        // });
      }
      if (this.columns.length && this.sort && this.sort.field) {
        // const sortColumn = this.getColumn(this.sort.field);
        // if (sortColumn) {
        //   allDatas = allDatas.sort(function(r1, r2) {
        //     return 1;
        //   });
        // }
      }
      this.pager.total = allDatas.length;
      var ds = this._.chunk(allDatas, this.pager.size);
      if (ds.length >= this.pager.page) {
        return ds[this.pager.page - 1];
      }
      return [];
    },

    async fetchServerData() {
      const response = await this.datas({
        filter: this.filter,
        sort: this.sort,
        pager: this.pager
      });
      if (this._.isArray(response)) {
        return response;
      }
      if (response.data.pager) {
        if (this.pager.size != response.data.pager.size) {
          this.cleanCache();
        }
        console.log(response)
        this.pager.page = response.data.pager.page;
        this.pager.size = response.data.pager.size;
        this.pager.total = response.data.pager.total;
      }
      return response.data.data;
    },

    async refresh() {
      this.cleanCache();
      await this.mapDataToRows();
      this.refreshStatus();
    },
    onSorting(sort) {
      this.sort = sort;
      this.cleanCache();
      this.mapDataToRows();
      this.saveState();
      this.refreshStatus();
    },
    saveState() {
      localCache.set(this.storageKey, this._.pick(this.$data, ['filter', 'sort']), this.cacheLifetime);
    },
    restoreState() {
      const previousState = localCache.get(this.storageKey);
      if (previousState === null) {
        return;
      }
      this.sort = previousState.sort;
      this.filter = previousState.filter;

      this.saveState();
    },
    getColumn(columnName) {
      return this.columns.find(column => column.field === columnName);
    },
    getWidth() {
      var w = 40;
      this.columns.forEach((c) => {
        // console.log(c,c.hidden,c.label);
        if (!c.hidden)
          w += (parseInt(c.width) || 0);
      });
      return w + "px";
    },
    getSelectedDatas(isAll) {
      const rows = [];
      if (isAll) {
        this._.forEach(this.selectedRows, (cv, ck) => {
          this._.forEach(cv, (v, k) => {
            rows.push(v);
          });
        });
      } else {
        let items = this.selectedRows[this.pageCacheKey];
        items && this._.forEach(items, (v, k) => {
          rows.push(v);
        });
      }
      return rows;
    },
    isSelected(row) {
      let selected = false,
        vueRowId = row && row.vueRowId || row;
      const rows = this.getSelectedDatas(true);
      this._.forEach(rows, (v, k) => {
        if (v.vueRowId == vueRowId)
          selected = true;
      });
      return selected;
    },

    setColumns(instances) {
      this.columns = instances.map(column => new Column(column));
    },
    addColumn(instance) {
      this.columns.push(new Column(instance));
    },
    addDatas(datas) {
      if (this._.isArray(datas)) {
        datas.forEach((data) => {
          data.sys_created = true;
          data.sys_stated = billState.INSERT;
          this.rows.push(this.formatDataToRow(data));
        });
      } else {
        datas.sys_created = true;
        datas.sys_stated = billState.INSERT;
        this.rows.push(this.formatDataToRow(datas));
      }
    },
    rowChange(row,column){
      // console.log('rowChange',row,column);
      this.$emit('rowChange', row,column);
    },
    getAllDatas() {
      const datas = [];
      this._.forEach(this.cacheRows, (cv, ck) => {
        this._.forEach(cv, (v, k) => {
          datas.push(v.data);
        });
      });
      return datas;
    },
    getPostDatas() {
      return this.getAllDatas().map(v => {
        if (v.sys_deleted && !v.sys_created) {
          v.sys_state = 'd';
        } else if (v.sys_created && !v.sys_deleted) {
          v.sys_state = 'c';
        } else if (v.sys_updated && !v.sys_created && !v.sys_deleted) {
          v.sys_state = 'u';
        }
        return v;
      }).filter(v => (v.sys_state == 'c' || v.sys_state == 'u' || v.sys_state == 'd'));
    },
  },
  created() {
    this.sort.field = this.sortBy;
    this.sort.order = this.sortOrder;
    this.restoreState();
  },

  async mounted() {
    if (this.$slots.default && this.$slots.default.filter) {
      const columnComponents = this.$slots.default
        .filter(column => column.componentInstance)
        .map(column => column.componentInstance);
      this.setColumns(columnComponents);

      columnComponents.forEach(columnCom => {
        Object.keys(columnCom.$options.props).forEach(
          prop => columnCom.$watch(prop, () => {
            this.setColumns(columnComponents);
          })
        );
      });
    }
    this.width = this.getWidth();
    this.pager.size=this.pagerSize;
    if (this.autoLoad) {
      await this.mapDataToRows();
    }
    this.$nextTick(() => {
      this.canFireEvents = true;
      this.refreshStatus();
    });
  },
};
</script>