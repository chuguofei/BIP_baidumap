<template>
  <md-table-card class="flex md-query">
    <md-table @select="onTableSelect" class="flex">
      <md-table-header>
        <md-table-row>
          <md-table-head v-for="(column, columnIndex) in refInfo.fields" v-if="!column.hide&&column.alias!='id'" :key="columnIndex">
          {{column.comment||column.name}}
          </md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="(row, rowIndex) in refData" 
          :key="row.id" 
          :md-item="row" 
          :md-auto-select="mdAutoSelect" 
          :md-selection="mdSelection" 
          @dblclick.native="dblclick(row)">
          <md-table-cell v-for="(column, columnIndex) in refInfo.fields" :key="columnIndex" v-if="!column.hide&&column.alias!='id'">
            {{ row[column.alias||column.name] }}
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
    <md-table-tool>
      <span class="flex"></span>
      <md-table-pagination
        :md-size="pageInfo.size"
        :md-total="pageInfo.total"
        :md-page="pageInfo.page"
        :md-page-options="[5, 10, 25, 50]"
        @pagination="onTablePagination">
      </md-table-pagination>
    </md-table-tool>
    <md-loading :loading="loading"></md-loading>
  </md-table-card>
</template>

<script>
  import theme from '../../core/components/mdTheme/mixin';

  export default {
    props: {
      mdQueryId: String,
      mdKey:{
        type:String,
        default:'id'
      },
      mdMax: {
        type: Number,
        default: Infinity
      },
      mdAutoSelect:{
        type:[String,Boolean],
        default:true
      },
      mdSelection:{
        type:[String,Boolean],
        default:true
      },
      mdPageSize:{
        type:[Number,String],
        default:'25'
      },
      options:{
        type:Object,
        default(){
          return {
            wheres:{},
            orders:{}
          }
        }
      }
    },
    mixins: [theme],
    watch: {
      mdPageSize(val) {
        this.pageInfo.size =val;
      },
    },
    data() {
      return {
        selectedRows:[],
        pageInfo:{
          size:0,
          total:0,
          page:1
        },
        refInfo:{},
        refData:[],
        loading:0,
      };
    },
    methods: {
      onTablePagination(pager){
         this.pagination(pager);
      },
      onTableSelect(items){
        this.selectedRows=[];
        Object.keys(items).forEach((row, index) =>{
          this.selectedRows[index]=items[row];
        });
        this.select();
      },
      pagination(pager){
        this.$emit('init',this.options);

        this.selectedRows=[];
        if(this.$refs['table']&&this.$refs['table'].$data){
          this.$refs['table'].$data.selectedRows={};
        }
        
        this.loading++;
        pager=pager||this.pageInfo;
        const params={};
        this._.extend(params,this.options,pager);
        this.$http.post('sys/queries/query/'+this.mdQueryId,params).then(response => {
          this.refInfo = response.data.schema;
          this.refData = response.data.data;
          this.pageInfo.size=response.data.pager.size;
          this.pageInfo.page=response.data.pager.page;
          this.pageInfo.total=response.data.pager.total;
          this.loading--;
          this.$emit('page');
        }, response => {
          this.loading--;
          this.$emit('page');
        });
      },
      select() {
        this.$emit('select',this.selectedRows);
      },
      dblclick(item){
        this.$emit('dblclick',item);
      },
    },
    mounted() {
      if(this.mdQueryId){
        this.pageInfo.size=this.mdPageSize;
        this.pagination();
      }
    },
  };
</script>
