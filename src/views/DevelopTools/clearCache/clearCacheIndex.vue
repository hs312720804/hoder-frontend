<template>
    <div class="clear-cache">
        <div>清除指定MAC</div>
        <div class="clear-form">
            <el-form label-width="100px">
                <el-form-item label="设备信息：">
                    <el-input v-model="deviceMsg" placeholder="请输入设备MAC" class="clear-input" clearable></el-input>
                    <el-button @click="clearCache" class="clearBtn">清除缓存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="clear-form">
            <el-button v-permission="'sysAdministrative:user:add' || 'hoder:devTool:updateApiCache'" @click="handleAllCacheClean">清理人群查询接口缓存</el-button>
        </div>
    </div>

</template>

<script>
    export default {
        name: "clearCacheIndex",
        data () {
            return {
                deviceMsg: ''
            }
        },
        methods: {
            clearCache() {
                this.$service.setClearCache({keyword:this.deviceMsg},'清除缓存成功').then(() => {
                }).catch(() => {})
            },
            handleAllCacheClean () {
                this.$service.setClearAllCache({} ,'操作成功').then(() => {
                }).catch(() => {})
            }
    }
    }
</script>

<style lang="stylus" scoped>
.clear-cache
    margin 30px
.clear-form
    padding 30px
    width 50%
    margin-top 30px
    border 1px dashed #ccc
.clear-input
    width 60%
.clearBtn
    margin-left 20px
</style>
