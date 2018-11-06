<template>
    <div id="container">
    </div>
</template>

<script>
export default {
    mounted() {
        this.baiduMap()
    },
    data() {
        return {
            //原始点信息
            points: [],
            bPoints: [],
            map:{}
        }
    },
    methods: {
        baiduMap() {
            // 百度地图API功能
            this.map =  new BMap.Map("container")
            //初始化坐标
            this.map.centerAndZoom(new BMap.Point(103.388611,35.563611), 5)
            //滚轮放大缩小
            this.map.enableScrollWheelZoom()
             
            //动态生成新的点
            setTimeout(this.dynamicLine, 1000)
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

            polyline = new BMap.Polyline(linePoints, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });   //创建折线  
            this.map.addOverlay(polyline);   //增加折线  
        },
        dynamicLine() {
            var lng = 100 + this.getRandom(40);
            var lat = 35 + this.getRandom(30);
            var id = this.getRandom(1000);
            var point = { "lng": lng, "lat": lat, "status": 1, "id": id }
            var makerPoints = [];
            var newLinePoints = [];
            var len;

            makerPoints.push(point);
            this.addMarker(makerPoints);//增加对应该的轨迹点  
            this.points.push(point);
            this.bPoints.push(new BMap.Point(lng, lat));
            len = this.points.length;
            newLinePoints = this.points.slice(len - 2, len);//最后两个点用来画线。  

            this.addLine(newLinePoints);//增加轨迹线  
            this.setZoom(this.bPoints);
            setTimeout(this.dynamicLine, 5000);
        },
        getRandom(n) {
            return Math.floor(Math.random() * n + 1)
        },
        setZoom(bPoints) {
            var view = this.map.getViewport(eval(bPoints));
            console.log(view)
            var mapZoom = view.zoom;
            var centerPoint = view.center;
            this.map.centerAndZoom(centerPoint, mapZoom);
        },
        addMarker(points) {
            var pointsLen = points.length;
            if (pointsLen == 0) {
                return;
            }
            var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), { imageOffset: new BMap.Size(0, 0) });
            // 创建标注对象并添加到地图   
            for (var i = 0; i < pointsLen; i++) {
                var point = new BMap.Point(points[i].lng, points[i].lat);
                var marker = new BMap.Marker(point, { icon: myIcon });
                this.map.addOverlay(marker);
            }
        }
    }
}
</script>

<style scoped type="text/css">
html{height:100%}  
body{height:100%;margin:0px;padding:0px}  
#container{width:100%;height:100%;border:1px solid gray}  
</style>

