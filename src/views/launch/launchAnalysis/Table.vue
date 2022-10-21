<template>
 <div class='row-wrap'>
    <div class="box">
      <div class="content">
        <div class="title">场景</div>

        <div class="search">
          <el-input placeholder="场景名/创建人" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>

        <div class="sceneList-wrap">
          <div class="lists-item" v-for="(item,index) in sceneList" :key="item.id" @click="activeIndex = index" :class="{active: activeIndex === index}">
            <i class="icon el-icon-video-camera-solid"></i>
            <span class="item-content">
              {{ item.name }}
              {{ item.id }}
            </span>

            <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom">
              <span class="el-dropdown-link">
                . . .
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" :key="item.id">
                  <!-- <el-popover
                    placement="top"
                    width="160"
                    v-model="renameVisible"
                    trigger="manual"
                  > -->
                    <!-- <div slot="reference">重命名</div> -->
                    <!-- <template #reference>
                      <span @click="renameVisible = true">重命名</span>
                    </template>
                    <p>这是一段内容这是一段内容确定删除吗？</p> -->
                    <!-- <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="renameVisible = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="renameVisible = false">确定</el-button>
                    </div> -->

                  <!-- </el-popover> -->
                  <el-popover placement="top" trigger="click" ref="pop">
                    <div slot="reference">重命名</div>
                    <div style="display: flex">
                      <el-input
                        type="text"
                        placeholder="请输入内容"
                        v-model="item.name"
                        maxlength="20"
                        show-word-limit
                        clearable
                        style="width: 250px"
                      >
                      </el-input>

                      <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                      <el-button type="primary" size="mini" @click="handelRename()">确定</el-button>
                    </div>
                  </el-popover>

                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  投放
                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  下架
                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </div>
        <div class="box-fotter">
          <!-- <el-button>添加</el-button> -->
          <el-button type="primary" icon="el-icon-plus" @click="addScene">添加</el-button>
        </div>

      </div>
    </div>

    <div class="box">
      <div class="content">
        <div class="title">接待员</div>

        <div class="search">
          <el-input placeholder="接待员/创建人" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>

        <div class="sceneList-wrap" >
          <div class="lists-item" v-for="(item, index) in servicer" :key="item.id" @click="activeIndex2 = index" :class="{active: activeIndex2 === index}">
            <i class="icon el-icon-user"></i>
            <span class="item-content">
              {{ item.name }}
              <!-- {{ item.id }} -->
            </span>
            <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom">
              <span class="el-dropdown-link">
                . . .
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">

                  <el-popover placement="top" trigger="click" ref="pop">
                    <div slot="reference">重命名</div>
                    <div style="display: flex">
                      <el-input

                        type="text"
                        placeholder="请输入内容"
                        v-model="item.name"
                        maxlength="20"
                        show-word-limit
                        clearable
                        style="width: 250px"
                      >
                      </el-input>

                      <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                      <el-button type="primary" size="mini" @click="handelRename()">确定</el-button>
                    </div>
                  </el-popover>

                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  投放
                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  下架
                </el-dropdown-item>
                <el-dropdown-item class="clearfix">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
        </div>
        <div class="box-fotter">
          <!-- <el-button>添加</el-button> -->
          <el-button type="primary" icon="el-icon-plus" @click="addServicer">添加</el-button>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="content detail">
        <div class="title">接待员详情</div>
        <div style="padding: 0 10px 10px 10px">

          <div class="detail-header">

            <div class="detail-header-column">
              <div class="detail-name">体育爱好者接待员</div>
              <div class="d-info">
                <div>创建人：李彪</div>
                <div>创建时间：2022.09.12</div>
              </div>
              <div style="text-align: center;">业务范围</div>
              <div class="detail-business-type">
                <!-- <div class="box-fotter">
                  <el-button type="text" icon="el-icon-plus">添加/修改业务范围</el-button>
                </div> -->
              </div>
            </div>
            <div class="detail-header-column">
              <div class="target">我的目标</div>
              <!-- <div>请输入接待员的目标<i class="el-icon-edit"></i></div> -->

              <div class="flex-content">
                <div class="target-img"></div>
                <div v-if="!isEdit" @click="editTarget" class="target-text">
                  <span>{{ target }}</span>
                  <span class="text-over"></span>
                </div>
                <!-- <el-input v-else type="text" ref="inputPriority" size="small" @blur="editStatuChange" v-model="target"></el-input> -->
                <el-input
                  v-else
                  ref="inputPriority"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  type="textarea"
                  placeholder="请输入内容"
                  @blur="editStatuChange"
                  v-model="target">
                </el-input>
              </div>

              <div class="kpi-wrap">
                <div>绩效</div>
                <div class="detail-kpi">
                  <!-- <el-descriptions title="" column="2">
                    <el-descriptions-item label="当前服务满意率">99889</el-descriptions-item>
                    <el-descriptions-item label="接待用户数">5588</el-descriptions-item>
                    <el-descriptions-item label="目标">苏州市</el-descriptions-item>
                    <el-descriptions-item label="满意用户数">123 </el-descriptions-item>
                  </el-descriptions> -->
                  <div class="detail-kpi-table">
                    <div>
                      <span class="kpi-label">当前服务满意率：</span>
                      <span class="kpi-value">NAN</span>
                    </div>
                    <div>
                      <span class="kpi-label">接待用户数：</span>
                      <span class="kpi-value">NAN</span>
                    </div>
                    <div>
                      <span class="kpi-label">目标：</span>
                      <span class="kpi-value">NAN</span>
                    </div>
                    <div>
                      <span class="kpi-label">满意用户数：</span>
                      <span class="kpi-value">NAN</span>
                    </div>
                  </div>

                  <div class="chart-empty"></div>
                </div>
              </div>
            </div>

          </div>

          <div>
            <div class="title2">服务对象选择</div>
            <div class="set-start">
              <div class="box-fotter">
                <!-- <el-button>添加</el-button> -->
                <el-button type="text" icon="el-icon-plus">新建服务对象筛选</el-button>
              </div>
            </div>
          </div>
          <div>
            <div class="title2">服务终止条件</div>
            <div class="set-end">
              <div class="box-fotter">
                <!-- <el-button>添加</el-button> -->
                <el-button type="text" icon="el-icon-plus">新建服务终止条件</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加场景"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-form :model="formScene">
        <el-form-item label="场景名：" label-width="70px">
          <el-input v-model="formScene.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddScene">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加接待员"
      :visible.sync="dialogVisible2"
      width="30%"
      >
      <el-form :model="formServicer">
        <el-form-item label="接待员名：" label-width="90px">
          <el-input v-model="formServicer.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>

 </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      input3: '',
      renameVisible: false,
      formScene: {
        name: ''
      },
      formServicer: {
        name: ''
      },
      dialogVisible: false,
      dialogVisible2: false,
      target: '请输入接待员的目标',
      priority: '',
      isEdit: false,
      activeIndex: 0,
      activeIndex2: 0,
      sceneList: [{
        id: 4,
        name: '新激活用户下单场景'
      }, {
        id: 1,
        name: '老用户下单场景'
      }, {
        id: 2,
        name: '新激活用户下单场景'
      }, {
        id: 4,
        name: '新激活用户下单场景'
      }],
      servicer: [{
        id: '001',
        name: '接待员1'
      }, {
        id: '002',
        name: '接待员2'
      }, {
        id: '003',
        name: '接待员3'
      }]
    }
  },
  created () {

  },
  methods: {
    handelRename () {
      this.handelClosePop()
    },
    handelClosePop () {
      const pops = this.$refs.pop
      pops.forEach(item => {
        console.log('item-----', item)
        item.doClose()
      })
    },
    addScene () {
      this.dialogVisible = true
    },
    confirmAddScene () {
      console.log('this.formScene.length--------', this.sceneList.length)
      const item = {
        name: this.formScene.name,
        id: this.sceneList.length + 1
      }
      this.sceneList.push(item)
      this.dialogVisible = false
    },
    addServicer () {
      this.dialogVisible2 = true
    },
    editTarget () {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.inputPriority.focus()
      })
    },
    editStatuChange () {
      this.isEdit = false
      // this.className = 'text'
    }
  }
}
</script>

