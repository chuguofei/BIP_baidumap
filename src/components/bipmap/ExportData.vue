<template>
    <div class="contentBar">
        <div class="contentA">
            <div class="content-area">
                <h3>飞航报告导出</h3>
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
                <div class="c-area">
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
                <div class="c-area">
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
                <div class="mybtn">
                    <md-button class="md-primary md-raised" @click="exportData">生成报告</md-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
    data(){
        return{
            planeno:'',
            taskno:'',
            planes:[],
            tasks:[],
            startTime:'',
            endTime:''
        }
    },
    methods: {
        exportData(){
            if(!this.planeno || !this.taskno){
                this.$notify.warning({content:'飞机编号或任务编号不能为空'})
                return
            }
            let taskname = this.tasks.find(o=>o.no==this.taskno).name
            let snkey = JSON.parse(window.sessionStorage.getItem('snkey'))
            // ,airid=${this.planeno}&taskno=${this.taskno}&snkey=${snkey}&taskname=${taskname}`
            let params={airid:this.planeno,taskno:this.taskno,snkey:snkey,taskname:taskname}
            axios.post(`${global.BIPAPIURL}airidWord`,qs.stringify(params))
            /* axios.get(`${global.BIPAPIURL}/airidWord?airid=${this.planeno}&taskno=${this.taskno}&snkey=${snkey}&taskname=${taskname}`) */
            .then(res=>{
                console.log(res)
                if(res.data.code == 0){
                    this.$notify.success({content:res.data.msg})
                    this.taskno = ''
                    this.planeno = '' 
                }else{
                    this.$notify.danger({content:res.data.msg})
                }
            })
            .catch(err=>{
                console.log(err)
            })
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


<style lang="scss" scoped>

.contentBar{
    width:100%;
    background-color: #f0f3f4;
    overflow: hidden;
    .contentA{
        width: 7rem;
        margin: .1rem auto;
        height:100%;
        border:1px solid #d1dbe5;
        border-radius: 4px;
        background-color: #fff;
        overflow: hidden;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        .content-area{
            h3{
                text-align: center;
            }
            width: 70%;
            margin:0 auto;
        }
    }
}
.c-area{
    position: relative;
}
.area-label{
    position: absolute;
    top: 45%;
    bottom: 55%;
}
.mybtn{
    text-align: center;
}
/* @media screen and (min-width: 200px) and (max-width:500px){
    html{
        font-size:30px;
    }
} */
</style>