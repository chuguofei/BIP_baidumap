//地球半径
const EARTH_ARC = 111.199
export default {
    methods:{
        baiduMap() {
            this.map = new BMap.Map("container")
            //104.524489 38.810945
            // this.map.centerAndZoom(new BMap.Point(116.98591030212918,34.57042861596912),18)
            this.map.centerAndZoom(new BMap.Point(100.922859, 40.881121), 4);  // 初始化地图,设置中心点坐标和地图级别
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
        //转化为弧度
        rad(d) {
            return d * Math.PI / 180.0
        },
        //获取垂直轨迹的四点方位角
        getPointAz(p1, p2, az) {
            if ((p1.lng < p2.lng && p1.lat >= p2.lat) || (p1.lng >= p2.lng && p1.lat > p2.lat)) {
                return (270 - az) + ',' + (90 - az) + ',' + (270 - az) + ',' + (90 - az)
            }
            if ((p1.lng > p2.lng && p1.lat <= p2.lat) || (p1.lng <= p2.lng && p1.lat < p2.lat)) {
                return (270 + az) + ',' + (90 + az) + ',' + (270 + az) + ',' + (90 + az)
            }
        },
        //求两个经纬度的方位角
        getAzimuth(lng1, lat1, lng2, lat2) {
            lat1 = this.rad(lat1)
            lat2 = this.rad(lat2)
            lng1 = this.rad(lng1)
            lng2 = this.rad(lng2)
            var azimuth = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1)
                * Math.cos(lat2) * Math.cos(lng2 - lng1)
            azimuth = Math.sqrt(1 - azimuth * azimuth)
            azimuth = Math.cos(lat2) * Math.sin(lng2 - lng1) / azimuth
            azimuth = Math.asin(azimuth) * 180 / Math.PI

            if (isNaN(azimuth)) {
                if (lng1 < lng2) {
                    azimuth = 90.0
                } else {
                    azimuth = 270.0
                }
            }
            return Math.ceil(azimuth)
        },
        //已知一个经纬度，方向角，距离，求另外一个点的经纬度
        getOtherPoint(lng1, lat1, distance, az) {
            distance = distance / 1000;
            az = az * Math.PI / 180;
            var lng = lng1 + (distance * Math.sin(az)) / (EARTH_ARC * Math.cos(this.rad(lat1)));
            var lat = lat1 + (distance * Math.cos(az)) / EARTH_ARC;
            return lng + "," + lat;
        },
        //设置转向
        setRota(f, m) {
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
        
    }
}