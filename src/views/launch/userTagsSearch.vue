<template>
    <div>
        <div>
            <el-form :model="formData" :inline="true">
                <el-form-item>
                    <el-select v-model="formData.type">
                        <el-option
                                v-for="(item,index) in objToArray(typeEnum)"
                                :label="item.label"
                                :value="item.value"
                                :key="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="formData.type === 2">
                    <el-input
                            v-model="formData.mac"
                            placeholder="请输入用户的MAC地址"
                            class="small-input"
                            clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-if="formData.type === 3">
                    <el-input
                            v-model="formData.thirdUserId"
                            placeholder="请输入微信/QQ/openId"
                            class="small-input"
                            clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-if="formData.type === 3">
                    <el-input
                            v-model="formData.cOpenid"
                            placeholder="请输入酷开openId"
                            class="small-input"
                            clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-if="formData.type === 1">
                    <el-select
                            v-model="formData.tagId"
                            filterable
                            placeholder="请选择标签名称"
                            @change="handleTagChange"
                            clearable
                    >
                        <el-option
                                v-for="(tagItem,index) in tagList"
                                :label="tagItem.label"
                                :value="tagItem.value"
                                :key="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="formData.type === 1">
                    <el-select
                            v-model="formData.tagAttrId"
                            filterable
                            placeholder="请选择标签属性"
                            clearable
                    >
                        <el-option
                                v-for="(tagItem,index) in tagAttrList"
                                :label="tagItem.label"
                                :value="tagItem.value"
                                :key="index"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="formData.type === 1">
                    <el-input
                            v-model="formData.tempMac"
                            placeholder="请输入用户的MAC地址"
                            class="small-input"
                            clearable
                    >
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
            <div>{{content}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "userTagsSearch",
        data () {
            return {
                formData: {
                    type: 1,
                    mac: undefined,
                    cOpenid: undefined,
                    thirdUserId: undefined,
                    tagId: undefined,
                    tagAttrId: undefined,
                    tempMac: undefined
                },
                typeEnum: {
                    1 : '临时标签',
                    2 : '大数据标签',
                    3: '第三方标签'
                },
                typeEnumArr: [],
                tagList: [],
                tagAttrList: [],
                content: undefined
            }
        },
        methods: {
            objToArray (obj) {
                const arr = []
                Object.keys(obj).forEach(item => {
                    arr.push({ label: obj[item], value: parseInt(item) })
                })
                return arr
            },
            handleGetTagsList () {
                // const apiData = { tagName : '临时' }
                this.$service.getTempTagList().then(data => {
                    this.tagList = this.objToArray(data)
                })
            },
            handleGetTagsAttr (tagId) {
                this.$service.getTempTagAttrList({tagId}).then(data => {
                    const arr = []
                    if (data.length > 0) {
                        data.forEach(item => {
                            arr.push({ label: item.attrName, value: item.attrId})
                        })
                    }
                    this.tagAttrList = arr
                })
            },
            handleTagChange (tagId) {
                this.handleGetTagsAttr(tagId)
            },
            handleSearch () {
                const formData = JSON.parse(JSON.stringify(this.formData))
                const types = formData.type
                const apiData = {
                    type: types,
                    mac: types === 1 ? formData.tempMac : (types === 2 ? formData.mac : undefined),
                    cOpenid: types === 3 ? formData.cOpenid : undefined,
                    thirdUserId: types === 3 ? formData.thirdUserId : undefined,
                    tagId:types === 1 ? formData.tagId : undefined,
                    tagAttrId: types === 1 ? formData.tagAttrId : undefined
                }
                this.$service.getUserTagList(apiData).then(data => {
                    this.content = data
                })
            }
        },
        created() {
            this.handleGetTagsList()
        }
    }
</script>

<style lang="stylus" scoped>
.small-input
    /*width 20%*/
</style>
