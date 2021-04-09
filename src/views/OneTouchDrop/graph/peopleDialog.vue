<template>
    <div class="peopleDialog-wrap">
        <el-dialog title="人群配置" :visible.sync="show.is" width="30%">
            <div class="content">
                <el-form label-position="left" label-width="120px" :model="peopleForm">
                    <el-form-item label="人群名称：">
                        <el-input v-model="peopleForm.peopleName"></el-input>
                    </el-form-item>
                    <el-form-item label="人群影响时间：">
                        <el-row :gutter="10">
                            <el-col :span="3">&gt;=</el-col>
                            <el-col :span="12">
                                <el-input v-model="peopleForm.peopleTime"></el-input>
                            </el-col>
                            <el-col :span="7">
                                <el-select v-model="peopleForm.peopleTimeCompany" placeholder="请选择">
                                    <el-option label="天" value="day"></el-option>
                                    <el-option label="小时" value="hour"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show.is = false">取 消</el-button>
                <el-button type="primary" @click="savePeople">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "peopleDialog",
        props: {
            show: {
                type: Object,
                default () {
                    return {
                        is: false
                    }
                }
            }
        },
        data () {
            return {
                peopleForm: {
                    peopleName: '',
                    peopleTime: '',
                    peopleTimeCompany: 'day'
                }
            }
        },
        methods: {
            savePeople () {
                this.$emit('savePeople', this.peopleForm)
            }
        },
        watch: {
            show: {
                handler (val) {
                    if (val.is) {
                       this.peopleForm = {
                           peopleName: '',
                           peopleTime: '',
                           peopleTimeCompany: 'day'
                       }
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>
