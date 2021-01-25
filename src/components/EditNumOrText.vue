<template>
    <div>
        <div class="flex-content" v-if="!isEdit" @click="editNumOrText">
            <div>{{parentValue}}</div>
            <div class="text-over"></div>
        </div>
        <el-input class="input-width" v-else type="text" ref="inputPriority" size="small" @change="saveChange" @blur="editStatusChange" v-model="parentValue"></el-input>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                parentValue: '',
                isEdit: false,
                dataBackup: ''
            }
        },
        props: ['obj', 'objKey', 'validType'],
        methods: {
            getInitData () {
                this.parentValue = this.obj[this.objKey]
                this.dataBackup = this.obj[this.objKey]
            },
            editNumOrText () {
                this.isEdit = true
                this.$nextTick(() => {
                    this.$refs.inputPriority.focus()
                })
            },
            editStatusChange () {
                this.isEdit = false
            },
            saveChange () {
                const error = this.verifyNumOrText(this.parentValue)
                if (error) {
                    this.$message.error(error)
                    this.parentValue = this.dataBackup
                } else {
                    this.isEdit = false
                    this.dataBackup = this.parentValue
                    this.obj[this.objKey] = this.validType === 'number' ? parseInt(this.parentValue) : this.parentValue
                }
            },
            isIntNumber (val) {
                const reg = /^[0-9]+?$/
                return reg.test(val)
            },
            verifyNumOrText (val) {
                if (this.validType === 'number') {
                    if (this.isIntNumber(val)) {
                        if (val > 100 || val < 0 ) {
                            return '分流占比只能填写1-100的整数'
                        }
                    } else {
                        return '分流占比只能填写0-100的整数，不可填非整数数字'
                    }
                } else {
                    return
                }
            }
        },
        created () {
            this.getInitData()
        }
    }
</script>
<style lang="stylus" scoped>
    .flex-content
        display flex
    .text-over
        background url(../assets/pencil.png) no-repeat right center
        width 16px
        height 16px
        margin-left 10px
    .input-width
        width 80%
</style>
