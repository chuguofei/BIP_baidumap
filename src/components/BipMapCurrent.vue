<template>
<md-layout md-gutter md-column>
    <md-layout md-gutter md-row>
      <md-layout md-flex-small="100" md-flex="75">
        <md-card>
            <div class="mapdiv">
                 <div class="mybtn">
                    <md-layout md-row>
                        <md-layout>
                            <md-button class="md-primary md-raised md-icon-button" @click="select">
                                <md-icon>settings</md-icon>
                            </md-button>
                             <md-switch v-model="switchm" id="switchm" name="switchm" class="md-primary"><span class="myspan">画面跟随</span></md-switch>
                        </md-layout>
                    </md-layout>
                 </div>
                <div id="container">
                </div>
            </div>
        </md-card>
        <md-loading :loading="loading"></md-loading>
      </md-layout>
      <md-layout md-flex-small="100" md-flex="25">
        <md-card>
            <md-list>
                <md-list-item>
                    <md-icon class="md-primary">airplanemode_active</md-icon> <span class="md-body-2">异常预警信息</span>
                    <md-divider class="md-inset"></md-divider>
                </md-list-item>
                <md-list-item v-for="(item,index) in 10" :key="index">
                    <md-icon class="md-accent">error</md-icon> <span class="md-body-1">xxx飞机速度异常&nbsp;&nbsp;&nbsp;&nbsp;12:0{{index}}:00</span>
                </md-list-item>
            </md-list>
        </md-card>
      </md-layout>
    </md-layout>
    
  </md-layout>
</template>

