<template>
    <div class="addPeoplePosition">
        <div class="title">{{title}}</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="人群投放Id" prop="launchCrowdId">
                <el-select v-model="form.launchCrowdId" :disabled="disableValue">
                    <el-option v-for="(item,index) in crowdIds" :label="item.label" :key="index" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人群名称" prop="name">
                <el-input v-model="form.name" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="存放协议" prop="protocol">
                <el-select v-model="form.protocol" :disabled="disableValue">
                    <el-option v-for="(item,index) in protocols" :label="item" :key="index" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="位置存放地址" prop="url">
                <el-input v-model="form.url" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="param">
                <el-input v-model="form.param" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="标注" prop="remark">
                <el-input v-model="form.remark" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="save" v-if="this.mode!= 'read'">保存</el-button>
                <el-button @click="goBack">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "peoplePositionAdd",
        props: {
            editId: '',
            mode: ''
        },
        data () {
            return {
                form: {
                    launchCrowdId: '',
                    name: '',
                    protocol: '',
                    url: '',
                    param: '',
                    remark: '',
                    id: ''
                },
                crowdIds: [],
                protocols: [],
                title: '',
                disableValue: false,
                rules: {
                    launchCrowdId: [
                        {required: true, message: '请输入人群投放ID', trigger: 'blur'}
                    ],
                    name: [
                        {required:true, message:'请输入人群名称', trigger: 'blur'}
                    ],
                    protocol: [
                        {required:true, message:'请选择存放协议', trigger: 'blur'}
                    ],
                    url: [
                        {required:true, message:'请输入位置存放地址', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            getCrowdIdList () {
                this.$service.crowdIdList().then(
                    (data) => {
                        console.log(data)
                        this.crowdIds = this._arrayingOption(data,'launchName','launchCrowdId')
                        console.log(this.crowdIds)
                    }
                )
            },
            getProtocolList () {
                this.$service.protocolList().then(
                    (data) => {
                        this.protocols = data
                    }
                )
            },
            getDetail () {
                this.$service.getPositonDetail({id: this.editId}).then(
                    (data) => {
                        console.log(data)
                        this.form = data
                        // if(this.mode === 'edit') {this.form.id = this.editId}
                    }
                )
            },
            // 数组化[{label, value}]
            _arrayingOption(arr, label, value) {
                return arr.reduce((result, item) => {
                    return result.concat({ label: item[label], value: item[value] })
                }, [])
            },
            goBack () {
                this.$emit('open-list-page')
            },
            save () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        // const submitData = {
                        //     id: this.editId,
                        //     launchCrowdId: this.form.launchCrowdId,
                        //     name: this.form.name,
                        //     protocol: this.form.protocol,
                        //     url: JSON.stringify(this.form.url),
                        //     param: JSON.stringify(this.form.param),
                        //     remark: this.form.remark
                        // }
                        if (this.editId === undefined) {
                            this.$service.peoplePositonAdd(this.form, '保存成功').then( () => {
                                this.$emit('open-list-page')
                            })
                        }else {
                            const submitData = {
                                id: this.editId,
                                launchCrowdId: this.form.launchCrowdId,
                                name: this.form.name,
                                protocol: this.form.protocol,
                                url: JSON.stringify(this.form.url),
                                param: JSON.stringify(this.form.param),
                                remark: this.form.remark
                            }
                            this.$service.peoplePositonEdit(submitData, '修改成功').then( () => {
                                this.$emit('open-list-page')
                            })
                        }
                    }
                })
            },
        },
        created () {
            this.getCrowdIdList()
            this.getProtocolList()
            if(this.editId === undefined){
                this.title = '新增'
            }else {
                if(this.mode === 'edit') {
                    this.title = '编辑'
                    this.getDetail()

                }else {
                    this.title = '查看详情'
                    this.getDetail()
                    this.disableValue = true
                }
            }
            console.log(this.editId)
            console.log(this.mode)
        }
    }
</script>

<style lang="stylus" scoped>
    .addPeoplePosition
        width 80%
        margin-left 20px
    .title
        margin 20px
        font-size 30px
</style>
