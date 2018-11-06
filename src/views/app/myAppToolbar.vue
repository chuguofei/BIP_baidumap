<template>
  <md-toolbar>
    <md-button class="md-icon-button" @click.native="toggle()">
      <md-icon>menu</md-icon>
    </md-button>
    <h2 class="md-title">{{mdTitle}}</h2>
    <div class="md-flex">
      <md-input-container class="md-flex md-header-search">
        <md-input class="md-header-search-input" placeholder="搜索"></md-input>
      </md-input-container>
    </div>
    <md-menu md-direction="bottom left" ref="taskMSG">
      <md-button class="md-icon-button" md-menu-trigger>
        <span class="bip-badge" v-if="counts>0">{{counts}}</span>
        <md-icon>notifications</md-icon>
      </md-button>
      <md-menu-content>
        <md-list class="custom-list">
          <md-list-item class="bip-task-item">
            <router-link to='/task' @click.native="selItem">
              <div class="md-table-cell-container">我的任务</div>
              <span class="badge badge-info" >+{{taskNum}}</span>
            </router-link>
          </md-list-item>
          <md-list-item class="bip-task-item">
            <router-link to='/msg' @click.native="selItem">
              <div class="md-table-cell-container">我的消息</div>
              <span class="badge badge-success" >+{{msgNum}}</span>
            </router-link>
          </md-list-item>
        </md-list>
      </md-menu-content>
    </md-menu>
    <md-menu md-direction="bottom left" ref="menuUser" class="bip-task">
      <md-button class="md-icon-button md-avatar" md-menu-trigger>
        <md-avatar>
          <img src="../../img/avatar/1.jpg">
        </md-avatar>
      </md-button>
      <md-menu-content>
        <md-card class="md-primary">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{user.userName}}</div>
              <div class="md-subhead">{{user.userCode}}</div>
            </md-card-header-text>
            <md-card-media>
              <img src="../../img/avatar/1.jpg" alt="People">
            </md-card-media>
          </md-card-header>
          <md-menu md-direction="bottom left" ref="menuEnts">
            <md-button md-menu-trigger>{{deptInfo.cmcName}}
              <md-icon>arrow_drop_down</md-icon>
            </md-button>
            <md-menu-content>
              <!-- <md-menu-item v-for="item in $root.userData.ents" :key="item">{{item.name }}</md-menu-item> -->
            </md-menu-content>
          </md-menu>
          <md-card-actions>
            <div class="layout-row layout-fill layout-align-space-between-center">
              <md-button>下载客户端</md-button>
              <md-button @click="logOut">退出</md-button>
            </div>
          </md-card-actions>
        </md-card>
      </md-menu-content>
    </md-menu>
  </md-toolbar>
</template>
<script>
const BIPTASK = "biptask",
  BIPMSG = "bipmsg";
