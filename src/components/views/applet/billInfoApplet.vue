<template>
  <md-part>
    <md-part-toolbar>
      <md-part-toolbar-group>
        <md-button :disabled="canCreate" @click.native="create">新建</md-button>
        <md-button class="md-accent" :disabled="canDelete" @click.native="delData">删除</md-button>
        <md-button @click.native="save" :disabled="canSave">保存</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button @click.native="list">列表</md-button>
      </md-part-toolbar-group>
      <md-part-toolbar-group>
        <md-button>复制</md-button>
        <!-- <md-button>审核</md-button> -->
        <md-button @click.native="submit" :disabled="canSubmit">{{getSH}}</md-button>
      </md-part-toolbar-group>
      <span class="flex"></span>
      <md-part-toolbar-crumbs>
        <md-part-toolbar-crumb>新增/修改</md-part-toolbar-crumb>
      </md-part-toolbar-crumbs>
    </md-part-toolbar>
    <md-part-body>
      <template v-if="dsm&&!dsm.haveChild">
        <md-content class="layout-fill" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
        </md-content>
      </template>
      <template v-else>
        <md-content class="flex layout-column" v-if="dsm&&dsm.ccells!=null">
          <md-layout>
            <md-bip-input v-for="cell in dsm.ccells.cels" :ref="cell.id" :key="cell.id" :cell="cell" :modal="dsm.currRecord" :btj="false" class="bip-input" @change="dataChange"></md-bip-input>
          </md-layout>
          <md-layout class="flex layout-column" v-if="dsm.ds_sub&&dsm.ds_sub.length==1">
              <md-bip-grid :datas="dsm.ds_sub[0].cdata" ref="grid" :row-focused="true" :auto-load="true" @onAdd="onLineAdd(dsm.ds_sub[0])" @onRemove="onRemove" :showAdd="canAddChild" :showRemove="canAddChild" @rowChange="rowChange" @click="rowClick(dsm.ds_sub[0])">
                <md-bip-grid-column v-for="item in dsm.ds_sub[0].ccells.cels" :key="item.id" :label="item.labelString" :field="item.id" editable :hidden="!item.isShow" :refId="item.editName || item.refValue" :script="item.script" :attr="item.attr" :ccPoint="item.ccPoint" :refValue="item.refValue" :dataType="getDataType(item)" :formatter="formatter">
                </md-bip-grid-column>
              </md-bip-grid>
          </md-layout>
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
        // var _self = this;
        // var bb = this.confirm('111');
        //var bb = this.$dialog.open({title:'系统提示',showYes:true,showCancel:true,content:'当前单据没有保存，是否保存？'});
        // console.log(bb);
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
        // console.log(billuser);
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
        // console.log(this.dsm.currRecord);
        if (this.dsm.currRecord.sys_stated === 4) {
          this.$notify.success({ content: "删除成功！", placement: "mid-center" });
          this.dsm.deleteRow(-1);
          this.dsm.createRecord();
          this.dsm.currRecord.sys_stated = 3;
          if (this.curr_dsm) {
            // console.log(this.curr_dsm);
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
    getDataType(item) {
      if (
        item.type == 91 ||
        item.type == 93 ||
        item.chkRule == "{DATE}" ||
        item.chkRule == "{DATETIME}"
      ) {
        return "date";
      }
      if (item.assist || item.editName) {
        return "entity";
      }
      if (item.editType == 1) {
        return "enum";
      }
      if (item.type < 12) {
        return "numeric";
      }
      return "string";
    },
    onLineAdd(subdsm) {
      this.curr_dsm = subdsm;
      var subId = subdsm.ccells.obj_id;
      if (!this.dsm.canEdit) return;
      var crd = subdsm.createRecord();
      // console.log(subdsm,subId,crd);
      if (!this.dsm.currRecord[subId]) {
        this.dsm.currRecord[subId] = [];
      }
      this.dsm.currRecord[subId] = subdsm.cdata;
    },
    onRemove(rows) {
      if (!this.dsm.canEdit) return;
      if(!this.curr_dsm)
        this.curr_dsm = this.dsm.ds_sub[0];
      _.forEach(rows.data, row => {
        this.curr_dsm.deleteRecord(row);
      });
      // console.log(rows);
    },
    rowClick(subdsm) {
      this.curr_dsm = subdsm;
      // console.log(this.curr_dsm);
    },
    rowChange(row) {
      // console.log("row Change", row);
      const state = this.dsm.currRecord.sys_stated;
      if (this.chkinfo) {
        if (this.chkinfo.state !== "0" && this.chkinfo.state !== "1") {
          return;
        }
      }
      this.dsm.currRecord.sys_stated = state | billS.EDITED;
    },
    formatter(value, data, column) {
      if (column.dataType === "numeric") {
        let pit = column.ccPoint;
        // console.log(value,typeof(value));
        const v = Number.parseFloat(value);
        if(v !== 0)
          value = common.formatDecimal(value, { precision: pit });
        else{
          value = '';
        }
        // data[column.field] = value;
        return value;
      }
      return value;
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
      // console.log(data1, "findChild");
      var res = await this.getDataByAPINewSync(data1);
      if (res.data.id === 0) {
        this.dsm.currRecord[objId] = res.data.data.pages.celData;
        subdsm.cdata = res.data.data.pages.celData;
        // console.log(subdsm);
      }
    }
  },
  computed: {
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
          // if(this.chkinfo.state=='6'){
          //   return true;
          // }else{
          //   return false;
          // }
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
          return false;
        }
      }
      return true;
    }
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

<style lang="scss">

</style>


