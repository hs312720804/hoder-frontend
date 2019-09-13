<template>
    <div>
        <!--<div :class="className" v-if="!isEdit" @mouseover="handleShowPencil" @mouseleave="handleHidePencil" @click="editPriority">{{priority}}</div>-->
        <div class="text-over" v-if="!isEdit" @click="editPriority">{{priority}}</div>
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
                    this.$service.updatePrioorityInCrowdList({ crowdId: this.crowdId, priority: this.priority ,policyId: this.policyId}, '修改优先级成功').then(() => {
                        this.isEdit = false
                        this.dataBackup = this.priority
                    })
                }
            },
            onDataChange (val, oldVal) {
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
    .text
        text-align center
    .text-over
        background url(../assets/pencil.png) no-repeat right center
        text-align center
</style>