<style lang='stylus' scoped>
.row-wrap {
  display: grid;
  grid-template-columns: 250px 250px auto;
  grid-template-rows: 100%;
  grid-gap: 20px;
  height 100%
  background: #000;
  margin: -20px;
  padding: 20px;
  background: rgb(243, 244, 250);

}
.box {
  // width: 150px;
  // border: 1px solid #000;
  // background: linear-gradient(to bottom, #34538b, #cd0000);
  // background-origin: border-box;
}
.content {
  height 100%
  background-color: #fff;
  overflow auto
  box-sizing: border-box;
  position relative
  // background: #fafafa;
  // background-image: url('https://img.alicdn.com/imgextra/i3/O1CN01kSoAWV1jd6n4fDpdT_!!6000000004570-2-tps-2200-1280.png');
  // background-size: 100%;

}

.icon
  font-size 20px
  width 30px

.title
  // font-size: 18px;
  // padding: 10px;
  // border-bottom: 1px dashed;
  // margin-bottom: 1px;
  padding: 10px 16px
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // min-height: 48px;
  // margin-bottom: -1px;
  // padding: 0 24px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 16px;

.lists-item
  // background rgb(237, 239, 255)
  // margin-bottom 10px
  // height: 36px;
  // line-height: 36px;
  font-size 14px
  color #666666
  padding 10px
  display flex
  border-bottom 1px dashed #f3f3f3
