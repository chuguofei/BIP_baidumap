<template>
  <md-input-container>
    <label :for="cell.id">{{cell.labelString}}</label>
    <md-select :name="cell.id" :id="cell.id" v-model="modal[cell.id]" :required="cell.isReq" :disabled="disabled" @change="dataCC">
      <md-option :value="item[header[0]]+''" v-for="(item,index) in values" :key="index">{{item[header[1]]}}</md-option>
    </md-select>
  </md-input-container>
</template>
<script>
import comm from "./modal.js";
export default {
  mixins: [comm],
  data() {
    return {
      header: [],
      values: []
    };
  },
  methods: {
    async doQuery() {
      // console.log(this.cell.refValue)
      if (this.cell.refValue) {
        if (this.cell.refValue.indexOf("$") > 0) {
          var data = JSON.parse(window.sessionStorage.getItem(this.cell.refValue));
          this.makeData(data);
        }else if (this.cell.refValue.indexOf("&") > 0) {
          var res = await this.getCLByAPI({'assistid':this.cell.refValue});
          console.log(res,'dddd');
          if(res.data)
            this.makeData(res.data);
        } else {
          this.header = ["code", "name"];
          var selectList = this.cell.refValue.split(";");
          // console.log(selectList)
          _(this.values).take(0);
          if(!this.cell.isReq){
            var item = { code: '', name: '' };
            this.values.push(item);
          }
          for (let i = 0; i < selectList.length; i++) {
            var key = selectList[i];
            var datas = key.split(":");
            var code = datas[0] + "";
            var item = { code: code, name: datas[1] };
            this.values.push(item);
          }
        }
      }
    },
    getCallBack(res) {
      // console.log(res.data);
      var data = res.data;
      if (data.code == -1) {
        this.$notify.danger({ content: data.message });
      } else {
        var len = data.labers.length;
        if (len > 1) {
          for (let i = 0; i < 2; i++) {
            this.header[i] = data.allCols[data.showCols[i]];
          }
        } else {
          this.header[0] = data.labers[0];
          this.header[1] = data.labers[0];
        }
        if (data.code == 1) {
          this.values = data.values;
        }
      }
    },

    makeData(data) {
      // console.log(data);
      if (data.code == -1) {
        this.$notify.danger({ content: data.message });
      } else {
        var len = data.labers.length;
        if (len > 1) {
          for (let i = 0; i < 2; i++) {
            this.header[i] = data.allCols[data.showCols[i]];
          }
        } else {
          this.header[0] = data.labers[0];
          this.header[1] = data.labers[0];
        }
        if (data.code == 1) {
          this.values = data.values;
          if(!this.cell.isReq){
            var item = { code: '', name: '' };
            this.values.splice(0, 0, item);  
          }
        }
      }
    },
    getCallError(res) {
      this.$notify.danger({ content: res.data.message });
    },
    dataCC(value) {
      // console.log(value+'');
      var refBackData = {
        cellId: this.cell.id,
        value: value,
        oldValue:this.oldValue,
        multiple: false
      };
      if (value !== this.oldValue) this.$emit("change", refBackData);
    }
  },
  mounted() {
    if (this.cell) {
      let notedit = this.cell.attr & this.NOTEDIT;
      this.disabled = notedit > 0 ? true : false;
      var modalValue = this.modal[this.cell.id];
      this.oldValue = modalValue?modalValue:'';
      this.doQuery();
    }
  }
};
</script>