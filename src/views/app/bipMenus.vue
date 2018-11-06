<template>
  <md-sidenav class="md-left md-app-menu has-extend" ref="mainSidenav">
    <md-toolbar>
      <img src="../../img/bip.png" alt="People">
      <md-subheader class="md-title">Bip系统平台</md-subheader>
    </md-toolbar>
    <md-list class="bip-menulist md-dense">
      <div>
        <md-list-item>
          <router-link exact to="/index">
            <md-icon v-colors="{color:'red-700-0.8'}">dashboard</md-icon>
            <span>首页</span>
          </router-link>
        </md-list-item>
        <md-list-item>
          <router-link exact to="/mapcurrent">
            <md-icon v-colors="{color:'blue-700-0.8'}">airplanemode_active</md-icon>
            <span>实时轨迹</span>
          </router-link>
        </md-list-item>
      </div>
      <bip-menu v-for="mm in menus" :key="mm.menuId" :menuItem="mm"></bip-menu>
      <div>
      <!-- <md-list-item>
        <router-link exact to="/ht">
          <md-icon>menu</md-icon>
          <span>合同管理</span>
        </router-link>
      </md-list-item> -->
      <md-list-item>
        <router-link exact to="/task">
          <md-icon v-colors="{color:'red-700-0.8'}">send</md-icon>
          <span>我的任务</span>
        </router-link>
      </md-list-item>
      <md-list-item>
        <router-link exact to="/msg">
          <md-icon v-colors="{color:'green-700-0.8'}">message_bulleted</md-icon>
          <span>我的消息</span>
        </router-link>
      </md-list-item>
      <md-list-item>
        <router-link exact to="/exportData">
          <md-icon v-colors="{color:'yellow-700-0.8'}">file_download</md-icon>
          <span>生成报告</span>
        </router-link>
      </md-list-item>
      </div>
    </md-list>
  </md-sidenav>
</template>

<script>
import BipMenuItem from './bipMenuItem'
export default {
  name: 'bip-menus',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      menus: []
    }
  },
  mounted() {
    this.loadMenus()
  },
  components: { 'bip-menu': BipMenuItem },
  methods: {
    loadMenus(){
      if(window.sessionStorage.getItem('menulist')){
        this.menus = JSON.parse(window.sessionStorage.getItem('menulist'))
      }
    },
    toggle() {
      this.$refs.mainSidenav.toggle();
      this.$emit('toggle');
    }
  }
}
</script>

<style lang="scss" scoped>
.bip-menulist.md-dense{
  overflow: auto;
  overflow-x:hidden;
}
.md-list{
display: inherit;
}
.md-title{
  color: #fff;
  font-family: "Lantinghei SC", "Open Sans", Arial, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
}

</style>


