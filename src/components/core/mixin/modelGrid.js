export default {
  methods: {
    async fetchLineDatas({ pager }) {
      if (!this.model.main.id) {
        return [];
      }
      return await this.$http.get(this.route + '/' + this.model.main.id + '/lines', { params: pager });
    },
    beforeSave() {
      if (this.$refs.grid) {
        this.$refs.grid.endEdit();
        this.model.main.lines = this.$refs.grid.getPostDatas();
      }
    },
    afterLoadData() {
      this.$refs.grid && this.$refs.grid.refresh();
    },
    afterCreate() {
      this.$refs.grid && this.$refs.grid.refresh();
    },
    afterCopy() {
      this.$refs.grid && this.$refs.grid.refresh();
    },
    afterSave() {
      this.$refs.grid && this.$refs.grid.refresh();
    },
  }
};