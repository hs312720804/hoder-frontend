<template>
    <div class="launch-statistics">
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
        <div>
            <div class="crowd-statistic">
                <div class="echarts-container border-bottom border-right" style="width: 60%">
                    <div class="title">人群使用情况</div>
                    <div class="crowd-all-item-container">
                        <div class="crowd-all-item" v-for="(item,index) in crowdAllData" :key="index">
                            <div class="crowd-all-item--number">{{item.count}}</div>
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="echarts-container border-bottom" style="width: 39%">
                    <div class="title">人群应用场景分布</div>
                    <div class="main" ref="useScene"></div>
                </div>
                <div class="echarts-container border-right" style="width: 49%;">
                    <div class="title">标签覆盖情况</div>
                    <div class="tag-all-item-container">
                        <div class="tag-all-item" v-for="(item,index) in tagAllData" :key="index">
                            <div class="tag-all-item--number">{{item.count}}</div>
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                    <div class="title">标签使用情况</div>
                    <div class="tag-all-item-container">
                        <div class="tag-all-item" v-for="(item,index) in tagUseData" :key="index">
                            <div class="tag-all-item--number">{{item.value}}</div>
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="echarts-container">
                    <div class="title">标签场景覆盖情况</div>
                    <div class="main" ref="tagRadar"></div>
                </div>
                <div class="echarts-container">
                    <!--<div class="title">人群应用场景分布</div>-->
                    <div class="main" ref="crowdForcas"></div>
                </div>
                <div class="echarts-container">
                    <div class="business-text" @click="businessClick(1)">按业务下钻-></div>
                    <div class="main" ref="peopleStatistic"></div>
                </div>
                <div class="echarts-container">
                    <div class="business-text" @click="businessClick(2)">按业务下钻-></div>
                    <div class="main" ref="crowdUv"></div>
                </div>
                <div class="echarts-container">
                    <div class="business-text" @click="businessClick(3)">按业务下钻-></div>
                    <div class="main" ref="crowdSend"></div>
                </div>
                <div class="echarts-container">
                    <div class="business-text" @click="businessClick(4)">按业务下钻-></div>
                    <div class="main" ref="crowdClick"></div>
                </div>
            </div>
        </div>
        <div>
            <div class="title">曝光用户分布及行为特征</div>
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
                crowdAllData: [],
                // 默认时间
                startDate: '',
                endDate: '',
                time0: [],
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
                },
                tagAllData: [],
                tagUseData: []
            }
        },
        watch: {
            time0(val,oldVal) {
                // 防止第一次加载页面重复调用接口
                if(oldVal.length !== 0) {
                    if(this.setDataInMonth(val[0],val[1])){
                        this.getAllCrowdTotal(val[0],val[1])
                        this.getCrowdtotal(val[0], val[1])
                        this.getForcastotal(val[0], val[1])
                        this.getCrowdUvtotal(val[0], val[1])
                        this.getCrowdSendtotal(val[0], val[1])
                        this.getCrowdClicktotal(val[0], val[1])
                        this.getCrowdSextotal(val[0], val[1])
                        this.getCrowdAgetotal(val[0], val[1])
                        this.getCrowdDevicetotal(val[0], val[1])
                        this.getCrowdProvincetotal(val[0], val[1])
                    }else{
                        this.$message('日期间隔最多只能是30天！请重新选择日期')
                        this.time0 = oldVal
                    }
                }
            },
            businessType(val) {
                this.handleLinesBusiness(val)
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
            setCircleEcharts(element,title,legend,data,circleType){
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
                            radius: circleType === 'all' ? '85%' : ['50%', '70%'],
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
            // 通用雷达图
            setRadarEcharts(element,title,legend,data,insideChildData){
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    tooltip: {
                        // trigger: 'item',
                        // formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: legend,
                        // padding:[0,0,150,0]
                    },
                    radar: {
                        shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        // indicator: [
                        //     { name: '销售（sales）', max: 6500},
                        //     { name: '管理（Administration）', max: 16000},
                        //     { name: '信息技术（Information Techology）', max: 30000},
                        //     { name: '客服（Customer Support）', max: 38000},
                        //     { name: '研发（Development）', max: 52000},
                        //     { name: '市场（Marketing）', max: 25000}
                        // ],
                        indicator: insideChildData
                    },
                    series: [
                        {
                            name:'',
                            type:'radar',
                            data: data,
                            // radius: '80%'
                            // data : [
                            //     {
                            //         value : [4300, 10000, 28000, 35000, 50000, 19000],
                            //         name : '预算分配（Allocated Budget）'
                            //     },
                            //     {
                            //         value : [5000, 14000, 28000, 31000, 42000, 21000],
                            //         name : '实际开销（Actual Spending）'
                            //     }
                            // ]
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
                    const newData = data.topCity.date.map((key,index) => {
                        return {value: key.count, name: key.name,seq: index+1,percent:key.percent}
                    })
                    const newProvinceData = data.province.date.map((key) => {
                        // return {value: parseFloat(key.percent.replace("%","")), name: key.name}
                        return {value: key.count, name: key.name}
                    })
                    console.log(newProvinceData)
                    this.setMapEcharts('main','省份分布',newProvinceData)
                    this.cityData = data.cityPercent
                    // let arr = Object.keys(data.cityPercent).map((key) => { return { value: parseInt(key), label:data[key]}})
                    this.table.data = newData
                    this.pagination.total = data.topCity.date.length
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
                        trigger: 'item',
                        formatter: '{b}<br/>{c}'
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
                    this.$service.get_crowd_bi_pv_total({startDate:this.time0[0],endDate:this.time0[1]}).then((data) => {
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
                    this.$service.get_crowd_bi_uv_total({startDate:this.time0[0],endDate:this.time0[1]}).then((data) => {
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
                    this.$service.get_crowd_send_bi_total({startDate:this.time0[0],endDate:this.time0[1]}).then((data) => {
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
                    this.$service.get_crowd_click_bi_total({startDate:this.time0[0],endDate:this.time0[1],type: 1}).then((data) => {
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
                    this.$service.get_crowd_click_bi_total({startDate:this.time0[0],endDate:this.time0[1],type: 2}).then((data) => {
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
            },
            setDataInMonth(startDate,endDate){
                const startTime = new Date(startDate).getTime()
                const endTime = new Date(endDate).getTime()
                const oneMonth = 3600*1000*24*30
                if(endTime - startTime > oneMonth) {return false}
                else{return true}
            },
            // 人群使用情况
            getAllCrowdTotal (startTime, endTime) {
                this.$service.getCrowdUseEcharts({beginTime:startTime,endTime:endTime}).then((data)=>{
                    this.crowdAllData = data
                })
            },
            // 人群应用场景分布
            setUseSceneCircle(beginTime,endTime) {
                this.$service.getCrowdUseSceneEcharts({beginTime,endTime}).then((data)=>{
                    const dataObject = data.data.map((key,index) => {
                        return {value: key.count, name: data.names[index]}
                    })
                    this.setCircleEcharts('useScene','',data.names,dataObject,'all')
                })
            },
            //  标签覆盖情况
            getAllTagTotal (beginTime,endTime) {
                this.$service.getTagAllEcharts({beginTime,endTime}).then((data)=>{
                    this.tagAllData = data
                })
            },
            //  标签覆盖情况雷达图
            getAllTagRadar (beginTime,endTime) {
                this.$service.getTagUseRadarEcharts({beginTime,endTime}).then((data)=>{
                    let names = []
                    data.data.forEach(item => {
                        names.push(item.name)
                    })
                    this.setRadarEcharts('tagRadar','',names,data.data,data.indicator)
                })
            },
            //  标签使用情况
            getTagUseTotal (beginTime,endTime) {
                this.$service.getTagUseEcharts({beginTime,endTime}).then((data)=>{
                    this.tagUseData = data
                })
            },
        },
        mounted () {
            // this.getCrowdtotal(this.startDate,this.endDate)
            // this.getForcastotal(this.startDate,this.endDate)
            // this.getCrowdUvtotal(this.startDate,this.endDate)
            // this.getCrowdSendtotal(this.startDate,this.endDate)
            // this.getCrowdClicktotal(this.startDate,this.endDate)
            this.getCrowdSextotal(this.startDate,this.endDate)
            this.getCrowdAgetotal(this.startDate,this.endDate)
            this.getCrowdDevicetotal(this.startDate,this.endDate)
            this.getCrowdProvincetotal(this.startDate,this.endDate)
            this.getAllCrowdTotal(this.startDate,this.endDate)
            this.setUseSceneCircle(this.startDate,this.endDate)
            this.getAllTagTotal(this.startDate,this.endDate)
            this.getTagUseTotal(this.startDate,this.endDate)
            this.getAllTagRadar(this.startDate,this.endDate)
        },
        created() {
            // 设置默认时间为昨天的前一周
            const start = new Date()
            const end = new Date()
            this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
            this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
            this.time0 = [this.startDate,this.endDate]
        }
    }
</script>

<style lang="stylus" scoped>
    .launch-statistics
        overflow hidden
    .title
        font-size 20px
        margin-left 20px
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
        display flex
        align-items center
        justify-content center
        height 300px
    .crowd-all-item
        width 20%
        text-align center
        margin 30px 0
        font-size 12px
        color #aaa
        &:first-child
            width 40%
            border-right 1px solid #eee
            .crowd-all-item--number
                font-size 30px
                margin-bottom 0
        .crowd-all-item--number
            color #000
            font-weight bold
            font-size 16px
            margin-bottom 10px
    .tag-all-item-container
        display flex
        align-items center
        justify-content center
        height 150px
    .tag-all-item
        width 25%
        text-align center
        margin 30px 0
        font-size 12px
        color #aaa
        &:first-child
            width 50%
            border-right 1px solid #eee
            .crowd-all-item--number
                margin-bottom 0
        .tag-all-item--number
            color #000
            font-weight bold
            font-size 16px
            margin-bottom 10px
    .echarts-container
        position relative
        width 50%
        height auto
        float left
    .main
        width 90%
        height 240px
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
