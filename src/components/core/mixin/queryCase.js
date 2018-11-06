export default {
  data() {
    return {
      loading: 0,
      queryId: '',
    };
  },
  watch: {

  },
  methods: {
    initQuery(options, promise) {
      this.$http.get('sys/queries/' + this.queryId).then(response => {
        options.query = response.data.data.query;
        options.wheres = options.query.wheres;
        options.orders = options.query.orders;
        options.columns = options.query.columns;

        if (this.atferInitQuery) {
          this.atferInitQuery(options, promise);
        }
      }, response => {
        promise.resolve('ok');
      });
    },
    doQuery(options){
    },
    cancelQuery(options) {

    },
  }
};