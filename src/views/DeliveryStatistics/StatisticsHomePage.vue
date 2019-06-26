<template>
    <div class="launch-statistics">
        <div>
            <div class="title">策略数据统计</div>
            <div class="crowd-statistic">
                <div class="crowd-statistic-item" v-for="(item,index) in crowdData" :key="index">
                    <div>{{item.name}}</div>
                    <div class="crowd-statistic-item--number">{{item.count}}</div>
                </div>
            </div>
        </div>
        <div>
            <div class="title">人群数据统计</div>
            <div class="crowd-statistic">
            <div class="echarts-container">
                <div class="date-picker">
                    <el-date-picker
                            v-model="time0"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <div class="crowd-all-item-container">
                <div class="crowd-all-item" v-for="(item,index) in crowdAllData" :key="index">
                    <div>{{item.name}}</div>
                    <div class="crowd-all-item--number">{{item.count}}</div>
                </div>
                </div>
            </div>
            <div class="echarts-container">
                <div class="date-picker">
                    <el-date-picker
                            v-model="time2"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <div class="main" ref="crowdForcas"></div>
            </div>
            <div class="echarts-container">
                <div class="date-picker">
                    <el-date-picker
                            v-model="time1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <div class="business-text" @click="businessClick(1)">按业务下钻-></div>
                <div class="main" ref="peopleStatistic"></div>
            </div>
            <div class="echarts-container">
                <div class="date-picker">
                    <el-date-picker
                            v-model="time3"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <div class="business-text" @click="businessClick(2)">按业务下钻-></div>
                <div class="main" ref="crowdUv"></div>
            </div>
            <div class="echarts-container">
                <div class="date-picker">
                    <el-date-picker
                            v-model="time4"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <div class="business-text" @click="businessClick(3)">按业务下钻-></div>
                <div class="main" ref="crowdSend"></div>
            </div>
            <div class="echarts-container">
                <div class="date-picker">
                    <el-date-picker
                            v-model="time5"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </div>
                <div class="business-text" @click="businessClick(4)">按业务下钻-></div>
                <div class="main" ref="crowdClick"></div>
            </div>
            </div>
        </div>
        <div>
            <div class="title">累计曝光人群画像</div>
            <div class="click-date-picker">
                <el-date-picker
                        v-model="time6"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </div>
            <div class="crowd-statistic border-bottom">
                <div ref="circleSex" class="circle-echarts border-right"></div>
                <div ref="circleAge" class="circle-echarts border-right"></div>
                <div ref="circleDevice" class="circle-echarts"></div>
            </div>
            <div class="crowd-statistic">
                <div class="left-map-container border-right">
                    <div class="map-echarts" ref="main"></div>
                    <div class="city-active-proportion">
                        <div class="city-active-proportion--title">{{cityData.name}}</div>
                        <div v-for="(item,index) in cityData.data" :key="index" class="city-active-proportion--name">
                            {{item.name}}:{{item.percent}}
                        </div>
                    </div>
                </div>
                <div class="table-over">
                    <div class="table-title">城市活跃排名</div>
                    <!--<ContentWrapper-->
                            <!--:filter="filter"-->
                            <!--:pagination="pagination"-->
                    <!--&gt;-->
                        <Table
                                :props="table.props"
                                :header="table.header"
                                :data="table.data"
                                class="table-overflow"
                        >
                        </Table>
                    <!--</ContentWrapper>-->
                </div>
            </div>
        </div>
        <el-dialog
                :title="businessTitle"
                :visible.sync="dialogVisible">
            <div v-if=" dialogVisibleType === true">
                <el-select v-model="businessType">
                    <el-option value="1" label="人群曝光总量"></el-option>
                    <el-option value="2" label="人群点击总量"></el-option>
                </el-select>
            </div>
            <div class="main" ref="business" v-if=" dialogVisible=== true"></div>
        </el-dialog>
    </div>
</template>

