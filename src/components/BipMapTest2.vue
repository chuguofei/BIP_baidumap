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
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
        //滚轮放大缩小
        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_PLANE, {
            scale: 0.6,//图标缩放大小
            strokeColor:'#fff',//设置矢量图标的线填充颜色
            strokeWeight: '2',//设置线宽
        });
        var icons = new BMap.IconSequence(sy, '0', '30');
        // 创建polyline对象
        var pois = [
            new BMap.Point(116.350658,39.938285),
            new BMap.Point(116.386446,39.939281),
            new BMap.Point(116.389034,39.913828),
            new BMap.Point(116.442501,39.914603)
        ];
        var polyline =new BMap.Polyline(pois, {
        enableEditing: false,//是否启用线编辑，默认为false
        enableClicking: true,//是否响应点击事件，默认为true
        icons:[icons],
        strokeWeight:'8',//折线的宽度，以像素为单位
        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
        strokeColor:"#18a45b" //折线颜色
        });

        map.addOverlay(polyline);          //增加折线
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