import Stomp from "stompjs";
export default {
  data() {
    return {
      user: {},
      deptInfo: {},
      client: null,
      taskNum: 0,
      msgNum: 0,
      isconnt: false
    };
  },
  props: {
    mdToken: String,
    mdTitle: String
  },
  created() {
    if (!this.isconnt) this.connectQ();
  },
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    async logOut() {
      if(this.isconnt)
        this.disconnect();
      this.$emit("logout");
    },
    onConnected: function(frame) {
      this.isconnt = true;
      // console.log("Connected: " + frame);
      //订阅频道
      var topic =
        "/exchange/" +
        BIPTASK +
        "/" +
        BIPTASK +
        "." +
        global.DBID +
        "." +
        this.user.userCode;
      var topic1 =
        "/exchange/" +
        BIPMSG +
        "/" +
        BIPMSG +
        "." +
        global.DBID +
        "." +
        this.user.userCode;
      // console.log(topic, topic1);
      this.client.subscribe(topic, this.responseCallback);
      this.client.subscribe(topic1, this.responseCallback);
      this.taskMsg(global.APIID_TM_ALL);
    },
    onFailed: function(frame) {
      // console.log("Failed: " + frame);
    },
    responseCallback: function(frame) {
      // console.log("responseCallback msg=>" + frame.body);
      var info = JSON.parse(frame.body);
      if (info.type === 1) {
        if (this.taskNum !== info.count) {
          this.taskNum = info.count;
          if(this.taskNum>0)
            this.$notify.warning({ content: "您有" + this.taskNum + "条任务未处理！" });
        }
      }
      if (info.type === 2) {
        this.msgNum = info.count;
        if(this.msgNum>0)
          this.$notify.info({ content: "您有" + this.msgNum + "条消息未处理！" });
      }
      // console.log(frame);
      // 接收消息
    },
    connectQ: function() {
      //初始化mqtt客户端，并连接mqtt服务
      var ws = new WebSocket(global.MQTT_SERVICE);
      this.client = Stomp.over(ws);
      var headers = {
        login: global.MQTT_USERNAME, //用户名
        passcode: global.MQTT_PASSWORD, //密码
        host: global.MQTT_HOST // 虚拟空间
      };
      this.client.connect(headers, this.onConnected, this.onFailed);
    },
    disconnect() {
      this.client.disconnect();
    },
    selItem(path1){
      // console.log(path1);
      // this.$router.push({ path: path1 })
      this.$refs.taskMSG.close()
    },
    load(){
      if(window.sessionStorage.getItem('user')){
        this.user = JSON.parse(window.sessionStorage.getItem("user"));
        this.deptInfo = this.user.deptInfo;
      }
    }
  },
  mounted() {
      this.load()
  },
  computed: {
    counts() {
      return this.taskNum + this.msgNum;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-input-container.md-flex.md-header-search {
  margin: 0 0 0 60%;
  .md-header-search-input {
    border-radius: 0.04rem;
    width: 80%;
  }
}
.md-input-container {
  min-height: 0.3rem;
}

.md-title {
  font-family: "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
  font-size: 0.18rem;
}

@media (max-width: 600px) {
  .md-title {
    font-family: "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
    font-size: 0.14rem;
  }
}

.md-input-container.md-has-value input {
  font-size: 0.14rem;
}

.md-avatar {
  width: 0.3rem;
  min-width: 0.3rem;
  height: 0.3rem;
  min-height: 0.3rem;
  border-radius: 0.3rem;
}
.bip-badge {
  position: absolute;
  right: 0;
  top: 3px;
  height: 15px;
  line-height: 15px;
  background-color: #f75d5d;
  color: #fff;
  border-radius: 15px;
  font-size: 0.14rem;
  text-align: center;
  white-space: nowrap;
  padding: 0 2px;
  z-index: 9;
}
.md-button.md-icon-button {
  border-radius: 0;
}

.md-list-item.bip-task-item{
    &.md-list-item-container{
      height: 0.48rem;
    }
}
.bip-task-item{
  min-height: .48rem;
  .md-list-item-container{
    height: 0.48rem;
  }
  .md-list.md-triple-line .md-list-item .md-list-item-container{
    min-height: 0.48rem;
  }
}
.md-list.md-triple-line .md-list-item .md-list-item-container {
    min-height: .48rem;
}
.badge {
 padding-top:1px;
 padding-bottom:3px;
 line-height:15px
}
.badge.radius-1 {
 border-radius:1px
}
.badge.radius-2 {
 border-radius:2px
}
.badge.radius-3 {
 border-radius:3px
}
.badge.radius-4 {
 border-radius:4px
}
.badge.radius-5 {
 border-radius:5px
}
.badge.radius-6 {
 border-radius:6px
}
.badge-transparent,.badge.badge-transparent,.label-transparent,.label.label-transparent {
 background-color:transparent
}
.badge-grey,.badge.badge-grey,.label-grey,.label.label-grey {
 background-color:#A0A0A0
}
.badge-info,.badge.badge-info,.label-info,.label.label-info {
 background-color:#3A87AD
}
.badge-primary,.badge.badge-primary,.label-primary,.label.label-primary {
 background-color:#428BCA
}
.badge-success,.badge.badge-success,.label-success,.label.label-success {
 background-color:#82AF6F
}
.badge-danger,.badge-important,.badge.badge-danger,.badge.badge-important,.label-danger,.label-important,.label.label-danger,.label.label-important {
 background-color:#D15B47
}
.badge-inverse,.badge.badge-inverse,.label-inverse,.label.label-inverse {
 background-color:#333
}
.badge-warning,.badge.badge-warning,.label-warning,.label.label-warning {
 background-color:#F89406
}
.badge-pink,.badge.badge-pink,.label-pink,.label.label-pink {
 background-color:#D6487E
}
.badge-purple,.badge.badge-purple,.label-purple,.label.label-purple {
 background-color:#9585BF
}
.badge-yellow,.badge.badge-yellow,.label-yellow,.label.label-yellow {
 background-color:#FEE188
}
.badge-light,.badge.badge-light,.label-light,.label.label-light {
 background-color:#E7E7E7
}
.badge-yellow,.label-yellow {
 color:#963;
 border-color:#FEE188
}
.badge-light,.label-light {
 color:#888
}
</style>
