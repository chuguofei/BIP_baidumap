<template>
  <md-part>
    <template v-if="isPC">
      <md-bip-bill-applet :dsm="ds_m" :dsext="ds_ext" :opera="opera" v-if="!blist" @list="list"></md-bip-bill-applet>
      <md-bip-bill-list-applet :dsm="ds_m" :dsext="ds_ext" :opera="opera" :mdTitle="mdTitle" @addBill="addBill"  v-else></md-bip-bill-list-applet>
    </template>
    <template v-else>
      <!-- <span>移动端信息</span> -->
      <md-mobile-bill-info :dsm="ds_m" :dsext="ds_ext" :opera="opera" v-if="!blist" @list="list"></md-mobile-bill-info>
      <md-mobile-bill-list :dsm="ds_m" :dsext="ds_ext" :opera="opera" :mdTitle="mdTitle" @addBill="addBill"  v-else></md-mobile-bill-list>
    </template>
  </md-part>
</template>
<script>
import CDataSet from '../classes/CDataSet';
import billS from '../classes/billState';
import Operation from '../operation/operation';
export default {
  data(){
    return {
      ds_m:null,
      ds_cont:null,
      ds_ext:[],
      blist:true,
      opera:null,
      isPC:this.ISPC()
    }
  },
   props: {mdTitle:{type:String,default:''},mparams:Object},
   created(){
     this.getCell();
   },
   methods:{
     addBill(){
       this.blist = false;
       if(this.ds_m.index<0)
        this.ds_m.createRecord();
     },
     list(){
       this.blist = true;
     },
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

      var pflow = this.mparams.pflow;
      if(pflow){
        data1 = {
          'dbid': global.DBID,
          'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
          'apiId': 'buid',
          'buid': pflow
        }
        var bb = await this.getDataByAPINewSync(data1);
        if(bb.data.id==0)
          this.opera = new Operation(bb.data.data.opt);
          // console.log(this.opera);
      }
     }
   },
   watch:{
     mparams(){
       this.ds_m = null;
       this.getCell();
       this.blist = true;
       this.opera = null;
     }
   },
  computed: {
  }
}
</script>

<style lang="scss">

</style>


