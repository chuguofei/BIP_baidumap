<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button @click.native="bbb">保存</md-button>
        <md-button >放弃</md-button>
        <md-button @click.native="ccc">新增</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button >列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-pager></md-part-toolbar-pager>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>分配方法</md-part-toolbar-crumb>
        <md-part-toolbar-crumb>编辑</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <md-content class="flex layout-column">
        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20"  md-theme="'md-warn'">
            <md-input-container :class="'md-accent'">
              <label>编码</label>
              <md-input required></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
            <md-input-container>
              <label>名称</label>
              <md-input required></md-input>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
            <md-input-container>
              <label>核算目的</label>
              <md-input-ref>
              </md-input-ref>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
             <xlsx-table @on-select-file="selectData" @get-name="getName"></xlsx-table>
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-small="50" md-flex-medium="33" md-flex-large="20">
            <md-button @click="download">下载</md-button>
          </md-layout>
          <md-bip-work ref="cc"></md-bip-work>
          <md-checkbox md-theme="orange"  id="my-test10" name="my-test10" md-value="orange" v-model="checkbox3" class="md-primary">Primary Orange</md-checkbox>
          <md-checkbox md-theme="green"  id="my-test11" name="my-test11" md-value="green" v-model="checkbox3" class="md-primary">Primary Green</md-checkbox>
          <md-checkbox md-theme="light-blue" id="my-test12" name="my-test12" md-value="light-blue" v-model="checkbox3" class="md-primary">Primary Light Blue</md-checkbox>
        </md-layout>
      </md-content>
    </md-part-body>
    <md-ref></md-ref>
  </md-part>
</template>
<style scoped>
.md-card {
  margin: 0.15rem;
}

@media (max-width: 600px) {
  .md-card {
    margin: 0;
  }
}
</style>
<script>
import Stomp from 'stompjs';
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      title:'',
      showDialog:false,
      checkbox3:[],
      client: Stomp.client(global.MQTT_SERVICE)
    }
  },
  created () {
    this.connect()
  },
  methods:{
    selectData(_data){
      var that = this
      this.$dialog.open({title:'清单',showTable:true,headerData:_data.header,bodyData:_data.body,showYes:false,showCancel:false,showMyBtn:true,btns:['关闭'],getTitle(){this.title = that.title}})
    },
    getName(_name){
      this.title = _name
    },
    bbb(){
      // console.log(this.$bipModal);
      this.$notify.success({content: '登录成功'})
    },
    ccc(){
      console.log(this);
      this.$refs['cc'].open('fdsfds');
    },
    connect() {
      //初始化mqtt客户端，并连接mqtt服务
      var clientid = '1';
      var headers = {
        'login': global.MQTT_USERNAME,
        'passcode': global.MQTT_PASSWORD,
        // 'client-id': clientid
        // additional header
      }
      this.client.connect(headers, this.onConnected, this.onFailed)
    },
    onConnected(frame) {
      console.log('Connected: ' + frame)
      var topic = '/topic/jt_test_queue'  
      //订阅频道
      this.client.subscribe(topic, this.responseCallback, this.onFailed) 
    },
    onFailed: function (frame) {
      console.log('Failed: ' + frame)
    },
    responseCallback: function (frame) {
      console.log('responseCallback msg=>' + frame.body)
      // 接收消息
    },
    download(){
      window.location.href='./commons-lang3-3.3.2.jar'
    }
  },
  mounted(){
    // this.download()
    window.sessionStorage.setItem('isLogin',JSON.stringify(true))
    let a = window.sessionStorage.getItem('isLogin')
    console.log(a)
  }
}
</script>

