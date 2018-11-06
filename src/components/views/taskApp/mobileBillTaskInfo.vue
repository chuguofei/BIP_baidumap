<template>
  <md-part>
    <md-part-toolbar>
      <!-- <md-part-toolbar-group>
        <md-button :disabled="canCreate" @click.native="create">新建</md-button>
        <md-button class="md-accent" :disabled="canDelete" @click.native="delData">删除</md-button>
        <md-button @click.native="save" :disabled="canSave">保存</md-button>
      </md-part-toolbar-group>-->
      <md-part-toolbar-group>
        <md-button @click.native="gotask">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <!-- <md-button>复制</md-button> -->
        <!-- <md-button>审核</md-button> -->
        <md-button @click.native="submit" :disabled="canSubmit">{{getSH}}</md-button>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>审核单据</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <template v-if="dsm&&dsm.ds_sub.length==0">
        <md-content class="layout-fill" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        </md-content>
      </template>
      <template v-if="dsm&&dsm.ds_sub.length>0">
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <md-stepper md-vertical  @completed="finish">
            <md-step id="step1" :md-label="dsm.ccells.desc" mdButtonContinue="下一步" mdButtonBack="返回" mdButtonFinish="完成" :mdEditable="true">
              <md-layout>
                <md-bip-input v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
              </md-layout>
            </md-step>
            <md-step id="step2" md-label="子项" mdButtonContinue="下一步" mdButtonBack="返回" mdButtonFinish="完成" :mdEditable="true">
              <div>
                <md-list>
                  <md-list-item v-for="(dj,djIndex) in dsm.ds_sub[0].cdata" :key="djIndex" @click.stop="itemClick(dsm.ds_sub[0],djIndex)">
                    <!-- 删除 -->
                     <md-button class="md-icon-button md-list-action" @click="deleteDj(dsm.ds_sub[0],djIndex)" :disabled="!canEditChild">
                      <md-icon class="md-accent">close</md-icon>
                      <md-tooltip md-direction="top">删除行</md-tooltip>
                    </md-button>
                    <!-- <md-icon>list</md-icon> -->
                    <h5>第 {{djIndex+1}} 行</h5>
                    <md-list-expand ref="expand">
                      <md-list>
                        <md-layout class="flex layout-column">
                            <md-layout>
                              <md-bip-input v-for="item in dsm.ds_sub[0].ccells.cels" :ref="item.id" :key="item.id" :cell="item" :modal="dj" :btj="false" class="bip-input" @change="childChange"></md-bip-input>
                            </md-layout>
                        </md-layout>
                      </md-list>
                    </md-list-expand>
                </md-list-item>
                </md-list>
                <md-button class=" md-raised md-primary" @click="addDj(dsm.ds_sub[0])" :disabled="!canEditChild">
                  添加行
                </md-button>
                <md-button class=" md-raised md-accent" @click="deleteAll(dsm.ds_sub[0])" :disabled="!canEditChild">
                  删除所有
                </md-button>
              </div>
              </md-step>
            <!-- <md-step id="step3" md-label="单据提交" mdButtonContinue="下一步" mdButtonBack="返回" mdButtonFinish="完成" :mdEditable="true">
               <h2 class="md-title">确认提交单据？</h2>
            </md-step> -->
          </md-stepper>
        </md-content>
      </template>
      <template v-if="chkinfo">
        <md-bip-work  ref="cc" :chkinfo="chkinfo" @dataCheckUp="dataCheckUp"></md-bip-work>
      </template>
    </md-part-body>
  </md-part>
