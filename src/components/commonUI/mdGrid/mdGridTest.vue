<template>
  <div style="padding:40px;margin:20px">
    <md-ref @init="init_group_ref" md-ref-id="suite.cbo.country.ref" ref="lineRef" @confirm="lineRefClose"></md-ref>
    <!-- <button @click="onLineAdd">open ref</button>
    <md-grid :datas="datas" :auto-load="true" :row-focused="false">
      <md-grid-column field="id" label="id" :hidden="true" />
      <md-grid-column field="code" label="编码" editable/>
      <md-grid-column field="name" label="名称" />
      <md-grid-column field="date" label="日期" :formatter="formatter" />
      <md-grid-column label="g1">
        <template scope="row">
          {{ row.group1&&row.group1.name ||''}}
        </template>
        <template slot="editor" scope="row">
          <md-input-container>
            <md-input-ref @init="init_group_ref" md-ref-id="suite.amiba.group.ref" v-model="row.group1"></md-input-ref>
          </md-input-container>
        </template>
      </md-grid-column>
      <md-grid-column field="group2" label="g2" dataType="entity" editable ref-id="suite.amiba.group.ref" :ref-init="init_group_ref" />
      <md-grid-column field="type_enum" label="类型" dataType="enum" editable ref-id="suite.amiba.doc.use.type.enum" />
    </md-grid> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: [],
      refValues: []
    };
  },
  methods: {
    onLineAdd() {
      this.$refs['lineRef'].open();
    },
    lineRefClose(datas) {
      this._.forEach(datas, (v, k) => {
        this.datas.push({ name: v.name, group1: v, group2: v });
      });
    },
    init_group_ref(options) {
      options.wheres.purpose = false;
    },
    formatter(value, columnProperties) {
      return `Hi, ${value}`;
    },
    getDatas({ pager, filter, sort }) {
      var datas = [
        { id: 'John', code: 'Lennon1', name: 'Guitar', date: '04/10/1940', type_enum: 'indect' }
      ];
      this.datas = datas;
    },
    async fetchData({ pager, filter, sort }) {
      const response = await this.$http.get('cbo/countries', { params: pager });
      return response;
    }
  },
  created() {
    this.getDatas({});
  }
};
</script>