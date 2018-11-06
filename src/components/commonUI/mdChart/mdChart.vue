<template>
  <div class="md-chart"></div>
</template>
<script>
import Highcharts from 'highcharts';
require('highcharts/highcharts-3d')(Highcharts);
var defaultOpts = {
  credits: { enabled: false },
  title: {
    style: { "color": "#222222", "fontSize": "24px" }
  },
  subtitle: {
    style: { "fontSize": "14px" }
  },
  chart: {
    style: { fontFamily: '\"PingFang SC\",\"Hiragino Sans GB\",\"Microsoft YaHei\","\"Lucida Grande\"' }
  }
};
export default {
  props: {
    options: Object,
    autoResize: Boolean
  },
  data() {
    return {
      msg: 1,
      chart: null,
      resizeEvt: ''
    }
  },
  methods: {
    formatOption(options) {
      return this._.extend({}, defaultOpts, options);
    },
    addSeries(options) {
      this.delegateMethod('addSeries', this.formatOption(options));
    },
    removeSeries() {
      if(this.chart&&this.chart.series){
        while (this.chart.series.length > 0) {
          this.chart.series[0].remove(false);
        }
        this.chart.redraw();
      }
    },
    mergeOption(options) {
      this.init(options);
      this.delegateMethod('update', this.formatOption(options))
    },
    redraw() {
      this.delegateMethod('redraw');
    },
    showLoading(txt) {
      this.chart && this.chart.showLoading(txt);
    },
    hideLoading() {
      this.chart && this.chart.hideLoading();
    },
    delegateMethod(name, ...args) {
      if (!this.chart) {
        console.error('Cannot call  before the chart is initialized');
        return
      }
      return this.chart[name](...args)
    },
    callback(chart) {
      this.$emit('callback', chart);
    },
    init(options) {
      options = options || this.options;
      if (options) {
        this.chart = new Highcharts.Chart(this.$el, this.formatOption(options), (c) => {
          this.callback(c);
        });
        if (this.autoResize) {
          this.resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
          if (document.addEventListener) {
            window.addEventListener(this.resizeEvt, this.resizeHanlder, false);
          }
        }
      }
    }
  },
  watch: {
    options: function(options) {
      this.init();
    }
  },
  mounted() {
    if (!this.chart && this.options) {
      this.init();
    }
  },
  beforeDestroy() {
    if (this.autoResize) {
      if (document.removeEventListener) {
        window.removeEventListener(this.resizeEvt, this.resizeHanlder, false);
      }
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>