export default {
  data() {
    return {
      model: {
        main: {},
        entity: '',
        pager: {
          firstId: '',
          lastId: '',
          prevId: '',
          nextId: '',
          total_items: 0
        },
        order: 'created_at',
        wheres: {}
      },
      loading: 0,
      route: ''
    };
  },
  computed: {
    canCopy() {
      return !!this.model.main.id;
    }
  },
  watch: {
    'model.main.id': function(value, oldValue) {
      value && this.loadData(value);
    }
  },
  methods: {
    validate() {
      return true;
    },
    initModel() { return {}; },

    create() {
      var m = this.initModel();
      if (m) {
        this._.forOwn(m, (value, key) => {
          this.$set(this.model, key, value);
        });
      }
      this.afterCreate();
    },
    afterCreate() {},

    cancel() {
      if (this.model.main && this.model.main.id) {
        this.loadData();
      } else {
        this.create();
      }
    },
    afterCancel() {},

    copy() {
      if (this.model.main && this.model.main.id) {
        this.model.main.id = null;
        if (this.model.main.code) {
          this.model.main.code = '';
        }
      }
      this.afterCopy();
      this.$toast('复制成功，请保存!');
    },
    afterCopy() {},

    loadData(id) {
      if (!id && this.model.main && this.model.main.id) {
        id = this.model.main.id;
      }
      if (id) {
        this.model.main.id = id;
        this.loading++;
        this.$http.get(this.route + '/' + id).then(response => {
          this.$set(this.model, 'main', response.data.data || {});
          this.afterLoadData(response.data.data);
          this.loading--;
        }, response => {
          if (response && response.data && response.data.data) {
            this.$toast(response.data.data);
          } else {
            this.$toast(response);
          }
          this.afterLoadData(false);
          this.loading--;
        });
      } else {
        this.create();
      }
      this.loadPagerInfo(id);
    },
    afterLoadData(data) {},

    beforeSave(data) {},
    save() {
      if (!this.validate()) {
        return false;
      }
      if (this.beforeSave(this.model.main) === false) {
        return false;
      }
      var iterable;
      if (this.model.main && this.model.main.id) {
        iterable = this.$http.put(this.route + '/' + this.model.main.id, this.model.main);
      } else {
        iterable = this.$http.post(this.route, this.model.main);
      }
      this.loading++;
      iterable && iterable.then(response => {
        // this.$set(this.model, 'main', response.data.data || {});
        this.afterSave(response.data.data);
        this.loading--;
        this.$toast(this.$lang.LANG_SAVESUCCESS);
      }, response => {
        this.$toast(response);
        this.afterSave(false);
        this.loading--;
      });
    },
    afterSave(data) {},

    paging(id) { this.loadData(id); },
    loadPagerInfo(id) {
      if (id) {
        this.$http.get('sys/entities/pager', {
          params: {
            entity: this.model.entity,
            id: id,
            order: this.model.order,
            wheres: this.model.wheres
          }
        }).then(response => {
          this.$set(this.model, 'pager', response.data.data);
        }, response => {});
      }
    },
  },
  created() {
    this.create();
    if (this.$route && this.$route.params && this.$route.params.id) {
      this.model.main.id = this.$route.params.id;
    }
  },
  mounted() {
    this.loadData(this.model.main.id);
  },
};