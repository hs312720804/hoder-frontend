<template>
    <el-dialog
            :title="tag.attrId ? '编辑批量上传' : '新建批量上传'"
            :visible.sync="showBatchDialog">
          <el-form :model="tag" :rules="rules" ref="gForm" label-width="100px">
              <el-form-item label="选择文件">
                  <input @change="handleSelectFile" type="file"></input>
                  <div class="error-tips">{{message}}</div>
              </el-form-item>
              <div v-if="tag.tagType === 'collect'">
                      <el-form-item label="ip" prop="ip">
                          <el-input v-model="tag.ip"></el-input>
                      </el-form-item>
                      <el-form-item label="password">
                          <el-input v-model="tag.password"></el-input>
                      </el-form-item>
                      <el-form-item label="port" prop="port">
                          <el-input v-model="tag.port"></el-input>
                      </el-form-item>
                      <el-form-item label="timeout" prop="timeout">
                          <el-input v-model="tag.timeout"></el-input>
                      </el-form-item>
                      <el-form-item label="名称" prop="attrName">
                          <el-input v-model="tag.attrName"></el-input>
                      </el-form-item>
                      <el-form-item label="cid" prop="cid">
                          <el-input v-model="tag.cid"></el-input>
                      </el-form-item>
                      <el-form-item label="版本号" prop="version">
                          <el-input v-model="tag.version"></el-input>
                      </el-form-item>
                      <el-form-item label="database" prop="database">
                          <el-input v-model="tag.database"></el-input>
                      </el-form-item>
                      <el-form-item label="扩展参数1">
                          <el-input v-model="tag.ext1"></el-input>
                      </el-form-item>
              </div>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('gForm')">提交</el-button>
              </el-form-item>
          </el-form>
    </el-dialog>
</template>

<script>
    export default {
        name: "batchUpload",
        data () {
            return {
                showBatchDialog: false,
                tag: {
                    tagId: undefined,
                    tagType: undefined,
                    ip: undefined,
                    password: undefined,
                    port: undefined,
                    timeout: undefined,
                    attrName: undefined,
                    cid: undefined,
                    version: undefined,
                    database: undefined,
                    ext1: undefined,
                    file:undefined
                },
                message: '',
                rules: {
                    // file: [
                    //     {required: true,message:'请上传excel文件',trigger: 'blur'}
                    // ],
                    ip: [
                        {required: true,message:'请输入ip',trigger: 'blur'}
                    ],
                    // password: [
                    //     {required: true,message:'请输入密码',trigger: 'blur'},
                    //     {min: 0, max: 20,trigger: 'blur'}
                    // ],
                    port: [
                        {required: true,message:'请输入端口号',trigger: 'blur'}
                    ],
                    timeout: [
                        {required: true,message:'请输入timeout',trigger: 'blur'}
                    ],
                    attrName: [
                        {required: true,message:'请输入attrName',trigger: 'blur'}
                    ],
                    cid: [
                        {required: true,message:'请输入cid',trigger: 'blur'}
                    ],
                    version: [
                        {required: true,message:'请输入version',trigger: 'blur'},
                        {pattern: /^[0-9a-zA-Z]{1,32}$/,message: '版本号只能为数字字符串组合'}
                    ],
                    database: [
                        {required: true,message:'请输入database',trigger: 'blur'}
                    ],

                }

            }
        },
        props: ['currentTag'],
        watch: {
            currentTag: function (val) {
                const form = this.$refs.gForm
                if (form) {
                    form.activePaths = {}
                }
                this.tag = val || {}
            }
        },
        methods: {
            handleSelectFile(event) {
                this.message = ''
                if(event.currentTarget.files[0]!== '') {
                    const fileName = event.currentTarget.files[0].name
                    const extension = fileName.split('.')[1] === 'xls'
                    const extension2 = fileName.split('.')[1] === 'xlsx'
                    if (!extension && !extension2) {
                        this.message = '上传模板只能是 xls、xlsx格式!'
                        return
                    }
                }else {
                    this.message = '文件不能为空'
                    return
                }
                this.tag.file = event.currentTarget.files[0]
            },
            // beforeUpload(file){
            //     this.files = file;
            //     const extension = file.name.split('.')[1] === 'xls'
            //     const extension2 = file.name.split('.')[1] === 'xlsx'
            //     const isLt5M = file.size / 1024 / 1024 < 5
            //     if (!extension && !extension2) {
            //         this.$message.warning('上传模板只能是 xls、xlsx格式!')
            //         return
            //     }
            //     if (!isLt5M) {
            //         this.$message.warning('上传模板大小不能超过 5MB!')
            //         return
            //     }
            //     this.tag.file = file.name;
            //     setTimeout(() => {
            //         this.submitUpload();
            //     },500);
            //     return false; // 返回false不会自动上传
            // },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const formData = new FormData()
                        const tag = this.tag
                        if(this.tag.file != undefined){
                        Object.keys(tag).forEach((key) => {
                            formData.append(key, tag[key])
                        })
                        this.$service.tagBatchsave(formData,'保存成功').then(() => {
                            this.$emit('upsert-end')
                            this.showBatchDialog = false
                        })
                        }else{
                            this.message = "请检查文件格式是否不对或者为空"
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
.error-tips
    color red
</style>
