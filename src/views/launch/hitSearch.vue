<template>
    <div>
        <div class="title">查询指定MAC的命中情况</div>
        <el-form :model="form" ref="form" :rules="rules" :inline="true">
            <el-form-item label="人群id：" prop="crowdId">
                <el-input v-model="form.crowdId" clearable></el-input>
            </el-form-item>
               <!-- <el-form-item label="设备信息：" prop="mac"> -->
            <el-form-item label="MAC地址" prop="mac">
                <el-input v-model="form.mac" clearable></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="date">
                <!-- <el-select v-model="form.date">
                    <el-option
                            v-for="(item,index) in dateList"
                            :label="item"
                            :key="index"
                            :value="item.replace(/-/g,'.')"
                    ></el-option>
                </el-select> -->
                <el-date-picker
                  v-model="form.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  clearable
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <div>
            <!-- <div>
                <div>人群：</div>
                <div class="result" v-if="crowdForm.crowd">
                    <div class="result-item">
                        {{crowdForm.crowd}}
                    </div>
                </div>
                <div v-else class="no-result">暂无数据</div>
            </div>
            <div>
                <div>该设备对应的人群条件是：</div>
                <div class="result" v-if="crowdForm.condition.length > 0">
                    <div v-for="(item,index) in crowdForm.condition" :key="index" class="result-item">
                        <div>{{item.date}}</div>
                        <div>{{item.thisMacTagValues}}</div>
                    </div>
                </div>
                <div v-else class="no-result">暂无数据</div>
            </div> -->
            <div v-if="list.length > 0">
                <div>
                    命中情况：
                    总条数： {{this.pagination.total}}
                </div>
                <div class="result">
                    <div v-for="(item,index) in list" :key="index" class="result-item">
                        <div>
                            <span style="display: inline-block; width: 150px;">{{ item.mac }}</span>
                            <span>命中时间：{{ item.hitDate }}</span>
                        </div>
                        <!-- <div>{{item.reason}}</div> -->
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
            <div v-else>{{ noneText }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CrowdValidateAA",
        data () {
            return {
                form: {
                    mac: '',
                    crowdId: '',
                    date: ''
                },
                pagination: {
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                crowdForm: {
                    crowd: '',
                    condition: [],
                    match: []
                },
                dateList: [],
                rules: {
                    // mac: {required: true, message: '请输入mac', trigger: 'blur'},
                    crowdId: {required: true, message: '请输入人群id', trigger: 'blur'}
                },
                pickerOptions: {
                    disabledDate:(time)=> {
                        const day1 =  30 * 24 * 3600 * 1000
                        // let maxTime = Date.now() - 1 * 24 * 3600 * 1000
                        let maxTime = Date.now()
                        let minTime = Date.now() - day1
                        return time.getTime() > maxTime || time.getTime() < minTime
                    }
                },
                list: [],
                noneText: ''
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
                this.$refs.form.validate(valid => {
                    if(valid) {
                      const filter = this.getFilter()
                      // this.$service.launchHelpCrowdIndex(filter).then(data => {
                      this.$service.newLaunchHelpCrowdIndex(filter).then(data => {
                        this.pagination.total = data.pageInfo.total
                        // this.crowdForm.crowd = data.fx || '暂无数据'
                        // this.crowdForm.condition = data.historyCondition || []
                        // this.crowdForm.match = data.historyResMatch || []
                        this.list = data.pageInfo.list || '暂无数据'
                        if (this.list === undefined || this.list.length === 0) {
                          this.noneText = '无命中记录'
                        }
                      })
                    }
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
            // this.setDateData()
        }
    }
</script>

<style lang="stylus" scoped>
.result
    border 1px dashed #333
    padding 0 20px
    margin 20px
    overflow auto
    .result-item
        margin 20px 0
.red--text
    color red
.title
    margin-bottom 20px
.no-result
    margin 20px
</style>
