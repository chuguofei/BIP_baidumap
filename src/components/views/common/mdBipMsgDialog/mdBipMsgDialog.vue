<template>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <div :class="ISPC()?classA:classB">
      <!-- title -->
      <md-dialog-title><div class="dia-title">{{msgTitle}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC">
        <div class="content-area">
          <div class="c-area">
            <label class="area-label">消息状态</label>
            <span>{{msgStatus}}</span>
          </div>
          <div class="c-area">
            <label class="area-label">时间</label>
            <span>2017/01/01</span>
          </div>
          <div class="c-area">
            <label class="area-label">消息內容</label>
            <textarea class="area-inner" readonly v-model="msgContent"></textarea>
          </div>
        </div>
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="read">已读</md-button>
        <md-button class="md-raised" @click="closeDialog">取消</md-button>
      </md-dialog-actions>
    </div>
  </md-dialog>
</template>

<script>
export default {
  data() {
    return {
      classA: 'classA',
      classB: 'classB',
    }
  },
  props: {
    msgTitle:{
      type:String
    },
    msgStatus:{
      type:String
    },
    msgContent:{
      type:String
    },
    upStatus:{
      type:Function,
      default(){}
    }
  },
  methods: {
    //修改消息状态
    read() {
      this.upStatus()
      this.closeDialog()
    },
    closeDialog() {
      this.$refs.dialog.close()
    }
  },
  mounted() {
    this.$refs.dialog.open()
  }
}
</script>

<style scoped>
.classA {
  min-height: 4.5rem;
  max-width: 5.5rem;
  max-height: 4.5rem;
  min-width: 5.5rem;
}

.actionC {
  position: absolute;
  bottom: .1rem;
  right: .1rem
}

.contentC {
  margin-bottom: .7rem;
  padding-bottom: 0;
}

@media screen and (min-width:300px) and (max-width:321px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner {
    max-height: 1.2rem;
    width: 100%;
  }
}

@media screen and (min-width:321px) and (max-width:361px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner{
    width: 100%;
  }
}

@media screen and (min-width:362px) and (max-width:380px) {
  .classB {
    min-height: 5rem;
    max-height: 5rem;
  }
  .area-inner{
    width: 100%;
  }
}

@media screen and (min-width:381px) and (max-width:420px) {
  .classB {
    min-height: 6rem;
    max-height: 6rem;
  }
  .area-inner{
    width: 100%;
  }
}

@media screen and (min-width:420px) {
  .classB {
    min-height: 6rem;
    max-height: 6rem;
  }
  .area-inner{
    width: 80%;
  }
}

.dia-title{
  text-align: center;
}

.content-area {
  color: #48576a;
  font-size: 14px;
}

.c-area {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  margin-bottom: .2rem;
}

.area-inner {
  display: block;
  resize: none;
  padding: 5px 7px;
  line-height: 1.5;
  color: #1f2d3d;
  background-color: #fff;
  background-image:none;
  border:1px solid #bfcbd9;
  border-radius: 4px;
  transition:border-color .2s cubic-bezier(.645,.045,.355,1);
  box-sizing: border-box;
  height: 1.5rem;
  /* width:80%; */
  float: left;
}
.area-label{
  width:.8rem;
  float: left;
}

</style>



