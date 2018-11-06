<template>
  <md-dialog ref="dialog"  @close="onRefClose" class="md-refs-dialog">
      <md-toolbar>
        <h1 class="md-title">{{title}}</h1>
        <md-input-container class="md-flex md-header-search">
          <md-input class="md-header-search-input"  placeholder="search" @keyup.enter.native="doQuery(word)" v-model="word"></md-input>
          <md-button class="md-icon-button md-inset" @click="doQuery(word)">
            <md-icon>search</md-icon>
          </md-button>
        </md-input-container>
        <md-button class="md-icon-button" @click.native="cancel()">
          <md-icon>close</md-icon>
        </md-button>
      </md-toolbar>
      <md-dialog-content class="no-padding">
        <md-table ref="table" @select="selectedRow" :multiple="multiple" :md-selection="mdSelection">
          <md-table-header>
            <md-table-row>
              <md-table-cell v-for="(name,index) in header" :key="index">
                {{name}}
              </md-table-cell>
            </md-table-row>
          </md-table-header>
          <md-table-body>
            <md-table-row v-for="(row, rowIndex) in refData" 
              :key="rowIndex" 
              :md-item="row"
              :md-selection="mdSelection" md-auto-select>
              <md-table-cell v-for="(column, columnIndex) in showCols" :key="columnIndex"  @dblclick.native="dblclick(row)">
                {{row[allCols[column]]}}
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
      </md-dialog-content>
      <md-dialog-actions>
        <md-table-pagination
          :md-size="pageInfo.size"
          :md-total="pageInfo.total"
          :md-page="pageInfo.page"
          :md-page-options="[10,20,30,40,50,100]"
           @pagination="onTablePagination"
         >
        </md-table-pagination>
        <span class="flex"></span>
        <md-button class="md-accent md-raised" @click.native="close()">确定</md-button>
        <md-button class="md-warn" @click.native="cancel()">取消</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
    },
    multiple: {
      type: Boolean,
      default: false
    },
    mdMax: {
      type: Number,
      default: Infinity
    },
    mdPageSize:{
      type:[Number,String],
      default:'20'
    },
    mdRefId: String,
    options:{
      type:Object,
      default(){
        return {
          wheres:{},
          orders:{}
        }
      }
    },
    mdSelection:{
      type:Boolean,
      default:false
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      word:'',
      refData:[],
      pageInfo:{
          size:this.mdPageSize,
          total:0,
          page:1
      },
      selectedRows:[],
      parentTable:'',
      header: [],
      showCols:[],
      allCols:[],
      title:''
    } 
  },
  mounted(){
    // this.doQuery();
  },
  methods:{
    open(){
      this.$refs['dialog'].open()
      // console.log('open')
      this.doQuery('')
    },
    onRefClose(){
    },
    selectedRow(items){
      if (this.multiple){
        this.selectedRows = items;
      }else{
        this.selectedRows.splice();
        for(var x in items){
          this.selectedRows[0] = items[x]
        }
      }
    },
    doQuery(word){
      var option={
        'pageSize': this.pageInfo.size,
        'page':this.pageInfo.page,
        'assistid': this.mdRefId,
        'cont': word
      };
      // console.log(this.mdRefId);
      if (this.mdRefId) {
        this.getAssistODataByAPI(option,this.getCallBack,this.getCallError);
      }
    },
    getCallBack(res){
      var data = res.data;
      this.title = data.title;
      this.header = data.labers;
      this.showCols = data.showCols;
      this.allCols = data.allCols;
      if(data.code==1){
        this.refData = data.values;
        this.pageInfo.total = data.total;
        this.pageInfo.size = data.size;
      }
      // else if (data.code==0){
      //   // this.$notify.warning({content: data.message});
      else{
        this.refData = [];
        this.pageInfo.total = 0;
        // this.$notify.danger({content: data.message});
      }
    },
    getCallError(res){
      // console.log(res);
      this.$notify.danger({content: res.data.message});
    },
    cancel(){
      this.$refs['dialog'].close();
      this.$emit('close',false);
    },
    close(){
      if(this.selectedRows.length>0){
        var refBackData = {
          cols:[],
          value:[],
          multiple:false
        };
        refBackData.cols = this.allCols;
        if(!this.multiple){
          refBackData.value[0] = this.selectedRows[0];
        }else{
          refBackData.multiple = true;
          refBackData.value = this.selectedRows;
        }
        this.$emit('close',refBackData);

      }
      this.$refs['dialog'].close();
    },
    makeRefData () {
      if(this.selectedRows){
      }
    },
    dblclick(row){
      this.close();
    },
    onTablePagination(page){
      // console.log(page);
      this.pageInfo.page = page.page;
      this.pageInfo.size = page.size;
      this.doQuery(this.word);
    }
  },
  watch:{
    word(val){
      // this.doQuery(val)
    },
  },
 
};
</script>
