<template>
    <div class="addPeoplePosition">
        <div class="title">{{title}}</div>
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="人群投放Id" prop="launchCrowdId">
                <el-select v-model="form.launchCrowdId" :disabled="disableValue">
                    <el-option v-for="(item,index) in crowdIds" :label="item.value+'_'+item.label" :key="index" :value="item.value"></el-option>
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
            <el-form-item label="redis地址示例" class="example" v-if="form.protocol === 'redis'">
                <span>{"ip":"172.16.33.12","port":"5459","password":"abc.123","timeout":"3000","database":"0","cid":"693","version":"20190422"}
                </span>
            </el-form-item>
            <el-form-item label="kafka地址示例" class="example" v-if="form.protocol === 'kafka'">
                <div>{"ip":"172.16.33.12","port":"5459"}</div>
            </el-form-item>
            <el-form-item label="位置存放地址" prop="url">
                <el-input v-model="form.url" :disabled="disableValue"></el-input>
            </el-form-item>
            <el-form-item label="redis参数示例" class="example" v-if="form.protocol === 'redis'">
                <div>{"mac_key":"crowd_534_mac_20190402","all_key":"crowd_534_20190402","sid_key":"crowd_534_sid_20190402","1_key":"crowd_543_1_20190402","2_key":"crowd_543_2_20190402","3_key":"crowd_543_3_20190402"} </div>
            </el-form-item>
            <el-form-item label="kafka参数示例" class="example" v-if="form.protocol === 'kafka'">
                <div>{"mac_topic":"topic1xx","all_topic":"topic2xx","sid_topic":"topic3xx","1_topic":"topic3x11x","2_topic":"topic4xx","3_topic":"topic4xx"}</div>
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
                        this.crowdIds = this._arrayingOption(data,'launchName','launchCrowdId')
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
                                url: this.form.url,
                                param: this.form.param,
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
                this.form.protocol = 'redis'
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
    .example
        font-size 12px
        color #ccc
    .example div
        overflow auto
</style>
