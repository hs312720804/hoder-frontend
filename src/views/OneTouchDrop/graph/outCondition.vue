<!--出口规则配置-->
<template>
    <div class="outCondition-wrap">
        <el-dialog
            title="方案出口规则配置"
            :visible.sync="show.is"
            width="65%"
        >
            <p class="title">规则设置</p>
            <template v-for="(crowd, i) in inputValue">
                <multiple-select :specialTags="specialTags" :dynamicPolicyJson="crowd.dynamicPolicyJson" :crowd="crowd" :i="i"></multiple-select>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show.is = false">取 消</el-button>
                <el-button type="primary" @click="saveEntryData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import multipleSelect from '@/components/MultipleSelect'
export default {
    name: "outCondition",
    props: {
        show: {
            type: Object,
            default () {
                return {
                    is: false
                }
            }
        },
        recordId: {
            type: [Number, String],
            default: 1
        },
        policyId: {
            type: [String, Number]
        },
        outputData: {
            type: [Array, Object, String]
        }
    },
    data () {
        return {
            specialTags: [],
            inputValue: []
        }
    },
    methods: {
        saveEntryData () {
            this.$emit('saveOutputCondition', this.inputValue)
        },
        getRecordId () {
            return this.recordId;
        },
        setInputValue (val) {
            if (val !== this.inputValue) {
                if (val.length > 0) {
                    this.inputValue = val
                    this.setSeq()
                }else {
                    if (this.inputValue.length > 0) {
                        return
                    }
                    this.inputValue.push(
                            {
                                'recordId': this.getRecordId(),
                                'tempCrowdId': undefined,
                                'crowdName': undefined,
                                'tagIds': [],
                                'purpose': undefined,
                                'remark': undefined,
                                'crowdOrder': length + 1,
                                'rulesJson': {
                                    condition: 'OR',
                                    rules: []
                                },
                                'dynamicPolicyJson': {
                                    link: 'AND',
                                    condition: 'AND',
                                    rules: []
                                },
                                'limitLaunch': false,
                                'limitLaunchCount': undefined,
                                total0: undefined
                            }
                    )
                    this.setSeq()
                }
            }
        },
        setSeq () {
            let inputValue = JSON.parse(JSON.stringify(this.inputValue))
            this.inputValue = inputValue.map((e, index) => {
                e.crowdOrder = index + 1
                return e
            })
        }
    },
    watch: {
        show: {
            handler (val) {
                if (val.is) {
                    // 新增
                    if (!this.policyId) {
                        this.$service.tagInfoNew(this.recordId).then(data => {
                            this.specialTags = data.filter(item => {
                                return item.dataSource === 6
                            })
                            this.setInputValue(this.outputData)
                        })
                    } else {
                        // 编辑
                        this.$service.getTagsByPoliceId({policyId: this.policyId}).then(data => {
                            this.specialTags = data.filter(item => {
                                return item.dataSource === 6
                            })
                            console.log(this.outputData);
                            this.setInputValue(this.outputData)
                        })
                    }
                }
            },
            deep: true
        },
        outputData: 'setInputValue'
    },
    components: {
        multipleSelect
    }
}
</script>

<style lang="stylus" scoped>
    .outCondition-wrap
        .title
            margin-bottom 20px;
</style>
