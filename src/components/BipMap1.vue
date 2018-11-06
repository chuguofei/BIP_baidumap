<template>
    <div id="container">
    </div>
</template>

<script>
export default {
    mounted() {
        this.baiduMap()
        this.websocketInit()
    },
    data() {
        return {
            //原始点信息
            points: [],
            bPoints: [],
            map:{},
            i:0,
        }
    },
    methods: {
        baiduMap() {
            // 百度地图API功能
            this.map =  new BMap.Map("container")
            //初始化坐标 (经度lng,纬度lat),(放大级别)
            this.map.centerAndZoom(new BMap.Point(116.405112,39.89979), 10)
            //滚轮放大缩小
            this.map.enableScrollWheelZoom()
             // 添加地图类型控件
            this.map.addControl(new BMap.MapTypeControl());
            //添加工具条、比例尺控件
            this.map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));
            this.map.addControl(new BMap.NavigationControl());
            //定位
            this.map.addControl(this.geolocationControl)
            //版权
            //设置版权控件位置
            var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })
            this.map.addControl(cr); //添加版权控件
            var bs = this.map.getBounds();   //返回地图可视区域
            cr.addCopyright({ id: 1, content: "<a href='#' style='font-size:16px;background:#2196f3;color:#fff'>北京华泰益兴科技</a>", bounds: bs });
            //动态生成新的点
            // setTimeout(this.dynamicLine, 0)

            this.map.addEventListener('click',function(e){
                //116.416799 39.882535天坛
                console.log(e.point.lng+" " +e.point.lat)
            })
        },
        addLine(points) {
            var linePoints = [], pointsLen = points.length, i, polyline;
            if (pointsLen == 0) {
                return;
            }
            // 创建标注对象并添加到地图     
            for (i = 0; i < pointsLen; i++) {
                linePoints.push(new BMap.Point(points[i].lng, points[i].lat));
            }
            polyline = new BMap.Polyline(linePoints, { strokeColor: "red", strokeWeight: 5, strokeOpacity: 0.5});   //创建折线  
            this.map.addOverlay(polyline);   //增加折线
            //窗口设置
            polyline.addEventListener('click',e => {
                var opts = {    
                    width : 220,     // 信息窗口宽度    220-730
                    height: 60,     // 信息窗口高度    60-650
                    title : "飞航"  // 信息窗口标题   
                }
                var infowindow = new BMap.InfoWindow("F518",opts)
                this.map.openInfoWindow(infowindow, new BMap.Point(points[0].lng,points[0].lat)); 
            })
            /* //关闭窗口
            polyline.addEventListener('mouseout',e => {
                this.map.closeInfoWindow()
            }) */

        },
        dynamicLine(lng,lat) {
            var point = { "lng": lng, "lat": lat}
            var makerPoints = [];
            var newLinePoints = [];
            var len;
            
            makerPoints.push(point);
            this.points.push(point);
            this.bPoints.push(new BMap.Point(lng, lat))
            
            len = this.points.length;
            newLinePoints = this.points.slice(len - 2, len);//最后两个点用来画线。  
            this.addLine(newLinePoints);//增加轨迹线  
            this.setZoom(this.bPoints);
        },
        getRandom(n) {
            return Math.floor(Math.random() * n + 1)
        },
        setZoom(bPoints) {
            var view = this.map.getViewport(eval(bPoints));
            var mapZoom = view.zoom; 
            var centerPoint = view.center;
            this.map.centerAndZoom(centerPoint, mapZoom);
        },
        websocketInit(){
            if('WebSocket' in window){
                this.websocket = new WebSocket('ws://127.0.0.1/websocket/websocket')
            }else{
                console.log('not support')
            }

            this.websocket.onerror = () => console.log('error')
            this.websocket.onopen = () => console.log('连接成功')
            this.websocket.onclose = () => console.log('连接断开')
            this.websocket.onmessage = event => this.getMessage(event.data)
            //窗口关闭时，主动关掉websocket连接，防止server端异常
            window.onbeforeunload = () => this.closeWebSocket()
        },
        closeWebSocket(){
            this.websocket.close()
        },
        getMessage(e){
            console.log(this.i++)
            var point = {}
            point = JSON.parse(e)
            setTimeout(this.dynamicLine(point.lng,point.lat),1000)
        }
    }
}
</script>

<style scoped type="text/css">
html{height:100%}  
body{height:100%;margin:0px;padding:0px}  
#container{width:100%;height:100%;border:1px solid gray}  
</style>

