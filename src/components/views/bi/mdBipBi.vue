<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="search()">查询</md-button>
        <!-- <md-button @click.native="clear">清空</md-button> -->
      </md-part-toolbar-group>
      <!-- <md-part-toolbar-group>
        <md-button>复制</md-button>
      </md-part-toolbar-group> -->
      <md-part-toolbar-group>
        <md-button @click.native="list()">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="searchCount('dialog')">统计</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
          <md-button @click.native="showSearchInfo">{{showContLabel}}</md-button>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>列表</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
        <template v-if="showCont">
          <md-layout md-gutter="4" v-if="ds_cont">
            <template v-if="showAllCont">
              <md-bip-input v-for="(cell, index) in ds_cont.ccells.cels" :key="cell.id" :cell="cell" :modal="ds_cont.currRecord" :is-search="true" v-if="cell.isShow" :btj="true"></md-bip-input>
            </template>
            <template v-else>
              <md-bip-input v-for="(cell, index) in ds_cont.ccells.cels" :key="cell.id" :cell="cell" :modal="ds_cont.currRecord" :is-search="true" v-if="cell.isShow&&index<4" :btj="true"></md-bip-input>
            </template>
            <md-button class="bip-more md-icon-button" @click.native="showMore()">
              <md-tooltip md-direction="right">{{tipLaber}}</md-tooltip>
              <md-icon>list</md-icon>   
            </md-button>
          </md-layout>
          
        </template>
        <template v-if="!groupTJ">
          <md-layout class="flex">
            <md-table-card>
              <md-table class="flex" v-if="ds_m">
                <md-table-header>
                  <md-table-row>
                    <md-table-head v-for="(item, index) in ds_m.ccells.cels" :key="index" v-if="item.isShow" :md-numeric="item.type<12">{{item.labelString}}</md-table-head>
                  </md-table-row>
                </md-table-header>
                <md-table-body>
                  <md-table-row :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in ds_m.cdata" 
                    :key="rowIndex"
                    :md-item="row" 
                    :md-auto-select="mdAutoSelect" 
                    :md-selection="mdSelection" 
                    @dblclick.native="dblclick(row)">
                    <md-table-cell v-for="(column, columnIndex) in ds_m.ccells.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                      <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type<12"></md-bip-ref>
                    </md-table-cell>
                  </md-table-row>
                </md-table-body>
              </md-table>
              <md-table-tool>
                <md-layout class="flex"></md-layout>
                <md-table-pagination
                    :md-size="pageInfo.size"
                    :md-total="pageInfo.total"
                    :md-page="pageInfo.page"
                    md-label="每页"
                    md-separator="/"
                    :md-page-options="[10,20, 30, 50]"
                    @pagination="onTablePagination"
                    >
                </md-table-pagination>
              </md-table-tool>
            </md-table-card>
          </md-layout>
        </template>
        <template v-else>
          <md-layout class="flex" >
            <md-bip-chart :groupfilds="groupfilds" :groupdatafilds="groupdatafilds" :modal="ds_cont.currRecord" :pcell="ds_m.ccells.obj_id" :doSearch="doSearCh" :searchCelId="ds_cont.ccells.obj_id"  :chartType="ctype" :showChart="showChart"></md-bip-chart>
          </md-layout>
        </template>
       </md-content>
        <md-loading :loading="loading"></md-loading>
       <md-dialog ref="dialog" class="md-bip-dialog" v-if="ds_m">
        <md-dialog-title>{{mdTitle}}--统计选择</md-dialog-title>
        <md-dialog-content>
          <md-input-container>
            <label for="groupfilds" >统计项选择</label>
            <md-select id="groupfilds" multiple v-model="groupfilds" required>
              <md-option v-for="(cell, index) in ds_m.ccells.cels"
                :key="index"
                :value="cell.id" v-if="cell.type !== 3 &&cell.isShow">
                {{cell.labelString}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="groupdatafilds">数据项选择</label>
            <md-select multiple v-model="groupdatafilds" required>
              <md-option v-for="(cell, index) in ds_m.ccells.cels"
                :key="index"
                :value="cell.id" v-if="cell.type == 3&&cell.isShow">
                {{cell.labelString}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <label for="ctype">图表类型</label>
            <md-select v-model="ctype">
              <md-option v-for="(item) in chartList"
                :key="item.id"
                :value="item.id">
                {{item.name}}
              </md-option>
            </md-select>
          </md-input-container>
          <md-input-container>
            <md-checkbox id="my-test1" name="my-test1" v-model="checkShowC">是否显示图表</md-checkbox>
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog('dialog')">取消</md-button>
          <md-button class="md-primary" @click="okDialog('dialog')">确定</md-button>
        </md-dialog-actions>
      </md-dialog>
    </md-part-body>
  </md-part>
</template>
<script>
import CDataSet from '../classes/CDataSet';
import billS from '../classes/billState';
import common from '../commonModal.js'
export default {
  data(){
    return {
      showCont: false,
      showContLabel: '显示条件',
      ds_cont:null,
      ds_m:null,
      ds_ext:[],
      pageInfo: {
        size:20,
        total:0,
        page:1
      },
      // pages: {},
      mdAutoSelect: false,
      mdSelection: false,
      groupfilds: [],
      groupdatafilds: [],
      chartList:[{id:'pie',name:'饼图'},{id:'line',name:'线图'},{id:'column',name:'柱状图'}],
      checkShowC:1,
      ctype:'line',
      loading:0,
      groupTJ:false,
      showChart:true,
      tjcell:{},
      tjpage:{},
      doSearCh:0,
      showAllCont:false,
      tipLaber:'更多条件'
    }
  },
  mixins:[common],
  props: ['mdTitle','mparams'],
  methods:{
    async getCell(){
       var pcell = this.mparams.pcell;
       var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_CELLPARAMS,
        'pcell': pcell
      }
      var res = await this.getDataByAPINewSync(data1);
      var data = res.data;
      // console.log(data);
      if(data.id===0){
        var cells = data.data.layCels;
        const celL = cells.length;
        if(celL==1){
          var cells0 = cells[0];
          cells0 = await this.makeCellCL(cells0);
          this.ds_m = new CDataSet(cells0);
          this.ds_m.setPcell(pcell);
        }else{
          var cells0 = await this.makeCellCL(cells[0]);
          this.ds_cont = new CDataSet(cells0);
          this.ds_cont.createRecord();
          var cells1 = await this.makeCellCL(cells[1]);
          this.ds_m = new CDataSet(cells1);
          this.ds_m.setPcell(pcell);
          for(var i=2;i<celL-2;i++){
            var cellsi = await this.makeCellCL(cells[i+1]);
            var ds = new CDataSet(cellsi);
            this.ds_ext[i] = ds;
          }
        }
        if(!this.mparams.bgroup)
          this.fetchUIData();
        else{
          this.groupfilds = this.mparams.groupfilds;
          this.groupdatafilds = this.mparams.sumfilds;
          this.ctype = this.mparams.ctype;
          this.doSearCh++;
          this.groupTJ = true;
        }
      }else{
        this.$notify.warning({content: data.message,placement:'mid-center'});
      }
    },
    async fetchUIData(){
      this.loading++;
      var pdata = JSON.stringify(this.ds_cont.currRecord);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.ds_m.pcell,
        pdata: pdata,
        bebill: 0,
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        cellid: this.ds_m.ccells.obj_id
      };
      var res = await this.getDataByAPINewSync(data1);
      if(res.data.id==0){
        var pages = res.data.data.pages;
        this.ds_m.cdata = pages.celData;
        this.pageInfo.page = pages.currentPage;
        this.pageInfo.size = pages.pageSize;
        this.pageInfo.total = pages.totalItem;
      }
      this.loading--;
    },
    initInf(){
      this.pageInfo.size=20;
      this.pageInfo.page = 1;
      this.pageInfo.total = 0;
      this.showCont = false;
      this.groupTJ = false;
      this.showAllCont=false;
    },
    initCell(){
      this.initInf();
      if(this.mparams.pcell){
        this.ds_m = null;
        this.ds_cont = null;
        this.ds_ext = [];
        this.getCell();
      }
    },
    onTablePagination (pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.fetchUIData();
    },
    showSearchInfo () {
      this.showCont = !this.showCont;
      this.showContLabel = this.showCont ? '隐藏条件' : '显示条件';
      if(!this.showCont){
        this.showAllCont = false;
      }
    },
    dblclick (row) {
    },
    clear(){
      if(this.ds_cont){
        // var crd = this.ds_cont.currRecord;
        _.forEach(this.ds_cont.ccells.cels,item=>{
          this.$set(this.ds_cont.currRecord,item.id,'');
        });
        // console.log(crd);
        // this.ds_cont.currRecord = crd;
      }
    },
    list(){
      if(this.groupTJ){
        this.groupTJ = false;
        this.fetchUIData();
      }
    },
    searchCount (ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    okDialog(ref){
      if(this.groupdatafilds.length>0&&this.groupfilds.length>0){
        this.$refs[ref].close();
        this.groupTJ = true;
        this.showCont = false;
        if(this.doSearCh === Number.MAX_SAFE_INTEGER){
          this.doSearCh = 0;
        }else{
          this.doSearCh++;
        }
      }
    },
    search() {
      if(this.groupTJ){
        this.doSearCh++;
        this.showCont = false;
      }else{
        // this.pageInfo.page = 1;
        this.fetchUIData();
      }
    },
    showMore(){
      this.showAllCont = !this.showAllCont;
    }
    // async get
  },
  async mounted(){
    this.initCell();
  },
  watch:{
    showCont(){
      this.showContLabel = this.showCont?'隐藏条件':'显示条件'
    },
    mparams(){
      this.initCell();
    },
    showAllCont(){
      if(this.showAllCont){
        this.tipLaber = '隐藏其他条件';
      }else{
         this.tipLaber = '更多条件';
      }
    }
  },
  computed:{

  }
}
</script>

<style lang="scss" scoped>
.md-num-red{
  color: red;
}

.md-table-head.md-numeric {
    // text-align: right;
    color:rgba(81,162,81,.91);
}

.bip-more{
  // background-color: rgba(81,162,81,.91);
  font-size: 0.1rem;
  &.md-button{
    // height: 0.3rem;
    // min-height: 0.2rem;
    margin: 0.15rem 0.08rem;
  }
}

</style>
