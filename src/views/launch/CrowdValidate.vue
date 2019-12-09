<template>
    <div>
        <div class="title">查询指定MAC的命中情况</div>
        <el-form :model="form" ref="form" :inline="true">
            <el-form-item label="设备信息：" prop="mac">
                <el-input v-model="form.mac"></el-input>
            </el-form-item>
            <el-form-item label="人群id：">
                <el-input v-model="form.crowdId"></el-input>
            </el-form-item>
            <el-form-item label="日期：">
                <el-select v-model="form.date">
                    <el-option
                            v-for="item in dateList"
                            :label="item"
                            :value="item.replace(/-/g,'.')"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <div>
            <div>
                <div>人群：</div>
                <div class="result">
                    <div class="result-item">{{crowdForm.crowd}}</div>
                </div>
            </div>
            <div>
                <div>该设备对应的人群条件是：</div>
                <div class="result">
                    <div v-for="(item,index) in crowdForm.condition" :key="index" class="result-item">
                        <div>{{item.date}}</div>
                        <div>{{item.thisMacTagValues}}</div>
                    </div>
                </div>
            </div>
            <div>
                <div>对比结果：</div>
                <div class="result red--text">
                    <div v-for="(item,index) in crowdForm.match" :key="index" class="result-item">
                        <div>{{item.date}}</div>
                        <div>{{item.reason}}</div>
                    </div>
                </div>
            </div>
            <el-pagination
                    layout="prev, pager, next"
                    :total="pagination.total"
                    :page-size="pagination.pageSize"
                    :current-page="pagination.pageNum"
                    @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CrowdValidate",
        data () {
            return {
                form: {
                    mac: '',
                    crowdId: '',
                    date: ''
                },
                pagination: {
                    pageSize: 3,
                    pageNum: 1,
                    total: 0
                },
                crowdForm: {
                    crowd: '',
                    condition: [],
                    match: []
                },
                dateList: []
            }
        },
        methods: {
            getFilter () {
                const filter = {
                    mac: this.form.mac,
                    crowdId: this.form.crowdId,
                    date: this.form.date,
                    pageSize: this.pagination.pageSize,
                    pageNum: this.pagination.pageNum
                }
                return filter
            },
            handleSearch () {
                const filter = this.getFilter()
                this.$service.launchHelpCrowdIndex(filter).then(data => {
                    this.pagination.total = data.total
                    this.crowdForm.crowd = data.fx || '暂无数据'
                    this.crowdForm.condition = data.historyCondition || []
                    this.crowdForm.match = data.historyResMatch || []
                })
            },
            handleCurrentChange(val) {
                this.pagination.pageNum = val
                this.handleSearch()
            },
            formatDate (d) {
                const time = new Date(d)
                let y = time.getFullYear(); // 年份
                let m = (time.getMonth() + 1).toString().padStart(2,'0'); // 月份
                let r = time.getDate().toString().padStart(2,'0'); // 日子
                return `${y}-${m}-${r}`
            },
            setDateData () {
                const a = []
                for (let i=0;i<5;i++) {
                    a.push(this.formatDate((new Date()).setTime((new Date()).getTime() - 3600 * 1000 * 24 * i)))
                }
                this.dateList = a
                this.form.date = a[1]
            }
        },
        created () {
            this.setDateData()
        }
    }
</script>

<style lang="stylus" scoped>
.result
    border 1px dashed #333
    padding 0 20px
    margin 20px
    .result-item
        margin 20px 0
.red--text
    color red
.title
    margin-bottom 20px
</style>
