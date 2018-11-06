<template>
  <div class="md-grid-actions layout layout-row layout-align-space-between-center">
    <div class="layout-row layout-align-start-center">
      <md-button class="md-icon-button md-button-query" @click.native="onQuery()" v-if="showQuery">
        <md-icon>search</md-icon>
        <md-tooltip>查询</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onAdd()" v-if="showAdd">
        <md-icon>add</md-icon>
        <md-tooltip>新增行</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onInsert()" v-if="showInsert">
        <md-icon>playlist_play</md-icon>
        <md-tooltip>插入行</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onRemove()" v-if="showRemove">
        <md-icon>clear</md-icon>
        <md-tooltip>删除行</md-tooltip>
      </md-button>
      <md-button class="md-icon-button" @click.native="onReload()" v-if="showReload">
        <md-icon>autorenew</md-icon>
        <md-tooltip>重新加载</md-tooltip>
      </md-button>
    </div>
    <md-pagination v-if="pagerInfo" :pager="pagerInfo" :options="pagerOptions" @pagination="onPagination"></md-pagination>
    <div class="layout-row layout-align-end-center" v-if="showConfirm||showCancel">
      <md-button v-if="showConfirm" class="md-accent md-raised" @click.native="onConfirm()">确定</md-button>
      <md-button v-if="showCancel" class="md-warn" @click.native="onCancel()">取消</md-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pagerInfo: Object,
    pagerOptions: {
      type: [Array, Boolean],
      default: function() {
        return [5, 10, 20, 50]
      }
    },
    showQuery: { default: true, type: Boolean },
    showAdd: { default: true, type: Boolean },
    showInsert: { default: true, type: Boolean },
    showRemove: { default: true, type: Boolean },
    showReload: { default: true, type: Boolean },
    showConfirm: { default: true, type: Boolean },
    showCancel: { default: true, type: Boolean },
  },
  methods: {
    onPagination(pager) {
      this.$emit('pagination', pager);
    },
    onQuery() {
      this.$emit('onQuery');
    },
    onAdd() {
      this.$emit('onAdd');
    },
    onInsert() {
      this.$emit('onInsert');
    },
    onRemove() {
      this.$emit('onRemove');
    },
    onReload() {
      this.$emit('onReload');
    },
    onConfirm() {
      this.$emit('onConfirm');
    },
    onCancel() {
      this.$emit('onCancel');
    },
  },
  mounted() {}
};
</script>