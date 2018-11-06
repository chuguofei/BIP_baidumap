<template>
  <div class="md-query-case">
    <slot></slot>
    <md-dialog ref="caseDialog" @open="onOpen"  @close="onClose" class="md-query-case-dialog">
      <md-dialog-content class="no-padding layout-column layout-fill">
        <md-tabs class="md-accent layout-column layout-fill flex" :md-swipeable="true" md-right :md-dynamic-height="false">
          <md-tab md-label="条件" md-icon="filter_list" v-if="options.wheres&&options.wheres.length">
            <md-layout md-gutter>
              <md-layout md-flex="100" v-for="item in options.wheres" :key="item">
                <md-input-container class="md-inset">
                  <div class="label">
                    <md-avatar>
                      <md-icon>attach_file</md-icon>
                    </md-avatar>
                    <label>{{item.comment}}</label>
                  </div>
                  <div class="input">
                    <md-input v-if="item.type=='input'" v-model="item.value"></md-input>
                    <md-input-ref v-else-if="item.type=='ref'" v-model="item.value" :multiple="item.multiple" :md-ref-id="item.refs.id"></md-input-ref>
                    <md-date v-else-if="item.type=='date'" v-model="item.value"></md-date>
                    <md-input v-else v-model="item.value"></md-input>
                  </div>
                </md-input-container>
              </md-layout>
            </md-layout>
          </md-tab>

          <md-tab md-label="栏目" md-icon="more_horiz" v-if="options.columns&&options.columns.length">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
          </md-tab>

          <md-tab md-label="排序" md-icon="sort" v-if="options.orders&&options.orders.length">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas.</p>
          </md-tab>
        </md-tabs>
      </md-dialog-content>
      <md-dialog-actions>
        <span class="flex"></span>
        <md-button class="md-accent md-raised" @click.native="query">确定</md-button>
        <md-button class="md-warn" @click.native="cancel">取消</md-button>
      </md-dialog-actions>
      <md-loading :loading="loading"></md-loading>
    </md-dialog>
  </div>
</template>
<script>
  export default {
    props: {
    },
    data(){
      return {
        inited:false,
        loading:0,
        options:{
            query:{},
            wheres:[],
            columns:[],
            orders:[]
          }
      }
    },
    methods: {
      init(){
        if(this.inited){
          return;
        }
        this.inited=true;
        const promise =new  Promise((resolve, reject)=>{
          this.$emit('init',this.options,{resolve,reject});
        });
        promise.then((value)=>{
          this.inited=true;
        },(reason)=>{
          this.inited=true;
        });
      },
      query(){
        this.$emit('query',this.options);
        this.$refs.caseDialog.close();
      },
      open(){
        this.init();
        this.$refs.caseDialog.open();
      },
      cancel(){
        this.$emit('cancel',this.options);
        this.$refs.caseDialog.close();
      },
      onOpen(){
        this.$emit('open',this.options);
      },
      onClose(){
        this.$emit('close',this.options);
      },
      getQueryCase(){
        var qc = { wheres: [], orders: [], columns: [] };
        this._.each(this.options.wheres, (v) => {
          if(v.value){
            var item=this.formatCaseWhereItem(v);
            if(item)qc.wheres.push(item);
          }
        });
        return qc;
      },
      formatCaseWhereItem(where){
        var has=false;
        var whereItem={name:where.name,comment:where.comment};
        if(where.operator){
          whereItem.operator=where.operator;
        }
        if(where.type=='ref'&&where.value){
          whereItem.value=this.getRefWhereItemValue(where);
          if(whereItem.value!==false){has=true;}
        }
        return has?whereItem:false;
      },
      getRefWhereItemValue(where){
        var valueField='id',temp=false,value=false;
        if(where.refs&&where.refs.valueField){
          valueField=where.refs.valueField;
        }
        if(where.multiple&&where.value&&where.value.length>0){
          value=[];
          for (var i = 0; i < where.value.length; i++) {
            temp=where.value[i][valueField];
            if(temp!==''&&temp!==undefined&&temp!==false){
              value.push(temp);
            }
          }
        }else if(where.value&&where.value[valueField]){
          value= where.value[valueField];
        }
        return value;
      },
    },
    created() {
      this.options.getQueryCase =()=>{
        return this.getQueryCase();
      }
    },
    mounted() {
    },
  };
</script>