<script>
    import { ContentWrapper, Table} from 'admin-toolkit'
    export default {
        name: "StatisticsHomePage",
        components: {
            ContentWrapper,
            Table
        },
        data () {
            return {
                crowdData: [],
                crowdAllData: [],
                // 默认时间
                startDate: '',
                endDate: '',
                time0: [],
                time1: [],
                time2: [],
                time3: [],
                time4: [],
                time5: [],
                time6: [],
                businessType: '1',
                cityData: '',
                dialogVisible: false,
                dialogVisibleType: false,
                businessTitle: '',
                filter: {},
                pagination: {},
                table: {
                    props: {},
                    header: [
                        {
                            label: '排名',
                            width: '50',
                            prop: 'seq'
                        },
                        {
                            label: '省份',
                            prop: 'name'
                        },
                        {
                            label: '活跃数量',
                            prop: 'value'
                        },
                        {
                            label: '占比',
                            prop: 'percent'
                        }
                    ],
                    data: []
                }
            }
        },
        watch: {
            time0(val) {
                this.getAllCrowdTotal(val[0],val[1])
            },
            time1(val) {
                this.getCrowdtotal(val[0],val[1])
            },
            time2(val) {
                this.getForcastotal(val[0],val[1])
            },
            time3(val) {
                this.getCrowdUvtotal(val[0],val[1])
            },
            time4(val) {
                this.getCrowdSendtotal(val[0],val[1])
            },
            time5(val) {
                this.getCrowdClicktotal(val[0],val[1])
            },
            time6(val) {
                this.getCrowdSextotal(val[0],val[1])
                this.getCrowdAgetotal(val[0],val[1])
                this.getCrowdDevicetotal(val[0],val[1])
                this.getCrowdProvincetotal(val[0],val[1])
            },
            businessType(val) {
                this.handleLinesBusiness(val)
            }
        },
        methods: {
            getCrowdData () {
                this.$service.get_total_policy().then((data)=>{
                    this.crowdData = data
                })
            },
            getAllCrowdTotal (startTime, endTime) {
                this.$service.get_crowd_all_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    this.crowdAllData = data
                })
            },
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
                            formatter: function (value) {
                                if (value >= 10000 && value < 10000000) {
                                value = value / 10000 + "万";
                                }
                                else if (value >= 10000000) {
                                    value = value / 10000000 + "千万";
                                } return value;
                            }
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
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legend
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
                            formatter: function (value) {
                                if (value >= 10000 && value < 10000000) {
                                    value = value / 10000 + "万";
                                }
                                else if (value >= 10000000) {
                                    value = value / 10000000 + "千万";
                                } return value;
                            }
                        },
                    },
                    series: yData
                })
            },
            // 通用圆饼图
            setCircleEcharts(element,title,legend,data){
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        data: legend
                    },
                    series: [
                        {
                            name:'',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
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
                                    show: false
                                }
                            },
                            data: data
                        }
                    ]
                });
            },
            // 人群调用总量PV
            getCrowdtotal (startTime, endTime) {
                this.$service.get_crowd_pv_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    this.setLineEchart('peopleStatistic',data.series[0].name,data.date,data.series[0].data)
                })
            },
            // 人群计算总量
            getForcastotal (startTime, endTime) {
                this.$service.get_crowd_forcas_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    this.setLineEchart('crowdForcas',data.series[0].name,data.date,data.series[0].data)
                })
            },
            // 人群命中总量
            getCrowdUvtotal (startTime, endTime) {
                this.$service.get_crowd_uv_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    this.setLineEchart('crowdUv',data.series[0].name,data.date,data.series[0].data)
                })
            },
            // 人群下发总量
            getCrowdSendtotal (startTime, endTime) {
                this.$service.get_crowd_send_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    this.setLineEchart('crowdSend',data.series[0].name,data.date,data.series[0].data)
                })
            },
            // 人群曝光总量
            getCrowdClicktotal (startTime, endTime) {
                this.$service.get_crowd_click_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    const legendData = data.series.map((key) => {
                        return key.name
                    })
                    const linesData = data.series.map((key) => {
                        return {name:key.name, data:key.data, type: 'line'}
                    })
                    this.setLinesEchart('crowdClick','曝光、点击量',data.date,linesData,legendData)
                })
            },
            // 人群画像性别
            getCrowdSextotal (startTime, endTime) {
                this.$service.get_crowd_sex_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    const dataObject = data.data.map((key,index) => {
                        return {value: key.count, name: data.names[index]}
                    })
                    this.setCircleEcharts('circleSex','性别分析',data.names,dataObject)
                })
            },
            // 人群年龄分布
            getCrowdAgetotal (startTime, endTime) {
                this.$service.get_crowd_age_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    const dataObject = data.data.map((key,index) => {
                        return {value: key.count, name: data.names[index]}
                    })
                    this.setCircleEcharts('circleAge','年龄分布',data.names,dataObject)
                })
            },
            // 产品等级分布
            getCrowdDevicetotal (startTime, endTime) {
                this.$service.get_device_level_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    const dataObject = data.data.map((key,index) => {
                        return {value: key.count, name: data.names[index]}
                    })
                    this.setCircleEcharts('circleDevice','产品等级分类',data.names,dataObject)
                })
            },
            // 省份分布
            getCrowdProvincetotal (startTime, endTime) {
                this.$service.get_crowd_province_total({startDate:startTime,endDate:endTime}).then((data)=>{
                    const newData = data.data.map((key,index) => {
                        return {value: key.value, name: key.name,seq: index+1,percent:key.percent}
                    })
                    this.setMapEcharts('main','省份分布',data.data)
                    this.cityData = data.cityPercent
                    // let arr = Object.keys(data.cityPercent).map((key) => { return { value: parseInt(key), label:data[key]}})
                    this.table.data = newData
                    this.pagination.total = data.data.length
                })
            },
            setMapEcharts (element,title,data) {
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                // 中国地图
                myChart.setOption({
                    title : {
                        text: title,
                        // subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left',
                    //     data:['创维','酷开']
                    // },
                    visualMap: {
                        min: 0,
                        max: 2000000,
                        left: 'left',
                        top: 'bottom',
                        text:['高','低'],           // 文本，默认为数值文本
                        calculable : true
                    },
                    // toolbox: {
                    //     show: true,
                    //     orient : 'vertical',
                    //     left: 'right',
                    //     top: 'center',
                    //     feature : {
                    //         mark : {show: true},
                    //         dataView : {show: true, readOnly: false},
                    //         restore : {show: true},
                    //         saveAsImage : {show: true}
                    //     }
                    // },
                    series : [
                        {
                            name: '省份分布',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:data
                        },
                    ]
                });
            },
            // 按业务下钻
            businessClick (type) {
                this.dialogVisible = true
                if(type === 1) {
                    this.dialogVisibleType = false
                    this.businessTitle = '各业务的人群调用总量'
                    this.$service.get_crowd_bi_pv_total({startDate:this.time1[0],endDate:this.time1[1]}).then((data) => {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name:key.name, data:key.data, type: 'line'}
                        })
                        this.setLinesEchart('business','',data.date,linesData,legendData)
                    })
                }else if(type === 2){
                    this.dialogVisibleType = false
                    this.businessTitle = '各业务的人群命中总量'
                    this.$service.get_crowd_bi_uv_total({startDate:this.time3[0],endDate:this.time3[1]}).then((data) => {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name:key.name, data:key.data, type: 'line'}
                        })
                        this.setLinesEchart('business','',data.date,linesData,legendData)
                    })
                }else if(type === 3){
                    this.dialogVisibleType = false
                    this.businessTitle = '各业务的人群下发总量'
                    this.$service.get_crowd_send_bi_total({startDate:this.time4[0],endDate:this.time4[1]}).then((data) => {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name:key.name, data:key.data, type: 'line'}
                        })
                        this.setLinesEchart('business','',data.date,linesData,legendData)
                    })
                }else if(type === 4){
                    this.dialogVisibleType = true
                    this.handleLinesBusiness(this.businessType)
                }
            },
            handleLinesBusiness(type) {
                if(type === '1') {
                    this.businessTitle = '各业务的人群曝光总量'
                    this.$service.get_crowd_click_bi_total({startDate:this.time5[0],endDate:this.time5[1],type: 1}).then((data) => {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name:key.name, data:key.data, type: 'line'}
                        })
                        this.setLinesEchart('business','',data.date,linesData,legendData)
                    })
                }else {
                    this.businessTitle = '各业务的人群点击总量'
                    this.$service.get_crowd_click_bi_total({startDate:this.time5[0],endDate:this.time5[1],type: 2}).then((data) => {
                        const legendData = data.series.map((key) => {
                            return key.name
                        })
                        const linesData = data.series.map((key) => {
                            return {name:key.name, data:key.data, type: 'line'}
                        })
                        this.setLinesEchart('business','',data.date,linesData,legendData)
                    })
                }
            },
            formatDate (d) {
                const time = new Date(d)
                let y = time.getFullYear(); // 年份
                let m = (time.getMonth() + 1).toString().padStart(2,'0'); // 月份
                let r = time.getDate().toString().padStart(2,'0'); // 日子
                return `${y}-${m}-${r}`
            }
        },
        mounted () {
            this.getCrowdData()
            this.getCrowdtotal(this.startDate,this.endDate)
            this.getForcastotal(this.startDate,this.endDate)
            this.getCrowdUvtotal(this.startDate,this.endDate)
            this.getCrowdSendtotal(this.startDate,this.endDate)
            this.getCrowdClicktotal(this.startDate,this.endDate)
            this.getCrowdSextotal(this.startDate,this.endDate)
            this.getCrowdAgetotal(this.startDate,this.endDate)
            this.getCrowdDevicetotal(this.startDate,this.endDate)
            this.getCrowdProvincetotal(this.startDate,this.endDate)
            this.getAllCrowdTotal(this.startDate,this.endDate)
        },
        created() {
            // 设置默认时间为昨天的前一周
            const start = new Date()
            const end = new Date()
            this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
            this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
            this.time0 = [this.startDate,this.endDate]
            this.time1 = [this.startDate,this.endDate]
            this.time2 = [this.startDate,this.endDate]
            this.time3 = [this.startDate,this.endDate]
            this.time4 = [this.startDate,this.endDate]
            this.time5 = [this.startDate,this.endDate]
            this.time6 = [this.startDate,this.endDate]
        }
    }
