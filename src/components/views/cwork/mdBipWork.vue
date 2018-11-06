<template>
<div class="md-work-dialog" v-if="chkinfo">
  <md-avatar class="md-large md-fab md-fab-top-left" tabindex="-9999">
    <template v-if="isSH==3 || isSH==4">
      <img src="../../../img/check/ysh.png">
    </template>
    <template v-if="isSH==2">
      <img src="../../../img/check/dsh.png">
    </template>
    <template v-if="isSH==1">
      <img src="../../../img/check/bh.png">
    </template>
  </md-avatar>
  <md-dialog ref="dialog" class="md-work-dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <md-toolbar>
      <h1 class="md-title">{{title}}</h1>
        <md-input-container class="md-flex md-header-search">
        </md-input-container>
      <md-button class="md-icon-button" @click.native="cancel()">
        <md-icon>close</md-icon>
      </md-button>
    </md-toolbar>
    <md-dialog-content>
        <md-subheader>下一节点:</md-subheader>
        <md-radio v-model="stateId" v-for="(item,index) in list" :key="index" :id="item.stateId" name="group1" :md-value="item.stateId">{{item.stateName}}</md-radio>
        <md-subheader>审批人:</md-subheader>
        <!-- <md-radio v-model="userId" v-for="(item,index) in users" :key="item.userCode" :id="item.userCode" name="group1" :md-value="item.userCode">{{item.userName}}</md-radio> -->
        <md-checkbox  v-for="item in users" :key="item.userCode" :id="item.userCode" :name="item.userCode" v-model="userIds" :md-value="item.userCode">{{item.userName}}</md-checkbox>

        <md-input-container md-theme="red">
          <label>说明</label>
          <md-input v-model="content"></md-input>
        </md-input-container>
    </md-dialog-content>
    <md-dialog-actions>
        <md-button class="md-primary md-raised" @click.native="checkUp()" :disabled="canYes">{{getYes}}</md-button>
        <md-button class="md-accent md-raised" @click.native="checkBack()" :disabled="canBH">驳回</md-button>
        <!-- <md-button class="md-accent md-raised" @click.native="checkBack()" :disabled="canBH">驳回到上一节点</md-button> -->
        <md-button class="md-accent md-raised" @click.native="cancelCheck()" :disabled="canTH">退回</md-button>
        <md-button class="md-raised" @click.native="close(false)">取消</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      title: "系统窗口",
      stateId: "",
      userIds: [],
      content: "已同意",
      users: [],
      list: [],
      cea: null,
      currUser: JSON.parse(window.sessionStorage.getItem("user")).userCode,
      billuser: ""
    };
  },
  props: { chkinfo: Object },
  methods: {
    close() {
      this.$refs["dialog"].close();
    },
    //同意并提交到下一个节点
    async checkUp() {
      this.cea.stateto = this.stateId;
      this.cea.yjcontext = this.content;
      this.cea.tousr = this.makeUU();
      this.cea.ckd = this.chkinfo.checked;
      var res = null;
      if (this.stateId == 6) {
        res = await this.getCeaCheckInfo(this.cea, 34);
      } else {
        if (this.cea.tousr == "") {
          this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
        } else {
          res = await this.getCeaCheckInfo(this.cea, 34);
          // console.log(res);
        }
      }
      // console.log(res);
      if (res.data.id == 0) {
        this.$emit("dataCheckUp", this.stateId);
        this.$notify.success({ content: "提交成功！", placement: "mid-center" });
        this.close();
      } else {
        this.$notify.danger({
          content: res.data.message,
          placement: "mid-center"
        });
      }
      // this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
      // console.log(res,'同意并提交');
    },
    makeUU() {
      var ids = "";
      for (var i = 0; i < this.userIds.length; i++) {
        ids += this.userIds[i] + ",";
      }
      if (ids.length > 0) {
        ids = ids.substring(0, ids.length - 1);
      }
      return ids;
    },
    //驳回
    checkBack() {
      this.$dialog
        .confirm("确定驳回吗？", {
          okText: "确定",
          cancelText: "取消"
        })
        .then(() => {
          this.bh(false);
          // if(this.chkinfo.upState === '0' ||this.chkinfo.upState === '1'){
          //   //this.bh(false);
          // }else{
          //    this.$dialog.confirm("驳回到上一个节点吗？", {
          //     okText: "确定",
          //     cancelText: "取消"
          //   }).then(()=>{
          //     //this.bh(true);
          //     console.log('驳回到上一个节点');
          //   }).catch(()=>{
          //     //this.bh(false);
          //     console.log('驳回新建状态');
          //   });
          // }
          // console.log(this.chkinfo);
          //this.bh();
        });
      this.close();
    },
    async bh(bup) {
      this.cea.stateto = this.chkinfo.state;
      this.cea.bup = "2";
      this.cea.tousr = bup ? "#" : this.billuser;
      var res = await this.getCeaCheckInfo(this.cea, 34);
      // console.log(res, "驳回！");
      if(res.data.id === 0)
        this.$emit("dataCheckUp",res.data.data.info);
    },
    //退回
    async cancelCheck() {
      if (this.chkinfo) {
        if (this.chkinfo.checked) {
          this.cea.stateto = this.chkinfo.state;
          this.cea.statefr = this.chkinfo.state;
          var id = 39;
          if (this.chkinfo.state !== "6") {
            id = 40;
          }
          var res = await this.getCeaCheckInfo(this.cea, id);
          if (res.data.id === 0) {
            this.$emit("dataCheckUp", res.data.data.info + "");
          }
        } else {
          this.cea.stateto = this.chkinfo.upState;
          this.cea.statefr = this.chkinfo.state;
          var id = 39;
          var res = await this.getCeaCheckInfo(this.cea, id);
          if (res.data.id === 0) {
            this.$emit("dataCheckUp", res.data.data.info + "");
          }
        }
      }
      this.close();
    },
    async open(ceaparam, billU) {
      this.cea = ceaparam;
      // this.$notify.danger({ content: "没有审批人", placement: "mid-center" });
      this.billuser = billU;
      // console.log(billU,this.currUser);
      if (this.cea.statefr == "0" || this.cea.statefr == "1" || this.cea.statefr == "5") {
        if (billU !== this.currUser) {
          this.$notify.danger({
            content: "只有制单人可以提交!",
            placement: "mid-center"
          });
          return;
        }
      } else {
        if (this.chkinfo.chkInfos) {
          var exitu = "";
          _.forEach(this.chkinfo.chkInfos, item => {
            if (item.userCode&&item.userCode === this.currUser) {
              exitu = this.currUser;
            }
          });
          // if(!exitu){
          //   this.$notify.danger({ content: "没有审批权限！", placement: "mid-center" });
          //   return ;
          // }
        } else {
          if (this.cea.statefr !== "6") {
            this.$notify.danger({
              content: "没有审批人!",
              placement: "mid-center"
            });
          }
        }
      }
      this.$refs["dialog"].open();
    },
    cancel() {
      // console.log("cccc");
      this.$refs["dialog"].close();
    },
    makeUsers() {
      if (this.chkinfo) {
        _.forEach(this.chkinfo.list, item => {
          if (item.stateId === this.stateId) {
            if (item.users) this.users = item.users;
            else {
              this.users = [];
            }
          }
        });
        if (this.users.length > 0) {
          this.userIds[0] = this.users[0].userCode;
        } else {
          this.userIds = [];
        }
      }
    },
    getIndexState() {
      if (this.chkinfo) {
        if (this.chkinfo.list && this.chkinfo.list.length > 0) {
          this.stateId = this.chkinfo.list[0].stateId;
          this.list = this.chkinfo.list;
        } else {
          this.list = [];
        }
      } else {
        this.list = [];
      }
    },
    initEA() {
      if (this.chkinfo) {
        this.getIndexState();
        this.makeUsers();
      }
    }
  },
  watch: {
    stateId() {
      this.makeUsers();
    },
    chkinfo() {
      // console.log("chkinfoChange");
      this.initEA();
      // this.getYes();
    }
  },
  mounted() {
    this.initEA();
  },
  computed: {
    isSH() {
      //0：新建状态，1:驳回状态；2:待审核；3:已审核;4:执行状态
      var id = 0;
      if (this.chkinfo) {
        if (this.chkinfo.state == "0" || this.chkinfo.state == "5") {
          id = 0;
        } else if (this.chkinfo.state == "1") {
          id = 1;
        } else if (this.chkinfo.state == "6") {
          id = 4;
        } else {
          if (this.chkinfo.checked) {
            id = 3;
          } else {
            id = 2;
          }
        }
      } else {
        id = 0;
      }
      // console.log(id,this.chkinfo);
      return id;
    },
    getYes() {
      // console.log(this.chkinfo);
      if (this.chkinfo) {
        if (this.chkinfo.state == "0" || this.chkinfo.state == "1" || this.chkinfo.state == "5") {
          return "提交";
        }
      }
      return "同意";
    },
    canYes() {
      if (this.chkinfo) {
        if (this.chkinfo.state === "6") {
          return true;
        }
        if(this.chkinfo.state === "0" || this.chkinfo.state === "1" || this.chkinfo.state === "5"){
          if(this.billuser == this.currUser){
            return false;
          }
          return true;
        }
        var exitu = "";
        _.forEach(this.chkinfo.chkInfos, item => {
          if (item.userCode === this.currUser) {
            exitu = this.currUser;
            return;
          }
        });
        if (exitu) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    canTH() {
      if (this.chkinfo.state) {
        // console.log(this.chkinfo);
        if (this.chkinfo.state === "0" || this.chkinfo.state === "1") {
          return true;
        }
        if(this.chkinfo.state === "5"){
          return false;
        }
        if(this.chkinfo.state === "6" && this.chkinfo.upState === "0"){
          if(this.currUser === this.billuser){
            return false;
          }else{
            return true;
          }
        }
        if (this.chkinfo.checked&&this.chkinfo.chkInfos) {
          if(this.chkinfo.chkInfos[0].userCode === this.currUser)
            return false;
          return true;
        }
        if (this.chkinfo.upUser&&this.currUser === this.chkinfo.upUser.userCode) {
          return false;
        } else {
          return true;
        }
        // return false;
      }
      return false;
    },
    canBH() {
      if (this.chkinfo) {
        if (this.chkinfo.state === "0" ||this.chkinfo.state === "1" || this.chkinfo.state === "5" ||this.chkinfo.state === "6") {
          return true;
        }
         var exitu = "";
        _.forEach(this.chkinfo.chkInfos, item => {
          if (item.userCode === this.currUser) {
            exitu = this.currUser;
            return;
          }
        });
        if (exitu) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
  }
};
</script>


