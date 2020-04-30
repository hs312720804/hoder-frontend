<template>
    <div>
        <div>重定向新增</div>
        <div>{{$route.query}}</div>
        <div>
            <el-form :model="form" label-width="100px">
                <el-form-item label="人群名称" prop="crowdName">
                    <el-input v-model="form.crowdName"></el-input>
                </el-form-item>
                <el-form-item label="父人群" prop="pCrowdName">
                    <el-select v-model="form.pCrowdName">
                        <el-option value="a">a</el-option>
                        <el-option value="b">b</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置人群条件">
                    <el-input v-model="form.conditions"></el-input>
                </el-form-item>
                <el-form-item label="人群有效期" prop="validPeriod">
                    <el-date-picker
                            v-model="form.validPeriod"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            :picker-options="pickerOptions"
                            :default-time="['00:00:00', '23:59:59']"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button>返回</el-button>
                    <el-button>创建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Add",
        data () {
            return {
                form: {
                    crowdName: '',
                    pCrowdName: '',
                    conditions: undefined,
                    validPeriod: undefined
                },
                business: [],
                behavior: [],
                parentCrowd: [],
                pickerOptions: {
                    disabledDate(time) {
                        // 设置可选时间为今天之后的60天内
                        const curDate = (new Date()).getTime()
                        // 算出一个月的毫秒数，这里使用30的平均值，实际应根据具体的每个月有多少天计算
                        const day = 60 * 24 * 3600 * 1000
                        const dateRange = curDate + day
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000 || time.getTime() > dateRange
                    }
                }
            }
        },
        watch : {
            '$route.query.policyId': function (val) {
                if(val != undefined) {
                    this.fetchData()
                }
            }
        },
        methods : {
            fetchData () {
                const routeData = this.$route.query
                this.$service.getRedirectCrowdAdd(
                    {policyId: routeData.policyId, params: {crowdId: routeData.crowdId ? routeData.crowdId : undefined}})
                        .then(data => {
                            const [businessList,behaviorList,parentCrowdList] = [[],[],[]]
                            data.tags.forEach(item => {
                                if (item.tagName === "父人群中活跃用户在业务") {businessList.push({value: item.attrValue, label: item.tagName})}
                                else if(item.tagName === "父人群用户行为满足"){behaviorList.push({value: item.attrValue, label: item.tagName})}
                            })
                            this.business = businessList
                            this.behavior = behaviorList
                            if(data.crowds.length > 0) {
                                data.crowds.forEach(item => {
                                    parentCrowdList.push({value: item.crowdId, label: item.crowdName})
                                })
                            }
                            this.parentCrowd = parentCrowdList
                        })
            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style scoped>

</style>