</template>
<script>
import CDataSet from "../classes/CDataSet";
import CeaPars from "../classes/CeaPars";
import billS from "../classes/billState";
import common from "../../core/utils/common.js";
export default {
  data() {
    return {
      curr_dsm: null,
      chkinfo: null
    };
  },
  props: { dsm: Object, dsext: Array, opera: Object },
  methods: {
    gotask(){
      this.$emit('gotask');
    },
    dataChange(res) {
      // console.log(res);
      // console.log(res, "dataChange");
      this.dsm.checkEdit(res);
    },
    create() {
      if (this.dsm) {
        var crd = this.dsm.currRecord;
        if ((crd.sys_stated & billS.INSERT) > 0) {
          this.$dialog.open({
            title: "系统提示",
            showYes: true,
            showCancel: false,
            content: "请先保存，然后再新建单据"
          });
        } else {
          this.dsm.createRecord();
          this.dsm.canEdit = true;
          if(this.dsm.haveChild())
            this.dsm.ds_sub[0].clearData();
          this.chkinfo = null;
        }
      }
    },
    list() {
      var crd = this.dsm.currRecord;
      if ((crd.sys_stated & billS.INSERT) > 0) {
      } else {
        this.$emit("list");
      }
      this.$emit("list");
    },
    async submit() {
      var crd = this.dsm.currRecord;
      if (this.opera) {
        var state = crd[this.opera.statefld];
        var params = {
          sid: crd[this.opera.pkfld],
          sbuid: crd[this.opera.buidfld],
          statefr: state,
          stateto: state,
          tousr: ""
        };
        var ceaParams = new CeaPars(params);
        var billuser = crd[this.opera.smakefld];
        this.$refs["cc"].open(ceaParams, billuser);
      }
      // var res = await this.getDataByAPINew(checkParasm);
      // console.log(res);
    },
    async dataCheckUp(state) {
      this.dsm.currRecord[this.opera.statefld] = state;
      this.dsm.currRecord.sys_stated = billS.POSTED;
      await this.makeCheckParams();
    },
    async delData() {
      this.$dialog
        .confirm("确定删除吗？", {
          okText: "确定",
          cancelText: "取消"
        })
        .then(() => {
          if ((this.dsm.currRecord.sys_stated & billS.INSERT) > 0) {
            alert("新建");
            return;
          }
          this.dsm.currRecord.sys_stated = 4;
          this.save();
        });
    },
    async save() {
      var str = JSON.stringify(this.dsm.currRecord);
      if((this.dsm.currRecord&billS.DELETE)==0){
        var isnull = this.checkNotNull(this.dsm);
          if(!isnull)
            return;
      }
      this.loading = 1;
      var options = { pcell: this.dsm.pcell, jsonstr: str };
      var res = await this.saveData(options);
      if (res.data.id == 0) {
        if (this.dsm.currRecord.sys_stated === 4) {
          this.$notify.success({ content: "删除成功！", placement: "mid-center" });
          this.dsm.deleteRow(-1);
          this.dsm.createRecord();
          this.dsm.currRecord.sys_stated = 3;
          if (this.curr_dsm) {
            this.curr_dsm.clearData();
          }
        } else {
          var data = res.data.data;
          var _self = this;
          _.forEach(data, function(val, key) {
            // console.log(val, key);
            _self.$set(_self.dsm.currRecord, key, val);
          });
          // this.dsm.currRecord.sys_stated = billS.DICT;
          this.dsm.makeState(billS.DICT);
          this.$notify.success({ content: "保存成功！", placement: "mid-center" });
        }
        if (this.opera || this.opera !== null) {
          await this.makeCheckParams();
        }
        return true;
      }
      this.loading = 0;
      // }
    },
    checkNotNull(cds) {
      for (let i = 0; i < cds.ccells.cels.length; i++) {
        var item = cds.ccells.cels[i];
        // console.log(item);
        if (item.unNull) {
          var vl = cds.currRecord[item.id];
          // console.log(vl,this.dsm.currRecord);
          if (!vl) {
            this.$notify.warning({
              content: "【" + item.labelString + "】不能为空！",
              placement: "mid-center"
            });
            return false;
          }
        }
      }
      if (cds.haveChild()) {
        return this.checkChildNotNull(cds);
      }
      return true;
    },
    checkChildNotNull(cds) {
      var isok = true;
      _.forEach(cds.ds_sub, dssub => {
        if (dssub.cdata.length === 0 && !dssub.ccells.unNull) {
          isok = false;
          this.$notify.warning({
            content: "【" + dssub.ccells.desc + "】不能为空！",
            placement: "mid-center"
          });
          return;
        } else {
          _.forEach(dssub.cdata, (item,index) => {
            for (let i = 0; i < dssub.ccells.cels.length; i++) {
              var cell = dssub.ccells.cels[i];
              if (cell.unNull) {
                var vl = item[cell.id];
                if (!vl) {
                  this.$notify.warning({
                    content: "第"+(index+1)+"行【" + cell.labelString + "】不能为空！",
                    placement: "mid-center"
                  });
                  isok = false;
                  return;
                }
              }
              if(!isok)
                break ;
            }
            if(!isok)
              return ;
          });
        }
      });
      return isok;
    },
    async makeCheckParams() {
      if (this.opera === null) return;
      var crd = this.dsm.currRecord;
      // console.log(this.opera);
      var params = {
        sid: crd[this.opera.pkfld],
        sbuid: crd[this.opera.buidfld],
        statefr: crd[this.opera.statefld],
        stateto: crd[this.opera.statefld],
        spuserId: ""
      };
      var ceaParams = new CeaPars(params);
      var res = await this.getCeaCheckInfo(ceaParams, 33);
      if (res.data.id == 0) {
        this.chkinfo = res.data.data.info;
      } else {
        this.chkinfo = {};
      }
      var state = crd[this.opera.statefld];
      if (state === "1" || state === "0") this.dsm.canEdit = true;
      // console.log(res, "fdfdsfds");
    },
    onRemove(row) {
      if (!this.dsm.canEdit) return;
        this.curr_dsm.deleteRecord(row);
      // console.log(rows);
    },
        //step2 添加子单据
    addDj(subdsm) {
      // console.log(subdsm)
      this.curr_dsm = subdsm;
      var subId = subdsm.ccells.obj_id;
      var crd = subdsm.createRecord();
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      //currRecord
      // console.log(subdsm.cdata);
      this.dsm.currRecord[subId] = subdsm.cdata;
      this.$nextTick(() => {
        // console.log(this.$refs.expand)
        var _index = this.$refs.expand.length-1
        subdsm.currRecord = subdsm.cdata[_index]
        for(var i = 0;i<_index;i++){
          this.$refs.expand[i].$parent.active = false
        }
        this.$refs.expand[_index].$parent.active = true
      });
      const state = this.dsm.currRecord.sys_stated ;
      this.dsm.currRecord.sys_stated = state | billS.EDITED;
      
    },
        //删除所有子单据
    deleteAll(subdsm){
      subdsm.clearData();
      this.dsm.currRecord.sys_stated = this.dsm.currRecord.sys_stated|billS.REPLACESUB;
    },
        //删除某行单据
    deleteDj(subdsm,index){
      this.itemClick(subdsm,index);
      this.curr_dsm = subdsm;
      this.onRemove(index);
      var _len = this.curr_dsm.cdata.length;
      if(_len>0){
        this.$refs.expand[_len-1].$parent.active = true
      }
      // console.log(this.curr_dsm);
    },
    finish(){
      if((this.dsm.currRecord.sys_stated&billS.EDITED)>0)
        this.save();
    },
    childChange(res){
      this.curr_dsm.checkEdit(res);
      this.dsm.currRecord.sys_stated = this.dsm.currRecord.sys_stated | billS.EDITED;
    },
    //listitem 点击step2 单据
    itemClick(subdsm,index){
      //当前点击行号
      this.curr_dsm = subdsm;
      subdsm.currRecord = subdsm.cdata[index];
    },
    async getChildData(subdsm) {
      if (!subdsm) {
        return;
      }
      const objId = subdsm.ccells.obj_id;
      var pkcel = this.dsm.ccells.cels[this.dsm.ccells.pkid];
      var pkkey = pkcel.id;
      var count = {};
      count[pkkey] = this.dsm.currRecord[pkkey];
      count = JSON.stringify(count);
      var data1 = {
        dbid: global.DBID,
        usercode: JSON.parse(window.sessionStorage.getItem("user")).userCode,
        apiId: global.APIID_FINDCELLDATA,
        pcell: this.dsm.pcell,
        pdata: count,
        bebill: 1,
        currentPage: 1,
        pageSize: 20,
        cellid: objId
      };
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id === 0) {
       var data = res.data.data.pages.celData;
        var ccdata = _.take(data,data.length);
        for(let i=0;i<ccdata.length;i++){
          var crd = ccdata[i];
          crd.sys_stated = billS.DICT;
          ccdata[i] = crd;
        }
        this.dsm.currRecord[objId] = ccdata;
        subdsm.cdata = ccdata;
        this.curr_dsm = subdsm;
      }
    }
  },
  computed: {
    canEditChild(){
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          if (state === '0' || state === '1') {
            return true;
          }
          return false;
        }
      }
      return true;
    },
    canCreate() {
      if (this.dsm && this.dsm.currRecord != null) {
        if (
          (this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||
          (this.dsm.currRecord.sys_stated & billS.EDITED) > 0
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    canSave() {
      if (this.dsm && this.dsm.currRecord != null) {
        if (
          (this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||
          (this.dsm.currRecord.sys_stated & billS.EDITED) > 0
        ) {
          return false;
        }
        if ((this.dsm.currRecord.sys_stated & billS.POSTED) > 0) {
          return true;
        }
        return true;
      } else {
        return true;
      }
    },
    canDelete() {
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          if ((crd.sys_stated & billS.INSERT) > 0) return true;
          const state = crd[this.opera.statefld];
          if (state == "0" || state == "1") {
            return false;
          } else {
            return true;
          }
        }
      }
      if (this.dsm && this.dsm.currRecord != null) {
        if ((this.dsm.currRecord.sys_stated & billS.INSERT) > 0) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    canSubmit() {
      if (this.dsm && this.dsm.currRecord != null) {
        if (
          (this.dsm.currRecord.sys_stated & billS.INSERT) > 0 ||
          (this.dsm.currRecord.sys_stated & billS.EDITED) > 0
        ) {
          return true;
        }
        if (this.chkinfo) {
        }
        return false;
      }
      return true;
    },
    getSH() {
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          if (state === '0' || state === '1' || state === '5') {
            return "提交/退回";
          } else {
            return "审核/退回";
          }
        }
      }
      return "提交/退回";
    },
    canAddChild(){
      if (this.opera) {
        var crd = this.dsm.currRecord;
        if (crd) {
          var state = crd[this.opera.statefld];
          if (state === '0' || state === '1') {
            return true;
          }
          return true;
        }
      }
      return false;
    },

  },
  async mounted() {
    if (this.dsm) {
      const state = this.dsm.currRecord.sys_stated & billS.INSERT;
      if (this.dsm.ds_sub && state === 0) {
        this.getChildData(this.dsm.ds_sub[0]);
        await this.makeCheckParams();
      } else if (this.dsm.ds_sub.length > 0) {
        this.dsm.ds_sub[0].clearData();
      }
    }
  },
  watch: {
    chkinfo() {
      if (this.chkinfo) {
        if (this.chkinfo.state !== "0" && this.chkinfo.state !== "1") {
          this.dsm.canEdit = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.md-layout{margin: 0;}
</style>


