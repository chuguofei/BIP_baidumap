<template>
    <div class="gaugechart" id="gaugechart">
    </div>
</template>

<script>
import echarts from 'echarts'
export default{
    name:'echarts',
    data(){
        return{
            options:null,
            gaugecharts:null
        }
    },
    props:['gaugeseries'],
    methods:{
        init(){
            this.gaugecharts = echarts.init(document.getElementById('gaugechart'))
            this.setOpt()
        },
        setOpt(){
            window.onresize = () =>{
                this.gaugecharts.resize()
            }
            this.gaugecharts.setOption(this.options)
        },
        updateOpt(){
            this.options.series[0].data[0].value = this.gaugeseries[0].substring(0,4)
            this.options.series[1].data[0].value = this.gaugeseries[1]/1000
        },
        loadOptions(){
            this.options = {
                title:{
                    text:'飞机状态监控台',
                    textStyle:{
                        color:'#333',
                        // fontStyle:'italic'
                    },
                    left:'center'
                },
                tooltip : {
                    formatter: "{a}:{c}({b})"
                },
                toolbox: {
                    show: true,
                    feature: {
                        // saveAsImage: {show: true,title:'保存图片'}
                    }
                },
                series: [
                    /* {
                        name:'速度',
                        type: 'gauge',
                        z: 3,
                        min: 0,
                        max: 250,
                        center: ['50%', '65%'],
                        splitNumber: 10,
                        radius: '85%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        axisLabel: {
                            borderRadius: 2,
                            color: 'black',
                        },
                        title : {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 14,
                            fontStyle: 'italic'
                        },
                        detail : {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontFamily: 'Arial',
                            fontSize:16,
                            rich: {}
                        },
                        // data:[{value: 40, name: 'km/h'}]
                        data:[{value: 0.00, name: 'km/h'}]
                    }, */
                    {
                        name: '速度',
                        type: 'gauge',
                        center: ['25%', '60%'],    // 默认全局居中
                        radius: '85%',
                        min:0,
                        max:250,
                        splitNumber:2,
                        axisLine: {
                            show:true,            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 3,
                                color:[[0, '#f23378'], [1, '#f23378']]
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length:8,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length:2,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer: {
                            width:2,
                            length:'75%'
                        },
                        itemStyle:{
                            color:'#f23378',
                            borderColor:'#f23378',
                            borderWidth:1
                            /* f23378 */
                        },
                        title: {
                            color:'#f23378',
                            fontWeight: 'bolder',
                            fontStyle: 'italic',
                            offsetCenter: [0, '-30%'],       // x, y，单位px
                            fontSize:12
                        },
                        detail: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize:14
                        },
                        data:[{value: 0.00,name:'km/h'}]
                    },
                    {
                        name: '高度',
                        type: 'gauge',
                        center: ['75%', '60%'],    // 默认全局居中
                        radius: '85%',
                        min:0,
                        max:1.8,//1.6km 1600m
                        splitNumber:2,
                        axisLine: {            // 坐标轴线
                            show:true,            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 3,
                                color:[[0, '#f23378'], [1, '#f23378']]
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length:8,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length:2,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer: {
                            width:2,
                            length:'75%'
                        },
                        itemStyle:{
                            color:'#f23378',
                            borderColor:'#f23378',
                            borderWidth:1
                            /* f23378 */
                        },
                        title: {
                            color:'#f23378',
                            fontWeight: 'bolder',
                            fontStyle: 'italic',
                            offsetCenter: [0, '-30%'],       // x, y，单位px
                            fontSize:12
                        },
                        detail: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize:14
                        },
                        // data:[{value: 1.5,name:'m'}]
                        data:[{value: 0.00,name:'km'}]
                    },
                ]
            }
        }
    },
    mounted(){
        this.loadOptions()
        this.init()
    },
    watch:{
        'gaugeseries':function(){
            this.updateOpt()
            this.setOpt()
        }
    }
}
</script>

<style lang="scss" scoped>
.gaugechart{
    width:100%;
    height:100%;
}
</style>