<script>
import qs from 'qs'
import axios from 'axios'
export default {
    mounted() {
        //清覆盖物，初始化数据
        this.clear()
        this.baiduMap()
        this.setHeight()
        window.onresize = () =>{
            this.clientHeight = document.body.clientHeight
        }
    },
    data() {
        return {
            map:{},
            points:[],
            pointsCollection:[],
            bPoints:[],
            //聚合点
            markers:[],
            i:0,
            //定时器
            timer:null,
            plane:null,
            clientHeight:'',
            checkbox:false,
            switchm:true,
            disbegin:true,
            dispause:true,
            loading:0,
            //区域点
            areaPoints:[],
            planeno:'',
            taskno:'',
        }
    },
    methods: {
        clear(){
            this.points = []
            this.bPoints = []
            this.i = 0
            this.timer = null
            this.areaPoints = []
        },
        select(){
            var _this = this
            this.$mapDialog.open({diaTitle:'实时轨迹参数选择', getTime(planeno,taskno,start,end){_this.getTim(planeno,taskno,start,end)} })
        },
        getTim(planeno,taskno,start,end){
            this.loading = 1 
            //清楚所有覆盖物
            this.map.clearOverlays()
            this.websocketInit(planeno,taskno,start,end)
        },
        // change(){
        //     this.checkbox = !this.checkbox
        // },
        setHeight(){
            this.clientHeight = document.body.clientHeight
            document.getElementById('container').style.height = (this.clientHeight - 125)+'px'
        },
        begin(){
            console.log('begin')
            this.disbegin = true
            this.dispause = false
            this.drawPointLine()
        },
        pause(){
            console.log('pause')
            this.dispause = true
            this.disbegin = false
            if(this.timer){
                clearTimeout(this.timer)
            }
        },
        baiduMap(){
            this.map = new BMap.Map("container")
            //104.524489 38.810945
            this.map.centerAndZoom(new BMap.Point(100.922859,60.881121), 4);  // 初始化地图,设置中心点坐标和地图级别
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            //添加工具条、比例尺控件
            this.map.addControl(new BMap.ScaleControl());
            this.map.addControl(new BMap.NavigationControl());
            //定位
            this.map.addControl(this.geolocationControl)
            // 添加地图类型控件
            this.map.addControl(new BMap.MapTypeControl())
            this.map.addEventListener('click',e=>{
                console.log(e.point.lng,e.point.lat)
            })
        },
        
        addPoint(lng,lat){
            var point = {lng:lng,lat:lat}
            this.points.push(point)
            var pt = new BMap.Point(lng,lat)
            this.bPoints.push(pt)
        },
        drawLine(){
            console.log(this.points)
            //当有点时才可以进行轨迹回放
            if(this.points.length>0){
                this.disbegin = !this.disbegin
            }else{
                this.$notify.warning({content:'暂无轨迹数据'})
                return
            }
            var data = []
            for(var i = 0; i <this.points.length-1;i++){
                data.push({
                    geometry:{
                        type:'LineString',
                        coordinates:[
                            [this.points[i].lng,this.points[i].lat],
                            [this.points[i+1].lng,this.points[i+1].lat]
                        ],
                        count: 30
                    }
                })
            }
            var options = {
                    lineWidth: 1,
                    max: 30,
                    draw: 'simple',
                    fillStyle:'red',
                    strokeStyle: 'red'
            }
            var dataSet = new mapv.DataSet(data)
            var mapvLayer = new mapv.baiduMapLayer(this.map, dataSet, options)
        },
        drawPointLine(){
            var linePoints = []
            linePoints.push(new BMap.Point(this.points[this.i].lng,this.points[this.i].lat))
            linePoints.push(new BMap.Point(this.points[this.i+1].lng,this.points[this.i+1].lat))
            var polyline = new BMap.Polyline(linePoints, { strokeColor: "#16a94d", strokeWeight: 5, strokeOpacity: 0.7 });   //创建折线  
            this.map.addOverlay(polyline);   //增加折线
            if(this.switchm){
                this.map.panTo(linePoints[0])
            }
            //第一次进入设置为最大放大级别
            if(this.i == 0){
                this.map.setZoom(19)
            }
            this.i++
            this.timer = setTimeout(this.drawPointLine,1000)
            this.plane.setPosition(new BMap.Point(this.points[this.i].lng,this.points[this.i].lat))
        },
        setZoom(bPoints) {
            var view = this.map.getViewport(eval(bPoints));
            var mapZoom = view.zoom; 
            var centerPoint = view.center;
            this.map.centerAndZoom(centerPoint, mapZoom);
        },
        
        websocketInit(planeno,taskno,startTime,endTime){
            this.clear()
            this.planeno = planeno || 'planeno'
            this.taskno = taskno || 'taskno'
            if('WebSocket' in window){
                this.websocket = new WebSocket(`${global.WEBSOCKET_WS }/${this.planeno}/${this.taskno}/${startTime}/${endTime}`)
            }else{
                console.log('not support')
            }
            if(this.i ==5 ){
                this.websocket.send('请服务器发送消息')
            }
            this.websocket.onerror = () => console.log('error')
            this.websocket.onopen = () => console.log('连接成功')
            this.websocket.onclose = () => console.log('连接断开')
            this.websocket.onmessage = event => {
                // console.log(this.planeno,this.taskno)
                // console.log(this.planeno=='planeno')//false
                // console.log(this.planeno=='planeno' && this.taskno == 'taskno')//false
                if(this.planeno=='planeno' || this.taskno == 'taskno'){
                    // console.log('marker')
                    if(event.data!='201'){
                        //加载飞机marker
                        this.getPlaneIcon(event.data)
                        this.loading = 0
                    }
                }else{
                    // console.log('gj')
                    //为某一具体飞机添加轨迹
                    this.getGuiJi(event.data)
                }
            }
            //窗口关闭时，主动关掉websocket连接，防止server端异常
            window.onbeforeunload = () => this.closeWebSocket()
        },
        closeWebSocket(){
            this.websocket.close()
        },
        getGuiJi(e){
            e = JSON.parse(e)
            //201代表完成所有点的获取
            if(e == '404' ){
                this.$notify.warning({content:'无轨迹数据'})
                this.loading = 0
            }else if(e != '201'){
                this.addPoint(e.lng,e.lat)
            }else{
                console.log(this.points)
                /* //加载轨迹线
                setTimeout(this.drawLine(),100) */
                //加载区域
                this.loadAreaPoint()
                //加载飞机marker
                this.loadPlane()
                //加载完成，释放开始按钮
                this.disbegin = false
                this.loading = 0
                this.begin()
            }
        },
        loadPlane(){
            //清掉覆盖物
            this.map.clearOverlays()            
            var icon = new BMap.Icon(require('@/img/plane.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            var title = `飞机:${this.planeno}`
            this.plane = new BMap.Marker(this.points[0],{icon:icon,title:title})
            this.map.addOverlay(this.plane)
        },
        getPlaneIcon(e){
            var pt = {}
            pt = JSON.parse(e)
            var icon = new BMap.Icon(require('@/img/plane.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            var title = `飞机:${pt.planeId}\n任务:${pt.taskName}`
            var point = {lng:pt.lng,lat:pt.lat}
            var planeMarker = new BMap.Marker(point,{icon:icon,title:title})
            this.map.addOverlay(planeMarker)
        },
        loadAreaPoint(){
            console.log('load')
            axios.post(`${global.WEBSOCKET}/servlet/AreaPointServlet`)
            .then(res=>{
                for(var p in res.data){
                    var ap = {lng:res.data[p].lng,lat:res.data[p].lat}
                    this.areaPoints.push(ap)
                }
                this.loadArea()
            })
            .catch(error=>{
                console.log(error)
            })
        },
        //加载区域
        loadArea(){
            var arr = []
            for(var p in this.areaPoints){
                arr.push(new BMap.Point(this.areaPoints[p].lng,this.areaPoints[p].lat))
            }
            // console.log(arr)
            var opts = {
                strokeColor:'blue',
                strokeWeight:5,
                fillOpacity:0.2,
                fillColor:'#f1c721',
                strokeStyle:'dashed'
            }

            var polygon = new BMap.Polygon(arr,opts)
            this.map.addOverlay(polygon)
        }
    },
    watch:{
        'clientHeight':function(){
            this.setHeight()
        },
    }
}
</script>

<style lang="scss" scoped>
.md-card {
  margin: 0.15rem;
}

@media (max-width: 600px) {
  .md-card {
    margin: 0;
  }
}
#container{height: 100%;width: 100%;}
.md-button{margin-left:.12rem;margin-right: .12rem; }
.md-checkbox{margin:0.06rem 0.04rem;min-height: .3rem;padding-top: 0.06rem;}
.mapdiv{position: relative;}
.mybtn{position: absolute;top: 0;left: 52px; z-index: 1;}
.myspan{color:#2196f3;margin-left: .05rem;}
.md-theme-default.md-button:not([disabled]).md-primary.md-raised, .md-theme-default.md-button:not([disabled]).md-primary.md-fab{background-color: #FBFBFB;color: #3D6DCC;border:1px solid #929191;}
</style>