.active
  background rgb(237, 239, 255)

.item-content
  flex 1
.el-dropdown
  display: inline-flex;
  position: relative;
  color: var(--el-text-color-regular);
  font-size: var(--el-font-size-base);
  line-height: 1;
  vertical-align: top;

// @supports (-webkit-mask: none) or (mask: none) {
//   .box {
//     // border: none;
//     // background: linear-gradient(to bottom, #34538b, #cd0000) no-repeat;
//     // -webkit-mask-image: linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px),  linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px);
//     // -webkit-mask-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
//     // -webkit-mask-position: 0 0, 0 0, 0 100%, 100% 0;
//     // -webkit-mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;
//     // /* 合并写法 */
//     // mask: linear-gradient(to right, #000 6px, transparent 6px) repeat-x,
//     // linear-gradient(to bottom, #000 6px, transparent 6px) repeat-y,
//     // linear-gradient(to right, #000 6px, transparent 6px) repeat-x 0 100%,
//     // linear-gradient(to bottom, #000 6px, transparent 6px) repeat-y 100% 0;
//     // mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;

//     border: none;
//     background: linear-gradient(to bottom, #34538b, #cd0000) no-repeat;
//     -webkit-mask-image: linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px), linear-gradient(to right, #000 6px, transparent 6px), linear-gradient(to bottom, #000 6px, transparent 6px);
//     -webkit-mask-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
//     -webkit-mask-position: 0 0, 0 0, 0 100%, 100% 0;
//     -webkit-mask-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;
//   }
// }
.detail {
  // padding: 15px
}
.detail-name {
  font-size 24px
  color: #676a6c;
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 100;
}
.detail-header {
  display: grid
  grid-template-columns: 40% auto
  grid-column-gap: 20px
}
.detail-header-column {
  // padding: 20px
  box-sizing border-box
  // div {
  //   margin-bottom 20px
  // }
}
.target {
  font-size 18px
}
.detail-business-type {
  height: 166px;
  width: 100%;
  background: #f4f4f5;
  margin-top: 15px;
  position: relative
}
.kpi-wrap {
  display grid;
  grid-template-columns: 45px auto
}
.detail-kpi {
  height: 200px;
  width: 100%;
  // border 1px solid #ccc
  background: #f4f4f5;
  font-size 14px
  padding: 15px;
  box-sizing: border-box;
}
.detail-kpi-table {
  width: 100%;
  display grid
  grid-template-columns: 50% 50%
  grid-template-rows: 35px 35px
  grid-column-gap: 20px
}
.set-start, .set-end {
  height 200px
  // border 1px solid #ccc
  background: #f4f4f5;
  position: relative

}
.box-fotter {
  position: absolute;
  bottom: 0;
  padding: 10px;
  display: grid;
  /* justify-content: center; */
  /* grid-template-columns: 100%; */
  /* align-items: center; */
  /* grid-template-rows: auto; */
  width: 100%;
  box-sizing: border-box;
}

.d-info {
  background-color: #f4f4f5;
  color: #909399;
  padding: 8px 16px;
  font-size: 12px;
  display: grid;
  grid-template-columns: auto 50%;
  margin: 20px 0
}

.search {
  padding 0 10px 10px 10px
}

.flex-content
  display flex
  margin 10px 0
  align-items: center;
.text-over
  display inline-block
  background url(../../../assets/pencil.png) no-repeat right center
  width 16px
  height 16px
  margin-left 10px
.target-img
  background: url(/img/target.52cab19f.png) right center;
  width: 60px;
  height: 60px;
  background-size: 100%;
  flex: 0 0 auto;
  margin-right: 15px;
.target-text
  font-size: 14px
.chart-empty {
  background: url(../../../assets/img/chart.png) center center no-repeat;
  width: 100%;
  height: 95px;
  background-size: contain;
  text-align: center;
}
.title2 {
  font-size: 16px;
  padding: 16px 0 10px 0;
  text-align: center;
  color: rgba(0,0,0,0.85);
  font-weight: 500;
}
>>>.el-input--suffix .el-input__inner {
  padding-right: 77px;
}
.sceneList-wrap
  position: absolute;
  width: 100%;
  bottom: 53px;
  top: 83px;
  overflow: auto;
</style>
