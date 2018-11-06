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
                                <md-tooltip md-direction="right">选项</md-tooltip>
                            </md-button>
                            <md-button class="md-primary md-raised md-icon-button" @click="begin" :disabled="disbegin">
                                <md-icon>play_arrow</md-icon>
                                <md-tooltip md-direction="right">播放</md-tooltip>
                            </md-button>
                            <md-button class="md-primary md-raised md-icon-button" @click="pause" :disabled="dispause">
                                <md-icon>pause</md-icon>
                                <md-tooltip md-direction="right">暂停</md-tooltip>
                            </md-button>
                        </md-layout>
                    </md-layout>
                    <md-layout md-row class="row2">
                        <md-switch v-model="switchm" id="switchm" name="switchm" class="md-primary"><span class="myspan">画面跟随</span></md-switch>
                        <!-- <md-checkbox id="check" name="check" v-model="checkbox" class="md-primary" @change="change">画面跟随</md-checkbox> -->
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
                    <md-icon class="md-primary">airplanemode_active</md-icon><span class="md-body-2">异常预警信息</span>
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
        // this.websocketInit()
        this.setHeight()
        window.onresize = () =>{
            this.clientHeight = document.body.clientHeight
        }
        // this.change()
        this.demo()
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
            taskno:''
        }
    },
    methods: {
        demo(){
            var polyline = new BMap.Polyline([
                new BMap.Point(116.399, 39.910),
                new BMap.Point(116.405, 39.920),
            ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
            this.map.addOverlay(polyline);   //增加折线
            this.f()
        },
        f(){
            var p1 = {lng:116.399123,lat:39.910123}
            var p2 = {lng:116.405234,lat:39.920322}
            var jd = this.setRota(p1,p2)
            console.log(jd)
            var p01 = {},p02 = {},p11 = {},p12 = {}
            //转换为像素坐标
            var p1px = this.map.pointToPixel(p1)
            console.log(p1px)
            var p2px = this.map.pointToPixel(p2)
            console.log(p2px)
            p01.x = p1px.x - 20 * Math.sin(jd)
            p01.y = p1px.y + 20 * Math.cos(jd)
            p01 = this.map.pixelToPoint(p01)
            p02.x = p1px.x + 20 * Math.sin(jd)
            p02.y = p1px.y - 20 * Math.cos(jd)
            p02 = this.map.pixelToPoint(p02)
            console.log(p01,p02)
        },
        clear(){
            this.points = []
            this.bPoints = []
            this.i = 0
            this.areaPoints = []
            if(this.timer){
                clearTimeout(this.timer)
            }
        },
        select(){
            var _this = this
            this.$mapDialog.open({diaTitle:'轨迹回放参数选择',getTime(planeno,taskno,start,end){_this.getTim(planeno,taskno,start,end)} })
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
            /* this.map.addEventListener('click',e=>{
                console.log(e.point.lng,e.point.lat)
            }) */
        },
        addPoint(lng,lat,planeId,taskName,speed,flow,height){
            var point = {lng:lng,lat:lat,planeId:planeId,taskName:taskName,flow:flow,height:height,speed:speed}
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
                    lineWidth: 20,
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
            //flow
            var polyline,circle,center,opts
            opts = {
                strokeColor:'#ca59c5b3',
                fillColor:'#ca59c5b3',
                strokeWeight:0.5,
                fillOpacity:0.7
            }
            center = {lng:(this.points[this.i].lng+this.points[this.i+1].lng)/2,lat:(this.points[this.i].lat+this.points[this.i+1].lat)/2}
            if(!(this.points[this.i].flow == '0.000000')){
                circle = new BMap.Circle(center,20,opts)
                //添加圆形区域
                // this.map.addOverlay(circle)
                /* polyline = new BMap.Polyline(linePoints, { strokeColor: "#d1d6e047", strokeWeight: 100, strokeOpacity: 0.5 });   //创建折线  
                this.map.addOverlay(polyline);   //增加折线 */
            }
            polyline = new BMap.Polyline(linePoints, { strokeColor: "black", strokeWeight: 5, strokeOpacity: 0.7 });   //创建折线
            if(this.points[this.i].flow == '0.000000' && this.points[this.i].flow == '0.000000'){
                // polyline.setStrokeColor('red')
            }
            this.map.addOverlay(polyline);   //增加折线
            if(this.switchm){
                this.map.panTo(linePoints[0])
            }
            //第一次进入设置为最大放大级别
            if(this.i == 0){
                this.map.setZoom(19)
            }
            //设置飞机转向
            var rota = this.setRota(this.points[this.i],this.points[this.i+1])
            this.plane.setRotation(rota)
            var title = `任务名称:${this.points[this.i].taskName}\n飞机编号:${this.points[this.i].planeId}\n高度:${this.points[this.i].height}(km)\n速度:${this.points[this.i].speed}(km/h)\n流量:${this.points[this.i].flow}(m3/h)`
            this.plane.setTitle(title)
            this.i++
            this.plane.setPosition(new BMap.Point(this.points[this.i].lng,this.points[this.i].lat))
            this.timer = setTimeout(this.drawPointLine,1000)
        },
        //设置转向
        setRota(f,m){
            var e = 0
            f = this.map.pointToPixel(f);//起点经纬度
            m = this.map.pointToPixel(m);//终点经纬度
            if (m.x != f.x) {
                var k = (m.y - f.y) / (m.x - f.x),
                    g = Math.atan(k);
                e = g * 360 / (2 * Math.PI);
                if (m.x < f.x) {
                    e = -e + 90 + 90
                } else {
                    e = -e
                }
                return -e
            } else {
                var h = m.y - f.y;
                if (h > 0) {
                    return 90
                } else {
                    return -90
                }
            }
            return
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
                this.addPoint(e.lng,e.lat,e.planeId,e.taskName,e.speed,e.flow,e.height)
            }else{
                console.log(this.points)
                //加载轨迹线
                setTimeout(this.drawLine(),100)
                //加载飞机marker
                this.loadPlane()
                //加载区域
                this.loadAreaPoint(this.points[0].planeId)
                //加载完成，释放开始按钮
                this.disbegin = false
                this.loading = 0
                // this.begin()
            }
        },
        loadPlane(){
            //清掉覆盖物
            // this.map.clearOverlays()            
            var icon = new BMap.Icon(require('@/img/plane.png'), new BMap.Size(30, 30), { imageOffset: new BMap.Size(1, 1) })
            this.plane = new BMap.Marker(this.points[0],{icon:icon})
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
        loadAreaPoint(id){
            console.log('load')
            var params = {id:id}
            axios.post(`${global.WEBSOCKET}/servlet/AreaPointServlet`,qs.stringify(params))
            .then(res=>{
                for(var p in res.data){
                    var ap = {lng:res.data[p].lng,lat:res.data[p].lat}
                    this.areaPoints.push(ap)
                }
                console.log(this.areaPoints)
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
.md-button{margin-left:.12rem;margin-right: 0; }
.md-checkbox{margin:0.06rem 0.04rem;min-height: .3rem;padding-top: 0.06rem;}
.mapdiv{position: relative;}
.mybtn{position: absolute;top: 0;left: 52px; z-index: 1;}
.row2{position: absolute; left:16px;top:40px;}
.myspan{color:#2196f3;margin-left: .05rem;}
.md-theme-default.md-button:not([disabled]).md-primary.md-raised, .md-theme-default.md-button:not([disabled]).md-primary.md-fab{background-color: #FBFBFB;color: #3D6DCC;border:1px solid #929191;}
</style>

