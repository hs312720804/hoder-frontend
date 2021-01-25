<template>
    <div>
        <div class="flex-content" v-if="!isEdit" @click="editPriority">
            <div>{{priority}}</div>
            <div class="text-over"></div>
        </div>
        <el-input v-else type="text" ref="inputPriority" size="small" @change="savePriority" @blur="editStatuChange" v-model="priority"></el-input>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                priority: '',
                // className: 'text-over',
                isEdit: false,
                dataBackup: ''
            }
        },
        props: ['data', 'crowdId', 'policyId'],
        watch: {
            data: 'onDataChange'
        },
        methods: {
            getPriority () {
                this.priority = this.data
                this.dataBackup = this.data
            },
            // handleShowPencil () {
            //     this.className = 'text-over'
            // },
            // handleHidePencil () {
            //     this.className = 'text'
            // },
            editPriority () {
                this.isEdit = true
                this.$nextTick(() => {
                    this.$refs.inputPriority.focus()
                })
            },
            editStatuChange () {
                this.isEdit = false
                // this.className = 'text'
            },
            savePriority () {
                const error = this.verifyPriority(this.priority)
                if (error) {
                    this.$message.error(error)
                    this.priority = this.dataBackup
                } else {
                    this.$service.updatePrioorityInCrowdList({ crowdId: this.crowdId, priority: this.priority ,policyId: this.policyId}, '操作成功，修改优先级会影响该策略下人群估算数量，请点击“估算”重新估算其他人群的圈定数据').then(() => {
                        this.isEdit = false
                        this.dataBackup = this.priority
                    }).catch(() => {
                        // 当接口报错，优先级就显示之前的值
                        this.priority = this.dataBackup
                    })
                }
            },
            onDataChange () {
                this.getPriority()
                this.isEdit = false
            },
            isIntNumber (val) {
                const reg = /^[0-9]+?$/
                return reg.test(val)
            },
            verifyPriority (val) {
                if (this.isIntNumber(val)) {
                    if (val > 1000000 || val < 0 ) {
                        return '优先级只能填写1-1000000的整数'
                    }
                } else {
                    return '优先级只能填写1-1000000的整数，不可填非数字'
                }
            }
        },
        created () {
            this.getPriority()
        }
    }
</script>
<style lang="stylus" scoped>
    .flex-content
        display flex
        justify-content center
    .text-over
        background url(../assets/pencil.png) no-repeat right center
        width 16px
        height 16px
        margin-left 10px
</style>