</script>

<style lang="stylus" scoped>
    .launch-statistics
        overflow hidden
    .title
        width 100%
        line-height 40px
        background #eeeeee
        color red
        font-size 20px
        padding-left 20px
    .crowd-statistic
        &:before
        &:after
            display table
            content ""
        &:after
            clear: both
        margin 30px 0
        .crowd-statistic-item
            width 25%
            float: left
            margin 20px 0
            text-align center
            .crowd-statistic-item--number
                color red
    .crowd-all-item-container
        margin-top 70px
    .crowd-all-item
        float left
        width 33%
        text-align center
        margin 30px 0
        .crowd-all-item--number
            color blue
    .echarts-container
        position relative
        width 50%
        height auto
        float left
    .main
        width 100%
        height 300px
        padding 30px
    .date-picker
        text-align center
    .circle-echarts
        float left
        width 33%
        height 200px
        margin-bottom 20px
    .border-right
        border-right 1px dashed #000
    .border-bottom
        border-bottom 1px dashed #000
    .click-date-picker
        text-align center
        margin 20px 0
    .left-map-container
        width 50%
        float left
        height 400px
    .map-echarts
        width 100%
        height 300px
        /*padding 30px*/
    .table-title
        font-size 18px
        margin 0 0 20px 0
    .table-over
        margin-left 40px
        width 40%
        float left
    .table-overflow
        height 360px
        overflow auto
    .city-active-proportion
        margin 20px 0 0 20px
    .city-active-proportion--title
        font-size 18px
    .city-active-proportion--name
         width 50%
         float left
         margin 10px 0
    .business-text
        text-decoration underline
        color #0077aa
        position absolute
        z-index 9
        top 80px
        right 80px
        cursor pointer
</style>
