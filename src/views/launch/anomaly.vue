<template>
    <div class="anomaly">
        <div class="anomaly-header">
                <el-date-picker
                        v-model="time"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                >
                </el-date-picker>
        </div>
        <div class="anomaly-content">
            <div class="anomaly-content--item">
                <div class="day-select">
                    <el-select v-model="day">
                        <el-option label="近7天" value="last7Day">近7天</el-option>
                        <el-option label="近15天" value="last15Day">近15天</el-option>
                        <el-option label="近30天" value="last30Day">近30天</el-option>
                        <el-option label="30天以上" value="over30Day">30天以上</el-option>
                        <!--<el-option v-for="(item,index) in dayEnum" :label="item+'天'" :value="item" :key="index">{{item}}天</el-option>-->
                    </el-select>
                </div>
                <div class="anomaly-item" ref="longTimeNoUse"></div>
                <div class="anomaly-item" ref="tempCrowd"></div>
            </div>
            <div class="anomaly-content--item">
                <div class="anomaly-item" ref="abTest"></div>
                <div class="anomaly-item" ref="tempCrowdAnomaly"></div>
            </div>
            <div class="anomaly-content--item">
                <div class="anomaly-item" ref="dmpApiDistribute"></div>
                <div class="anomaly-item" ref="dmpApiSuccess"></div>
            </div>
            <div class="anomaly-content--item">
                <div class="anomaly-item" ref="dmpApiFail"></div>
                <div class="anomaly-item" ref="dmpApiFailReason"></div>
            </div>
            <div class="anomaly-content--item">
                <div class="anomaly-item" ref="taskStability"></div>
                <div class="anomaly-item" ref="taskStabilityErrorReason"></div>
            </div>
            <div class="anomaly-content--item">
                <div class="anomaly-item" ref="QPS"></div>
                <div class="anomaly-item" ref="searchCrowdTime"></div>
            </div>
            <div class="anomaly-content--item">
                <div class="anomaly-item" ref="hitOverFifty"></div>
                <div class="anomaly-item" ref="hitToZero"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "anomalyEchartsAA",
        data () {
            return {
                time: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },
                day: 'last7Day'
            }
        },
        watch: {
            'time': function (val,oldVal) {
                if (oldVal.length !== 0 && (val !== oldVal)) {
                    this.fetchData()
                }
            },
            'day': function (val,oldVal) {
                if (oldVal !== undefined && (val !== oldVal)) {
                    this.getLongTimeNoUse()
                }
            }
        },
        methods: {
            // 通用单线性参数设置
            setLineEchart (element,title,xData,yData) {
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: xData,
                        axisLabel: {
                            interval: 0,
                            rotate: -45
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            inside: true
                        },
                        scale: true,
                        axisLabel: {
                            margin: 2,
                            // formatter: function (value) {
                            //     if (value >= 10000 && value < 10000000) {
                            //         value = value / 10000 + "万";
                            //     }
                            //     else if (value >= 10000000) {
                            //         value = value / 10000000 + "千万";
                            //     } return value;
                            // }
                        },
                    },
                    series: [{
                        data: yData,
                        type: 'line'
                    }]
                })
            },
            // 通用多线性参数设置
            setLinesEchart (element,title,xData,yData,legend) {
                const _this = this
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    // tooltip: {
                    //     trigger: 'axis'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter:function (a) {
                            return _this.cc_format_number(a.data)
                        }
                    },
                    legend: {
                        data: legend,
                        padding: 30
                    },
                    xAxis: {
                        type: 'category',
                        data: xData,
                        axisLabel: {
                            interval: 0,
                            rotate: -45
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            inside: true
                        },
                        scale: true,
                        axisLabel: {
                            margin: 2,
                            // formatter: function (value) {
                            //     if (value >= 10000 && value < 10000000) {
                            //         value = value / 10000 + "万";
                            //     }
                            //     else if (value >= 10000000) {
                            //         value = value / 10000000 + "千万";
                            //     } return value;
                            // }
                        },
                    },
                    series: yData
                })
            },
            // 通用圆饼图
            setCircleEcharts(element,title,legend,data,circleType){
                const _this = this
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    // tooltip: {
                    //     trigger: 'item',
                    //     formatter: "{a} <br/>{b}: {c} ({d}%)"
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter:function (a) {
                            return a.data.name + ':' + _this.cc_format_number(a.data.value) +'('+ a.percent+ ')%'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: circleType === 'all' ? 'bottom':'right',
                        data: legend,
                        type: 'scroll'
                    },
                    series: [
                        {
                            name:'',
                            type:'pie',
                            radius: circleType === 'all' ? '70%' : ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: circleType === 'all' ? true : false,
                                    position: circleType === 'all' ? '': 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },
                            data: data
                        }
                    ]
                });
            },
            formatDate (d) {
                const time = new Date(d)
                let y = time.getFullYear(); // 年份
                let m = (time.getMonth() + 1).toString().padStart(2,'0'); // 月份
                let r = time.getDate().toString().padStart(2,'0'); // 日子
                return `${y}-${m}-${r}`
            },
            validateEmptyData (data,ele) {
                if(Object.keys(data).length === 0) {
                    this.$refs[ele].innerHTML = '暂无数据'
                    return false
                } else {
                    return true
                }
            },
            getLongTimeNoUse () {
                this.$service.longTimeNoUseEcharts({beginDate: this.time[0], endDate: this.time[1], day: this.day}).then((data) => {
                    if(this.validateEmptyData(data,'longTimeNoUse')) {
                        this.setLineEchart('longTimeNoUse', '长期未使用人群情况', data.xaxis, data.series[0].value)
                    }
                })
            },
            getTempCrowd () {
                this.$service.tempCrowdEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'tempCrowd')) {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name: key.name, data: key.value, type: 'line'}
                        })
                        this.setLinesEchart('tempCrowd', '临时人群（高级人群）异常情况', data.xaxis, linesData, legendData)
                    }
                })
            },
            getAbTest () {
                this.$service.abTestEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'abTest')) {
                        this.setLineEchart('abTest', '已过期AB实验人群', data.xaxis, data.series[0].value)
                    }
                })
            },
            getTempTagAnomaly () {
                this.$service.tempCrowdEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'tempCrowdAnomaly')) {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name: key.name, data: key.value, type: 'line'}
                        })
                        this.setLinesEchart('tempCrowdAnomaly', '临时标签异常情况', data.xaxis, linesData, legendData)
                    }
                })
            },
            getDmpApiUseDistribute () {
                this.$service.getDmpApiRequestEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'dmpApiDistribute')) {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name: key.name, data: key.value, type: 'line'}
                        })
                        this.setLinesEchart('dmpApiDistribute', 'DMP接口调用分布情况', data.xaxis, linesData, legendData)
                    }
                })
            },
            getDmpApiUseSuccess () {
                this.$service.getDmpApiRequestAccuracyEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'dmpApiSuccess')) {
                        this.setLineEchart('dmpApiSuccess', 'DMP接口调用正确率', data.xaxis, data.series[0].value)
                    }
                })
            },
            getDmpApiUseFail () {
                this.$service.getDmpApiRequestErrorEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'dmpApiFail')) {
                        this.setLineEchart('dmpApiFail', 'DMP接口调用错误率', data.xaxis, data.series[0].value)
                    }
                })
            },
            getDmpApiUseFailReason () {
                this.$service.getDmpApiRequestErrorReasonEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data)=>{
                    if(this.validateEmptyData(data,'dmpApiFailReason')) {
                        const dataObject = data.data.map((key, index) => {
                            return {value: key.count, name: data.names[index]}
                        })
                        this.setCircleEcharts('dmpApiFailReason', 'DMP接口调用错误原因分布', data.names, dataObject)
                    }
                })
            },
            getTaskStability () {
                this.$service.getDmpTaskEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'taskStability')) {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name: key.name, data: key.value, type: 'line'}
                        })
                        this.setLinesEchart('taskStability', '任务调度系统稳定性', data.xaxis, linesData, legendData)
                    }
                })
            },
            getTaskFailReason () {
                this.$service.getDmpTaskFailReasonEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data)=>{
                    if(this.validateEmptyData(data,'taskStabilityErrorReason')) {
                        const dataObject = data.data.map((key, index) => {
                            return {value: key.count, name: data.names[index]}
                        })
                        this.setCircleEcharts('taskStabilityErrorReason', '任务调度系统失败原因', data.names, dataObject)
                    }
                })
            },
            getQPS () {
                this.$service.getDmpQpsApiRequestEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'QPS')) {
                        this.setLineEchart('QPS', 'QPS(每日单次请求峰值)', data.xaxis, data.series[0].value)
                    }
                })
            },
            getSearchCrowdTime () {
                this.$service.getSelectCrowdTimeEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'searchCrowdTime')) {
                        this.setLineEchart('searchCrowdTime', '单人群查询最长耗时（每日）', data.xaxis, data.series[0].value)
                    }
                })
            },
            getHitDeclineFifty () {
                this.$service.getCrowdHitCountDeclineEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'hitOverFifty')) {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name: key.name, data: key.value, type: 'line'}
                        })
                        this.setLinesEchart('hitOverFifty', '命中、曝光、点击今日突降50%以上人群数（投放中）', data.xaxis, linesData, legendData)
                    }
                })
            },
            getHitDeclineToZero () {
                this.$service.getCrowdHitCountDeclineToZeroEcharts({beginDate: this.time[0], endDate: this.time[1]}).then((data) => {
                    if(this.validateEmptyData(data,'hitToZero')) {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name: key.name, data: key.value, type: 'line'}
                        })
                        this.setLinesEchart('hitToZero', '命中、曝光、点击今日突降为0人群数（投放中）', data.xaxis, linesData, legendData)
                    }
                })
            },
            fetchData () {
                this.getLongTimeNoUse()
                this.getTempCrowd()
                this.getAbTest()
                this.getTempTagAnomaly()
                this.getDmpApiUseDistribute()
                this.getDmpApiUseSuccess()
                this.getDmpApiUseFail()
                this.getDmpApiUseFailReason()
                this.getTaskStability()
                this.getTaskFailReason()
                this.getQPS()
                this.getSearchCrowdTime()
                this.getHitDeclineFifty()
                this.getHitDeclineToZero()
            }
        },
        created() {
            // 设置默认时间为今天的前一周
            const start = new Date()
            const end = new Date()
            const startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 6))
            const endDate = this.formatDate(end.setTime(end.getTime()))
            this.time = [startDate,endDate]
            // this.time = ['2019-10-28','2019-10-29']
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
    .anomaly-content--item
        display flex
        position relative
    .anomaly-item
        width 49%
        height 300px
        background-color #f2f4f6
        margin 15px 10px
        padding 15px
    .day-select
        position absolute
        z-index 999
        top 30px
        width 49%
        text-align center
</style>
