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
            bounds: [],
            linesPoints: [],
            map: {},
            spoi1: {},//起点1
            spoi2: {},//起点2
            epoi: {},//终点
            myIcon: {}//图标
        }
    },
    methods: {
        //初始化数据
        baiduMap() {
            // 百度地图API功能
            this.map = new BMap.Map("container")
            //初始化坐标
            this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 15)
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
            //初始化起点终点
            this.spoi1 = new BMap.Point(116.380967, 39.913285)
            this.spoi2 = new BMap.Point(116.380967, 39.953285)
            this.epoi = new BMap.Point(116.424374, 39.914668)
            //图标
            this.myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), { imageOffset: new BMap.Size(0, 0) })
            this.initLine()
        },
        initLine() {
            //清空覆盖物
            this.map.clearOverlays()
            //驾车，并设置回调
            var driving3 = new BMap.DrivingRoute(this.map, { onSearchComplete: this.drawLine })
            //搜索一条路线
            driving3.search(this.spoi1, this.epoi)
            var driving4 = new BMap.DrivingRoute(this.map, { onSearchComplete: this.drawLine })
            driving4.search(this.spoi2, this.epoi)
            //2s后启动
            setTimeout(this.run, 2000)
        },
        addLabel() {
            
        },
        showInfo(content){
            var opts =  {
				width : 250,     // 信息窗口宽度
				height: 80,     // 信息窗口高度
				title : "信息窗口" , // 信息窗口标题
				enableMessage:true//设置允许信息窗发送短息
            }
            alert('超级玛丽')
            console.log('aaa')
            var point = new BMap.Point(this.spoi1.lng,this.spoi1.lat)
            var infoWindow = new BMap.InfoWindow(content,opts)  // 创建信息窗口对象 
            this.map.openInfoWindow(infoWindow,point); //开启信息窗口
            
            var point2 = new BMap.Point(this.spoi2.lng,this.spoi2.lat)
            this.map.openInfoWindow(infoWindow,point2); //开启信息窗口
            // alert('aaa')
            // console.log(point)
            // if(point==this.spoi1){
            //     console.log('111')
            // }else if(point==this.spoi2){
            //     console.log('222')
            // }
        },
        run() {
            for (var m = 0; m < this.linesPoints.length; m++) {
                var pts = this.linesPoints[m];
                var len = pts.length;
                var carMk = new BMap.Marker(pts[0], { icon: this.myIcon });
                this.map.addOverlay(carMk);
                resetMkPoint(1, len, pts, carMk)
            }

            function resetMkPoint(i, len, pts, carMk) {
                carMk.setPosition(pts[i]);
                if (i < len) {
                    setTimeout(function() {
                        i++;
                        resetMkPoint(i, len, pts, carMk);
                    }, 100);
                }
            }
        },
        drawLine(results) {
            var opacity = 0.45;
            var planObj = results.getPlan(0);
            var b = new Array();
            var that = this
            var addMarkerFun = function(point, imgType, index, title) {
                var url;
                var width;
                var height
                var myIcon;
                // imgType:1的场合，为起点和终点的图；2的场合为车的图形
                if (imgType == 1) {
                    url = "http://lbsyun.baidu.com/jsdemo/img/dest_markers.png";
                    width = 42;
                    height = 34;
                    myIcon = new BMap.Icon(url, new BMap.Size(width, height), { offset: new BMap.Size(14, 32), imageOffset: new BMap.Size(0, 0 - index * height) });
                } else {
                    url = "http://lbsyun.baidu.com/jsdemo/img/trans_icons.png";
                    width = 22;
                    height = 25;
                    var d = 25;
                    var cha = 0;
                    var jia = 0
                    if (index == 2) {
                        d = 21;
                        cha = 5;
                        jia = 1;
                    }
                    myIcon = new BMap.Icon(url, new BMap.Size(width, d), { offset: new BMap.Size(10, (11 + jia)), imageOffset: new BMap.Size(0, 0 - index * height - cha) });
                }

                var marker = new BMap.Marker(point, { icon: myIcon });
                marker.addEventListener("click",function(e){
                    that.showInfo("hihii")
                })
                if (title != null && title != "") {
                    marker.setTitle(title);
                }
                // 起点和终点放在最上面
                if (imgType == 1) {
                    marker.setTop(true);
                }
                that.map.addOverlay(marker);
            }
            var that = this
            var addPoints = function(points) {
                for (var i = 0; i < points.length; i++) {
                    that.bounds.push(points[i]);
                    b.push(points[i]);
                }
            }
            // 绘制驾车步行线路
            for (var i = 0; i < planObj.getNumRoutes(); i++) {
                var route = planObj.getRoute(i);
                if (route.getDistance(false) <= 0) { continue; }
                addPoints(route.getPath());
                // 驾车线路
                if (route.getRouteType() == BMAP_ROUTE_TYPE_DRIVING) {
                    this.map.addOverlay(new BMap.Polyline(route.getPath(), { strokeColor: "red", strokeOpacity: opacity, strokeWeight: 6, enableMassClear: true }));
                } else {
                    // 步行线路有可能为0
                    this.map.addOverlay(new BMap.Polyline(route.getPath(), { strokeColor: "red", strokeOpacity: 0.75, strokeWeight: 4, enableMassClear: true }));
                }
            }
            this.map.setViewport(this.bounds);
            // 终点
            addMarkerFun(results.getEnd().point, 1, 1);
            // 开始点
            addMarkerFun(results.getStart().point, 1, 0);
            this.linesPoints[this.linesPoints.length] = b;
        },
    },
    computed: {
        geolocationControl() {
            return new BMap.GeolocationControl()
        }
    },
}
</script>

<style scoped type="text/css">
html {
    height: 100%
}

body {
    height: 100%;
    margin: 0px;
    padding: 0px
}

#container {
    width: 100%;
    height: 100%;
    border: 1px solid gray
}
</style>

