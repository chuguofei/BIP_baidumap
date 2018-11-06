<template>
  <div>
    <!-- <md-bip-bill v-if="mparams.beBill" :mdTitle="menuTitle" :mparams="mparams"></md-bip-bill> -->
    <template  v-if="mparams.beBill">
      <md-bip-applet :mdTitle="menuTitle" :mparams="mparams"></md-bip-applet>
    </template>
    <template v-else>
      <!-- <md-bip-report :mdTitle="menuTitle" :mparams="mparams"></md-bip-report> -->
       <md-bip-bi :mdTitle="menuTitle" :mparams="mparams"></md-bip-bi>
    </template>
    <!-- <md-bip-applet v-if="mparams.beBill" :mdTitle="menuTitle" :mparams="mparams"></md-bip-applet>
    <md-bip-report v-else :mdTitle="menuTitle" :mparams="mparams"></md-bip-report> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      pbuid: '',
      pmenuid: '',
      menuTitle: '',
      mparams: {}
    }
  },
  methods: {
    async fetchParams () {
      this.pbuid = this.$route.query.pbuid
      this.pmenuid = this.$route.query.pmenuid
      this.menuTitle = this.$route.query.title
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.sessionStorage.getItem('user')).userCode,
        'apiId': global.APIID_MPARAMS,
        'pbuid': this.pbuid,
        'pmenuid': this.pmenuid
      }
      if(this.pbuid && this.pmenuid){
        //var bb = await this.getDataByAPINew(data1,this.getCallBack,this.getCallError);
        var res = await this.getDataByAPINewSync(data1);
        // console.log(res);
        if(res.data.id==0){
          this.mparams = res.data.data.mparams
        }else{
          console.log(res);
          this.$notify.warning({content: res.data.message,placement:'mid-center'});
        }
      }
    },
    // getCallBack(res){
    //   // 获取返回值
    //   if(res.data.id==0){
    //     this.mparams = res.data.data.mparams
    //   }else{
    //     console.log(res);
    //     this.$notify.warning({content: res.data.message,placement:'mid-center'});
    //   }
    // },
    // getCallError(res) {
    //   console.log(res)
    // }
  },
  watch: {
    '$route': ['fetchParams']
  },
  mounted () {
  },
  created () {
    this.fetchParams()
  }
}
</script>

