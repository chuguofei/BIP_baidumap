<template>
  <md-layout md-flex="100">
    <md-card>
      <md-card-media>
        <md-layout md-flex="33" md-flex-xsmall="100" class="md-bip-chart" v-if="showChart">
          <md-chart ref="reportChart" :options="option" :autoResize="true"></md-chart>
        </md-layout>
      </md-card-media>
      <md-layout class="flex">
        <md-table-card v-if="tjcell">
          <md-table class="flex">
            <md-table-header>
              <md-table-row>
                <md-table-head v-for="(item, index) in tjcell.cels" :key="index">{{item.labelString}}</md-table-head>
              </md-table-row>
            </md-table-header>
            <md-table-body>
              <md-table-row :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in tjpages.celData" :key="rowIndex" :md-item="row" v-if="startIndex<=rowIndex && endIndex>=rowIndex">
                <md-table-cell v-for="(column, columnIndex) in tjcell.cels" :key="columnIndex" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                  <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" @makeRef="makeRef"></md-bip-ref>
                </md-table-cell>
              </md-table-row>
            </md-table-body>
          </md-table>
          <md-table-tool>
            <md-layout class="flex"></md-layout>
            <md-table-pagination :md-size="pageInfo.size" :md-total="pageInfo.total" :md-page="pageInfo.page" md-label="每页" md-separator="/" :md-page-options="[10,20, 30, 50]" @pagination="onTablePagination">
            </md-table-pagination>
          </md-table-tool>
        </md-table-card>
      </md-layout>
    </md-card>
  </md-layout>
