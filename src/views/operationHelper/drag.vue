<template>
<div class="div-wrap">
  <draggable v-model="binds" @update="datadragEnd" :options="{animation: 300}" class="drag-wrap">
    <transition-group>
      <div v-for="(item, index) in binds" :key="item.resourceCode + index" class="drag-item-wrap">
        <div class="drag-item">

          <!-- <el-select v-model="item.businessId" placeholder="请选择方案">
            <el-option
              v-for="obj in options"
              :key="obj.id"
              :label="obj.label"
              :value="obj.id">
            </el-option>
          </el-select> -->
          <!-- {{options}} -->
          <el-form-item :prop="`binds.${index}.resourceCode`" :rules="{ required: true, message: '请选择方案',trigger: 'change'}">

            <el-select v-model="item.resourceCode" placeholder="请选择方案" @change="resourceCodeChange($event, item)" clearable :popper-append-to-body="false">
              <div class="options-wrap">
                <el-option
                  v-for="item in options"
                  :key="item.resourceCode"
                  :label="item.resourceCode"
                  :value="item.resourceCode">
                  <span style="float: left;">{{ item.resourceCode }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.resourceName }}</span>
                </el-option>
              </div>

              <div class="operate-wrap">
                <!-- :rule="formInlineRule" :ref="`formInlineRef${index}`" -->
                <el-form :inline="true" :model="formInline" class="demo-form-inline" >
                  <el-form-item prop="resourceCode">
                    <el-input v-model="formInline.resourceCode" placeholder="业务方的方案ID" style="width: 130px"></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-input v-model="formInline.resourceName" placeholder="备注（可选）" @keydown.enter.native="addPlan" style="width: 130px"></el-input>
                  </el-form-item>
                </el-form>

                <el-button type="text" @click="addPlan" icon="el-icon-plus">添加方案</el-button>
              </div>
            </el-select>
          </el-form-item>

          <span class="text-tip">绑定</span>

          <el-form-item :prop="`binds.${index}.crowdId`" :rules="{ required: true, message: '请选择人群',trigger: 'change'}">
            <el-select
              v-model="item.crowdId"
              placeholder="请选择人群"
              :filterable="true"
              :remote="true"
              :remote-method="getCrowdList"
              @visible-change="getCrowdList('')"
              clearable
              class="select-wrap"
              @change="crowdIdChange($event, item)"
              :popper-append-to-body="false">
              <el-option-group label="人群列表">
                <div class="options2-wrap">
                  <el-option
                    v-for="obj in crowdList"
                    :key="obj.crowdId"
                    :label="obj.crowdName"
                    :value="obj.crowdId">
                  </el-option>
                </div>
              </el-option-group>
              <div v-if="crowdList.length === 0" class="empty-text">无数据</div>
              <el-option-group label="全量兜底">
                <el-option
                  :key="index"
                  label="全量兜底"
                  :value="0">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <i class="el-icon-s-operation"></i>
        </div>
        <i class="el-icon-delete"  @click="cutColor(index)"></i>
      </div>

    </transition-group>
  </draggable>

  <!-- return h('div', {
                class: 'table-cell-wrap'
              },
              [
                h('div', { class: 'table-cell-wrap-icon' }, [
                  h('span', '高'),
                  h('span', '低')
                ]),
                h('div', { class: 'arrow-wrap' }, [
                  h('div', { class: 'arrow' })
                ]),
                h('div', { class: 'aaa' }, group)
              ]) -->
  <div class="direction-wrap">
    <div class='table-cell-wrap-icon'>
      <span>高</span>
      <span>低</span>
    </div>
    <div class="arrow-wrap">
      <div class="arrow"></div>
    </div>
  </div>
  <div class="box-fotter">
    <el-button icon="el-icon-plus" @click="addColor">添加绑定</el-button>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  props: {
    bizId: {
      type: [String, Number],
      default: 1
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'form.binds': {
      handler (val) {
        console.log('val--->', val)
        this.binds = val
      },
      deep: true,
      immediate: true
    },
    binds: {
      handler (val) {
        // eslint-disable-next-line vue/no-mutating-props
        this.form.binds = val
      },
      deep: true
    }
  },
  data () {
    return {
      formInlineRule: { required: true, message: '请输入任务ID', trigger: 'blur' },
      binds: [],
      formInline: {
        resourceCode: '',
        resourceName: ''
      },
      msg: '这是测试组件',
      options: [{
        id: 0,
        label: '方案1'
      }, {
        id: 1,
        label: '方案2'
      }, {
        id: 2,
        label: '方案3'
      }, {
        id: 3,
        label: '方案4'
      }, {
        id: 4,
        label: '方案5'
      }, {
        id: 5,
        label: '方案6'
      }, {
        id: 6,
        label: '方案7'
      }],

      crowdList: [],
      startArr: [],
      endArr: [],
      count: 0
    }
  },
  components: {
    draggable
  },
  methods: {
    // <el-select v-model="item.resourceCode" placeholder="请选择方案" @change="resourceCodeChange($event, item)">
    resourceCodeChange (e, item) {
      console.log('e-->', e)
      console.log('eitem-->', item)

      const obj = this.options.find(i => {
        return e === i.resourceCode
      })
      console.log('obj---->', obj)
      item.resourceId = obj ? obj.id : ''
      item.resourceName = obj ? obj.resourceName : ''
      item.priority = ''
    },
    crowdIdChange (e, item) {
      console.log('e-->', e)
      console.log('eitem-->', item)
      if (e === 0) {
        item.bindType = 2 // 全量托底

        item.policyId = null
        item.crowdName = '全量托底'
      } else {
        item.bindType = 1 // 人群绑定

        const obj = this.crowdList.find(i => {
          return e === i.crowdId
        })
        console.log('obj---->', obj)
        item.policyId = obj ? obj.policyId : ''
        item.crowdName = obj ? obj.crowdName : ''
      }
    },

    // 新增方案
    addPlan (index) {
      // this.$refs[`formInlineRef${index}`][0].validate(valid => {
      //   if (valid) {
      if (this.formInline.resourceCode === '') {
        return this.$message.error('请输入业务方的方案ID')
      }
      const params = {
        bizId: this.bizId, // 业务ID
        ...this.formInline
      }
      this.$service.saveAssistantResource(params, '添加成功').then(res => {
        this.formInline = {
          resourceCode: '',
          resourceName: ''
        }

        this.getAssistantResourceList()
      })
      //   }
      // })
    },
    getAssistantResourceList () {
      const params = {
        bizId: this.bizId, // 业务ID
        pageNum: 1,
        pageSize: 500
      }
      this.$service.getAssistantResourceList(params).then(res => {
        this.options = res.row || []
      })
    },
    // 删除
    cutColor (index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.binds.splice(index, 1)
    },
    // 新增
    addColor () {
      // eslint-disable-next-line vue/no-mutating-props
      this.binds.push({
        resourceCode: '',
        resourceName: ''
      })
    },
    // getdata (evt) {
    //   console.log(evt.draggedContext.element.text)
    // },
    datadragEnd (evt) {
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.binds)
    },
    // visibleChange (val, modelValue) {
    //   if (modelValue === '') {
    //     this.getCrowdList()
    //   }
    // },
    getCrowdList (keyWord) {
      const params = {
        crowdName: keyWord,
        pageNum: 1,
        pageSize: 500
      }
      this.$service.getAssistantTaskCrowdList(params).then(res => {
        this.crowdList = res.row || []
      })
    }
  },
  created () {
    this.getCrowdList()
    this.getAssistantResourceList()
  },
  mounted () {
    // 为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .drag-wrap {
    // border: 1px solid #000
  }
  // .test{
  //   border:1px solid #ccc;
  // }
  .drag-item-wrap {
    display: grid;
    grid-template-columns: auto 16px;
    grid-gap: 29px;
    align-items: center;
  }
  .drag-item{
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin: auto;
    position: relative;
    border-bottom: 1px dashed #e1e1e1;
    display flex
    align-items: center;
    justify-content: space-between;
  }
  .ghostClass{
    opacity: 1;
  }
  .bottom{
    width: 200px;
    height: 50px;
    position: relative;
    background: blue;
    top:2px;
    left: 2px;
    transition: all .5s linear;
  }
  .text-tip {
    font-size 12px
    color: #E6A23C
  }
  .box-fotter {
    display: grid;
    margin: 10px 0
  }
  .el-icon-delete {
    cursor pointer
  }
  .operate-wrap {
    display: grid;
    justify-content: center;
    grid-template-rows: 30px 18px;
    margin-top: 5px;
    padding: 5px;
    border-top: 1px dashed #e7e7e7;
  }

  .options-wrap {
    max-height: 180px;
    overflow auto
  }
  .options2-wrap{
    max-height: 130px;
    overflow auto
  }
  .select-wrap >>> .el-select-dropdown__wrap {
    max-height: 374px;
  }
  $arrowColor = #d7d7d7;
  .table-cell-wrap-icon{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: $arrowColor;
    font-size 12px
    width: 17px;
  }
  .arrow-wrap {
    height: 100%;
    background: $arrowColor;
    width: 1px;
    margin-left: 7px;
    position: relative
  }
  .arrow {
    width: 10px;
    height: 10px;
    border: 1px solid;
    border-color: transparent transparent $arrowColor $arrowColor;
    position: absolute;
    bottom: 2px;
    left: -6px;
    -webkit-transform: rotate(314deg);
    transform: rotate(314deg);
  }
  .div-wrap {
    display: grid;
    grid-template-columns: auto 35px;
    grid-gap: 0 20px;
  }
  .direction-wrap {
    display: flex;
    justify-content: center;
    padding: 10px 0px;
  }
  .div-wrap
    >>>.el-form-item--mini.el-form-item, >>>.el-form-item--small.el-form-item
      margin-bottom 0
  .empty-text
    margin: 0;
    text-align: center;
    color: #999;
    font-size: 14px;
</style>
