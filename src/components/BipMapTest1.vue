<template>
    <!--地图容器-->
    <div style="width:100%;height:100%;border:1px solid gray" id="container"></div>
</template>
<script>
export default {
    name: '',
    data() {
        return {

        }
    },
    mounted() {
        // 百度地图API功能
        var map = new BMap.Map("container");
        //初始化坐标
        map.centerAndZoom(new BMap.Point(118.454, 32.955), 6);
        //滚轮放大缩小
        map.enableScrollWheelZoom();
        var beijingPosition = new BMap.Point(116.432045, 39.910683),
            hangzhouPosition = new BMap.Point(120.129721, 30.314429),
            taiwanPosition = new BMap.Point(121.491121, 25.127053);
        var points = [beijingPosition, hangzhouPosition, taiwanPosition];

        var curve = new BMap.Polyline(points, { strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.5 }); //创建弧线对象
        map.addOverlay(curve); //添加到地图中
        curve.enableEditing(); //开启编辑功能
    }
}
</script>
<style>
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
    font-family: "微软雅黑";
}
</style>