<template>
    <div class="launch-statistics">
        <div class="statistics-header">
            <div class="date-picker">
                <el-date-picker
                        v-model="time0"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                >
                </el-date-picker>
            </div>
            <div>
                <el-button type="primary" @click="handleOneTouchDrop">创建人群</el-button>
                <el-button type="warning" @click="handleOpenLaunchList">投放列表</el-button>
            </div>
        </div>
        <div>
            <div class="crowd-statistic">
                <div class="echarts-container border-right" style="width: 49%">
                    <div class="title">人群使用情况</div>
                    <div class="crowd-all-item-container">
                        <div class="crowd-all-item" v-for="(item,index) in crowdAllData" :key="index">
                            <div class="crowd-all-item--number">{{item.count}}</div>
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <div class="echarts-container" style="width: 50%">
                    <div class="title">人群应用场景分布</div>
                    <div class="echarts-container" style="width: 50%">
                        <ve-wordcloud :data="chartData" :settings="chartSettings" style="height: 300px;margin: -30px 0 0 -20px"></ve-wordcloud>
                    </div>
                    <div class="echarts-container" style="width: 50%">
                        <div class="main" ref="useScene"></div>
                    </div>
                </div>
            </div>
            <div class="crowd-statistic">
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
            </div>
            <div class="crowd-statistic">
                <div class="echarts-container border-right" style="width: 49%">
                    <div class="title">业务投放情况</div>
                    <div class="launch-all-item-container border-bottom">
                        <div class="launch-all-item" v-for="(item,index) in launchData" :key="index">
                            <div class="launch-all-item--number">{{item.count}}</div>
                            <div>{{item.name}}</div>
                        </div>
                    </div>
                    <div class="two-mixed">
                        <div class="mixed-item">
                            <div class="title">业务人群使用情况</div>
                            <div class="business-use-text">
                                <div class="number">{{businessUseCrowdData.count}}</div>
                                <div class="name">{{businessUseCrowdData.name}}</div>
                            </div>
                        </div>
                        <div class="mixed-item">
                            <div class="title" style="text-align: center">人群对应业务分布情况</div>
                            <div class="main" ref="businessUseCrowd"></div>
                        </div>
                    </div>
                </div>
                <div class="echarts-container">
                    <div class="title">业务使用全流程趋势图（总调用、下发、曝光、点击）</div>
                    <div class="main" ref="businessUseTendency" style="height: 300px"></div>
                </div>
            </div>
        </div>
        <div>
            <div class="title" style="margin-top: 10px">曝光用户分布及行为特征</div>
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
                <!--<div class="table-over">-->
                    <!--<div class="table-title">城市活跃排名</div>-->
                    <!--<Table-->
                            <!--:props="table.props"-->
                            <!--:header="table.header"-->
                            <!--:data="table.data"-->
                            <!--class="table-overflow"-->
                    <!--&gt;-->
                    <!--</Table>-->
                <!--</div>-->
                <div class="table-over">
                    <div class="title">活跃时段分布</div>
                    <div class="main" ref="activeTimeDistrict" style="height: 300px"></div>
                </div>
            </div>
        </div>
        <div class="crowd-statistic">
            <div class="echarts-container border-right" style="width: 60%;height: 400px">
                <div class="title">用户分布情况</div>
                <div class="member-select">
                    <div class="member-select--text">按会员权益</div>
                    <el-select v-model="memberListType">
                        <template v-for="(item,index) in memberList">
                            <el-option
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                            ></el-option>
                        </template>
                    </el-select>
                </div>
                <div class="main" ref="userDistribution" style="height: 320px"></div>
            </div>
            <div class="echarts-container" style="width: 39%">
                <div class="title">末次付费的会员产品包情况</div>
                <div class="member-select">
                    <div class="member-select--text">按会员权益</div>
                    <el-select v-model="memberListByPay">
                        <template v-for="(item,index) in memberList">
                            <el-option
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                            ></el-option>
                        </template>
                    </el-select>
                </div>
                <div class="main" ref="lastPayProduct"></div>
            </div>
        </div>
        <div class="crowd-statistic">
            <div ref="deviceActive" class="circle-echarts border-right"></div>
            <div class="circle-echarts border-right">
                <div class="active-rate">
                <div class="active-rate--title">起播活跃率</div>
                    <div>
                        <el-select v-model="dateData">
                            <template v-for="(item,index) in dateList">
                                <el-option
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                ></el-option>
                            </template>
                        </el-select>
                    </div>
                </div>
                <div ref="activeRate" style="width: 100%;height: 200px"></div>
            </div>
            <div ref="userWatchPreference" class="circle-echarts"></div>
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
    import veWordcloud from 'v-charts/lib/wordcloud'
    export default {
        name: "StatisticsHomePage",
        components: {
            ContentWrapper,
            Table,
            veWordcloud
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
                tagUseData: [],
                launchData: [],
                businessUseCrowdData: {},
                memberListType: '',
                memberListByPay: '',
                memberList: [],
                dateList: [],
                dateData: '',
                chartData: {
                    columns: ['word', 'count'],
                    rows: []
                },
                chartSettings: {
                    shape: 'star'
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        watch: {
            time0(val,oldVal) {
                // 防止第一次加载页面重复调用接口
                if(oldVal.length !== 0) {
                    if(this.setDataInMonth(val[0],val[1])){
                        this.getCrowdSextotal(this.time0[0],this.time0[1])
                        this.getCrowdAgetotal(this.time0[0],this.time0[1])
                        this.getCrowdDevicetotal(this.time0[0],this.time0[1])
                        this.getCrowdProvincetotal(this.time0[0],this.time0[1])
                        this.getAllCrowdTotal(this.time0[0],this.time0[1])
                        this.setUseSceneCircle(this.time0[0],this.time0[1])
                        this.getAllTagTotal(this.time0[0],this.time0[1])
                        this.getTagUseTotal(this.time0[0],this.time0[1])
                        this.getAllTagRadar(this.time0[0],this.time0[1])
                        this.getLaunchTotal(this.time0[0],this.time0[1])
                        this.getBusinessUseCrowdTotal(this.time0[0],this.time0[1])
                        this.getBusinessToCrowdTotal(this.time0[0],this.time0[1])
                        this.getBusinessUseTendency(this.time0[0],this.time0[1])
                        this.getActiveTimeDistriction(this.time0[0],this.time0[1])
                        this.getBroadcastRate(this.time0[0],this.time0[1])
                        this.getUserWatchPreference(this.time0[0],this.time0[1])
                        this.getUserDistribution(this.time0[0],this.time0[1])
                        this.getLastPayProduct(this.time0[0],this.time0[1])
                        this.getServiceActive(this.time0[0],this.time0[1])
                    }else{
                        this.$message('日期间隔最多只能是30天！请重新选择日期')
                        this.time0 = oldVal
                    }
                }
            },
            'memberListType': function () {
                this.getUserDistribution(this.time0[0],this.time0[1])
            },
            'memberListByPay': function () {
                this.getLastPayProduct(this.time0[0],this.time0[1])
            },
            'dateData': function () {
                this.getBroadcastRate(this.time0[0],this.time0[1])
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
            // 通用嵌套环形图
            setCircleDoubleEcharts(element,title,legend,dataTotal,dataChild){
                let echarts = require('echarts')
                let myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'item',
                        // formatter: "{a} <br/>{b}: {c} ({d}%)"
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        data: legend,
                        type: 'scroll'
                    },
                    series: [
                        {
                            // name:'',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    // position: 'center'
                                    position: 'inner'
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
                            data: dataTotal
                        },
                        {
                            // name: '',
                            type: 'pie',
                            radius: ['40%','55%'],
                            label: {
                                normal: {
                                    show: false,
                                    formatter: '  {b|{b}：}{c}  {per|{d}%}  ',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    // shadowBlur:3,
                                    // shadowOffsetX: 2,
                                    // shadowOffsetY: 2,
                                    // shadowColor: '#999',
                                    // padding: [0, 7],
                                    rich: {
                                        // a: {
                                        //     color: '#999',
                                        //     lineHeight: 22,
                                        //     align: 'center'
                                        // },
                                        // abg: {
                                        //     backgroundColor: '#333',
                                        //     width: '100%',
                                        //     align: 'right',
                                        //     height: 22,
                                        //     borderRadius: [4, 4, 0, 0]
                                        // },
                                        // hr: {
                                        //     borderColor: '#aaa',
                                        //     width: '100%',
                                        //     borderWidth: 0.5,
                                        //     height: 0
                                        // },
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data: dataChild
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
            // 通用柱状图参数设置
            setBarEchart (element,title,xData,yData) {
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
                        // data: yData.length === 0 ? this.fillEmptyData.data : yData,
                        data: yData,
                        type: 'bar',
                        barWidth : 30
                    }]
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
                        max: 5000000,
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
                    let chartRowsData = []
                    data.data.forEach((item,index) => {
                        chartRowsData.push({'word': data.names[index], 'count': item.count})
                    })
                    this.chartData.rows = chartRowsData
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
            //  业务投放情况
            getLaunchTotal (beginTime,endTime) {
                this.$service.getLaunchEcharts({beginTime,endTime}).then((data)=>{
                    this.launchData = data
                })
            },
            //  业务人群使用情况
            getBusinessUseCrowdTotal (beginTime,endTime) {
                this.$service.getCrowdBusinessUseEcharts({beginTime,endTime}).then((data)=>{
                    this.businessUseCrowdData = data
                })
            },
            //  人群对应业务分布情况
            getBusinessToCrowdTotal (beginTime,endTime) {
                this.$service.getCrowdBusinessEcharts({beginTime,endTime}).then((data)=>{
                    const dataObject = data.data.map((key,index) => {
                        return {value: key.count, name: data.names[index]}
                    })
                    this.setCircleEcharts('businessUseCrowd','',data.names,dataObject,'all')
                })
            },
            //  业务使用全流程趋势图
            getBusinessUseTendency (beginTime,endTime) {
                this.$service.getBusinessUseTendencyEcharts({beginTime,endTime}).then((data)=>{
                    const legendData = data.series.map((key) => {
                        return key.name
                    })
                    const linesData = data.series.map((key) => {
                        return {name:key.name, data:key.value, type: 'line'}
                    })
                    this.setLinesEchart('businessUseTendency','',data.xaxis,linesData,legendData)
                })
            },
            // 用户活跃时间段
            getActiveTimeDistriction(beginTime,endTime) {
                this.$service.getActiveTimeEcharts({beginTime,endTime}).then(data => {
                    this.setBarEchart('activeTimeDistrict','',data.xaxis,data.series)
                })
            },
            // 用户分布情况
            getUserDistribution(beginTime,endTime) {
                this.$service.getUseDistributionEcharts({beginTime,endTime,category: this.memberListType}).then(data => {
                    let dataTotal = [],childData = []
                    data.series[0].forEach(item => {
                        childData.push({value: item.count, name: item.name})
                    })
                    data.series[1].forEach(item => {
                        dataTotal.push({value: item.count, name: item.name})
                    })
                    this.setCircleDoubleEcharts('userDistribution','',data.legend,dataTotal,childData)
                })
            },
            // 末次付费的会员产品包
            getLastPayProduct (beginTime,endTime) {
                this.$service.getLastPaidProductEcharts({beginTime,endTime,category: this.memberListByPay}).then(data => {
                    const dataObject = []
                    data.data.forEach(item => {
                        dataObject.push({name: item.name, value: item.count})
                    })
                    this.setCircleEcharts('lastPayProduct','',data.names,dataObject)
                })
            },
            // 对象转成数组
            objectToArray (obj) {
                let arr = []
                for (let i in obj) {
                    arr.push({ value: i, label: obj[i] })
                }
                return arr
            },
            // 获取会员权益
            getMemberBenefits() {
                this.$service.getUserVipRightsList().then(data => {
                    const memberListData = data
                    this.memberList = memberListData
                    // 设置两个默认的下拉框选值
                    this.memberListType = memberListData[0].value
                    this.memberListByPay = memberListData[0].value
                })
            },
            // 设备活跃情况
            getServiceActive(beginTime,endTime) {
                this.$service.getActiveDeviceEcharts({beginTime,endTime}).then(data => {
                    this.setBarEchart('deviceActive','设备活跃情况',data.xaxis,data.series)
                })
            },
            // 起播活跃率情况
            getBroadcastRate(beginTime,endTime) {
                this.$service.getBroadcastRateEcharts({beginTime,endTime,category: this.dateData}).then(data => {
                    const dataObject = []
                    data.data.forEach(item => {
                        dataObject.push({name: item.name, value: item.count})
                    })
                    this.setCircleEcharts('activeRate','',data.names,dataObject)
                })
            },
            // 用户观影偏好分布
            getUserWatchPreference(beginTime,endTime) {
                this.$service.getUserWatchPreferenceDistributionEcharts({beginTime,endTime}).then(data => {
                    const dataObject = []
                    data.data.forEach(item => {
                        dataObject.push({name: item.name, value: item.count})
                    })
                    this.setCircleEcharts('userWatchPreference','用户观影偏好分布',data.names,dataObject)
                })
            },
            getInitDate() {
                this.$service.getinitDateEcharts().then((data) => {
                    this.dateList = data
                    this.dateData = data[0].value
                })
            },
            handleOneTouchDrop () {
                this.$router.push({
                    path: 'oneTouchDrop'
                })
            },
            handleOpenLaunchList () {
                this.$router.push({
                    path: 'launch/launchTabList'
                })
            }
        },
        mounted () {
            this.getCrowdSextotal(this.startDate,this.endDate)
            this.getCrowdAgetotal(this.startDate,this.endDate)
            this.getCrowdDevicetotal(this.startDate,this.endDate)
            this.getCrowdProvincetotal(this.startDate,this.endDate)
            this.getAllCrowdTotal(this.startDate,this.endDate)
            this.setUseSceneCircle(this.startDate,this.endDate)
            this.getAllTagTotal(this.startDate,this.endDate)
            this.getTagUseTotal(this.startDate,this.endDate)
            this.getAllTagRadar(this.startDate,this.endDate)
            this.getLaunchTotal(this.startDate,this.endDate)
            this.getBusinessUseCrowdTotal(this.startDate,this.endDate)
            this.getBusinessToCrowdTotal(this.startDate,this.endDate)
            this.getBusinessUseTendency(this.startDate,this.endDate)
            this.getActiveTimeDistriction(this.startDate,this.endDate)
            this.getBroadcastRate(this.startDate,this.endDate)
            this.getUserWatchPreference(this.startDate,this.endDate)
            this.getServiceActive(this.time0[0],this.time0[1])
        },
        created() {
            // 设置默认时间为今天的前一周
            const start = new Date()
            const end = new Date()
            this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 8))
            // this.endDate = this.formatDate(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1))
            this.endDate = this.formatDate(end.setTime(end.getTime()))
            this.time0 = [this.startDate,this.endDate]
            this.getMemberBenefits()
            this.getInitDate()
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
        padding 10px 0
        border-bottom 1px dashed #ccc
        &:before
        &:after
            display table
            content ""
        &:after
            clear: both
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
    .launch-all-item-container
        display flex
        align-items center
        justify-content center
        height 150px
        margin 0 10px
    .launch-all-item
        width 25%
        text-align center
        margin 30px 0
        font-size 12px
        color #aaa
        &:first-child
            width 50%
        .launch-all-item--number
            color #000
            font-weight bold
            font-size 16px
            margin-bottom 10px
    .echarts-container
        position relative
        width 50%
        height auto
        float left
        &:before
        &:after
            display table
            content ""
        &:after
            clear: both
    .main
        width 90%
        height 240px
        padding 30px
    /*.date-picker*/
        /*text-align center*/
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
        /*margin 10px 0*/
    .business-text
        text-decoration underline
        color #0077aa
        position absolute
        z-index 9
        top 80px
        right 80px
        cursor pointer
    .two-mixed
        margin-top 10px
        display flex
        .mixed-item
            &:first-child
                width 34%
            width 66%
    .business-use-text
        width 100px
        text-align center
        margin 100px 75px
    .number
        color #000
        font-weight bold
        font-size 16px
        margin-bottom 10px
    .name
        font-size 12px
        color #aaa
    .member-select
        display flex
        align-items center
        justify-content center
        .member-select--text
            margin-right 20px
    .active-rate
        display flex
        align-items center
        margin-left 20px
    .active-rate--title
        margin-right 20px
    .statistics-header
        display flex
        justify-content space-between
        padding-bottom 20px
        border-bottom 1px dashed #ccc
</style>
