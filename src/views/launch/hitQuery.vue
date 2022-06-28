<template>
  <!-- 所有的命中情况：包括命中、未命中、当前命中 ；以及其状态的详情 -->
  <div>
    <div class="title"></div>
    <el-form :model="form" ref="form" :rules="rules" :inline="true">
        <el-form-item label="MAC地址" prop="mac">
          <el-input v-model="form.mac" clearable></el-input>
        </el-form-item>
      <el-form-item label="策略ID：" prop="policyId" >
        <el-input v-model="form.policyId" clearable></el-input>
      </el-form-item>
      <el-form-item label="openID" prop="cOpenId">
        <el-input v-model="form.cOpenId" clearable></el-input>
      </el-form-item>
      <el-form-item label="thirdUserId" prop="thirdUserId">
        <el-input v-model="form.thirdUserId" clearable></el-input>
      </el-form-item>
      <el-form-item label="vUserId" prop="vUserId">
        <el-input v-model="form.vUserId" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <div v-if="list.length > 0" style="border: 1px dashed #333; padding: 10px">
      <el-descriptions  :column="1">
        <el-descriptions-item label="策略ID" label-class-name="my-label" content-class-name="my-content">{{ searchData.policyId }}</el-descriptions-item>
        <el-descriptions-item label="策略名称" label-class-name="my-label" content-class-name="my-content">{{ searchData.policyName }}</el-descriptions-item>
        <el-descriptions-item label="MAC" label-class-name="my-label" content-class-name="my-content">{{ form.mac }}</el-descriptions-item>
        <el-descriptions-item label="人群名称顺序" label-class-name="my-label" content-class-name="my-content">
          白色填充：无法命中，绿色填充：当前命中，黄色填充：可以命中</el-descriptions-item>
      </el-descriptions>
      <div style="margin: 20px 0">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="hitWrap"
          >
          <span
            class="hitItem"
            :class="{
              'hoverColor': index === hoverIndex,
              'clickColor': index === clickIndex,
              'white': item.hit === 0,
              'yellow': item.hit === 1,
              'green': item.crowdId === currentHit}"
            @mouseover="hoverIndex = index"
            @mouseout="hoverIndex = -1"
            @click.stop="handleClickDetail(item, index)">
            {{ item.crowdId }}
          </span>
          <span v-if="index !== list.length-1" class="line"></span>
          <span v-if="index !== list.length-1" class="arrow-right"></span>
        </div>
      </div>
      <c-table
        v-if="detailtags.data.length > 0"
        :props="detailtags.props"
        :header="detailtags.header"
        :data="detailtags.data"
      >
      </c-table>

    </div>
    <el-empty v-if="list.length === 0" description="暂无数据"></el-empty>
  </div>
</template>

<script>
export default {
  name: 'hitQueryAA',
  data () {
    return {
      form: {
        // policyId: '4107',
        // mac: '1ca7708b28e4',
        policyId: '',
        mac: '',
        cOpenId: '',
        thirdUserId: '',
        vUserId: ''
      },

      rules: {
        policyId: { required: true, message: '请输入策略id', trigger: 'blur' },
        mac: { required: true, message: '请输入mac', trigger: 'blur' }
      },
      searchData: {},
      list: [],
      noneText: '暂无数据',
      hoverIndex: -1,
      clickIndex: -1,
      detailtags: {
        props: {},
        header: [
          {
            label: '标签名称',
            prop: 'name'
          },
          {
            label: '标签code',
            prop: 'code'
          },
          {
            label: '运营符号',
            prop: 'operator'
          },
          {
            label: '运营值',
            prop: 'value'
          },
          {
            label: '运营值是否满足',
            // prop: 'ok',
            render: (h, { row }) => {
              const options = ['否', '是']
              return options[row.ok]
            }
          },
          {
            label: '标签类型',
            // prop: 'type',
            render: (h, { row }) => {
              return this.tagType[row.type]
            }
          },
          {
            label: '标签判断逻辑',
            prop: 'str'
          }

        ],
        data: []
      },
      tagType: [],
      currentHit: ''
    }
  },

  created () {

  },
  mounted () {
    // this.init()
  },
  methods: {
    handleClickDetail (item, index) {
      this.clickIndex = index
      this.detailtags.data = item.tags
    },

    handleSearch () {
      // 清空数据
      this.list = []
      this.hoverIndex = -1

      this.$refs.form.validate(valid => {
        if (valid) {
          // const filter = this.getFilter()
          this.$service.hitDetail(this.form).then(data => {
            console.log('data=====>', data)

            this.searchData = data || {}
            this.list = data.rows || []
            this.tagType = data.tagType
            this.currentHit = data.hit || ''

            // 默认选中第一个
            this.clickIndex = 0
            this.handleClickDetail(this.list[0], 0)
          })
        }
      })
    }
    // getFilter () {
    //   const filter = {
    //     policyId: '', // 策略ID
    //     mac: '', // mac
    //     cOpenId: '', // 酷开账号
    //     thirdUserId: '', // 第三方账号
    //     vUserId: ''
    //   }
    //   return filter
    // },

  }
}
</script>

<style lang="stylus" scoped>
.hitWrap
  display inline-block
  margin 22px 0
.hitItem
  width: 100px
  height: 100px
  display: inline-block
  border 7px solid #78a6d5
  border-radius 50%
  line-height 100px
  text-align center
  font-size 20px
.line
  display: inline-block;
  width: 85px;
  border: 3px solid #8dbdef
.arrow-right
  transform: rotate(-45deg);
  border: solid #8dbdef;
  border-width: 0 6px 6px 0;
  display: inline-block;
  padding: 6px;
  vertical-align: -6px;
  margin: 0 3px 0 -13px;
.hoverColor
  border 7px solid #409EFF
  color #000
.white
  background-color #fff
.yellow
  background-color #fbf530
.green
  background-color #67C23A
.clickColor
  // box-shadow: 0 0 10px rgb(64 158 255);
  // border: 1px solid #409eff;
  box-shadow: 0 0 25px rgb(64 158 255);
  border: 7px solid #409eff;

/deep/ .my-label
  width: 120px;
  font-size: 16px;
/deep/ .my-content {
  font-size: 16px;
}

</style>
