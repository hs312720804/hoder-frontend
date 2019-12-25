<template>
    <div>
        <ContentWrapper
                :filter="filter"
                :pagination="pagination"
                @filter-change="handleFilterChange"
        >
            <div class="header-title">
                该人群主页投放相关的DMP记录
            </div>
            <Table
                    :props="table.props"
                    :header="table.header"
                    :data="table.data"
            >
            </Table>
        </ContentWrapper>
        <el-dialog :visible.sync="showFunnel" title="该推荐位人群投后全链路的漏斗数据">
            <div style="float: right"><el-button type="primary" @click="handleExport">导出数据</el-button></div>
            <div ref="funnel" class="funnel-echarts"></div>
            <div class="funnel-item">
                <div class="item-title">1</div>
                <div class="item-buf">2</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { ContentWrapper, Table, utils} from 'admin-toolkit'
    export default {
        name: "HomepageReleaseRecord",
        components: {
            ContentWrapper,
            Table
        },
        data () {
            return {
                filter: {},
                pagination: {},
                table: {
                    props: {},
                    header: [
                        {
                            label: 'ID',
                            prop: 'id'
                        },
                        {
                            label: '开始时间',
                            prop: 'startTime'
                        },
                        {
                            label: '结束时间',
                            prop: 'endTime'
                        },
                        {
                            label: '版块Id',
                            prop: 'sectionId'
                        },
                        {
                            label: '版块名称',
                            prop: 'sectionName'
                        },
                        {
                            label: '推荐位位置',
                            prop: 'recommendedPosition'
                        },
                        {
                            label: '推荐位名称',
                            prop: 'recommendedName'
                        },
                        {
                            label: '操作',
                            render: utils.component.createOperationRender(this, {
                                handleSeeFunnel: "查看数据漏斗"
                            })
                        }
                    ],
                    data: []
                },
                showFunnel: false,
                funnelTransform: {
                    totalPopulation: '圈定人群总量',
                    homepageActivity: '主页活跃量',
                    homepageExposure: '主页曝光',
                    homepageClick: '主页点击',
                    homepageCtr: '主页ctr',
                    orderNumber: '成交单量',
                    orderTotal: '成交总金额'
                }
            }
        },
        methods: {
            // 漏斗图
            setFunnelEcharts(element,title,legend,data){
                const echarts = require('echarts')
                const myChart = echarts.init(this.$refs[element])
                myChart.setOption({
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        data: legend
                    },
                    calculable: true,
                    series: [
                        {
                            name:'漏斗图',
                            type:'funnel',
                            left: '10%',
                            top: 60,
                            //x2: 80,
                            bottom: 60,
                            width: '80%',
                            // height: {totalHeight} - y - y2,
                            min: 0,
                            max: 100,
                            minSize: '0%',
                            maxSize: '100%',
                            sort: 'descending',
                            gap: 2,
                            label: {
                                show: true,
                                position: 'inside'
                            },
                            labelLine: {
                                length: 10,
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'
                                }
                            },
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                            emphasis: {
                                label: {
                                    fontSize: 20
                                }
                            },
                            data: data
                        }
                    ]
                })
            },
            parseFilter () {
                const {filter, pagination} = this
                filter.bid = 2
                filter.crowdId = 12
                if(pagination) {
                    filter.pageNum = pagination.currentPage || 1
                    filter.pageSize = pagination.pageSize || 10
                }
                return filter
            },
            fetchData () {
                const filter = this.parseFilter()
                this.$service.getHomepageReleaseRecordList(filter).then((data) => {
                    console.log(data)
                    this.table.data = data.list
                    this.pagination.total = data.total
                })
            },
            handleFilterChange () {
                this.fetchData()
            },
            handleEdit ({row}) {
                this.$emit('open-add-page', row.id, 'edit')
            },
            handleSeeFunnel ({row}) {
                const bdiId = row.id
                this.showFunnel = true
                this.$service.getHomepageReleaseRecordFunnel({bdiId}).then((data) => {
                    if(data == null) {
                        this.$refs['funnel'].innerHTML = '暂无数据'
                    } else {
                        const dataArr = []
                        const legendArr = []
                        const obj = Object.keys(this.funnelTransform)
                        obj.forEach((item) => {
                            dataArr.push({name: this.funnelTransform[item], value: data[item]})
                            legendArr.push(this.funnelTransform[item])
                        })
                        this.setFunnelEcharts('funnel','',legendArr,dataArr)
                    }
                })
            },
            handleExport () {

            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.header-title
    text-align center
    margin-bottom 20px
    color red
.funnel-echarts
    width 50%
    height 300px
    margin auto
.funnel-item
    display flex
    text-align center
.item-title
    width 30%
.item-buf
    width 70%
    background #9a6e3a
</style>
