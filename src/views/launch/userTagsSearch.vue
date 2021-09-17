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
                <el-form-item label="选择日期：" v-if="formData.type === 2">
                    <el-date-picker
                            v-model="formData.date"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            value="yyyy-MM-dd"
                            :picker-options="dateRange"
                    >
                    </el-date-picker>
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
                    <div v-if="formData.type === 3" style="font-size: 12px; color: red"> 微信/QQ/openID/酷开openid至少输入一个 </div>
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
                                :label="'【'+tagItem.value+'】'+tagItem.label"
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
            <div class="content" v-if="content">
                <pre><code>{{content}}</code></pre>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'userTagsSearchAA',
  data () {
    return {
      formData: {
        type: 1,
        mac: undefined,
        cOpenid: undefined,
        thirdUserId: undefined,
        tagId: undefined,
        tagAttrId: undefined,
        tempMac: undefined,
        date: undefined
      },
      typeEnum: {
        1: '临时标签',
        2: '大数据标签',
        3: '第三方标签'
      },
      typeEnumArr: [],
      tagList: [],
      tagAttrList: [],
      content: undefined,
      dateRange: {
        disabledDate (time) {
          return time.getTime() > Date.now() || time.getTime() < new Date().getTime() - 15 * 24 * 60 * 60 * 1000
        }
      }
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
      this.$service.getTempTagAttrList({ tagId }).then(data => {
        const arr = []
        if (data.length > 0) {
          data.forEach(item => {
            arr.push({ label: item.attrName, value: item.attrId })
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
        tagId: types === 1 ? formData.tagId : undefined,
        tagAttrId: types === 1 ? formData.tagAttrId : undefined,
        date: types === 2 ? formData.date : undefined
      }
      if (types !== 2) {
        this.$service.getUserTagList(apiData).then(data => {
          if (data) {
            this.content = data
          } else {
            this.content = '暂无数据'
          }
        })
      } else {
        const bigDataApi = {
          id: formData.mac,
          date: formData.date
        }
        this.$service.getBigDataUserTagList(bigDataApi).then(data => {
          if (data) {
            this.content = data
          } else {
            this.content = '暂无数据'
          }
        })
      }
    }
  },
  created () {
    this.handleGetTagsList()
  }
}
</script>

<style lang="stylus" scoped>
    .content
        margin 20px
        border 1px solid #ccc
        padding 20px
</style>