</template>
<script>
import common from "../commonModal.js";
export default {
  data() {
    return {
      option: {},
      pageInfo: {
        size: 999,
        total: 0,
        page: 1
      },
      tjcell: {},
      tjpages: {},
      startIndex: 1,
      endIndex: 0,
      refValues: [],
      chartData: []
    };
  },
  mixins: [common],
  props: {
    groupfilds: Array,
    groupdatafilds: Array,
    pcell: String,
    searchCelId: String,
    modal: Object,
    doSearch: Number,
    chartType: String,
    showChart: { type: Boolean, default: true }
  },
  mounted() {
    this.tjcell = this.ptjCell;
    this.tjpages = this.ptjPage;
    this.option = {};
    this.pieOption = {};
    this.searchData();
    if (this.tjpages) {
      this.makeColumnOpitons();
    }
  },
  watch: {
    // 'option': function() {
    // },
    doSearch: function() {
      if (this.doSearch) this.searchData();
    },
    pcell: function() {
      this.searchData();
    },
    refValues: function() {
      this.makeDataUI();
    }
  },
  methods: {
    async searchData() {
      this.pageInfo.page = 1;
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDDATA,
        pcell: this.pcell,
        psearch: this.searchCelId,
        pdata: JSON.stringify(this.modal),
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        groupfilds: JSON.stringify(this.groupfilds),
        groupdatafilds: JSON.stringify(this.groupdatafilds)
      };
      // console.log('chart serach',this.groupfilds.length,this.groupdatafilds.length,this.pcell,this.doSearch);
      if (
        this.groupfilds.length > 0 &&
        this.groupdatafilds.length > 0 &&
        this.pcell &&
        this.doSearch >= 0
      ) {
        var res = await this.getDataByAPINew(data1);
        // console.log(res);
        if (res.data.id === 0) {
          this.tjcell = res.data.data.tjlayCels;
          this.tjpages = res.data.data.tjpages;
          await this.makeDataUI();
        }
      }
    },
    // getCallBack(res) {
    //   console.log(res, "bipchart");
    //   if (res.data.id === 0) {
    //     this.tjcell = res.data.data.tjlayCels;
    //     this.tjpages = res.data.data.tjpages;
    //     this.makeDataUI();
    //   }
    // },
    async makeDataUI() {
      this.pageInfo.total = this.tjpages.totalItem;
      this.pageInfo.size = this.tjpages.pageSize;
      this.chartData = [];
      if (this.pageInfo.total > 50) {
        console.log("数据太多了，页面无法显示，只能显示50行");
        this.chartData = _.take(this.tjpages.celData, 50);
      } else {
        this.chartData = this.tjpages.celData;
      }
      this.caclStartAndEndIndex();
      if (this.chartType == "pie") {
        await this.makePieOpitons();
      } else {
        await this.makeColumnOpitons();
      }
    },
    getCallError(res) {},
    //饼状图
    async makePieOpitons() {
      var pieOption = {
        chart: {
          type: "pie",
          spacing: [0, 0, 0, 0],
          margin: [0, 0, 0, 0],
          height: "200px"
        },
        title: {
          text: "",
          floating: true,
          align: "center",
          verticalAlign: "middle"
        },
        // colors: ['#F7464A', '#46BFBD', '#FDB45C','#4CBE5D'],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            borderWidth: 0,
            innerSize: "60%",
            shadow: false,
            center: ["50%", "50%"],
            dataLabels: {
              enabled: false
            },
            showInLegend: true,
            point: {
              events: {
                click(e) {
                  this.series.chart.setTitle({
                    text:
                      this.name +
                      "<br/>" +
                      Math.round(this.percentage * 100) / 100 +
                      "%"
                  });
                }
              }
            }
          }
        },
        tooltip: { enabled: false },
        legend: {
          enabled: true,
          symbolRadius: 3,
          align: "left",
          verticalAlign: "middle",
          floating: true,
          layout: "vertical"
        },
        series: [
          {
            type: "pie",
            data: []
          }
        ]
      };
      var data = [];
      for(let i=0;i<this.chartData.length;i++){
        var item = this.chartData[i];
        var name = await this.getGroupFldName(item);
        data.push({ name: name, y: item[this.groupdatafilds[0]] });
      }
      pieOption.series[0].data = data;
      this.option = pieOption;
      // this.$refs.bipRChart.mergeOption(this.option);
    },
    //线图、柱状图
    async makeColumnOpitons() {
      let options = {
        chart: {
          type: "column"
        },
        title: {
          text: this.getTitle() + "统计"
        },
        subtitle: {
          text: ""
        },
        xAxis: {
          categories: [],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ""
          }
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: []
      };
      if (this.chartType == "line") {
        options.chart.type = this.chartType;
      }
      var categories = [];
      var series = [];
      options.xAxis.categories.splice();
      options.series.splice();
      for(let i=0;i<this.chartData.length;i++){
        var item = this.chartData[i];
        var name = await this.getGroupFldName(item);
        categories.push(name);
        // console.log(categories,name);
        _.each(this.groupdatafilds, (fld, key1) => {
          let colname = this.getFldName(fld);
          var _idx = _.findIndex(series, function(im) {
            return im.name == colname;
          });
          if (_idx >= 0) {
            var bb = series[_idx];
            bb.data[i] = item[fld];
            series[_idx] = bb;
          } else {
            var bb = { name: colname, data: [] };
            bb.data[i] = item[fld];
            series.push(bb);
          }
        });
      }
      options.xAxis.categories = categories;
      options.series = series;
      this.option = options;
    },
    async getGroupFldName(items) {
      // console.log(items,'999999999');
      var name = "";
      for(let i=0;i<this.groupfilds.length;i++){
        var id = this.groupfilds[i];
        var code = items[id];
        var cell = this.getCellById(id);
        var rr = cell.refValue;
          if (rr != null && rr) {
          if (rr.indexOf("$") > 0) {
            var val = JSON.parse(window.sessionStorage.getItem(rr));
            _.forEach(val.values, item => {
              if (item.code == code) {
                name += item.name + "-";
              }
            });
          } else if (rr.indexOf("&") > 0) {
            // console.log(cell,rr);
            var val = JSON.parse(window.sessionStorage.getItem(rr + "." + code));
            if (val) {
              var itemName = val.value[val.allCols[1]];
              itemName = itemName ? itemName : code;
              name += val.value[val.allCols[1]] + "-";
            } else {
              if (code === "") {
                name += code + "-";
              } else {
                var cc = await this.getCLByAPI({ assistid: rr, cont: code });
                if (cc.data.code == 1) {
                  var cldata = { allCols: cc.data.allCols };
                  var vvs = cc.data.values;
                  if (vvs.length === 1) {
                    cldata.value = vvs[0];
                  } else {
                    var indx = _.findIndex(vvs, item => {
                      return item[cldata.allCols[0]] === code;
                    });
                    cldata.value = vvs[indx];
                  }
                  name += cldata.value[cldata.allCols[1]] + "-";
                  if (!window.sessionStorage.getItem(rr + "." + code))
                    window.sessionStorage.setItem(rr + "." + code,JSON.stringify(cldata));
                } else {
                  name += code + "-";
                }
              }
            }
          }
        } else {
          name += items[id] + "-";
        }
      }
      if (name.indexOf("-") > 0) name = name.substr(0, name.length - 1);
      return name;
    },
    getFldName(id) {
      var _idx = _.findIndex(this.tjcell.cels, function(cell) {
        return cell.id == id;
      });
      if (_idx == -1) {
        return id;
      } else {
        return this.tjcell.cels[_idx].labelString;
      }
    },
    getTitle() {
      var title = "";
      this._.each(this.groupfilds, (fld, indx) => {
        title += this.getFldName(fld) + "-";
      });
      return (title = title.substr(0, title.length - 1));
    },
    onTablePagination(pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.caclStartAndEndIndex();
    },
    caclStartAndEndIndex() {
      this.startIndex = (this.pageInfo.page - 1) * this.pageInfo.size;
      this.endIndex = this.startIndex + this.pageInfo.size - 1;
    },
    makeRef(refId, refData) {
      var data = { id: refId, code: refData.code, name: refData.name };
      var exi = _.findIndex(this.refValues, data);
      if (exi === -1) {
        this.refValues.push(data);
      } else {
        data = this.refValues[exi];
        data.name = refData.name;
        this.refValues[exi] = data;
      }
      var id = refId;
      var code = refData.code;
      var _self = this;
      var getNum = _.findIndex(this.refValues, function(item) {
        return item.id === id && item.code == code;
      });
    },
    getCellById(id) {
      var cc = null;
      _.forEach(this.tjcell.cels, item => {
        if (item.id == id) {
          cc = item;
        }
      });
      return cc;
    }
  }
};
</script>

<style>
.myChart {
  min-height: 200px;
  height: 300px;
}

.md-bip-chart {
  height: 300px;
}
</style>
