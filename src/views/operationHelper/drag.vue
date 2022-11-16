<template>
<div>
  <draggable v-model="colors" @update="datadragEnd" :options="{animation: 300}" class="drag-wrap">
    <transition-group>
      <div v-for="(item, index) in colors" :key="item.text" class="drag-item-wrap">
        <div class="drag-item">

          <!-- <el-select v-model="item.businessId" placeholder="请选择方案">
            <el-option
              v-for="obj in options"
              :key="obj.id"
              :label="obj.label"
              :value="obj.id">
            </el-option>
          </el-select> -->

          <el-select v-model="item.businessId" placeholder="请选择">
            <div class="options-wrap">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.id">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
              </el-option>
            </div>

            <div class="operate-wrap">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                  <el-input v-model="formInline.user" placeholder="业务方的方案ID" style="width: 130px"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-input v-model="formInline.user" placeholder="备注（可选）" style="width: 130px"></el-input>
                </el-form-item>
              </el-form>

              <el-button type="text" @click="addPlan" icon="el-icon-plus">添加方案</el-button>
            </div>
          </el-select>

          <span class="text-tip">绑定</span>
          <el-select v-model="item.businessId" placeholder="请选择人群" class="select-wrap">
            <el-option-group label="人群列表">
              <div class="options2-wrap">
                <el-option
                  v-for="obj in options"
                  :key="obj.id"
                  :label="obj.label"
                  :value="obj.id">
                </el-option>
              </div>
            </el-option-group>
            <el-option-group label="全量托底">
              <el-option
                key="全量托底"
                label="全量托底"
                value="全量托底">
              </el-option>
            </el-option-group>
          </el-select>

          <i class="el-icon-s-operation"></i>
        </div>
        <i class="el-icon-delete"  @click="cutColor(index)"></i>
      </div>

    </transition-group>
  </draggable>

  <div class="box-fotter">
    <el-button icon="el-icon-plus" @click="addColor">添加绑定</el-button>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  data () {
    return {
      formInline: {
        user: '',
        region: ''
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
      colors: [
        {
          text: 'Aquamarine'
        },
        {
          text: 'Hotpink'
        },
        {
          text: 'Gold'
        }
      ],
      startArr: [],
      endArr: [],
      count: 0
    }
  },
  components: {
    draggable
  },
  methods: {
    addPlan () {
      console.log('submit!')
    },
    // 删除
    cutColor (index) {
      this.colors.splice(index, 1)
    },
    // 新增
    addColor () {
      this.colors.push({
        text: ''
      })
    },
    getdata (evt) {
      console.log(evt.draggedContext.element.text)
    },
    datadragEnd (evt) {
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.colors)
    }
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
</style>
