<template>
  <md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
    <div :class="ISPC()?classA:classB">
      <!-- title -->
      <md-dialog-title><div class="dia-title">{{diaTitle}}</div></md-dialog-title>
      <!-- content -->
      <md-dialog-content class="contentC">
        <div class="content-area">
           <div class="c-area">
            <md-layout md-row md-gutter="16">
              <md-layout md-flex="15">
                <label class="area-label">任务编号</label>
              </md-layout>
              <md-layout md-flex="85">
              <md-input-container>
                <label for="task">task</label>
                <md-select name="task" id="task" v-model="taskno">
                  <md-option v-for="(task,index) in tasks" :key="index" :value="task.no">{{task.name}}</md-option>
                </md-select>
              </md-input-container>
              </md-layout>
            </md-layout>
          </div>
          <div class="c-area">
            <md-layout md-row md-gutter="16">
              <md-layout md-flex="15">
                <label class="area-label">飞机编号</label>
              </md-layout>
              <md-layout md-flex="85">
              <md-input-container>
                <label for="plane">plane</label>
                <md-select name="plane" id="plane" v-model="planeno">
                  <md-option v-for="(plane,index) in planes" :key="index" :value="plane">{{plane}}</md-option>
                </md-select>
              </md-input-container>
              </md-layout>
            </md-layout>
          </div>
           <div class="c-area" v-if="!current">
             <md-layout md-row md-gutter="16">
               <md-layout md-flex="15">
                  <label class="area-label">起始时间</label>
               </md-layout>
               <md-layout md-flex="85">
                <md-input-container>
                  <md-date :btime="true" v-model="startTime"></md-date>
                </md-input-container>
              </md-layout>
            </md-layout>
          </div>
          <div class="c-area" v-if="!current">
             <md-layout md-row md-gutter="16">
               <md-layout md-flex="15">
                  <label class="area-label">结束时间</label>
               </md-layout>
               <md-layout md-flex="85">
                <md-input-container>
                  <md-date :btime="true" v-model="endTime"></md-date>
                </md-input-container>
              </md-layout>
            </md-layout>
          </div>
        </div>
      </md-dialog-content>
      <!-- action -->
      <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="ok">确定</md-button>
        <md-button class="md-raised" @click="closeDialog">取消</md-button>
      </md-dialog-actions>
    </div>
  </md-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {
      classA: 'classA',
      classB: 'classB',
      planeno:'',
      taskno:'',
      planes:[],
      tasks:[],
      startTime:'',
      endTime:''
    }
  },
  props: {
    getOpt:{
      type:Function,
    },
    getCurrentOpt:{
      type:Function,
    },
    diaTitle:'',
    //是否为实时轨迹
    current:false
  },
  methods: {
    ok() {
      if(this.current){
        // let currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        //5s前的时间
        let ct = moment(new Date()).subtract(5,'seconds').format('YYYY-MM-DD HH:mm:ss')
        this.getCurrentOpt(this.planeno,this.taskno,ct)
        this.closeDialog()
        return
      }
      if(!this.compareDate(this.startTime,this.endTime)){
        this.$notify.warning({content:'结束时间不能大于开始时间'})
        return
      }
      if(!this.startTime || !this.endTime){
        this.$notify.warning({content:'时间不能为空'})
        return
      }
      console.log(this.planes,this.planeno)
      this.getOpt(this.planeno,this.taskno,this.startTime,this.endTime)
      this.closeDialog()
    },
    compareDate(t1,t2){
      //比较结束时间大于开始时间
      if(t1 && t2){
        return (new Date(t2.replace(/-/g,"\/"))) > (new Date(t1.replace(/-/g,"\/")))
      }
      return true
    },
    closeDialog() {
      this.$refs.dialog.close()
    },
    getListData(){
        var that = this
        let params = {startTime:that.startTime,endTime:that.endTime}
        axios.post(`${global.WEBSOCKET}/servlet/ListDataServlet`,qs.stringify(params))
        .then(res=>{
            this.tasks = []
            for(var d in res.data){
                var _tasks = {'no':d,'name':res.data[d]}
                this.tasks.push(_tasks)
            }
        })
        .catch(error=>{
            console.log(error)
        })
    },
    getTimeInterval(){
        axios.post(`${global.WEBSOCKET}/servlet/TimeIntervalServlet`)
        .then(res=>{
            this.startTime = res.data['mintime']
            this.endTime = res.data['maxtime']
        })
        .catch(error=>{
            console.log(error)
        })
    },
    getAirId(){
        this.planes = []
        let taskno = this.taskno || 'taskno'
        let params = {taskno}
        axios.post(`${global.WEBSOCKET}/servlet/AirIdServlet`,qs.stringify(params))
        .then(res=>{
            for(var air in res.data){
                this.planes.push(res.data[air])
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }
  },
  created(){
    //获取默认时间区间
    this.getTimeInterval()
    //获取飞机编号
    this.getAirId()
    //获取select数据
    this.getListData()
  },
  mounted() {
    this.$refs.dialog.open()
  },
  watch:{
    'taskno':function(){
        this.getAirId()
    },
    'startTime':function(){
        this.getListData()
    },
    'endTime':function(){
        this.getListData()
    }
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
  padding-top:.2rem;
}
.md-layout{
  margin:0;
}
</style>



