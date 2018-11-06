<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="create">新建</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="delList">删除</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
      </md-part-toolbar-group>
      <md-part-toolbar-pager @paging="paging" :options="pager"></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>{{mdTitle}}</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>列表</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
         <md-layout class="flex">
          <md-table-card>
            <md-table @select="onTableSelect" class="flex">
              <md-table-header>
                <md-table-row v-if="dsm">
                  <md-table-head v-for="(item, index) in dsm.ccells.cels" :key="item.id" v-if="item.isShow" :md-numeric="item.type===3">{{item.labelString}}</md-table-head>
                </md-table-row>
              </md-table-header>
              <md-table-body v-if="dsm">
                <md-table-row v-if="dsm.cdata.length==0">
                  <md-layout>
                      <md-content>                      
                        <md-button class="md-fab md-fab-center-center">
                        <md-icon>verified_user</md-icon>
                      </md-button>
                      <span class="md-fab-center-center">没有获取到数据</span></md-content>
                  </md-layout>
                </md-table-row>
                <md-table-row v-else :class="setRowColor(rowIndex)?'md-tr-color':''" v-for="(row, rowIndex) in dsm.cdata" 
                  :key="rowIndex"
                  :md-item="row" 
                  :md-auto-select="mdAutoSelect" 
                  :md-selection="mdSelection" 
                  @dblclick.native="dblclick(row,rowIndex)">
                  <md-table-cell v-for="(column, columnIndex) in dsm.ccells.cels" :key="columnIndex" v-if="column.isShow" :md-numeric="column.type<12" :class="numRed(row[column.id],column) ? 'md-num-red':''">
                    <md-bip-ref :inputValue="row[column.id]" :bipRefId="column" :md-numeric="column.type === 3" :modal="row" @pkclick="dblclick(row,rowIndex)"></md-bip-ref>
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
          <md-loading :loading="loading"></md-loading>
         </md-layout>
      </md-content>
    </md-part-body>
  </md-part>
</template>
<script>
import BillState from '../classes/billState';
export default {
  data () {
    return {
      mdAutoSelect: true,
      mdSelection: true,
      loading:0,
      pager:{
        firstId:'1',
        lastId:'',
        prevId:'',
        nextId:'',
      },
      pageInfo:{
        size:20,
        page:1,
        total:0
      }
    }
  },
  props: {dsm:Object,dsext:Array,dscont:Object,mdTitle:String,opera:Object},
  created(){
    if(this.dsm){
      this.fetchUIData();
    }
  },
  methods:{
    pkclick(row){
      console.log(row);
    },
    create(){
      this.dsm.index=-1;
      this.$emit('addBill');
    },
    initInfo(){
      this.pager = {firstId:'1',lastId:'', prevId:'', nextId:'',};
      this.pageInfo = {size:20,page:1,total:0};
    },
    paging(page){
      if(page==this.pageInfo.page){
        return;
      }
      this.pageInfo.page = page;
      this.fetchUIData();
    },
    onTableSelect(item){
      this.selectData = item;
    },
    setRowColor(_index){
      _index = _index % 2;
      if ( _index !== 0){
        return true;
      }
      return false;
    },
    onTablePagination (pager) {
      this.pageInfo.page = pager.page;
      this.pageInfo.size = pager.size;
      this.fetchUIData();
    },
    async fetchUIData () {
      this.loading++;
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_FINDCELLDATA,
        'pcell': this.dsm.pcell,
        'pdata': '',
        'bebill':  1,
        'currentPage': this.pageInfo.page,
        'pageSize': this.pageInfo.size,
        'cellid': ''
      }
      var res = await this.getDataByAPINewSync(data1);
      if(res.data.id==0){
        if(this.dsm.cdata.length>0){
          this.dsm.clearData();
        }
        _.forEach(res.data.data.pages.celData,row=>{
          row.sys_stated = BillState.HISTORY;
          this.dsm.addRow(row);
        });
        this.pageInfo.total = res.data.data.pages.totalItem;
        var total = res.data.data.pages.totalPage;
        console.log('total',total)
        if(total>0){
          this.pager.nextId= total==1? '':(this.pageInfo.page==total? '':(parseInt(this.pageInfo.page)+1)+'');
          this.pager.prevId = (parseInt(this.pageInfo.page)==1?'':(parseInt(this.pageInfo.page)-1)+'');
          this.pager.lastId = total==1?'':(this.pageInfo.page==total)?'':total+'';
        }
      }
      this.loading--;
    },
    numRed (vals,cell) {
      if(cell.type === 3 &&vals<0)
        return true;
      return false;
    },
    dblclick(row,index){
      // console.log(row,index);
      this.dsm.currRecord = row;
      this.dsm.index = index;
      this.$emit('addBill');
    },

    //删除数据
    delList(){
      console.log(this.selectData);
      _.forEach(this.selectData,item=>{
        if(this.opera){
          var state = item[this.opera.statefld];
          var sid  = item[this.opera.pkfld];
          if(state !== '0' && state !=='1'){
            this.$notify.warning({content: '不能删除'+sid+'!'});
          }else{
            item.sys_stated = 4;
            var str = JSON.stringify(item);
            var options = { pcell: this.dsm.pcell, jsonstr: str };
            this.saveData(options,this.delSuccess);
            // console.log(res);
          }
        }
        console.log(item);
      });
      // var _self = this;
      // _.forEach(this.selectData,function(n,key){
      //   n.sys_stated = 4;
      //   var str = JSON.stringify(n);
      //   //  console.log(str);
      //   var options = {'pcell': _self.mparams.pcell, 'jsonstr': str};
      //   // _self.saveData(options,_self.delSuccess,_self.delError);
      // });
      // this.$notify.success({content: '删除成功！'});
    },
    delSuccess(res){
      if(res.data.id == 0){
        this.$notify.info({content: '删除成功！'});
        this.fetchUIData();
      }
    },
    // delError(res){
    //   this.$notify.danger({content: '出错了！'});
    // }
  },
  watch:{
    dsm(){
      if(this.dsm){
        this.initInfo();
        this.fetchUIData();
      }
    }
  }
}
</script>

