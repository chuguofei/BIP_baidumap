<template>
<div class="layout-fill">
    <div  v-if="isLogin" class="md-app layout-fill layout-column flex">
      <bip-menus ref="menu" :md-token="mdToken" :md-title="mdTitle"></bip-menus>
      <app-toolbar ref="toolbar" @toggle="toggle" :md-token="mdToken" :md-title="mdTitle" @logout="exit"></app-toolbar>
      <app-content class="layout-fill flex md-part layout-column"></app-content>      
  </div>
  <div v-else>
    <app-login  @emitLogin="emitLogin"></app-login>
  </div>
</div>
</template>
<script>
import appToolbar from './myAppToolbar';
import appContent from './myAppContent';
import bipMenu from './bipMenus';
import Login from '../Login';
export default {
  name: 'myapp',
  data () {
    return {
      mdToken: 'bbb',
      mdTitle: '',
      isLogin: false
    }
  },
  components:{'app-toolbar':appToolbar,'app-content':appContent,'bip-menus': bipMenu,'app-login':Login},
  methods: {
    created(){
    },
    toggle() {
      // if(this.$route.path != '/task' &&this.$route.path != '/msg')
      // console.log(this.$refs.menu);
      this.$refs.menu.toggle();
      this.setTitle();
    },
    setTitle() {
        if(this.$route.query.title){
        this.mdTitle = this.$route.query.title
      }else{
        if(this.$route.path == '/' || this.$route.path == '/index'){
          this.mdTitle = '轨迹回放';
        }else if(this.$route.path == '/task'){
          this.mdTitle = '任务';
        }else if(this.$route.path == '/msg'){
          this.mdTitle = '消息';
        }else if(this.$route.path == '/exportData'){
          this.mdTitle = '生成报告'
        }else if(this.$route.path == '/mapcurrent'){
          this.mdTitle = '实时轨迹'
        }else{
          this.mdTitle = this.$route.path;
        }
      }
    },
    emitLogin(){
      this.isLogin = true;
      window.sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin))
    },
    exit() {
      window.sessionStorage.clear();
      this.$router.push({path:'/',name:''})
      this.isLogin = false;
    },
    async loginRemote(usercode,pwd) {
      var logindata = {
        apiId: global.APIID_LOGIN,
        dbid: global.DBID,
        usercode: usercode,
        pwd: this.base64Encode(pwd)
      }
      try{
        var res = await this.getDataByAPINew(logindata);
        this.loginSuccess(res);
      }catch(e){
        this.$notify.danger({content: '系统连接错误！'});
      }
    },
    loginSuccess(res) {
      if (res.data.id === 0) {
        var userI = res.data.data.user;
        var mlist = res.data.data.menulist;
        var snkey = res.data.data.snkey;
        window.sessionStorage.setItem('user', JSON.stringify(userI));
        window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
        window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
      } else {
        this.$notify.danger({content: res.data.message})
      }
      this.$refs.menu.loadMenus()
      this.$refs.toolbar.load()
    },
  },
  mounted(){
    if(this.$route.path == '/blank'){
      console.log(this.$route)
      this.emitLogin()
      // this.loginRemote(usercode,pwd)
      this.loginRemote('admin','system')
    }
    var lid = window.sessionStorage.getItem('isLogin');
    if(lid){
      this.isLogin = true;
    }else{
      this.isLogin = false;
    }
    this.setTitle();
  },
  watch: {
    '$route': 'toggle'
  }
};
</script>

<style lang="scss">

.bipcontent{
  overflow: scroll;
}

</style>


