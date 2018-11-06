<template>
  <md-part>
    <template v-if="!bdj">
      <md-table-card class="flex">
        <md-table class="flex">
          <md-table-header>
            <md-table-row>
              <md-table-head>操作</md-table-head>
              <md-table-head v-for="item in taskLayCel.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="(row, rowIndex) in taskValues" :key="rowIndex" :md-item="row" :class="setRowColor(rowIndex)?'md-tr-color':''">
              <md-table-cell>
              <md-part-toolbar-group>
                <md-button class="md-icon-button md-list-action" @click="rowClick(row)">
                  <md-icon class="md-accent">settings</md-icon>
                </md-button>
              </md-part-toolbar-group>
              </md-table-cell>
              <md-table-cell v-for="(column, columnIndex) in taskLayCel.cels" :key="columnIndex" v-if="column.isShow">
                <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row"></md-bip-ref>
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
    </template>
    <template v-if="bdj">
      <md-bip-task-applet :dsm="ds_m" :dsext="ds_ext" :opera="opera" @gotask="gotask"></md-bip-task-applet>
    </template>
  </md-part>
</template>


<script>
import Operation from "@/components/views/operation/operation";
import CDataSet from '@/components/views/classes/CDataSet';
import BillState from '@/components/views/classes/billState';
import Stomp from "stompjs";
const BIPTASK = "biptask";
export default {
  data() {
    return {
      taskLayCel: {},
      taskValues: [],
      pageInfo: {
        size: 20,
        page: 1,
        total: 0
      },
      opera: {},
      ds_m:{},
      ds_ext:[],
      menuList: JSON.parse(window.sessionStorage.getItem("menulist")),
      mparams:null,
      bdj: false,
      userCode:JSON.parse(window.sessionStorage.getItem("user")).userCode,
      taskCli:null,
      isconnt: false
    };
  },
  created() {
    this.fetchTaskData();
    this.connectQ();
  },
  beforeDestroy(){
    if(this.isconnt){
      this.disconnect();
    }
      
  },
  methods: {
    gotask(){
      this.bdj = false;
    },
    disconnect() {
      this.taskCli.disconnect();
    },
    connectQ: function() {
      //初始化mqtt客户端，并连接mqtt服务
      var ws = new WebSocket(global.MQTT_SERVICE);
      this.taskCli = Stomp.over(ws);
      var headers = {
        login: global.MQTT_USERNAME, //用户名
        passcode: global.MQTT_PASSWORD, //密码
        host: global.MQTT_HOST // 虚拟空间
      };
      this.taskCli.connect(headers, this.onConnected, this.onFailed);
    },
    onConnected: function(frame) {
      this.isconnt = true;
      // console.log("Connected: " + frame);
      //订阅频道
      var topic ="/exchange/" +BIPTASK +"/" + BIPTASK +"." +global.DBID +"." +this.userCode;
      this.taskCli.subscribe(topic, this.responseCallback);
    },
    responseCallback: function(frame) {
      if(!this.bdj)
        this.fetchTaskData();
    },
    async fetchTaskData() {
      var data1 = {
        dbid: global.DBID,
        usercode: this.userCode,
        apiId: global.APIID_CELLPARAM,
        pcell: "SYRW",
        pdata: "{brd:0,}",
        bebill: 1,
        currentPage: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        cellid: ""
      };
      var res = await this.getDataByAPINew(data1);
      // console.log(res);
      if (res.data.id == 0) {
        this.taskLayCel = await this.makeCellCL(res.data.data.layCels);
        this.taskValues = res.data.data.pages.celData;
        this.pageInfo.page = res.data.data.pages.currentPage;
        this.pageInfo.total = res.data.data.pages.totalItem;
        this.pageInfo.size = res.data.data.pages.pageSize;
      }
    },
    async rowClick(row) {
      // console.log(row);
      row.brd = 1;
      var pflow = row.buid;
      var data1 = {
        dbid: global.DBID,
        usercode: this.userCode,
        apiId: "buid",
        buid: pflow
      };
      var bb = await this.getDataByAPINewSync(data1);
      if (bb.data.id == 0) this.opera = new Operation(bb.data.data.opt);
      if (this.opera) {
        var menuid = this.opera.pmenuid;
        var bb = this.getMenuById(this.menuList, menuid);
        // console.log(bb);
        // this.bdj = true;
        if(bb)
          await this.fetchParams(pflow,menuid);
        else
          this.mparams = null;
        if(this.mparams){
          await this.getCell();
          var pdata = {};
          pdata[this.opera.pkfld] = row.buno;
          await this.fetchUIData(pdata);
          if(this.ds_m.cdata.length>0)
            this.bdj = true;
        }
      }
    },
    async fetchUIData (pdata) {
      this.loading++;
      var data1 = {
        'dbid': global.DBID,
        'usercode': this.userCode,
        'apiId': global.APIID_FINDCELLDATA,
        'pcell': this.ds_m.pcell,
        'pdata': JSON.stringify(pdata),
        'bebill':  1,
        'currentPage': 1,
        'pageSize': 1,
        'cellid': ''
      }
      // console.log(data1);
      var res = await this.getDataByAPINewSync(data1);
      if(res.data.id==0){
        if(this.ds_m.cdata.length>0){
          this.ds_m.clearData();
        }
        _.forEach(res.data.data.pages.celData,row=>{
          row.sys_stated = BillState.HISTORY;
          this.ds_m.addRow(row);
        });
      }
    },
    setRowColor(_index) {
      _index = _index % 2;
      if (_index !== 0) {
        return true;
      }
      return false;
    },
    onTablePagination(page) {
      // console.log(page);
      this.pageInfo.size = page.size;
      this.pageInfo.page = page.page;
      this.fetchTaskData();
    },
    getMenuById(menus, id) {
      var menu = null;
      for (let i = 0; i < menus.length; i++) {
        var item = menus[i];
        // console.log(item);
        if (item.menuId == id) {
          menu = item;
        } else {
          if (item.haveChild) {
            menu = this.getMenuById(item.childMenu, id);
          }
        }
        if (menu) {
          break;
        }
      }
      return menu;
    },
    async fetchParams(pbuid,pmenuid) {
      var data1 = {
        dbid: global.DBID,
        usercode: this.userCode,
        apiId: global.APIID_MPARAMS,
        pbuid: pbuid,
        pmenuid: pmenuid
      };
      if (pbuid && pmenuid) {
        //var bb = await this.getDataByAPINew(data1,this.getCallBack,this.getCallError);
        var res = await this.getDataByAPINewSync(data1);
        // console.log(res);
        if (res.data.id == 0) {
          this.mparams = res.data.data.mparams;
        } else {
          // console.log(res);
          this.$notify.warning({
            content: res.data.message,
            placement: "mid-center"
          });
        }
      }
    },
    async getCell(){
      var pcell = this.mparams.pcell;
      var data1 = {
      'dbid': global.DBID,
      'usercode': this.userCode,
      'apiId': global.APIID_CELLPARAMS,
      'pcell': pcell
      }
      var res = await this.getDataByAPINewSync(data1);
      var data = res.data;
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
          this.ds_m = new CDataSet(cells0);
          this.ds_m.setPcell(pcell);
          for(var i=0;i<celL-2;i++){
            var cellsi = await this.makeCellCL(cells[i+1]);
            var ds = new CDataSet(cellsi);
            this.ds_ext[i] = ds;
          }
        }
      }else{
        this.$notify.warning({content: data.message,placement:'mid-center'});
      }
    }
  },
  watch:{
    bdj(){
      if(!this.bdj){
        this.fetchTaskData();
      }
    }

  }

};
</script>

<style lang="scss" scoped>
</style>

