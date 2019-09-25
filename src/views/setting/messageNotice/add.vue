<template>
    <div>
        <template v-if="mode === 'read'">
            <div class="header-title">消息详情</div>
            <div class="read-content">
                <div class="notice-title">
                    {{readForm.noticeTitle}}
                </div>
                <div class="notice-time">时间：{{readForm.pushTime}}</div>
                <div class="notice-content">{{readForm.content}}</div>
                <el-button type="primary" @click="goBack">返回</el-button>
            </div>
        </template>
        <template v-else>
            <div class="header-title">{{addFormTitle}}</div>
            <el-form :model="addForm" label-width="120px" class="add-form">
                <el-form-item label="标题" prop="noticeTitle">
                    <el-input v-model="addForm.noticeTitle"></el-input>
                </el-form-item>
                <el-form-item label="消息类型" prop="noticeType">
                    <el-select v-model="addForm.noticeType">
                        <el-option :value="1" label="升级消息"></el-option>
                        <el-option :value="2" label="系统通知"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="6" v-model="addForm.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                    <el-button @click="goBack">返回</el-button>
                </el-form-item>
            </el-form>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            editId: '',
            mode: ''
        },
        data () {
            return {
                title: '',
                readForm: {
                    noticeTitle: '',
                    pushTime: '',
                    content: ''
                },
                markEnum: {
                    'edit': 1,
                    'read': 2
                },
                addFormTitle: '',
                addForm: {
                    noticeTitle: '',
                    noticeType: 1,
                    content: '',
                    noticeId: undefined
                }
            }
        },
        watch: {
            'editId'() {
                this.fetchData()
            }
        },
        methods: {
            fetchData () {
                const noticeId = this.editId
                const mark = this.markEnum[this.mode]
                const mode = this.mode
                if (noticeId) {
                    this.addFormTitle = '编辑'
                    this.$service.noticeDetail({noticeId,mark}).then((data)=> {
                        if (mode === 'read') {this.readForm = data}
                        if (mode === 'edit') {this.addForm = data}
                    })
                }else {
                    this.addFormTitle = '新增'
                }
            },
            goBack () {
                this.$emit('open-list-page')
            },
            handleSubmit () {
                if (!this.editId) {
                    // 新增保存
                    this.$service.noticeAdd(this.addForm,'保存成功').then(() => {
                        this.$emit('open-list-page')
                    })
                } else {
                    // 编辑保存
                    this.addForm.noticeId = this.editId
                    this.$service.noticeEdit(this.addForm,'修改成功').then(() => {
                        this.$emit('open-list-page')
                    })
                }
            }
        },
        created () {
            this.fetchData()
        }
    }
</script>

<style lang="stylus" scoped>
.header-title
    background #ccc
    padding 15px
    font-size 20px
    color #666
    margin-bottom 20px
.read-content
    margin 30px
.notice-title
    font-size 18px
    color #333
.notice-time
    color #999
    font-size 14px
    margin 10px 0 20px 0
.notice-content
    color #000
    text-indent 20px
    line-height 1.5
    margin-bottom 40px
.add-form
    width 80%
</style>
