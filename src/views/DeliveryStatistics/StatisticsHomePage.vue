<template>
    <div>
        <div>我是统计页</div>
        <div class="main" ref="main"></div>
    </div>
</template>

<script>
    export default {
        name: "StatisticsHomePage",
        data () {
            return {
                initData: []
            }
        },
        methods: {
            getData () {
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs.main)
                // myChart.setOption({
                //     title: {
                //         text: 'ECharts 入门示例'
                //     },
                //     tooltip: {},
                //     xAxis: {
                //         data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                //     },
                //     yAxis: {},
                //     series: [{
                //         name: '销量',
                //         type: 'bar',
                //         data: [5, 20, 36, 10, 10, 20]
                //     }]
                // });
                // myChart.setOption({
                //     tooltip: {
                //         trigger: 'item',
                //         formatter: "{a} <br/>{b}: {c} ({d}%)"
                //     },
                //     legend: {
                //         orient: 'vertical',
                //         x: 'left',
                //         data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                //     },
                //     series: [
                //         {
                //             name:'访问来源',
                //             type:'pie',
                //             radius: ['50%', '70%'],
                //             avoidLabelOverlap: false,
                //             label: {
                //                 normal: {
                //                     show: false,
                //                     position: 'center'
                //                 },
                //                 emphasis: {
                //                     show: true,
                //                     textStyle: {
                //                         fontSize: '30',
                //                         fontWeight: 'bold'
                //                     }
                //                 }
                //             },
                //             labelLine: {
                //                 normal: {
                //                     show: false
                //                 }
                //             },
                //             data:[
                //                 {value:335, name:'直接访问'},
                //                 {value:310, name:'邮件营销'},
                //                 {value:234, name:'联盟广告'},
                //                 {value:135, name:'视频广告'},
                //                 {value:1548, name:'搜索引擎'}
                //             ]
                //         }
                //     ]
                // });
                myChart.setOption({
                    title : {
                        text: 'iphone销量',
                        subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data:['iphone3','iphone4','iphone5']
                    },
                    visualMap: {
                        min: 0,
                        max: 2500,
                        left: 'left',
                        top: 'bottom',
                        text:['高','低'],           // 文本，默认为数值文本
                        calculable : true
                    },
                    toolbox: {
                        show: true,
                        orient : 'vertical',
                        left: 'right',
                        top: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                        {
                            name: 'iphone3',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[
                                {name: '北京',value: Math.round(Math.random()*1000)},
                                {name: '天津',value: Math.round(Math.random()*1000)},
                                {name: '上海',value: Math.round(Math.random()*1000)},
                                {name: '重庆',value: Math.round(Math.random()*1000)},
                                {name: '河北',value: Math.round(Math.random()*1000)},
                                {name: '河南',value: Math.round(Math.random()*1000)},
                                {name: '云南',value: Math.round(Math.random()*1000)},
                                {name: '辽宁',value: Math.round(Math.random()*1000)},
                                {name: '黑龙江',value: Math.round(Math.random()*1000)},
                                {name: '湖南',value: Math.round(Math.random()*1000)},
                                {name: '安徽',value: Math.round(Math.random()*1000)},
                                {name: '山东',value: Math.round(Math.random()*1000)},
                                {name: '新疆',value: Math.round(Math.random()*1000)},
                                {name: '江苏',value: Math.round(Math.random()*1000)},
                                {name: '浙江',value: Math.round(Math.random()*1000)},
                                {name: '江西',value: Math.round(Math.random()*1000)},
                                {name: '湖北',value: Math.round(Math.random()*1000)},
                                {name: '广西',value: Math.round(Math.random()*1000)},
                                {name: '甘肃',value: Math.round(Math.random()*1000)},
                                {name: '山西',value: Math.round(Math.random()*1000)},
                                {name: '内蒙古',value: Math.round(Math.random()*1000)},
                                {name: '陕西',value: Math.round(Math.random()*1000)},
                                {name: '吉林',value: Math.round(Math.random()*1000)},
                                {name: '福建',value: Math.round(Math.random()*1000)},
                                {name: '贵州',value: Math.round(Math.random()*1000)},
                                {name: '广东',value: Math.round(Math.random()*1000)},
                                {name: '青海',value: Math.round(Math.random()*1000)},
                                {name: '西藏',value: Math.round(Math.random()*1000)},
                                {name: '四川',value: Math.round(Math.random()*1000)},
                                {name: '宁夏',value: Math.round(Math.random()*1000)},
                                {name: '海南',value: Math.round(Math.random()*1000)},
                                {name: '台湾',value: Math.round(Math.random()*1000)},
                                {name: '香港',value: Math.round(Math.random()*1000)},
                                {name: '澳门',value: Math.round(Math.random()*1000)}
                            ]
                        },
                        {
                            name: 'iphone4',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[
                                {name: '北京',value: Math.round(Math.random()*1000)},
                                {name: '天津',value: Math.round(Math.random()*1000)},
                                {name: '上海',value: Math.round(Math.random()*1000)},
                                {name: '重庆',value: Math.round(Math.random()*1000)},
                                {name: '河北',value: Math.round(Math.random()*1000)},
                                {name: '安徽',value: Math.round(Math.random()*1000)},
                                {name: '新疆',value: Math.round(Math.random()*1000)},
                                {name: '浙江',value: Math.round(Math.random()*1000)},
                                {name: '江西',value: Math.round(Math.random()*1000)},
                                {name: '山西',value: Math.round(Math.random()*1000)},
                                {name: '内蒙古',value: Math.round(Math.random()*1000)},
                                {name: '吉林',value: Math.round(Math.random()*1000)},
                                {name: '福建',value: Math.round(Math.random()*1000)},
                                {name: '广东',value: Math.round(Math.random()*1000)},
                                {name: '西藏',value: Math.round(Math.random()*1000)},
                                {name: '四川',value: Math.round(Math.random()*1000)},
                                {name: '宁夏',value: Math.round(Math.random()*1000)},
                                {name: '香港',value: Math.round(Math.random()*1000)},
                                {name: '澳门',value: Math.round(Math.random()*1000)}
                            ]
                        },
                        {
                            name: 'iphone5',
                            type: 'map',
                            mapType: 'china',
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[
                                {name: '北京',value: Math.round(Math.random()*1000)},
                                {name: '天津',value: Math.round(Math.random()*1000)},
                                {name: '上海',value: Math.round(Math.random()*1000)},
                                {name: '广东',value: Math.round(Math.random()*1000)},
                                {name: '台湾',value: Math.round(Math.random()*1000)},
                                {name: '香港',value: Math.round(Math.random()*1000)},
                                {name: '澳门',value: Math.round(Math.random()*1000)}
                            ]
                        }
                    ]
                });
            }
        },
        mounted () {
            this.getData()
        }
    }
</script>

<style lang="stylus" scoped>
.main
    width 800px
    height 800px
</style>
