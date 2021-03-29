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
        props: ['obj', 'objKey', 'validType', 'range'],
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
                        let min = 0
                        let max = 0
                        if (this.range) {
                            min = this.range[0]
                            max = this.range[1]
                            if (val > max || val < min ) {
                                return `只能填写${min}-${max}的整数`
                            }
                            return
                        }
                        return

                    } else {
                        return '只能填写整数，不可填非整数数字'
                    }
                }
                return
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
