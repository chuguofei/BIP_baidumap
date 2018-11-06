<template>
    <md-input-container>
    <md-dialog md-open-from="#upfile" md-close-to="#upfile" ref="fDia">
    <div class="classA">
    <md-dialog-content class="contentC">
        <md-input-container>
        <md-file v-model="placeholder" :id="id" placeholder="选择文件" :accept="accept"  @selected="selectFile" ref="file" multiple></md-file>
        </md-input-container>
        <div v-if="selFile">已选择{{num}}个文件</div>
        <div v-else>可以上传图片或者文件，总大小不能超过5M</div>
        <div :id="divId" style="width:100px">
            <img src="" alt=""/>
        </div>
        <md-table v-if="selFile" class="classAA" @select="onSelect">
            <md-table-header>
                <md-table-row>
                <md-table-head>编号</md-table-head>
                <md-table-head>文件名称</md-table-head>
                <md-table-head>文件类型</md-table-head>
                <md-table-head>文件大小</md-table-head>
                </md-table-row>
            </md-table-header>

            <md-table-body>
                <md-table-row v-for="(row,index) in myFiles" :key="index" md-auto-select :md-item="row">
                    <md-table-cell>{{parseInt(index)+1}}</md-table-cell>
                    <md-table-cell>{{row.name}}</md-table-cell>
                    <md-table-cell>{{row.type}}</md-table-cell>
                    <md-table-cell>{{getSize(row.size)}}</md-table-cell>
                </md-table-row>
            </md-table-body>
        </md-table>
    </md-dialog-content>
    <md-dialog-actions class="actionC">
         <md-button class="md-primary md-raised" @click="save">上传文件</md-button>
        <md-button class="md-accent md-raised" @click="clear()">清空列表</md-button>
        <md-button class="md-raised" @click="closeDialog('fDia')">取消</md-button>
    </md-dialog-actions>
    </div>
    </md-dialog>
      <md-input :placeholder="upmsg" readonly></md-input>
      <md-button class="md-icon-button md-clear-input" id="upfile" @click="openDialog()"><md-icon>insert_drive_file</md-icon></md-button>
    </md-input-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      upmsg: "附件上传",
      placeholder: null,
      num: "",
      selFile: false,
      accept: "*",
      myFiles: [],
      selFiles: [],
      id: "fileup",
      src: "",
      divId: "di"
    };
  },
  methods: {
    onSelect(_row, index) {
      for (var i = 0; i < this.myFiles.length; i++) {
        if (_row[i]) {
          console.log(i);
        }
      }
    },

    //清空列表
    clear() {
      this.myFiles = [];
      this.selFiles = [];
      this.selFile = false;
      document.getElementById(this.divId).getElementsByTagName("img")[0].src =
        "";
      this.placeholder = null;
    },
    showImg() {
      var id = this.divId;
      var fileInput = document.getElementById(this.id);
      fileInput.addEventListener(
        "change",
        function() {
          var file = fileInput.files[0];
          var reader = new FileReader();
          // 监听reader对象的的onload事件，当图片加载完成时，把base64编码賦值给预览图片
          reader.addEventListener(
            "load",
            function() {
              if (document.getElementById(id)) {
                document.getElementById(id).getElementsByTagName("img")[0].src =
                  reader.result;
              }
            },
            false
          );
          // 调用reader.readAsDataURL()方法，把图片转成base64
          reader.readAsDataURL(file);
        },
        false
      );
    },
    getSize(size) {
      size =
        size > 1024
          ? size / 1024 > 1024
            ? size / (1024 * 1024) > 1024
              ? (size / (1024 * 1024 * 1024)).toFixed(2) + "GB"
              : (size / (1024 * 1024)).toFixed(2) + "MB"
            : (size / 1024).toFixed(2) + "KB"
          : size.toFixed(2) + "B";
      return size;
    },

    selectFile(f) {
      this.selFiles.push(f);
      if (f.length > 0) {
        for (let i = 0; i < f.length; i++) {
          var _f = { name: f[i].name, size: f[i].size, type: f[i].type };
          this.myFiles.push(_f);
          this.num = this.myFiles.length;
        }
        this.selFile = true;
      }
    },
    async save() {
      //   var files = this.selFiles[0]
      if (this.selFiles.length < 1) {
        this.$notify.danger({ content: "请选择要上传的文件！" });
        this.clear();
        return;
      }
      var files = [];
      for (let i = 0; i < this.selFiles.length; i++) {
        files = this.selFiles[i];
        if (files.length < 1) {
          this.$notify.danger({ content: "请选择要上传的文件！" });
          this.clear();
          return;
        }

        var sumSize = 0;
        for (let i = 0; i < files.length; i++) {
          sumSize = sumSize + files[i].size;
          // if(sumSize>(5*1024*1024)){
          //     this.$notify.danger({content: '文件大小超过限制！'})
          //     return;
          // }
        }
        var arg = {
          data: {}
        };
        for (let i = 0; i < files.length; i++) {
          arg.data["file-" + i] = files[i];
        }
        // console.log(1111);
        var res = await this.upLoad(arg);
        if (res.data.id == 0) {
          this.$notify.success({ content: "上传成功！", placement: "mid-center" });
        } else {
          this.$notify.danger({ content: "上传失败！", placement: "mid-center" });
        }
        // console.log(res);
      }
    },
    openDialog() {
      this.$refs.fDia.open();
      this.showImg();
    },
    closeDialog() {
      this.$refs.fDia.close();
    }
  },
  mounted() {},
  updated() {},
  watch: {}
};
</script>

<style scoped>
.md-button.md-icon-button {
  height: 0;
}
.md-input-container input {
  font-weight: 700;
}
.classA {
  min-height: 2.1rem;
  min-width: 6rem;
  max-width: 6rem;
  max-height: 5rem;
}
.classAA {
  overflow: auto;
  max-height: 2.5rem;
}
.actionC {
  position: absolute;
  bottom: 0.1rem;
  right: 0.1rem;
}
.contentC {
  margin-bottom: 1rem;
}
</style>


