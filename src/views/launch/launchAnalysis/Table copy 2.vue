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

            <el-dropdown trigger="hover" class="el-dropdown">
              <span class="el-dropdown-link">
                . . .
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">
                  重命名
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

          <div class="box-fotter">
            <!-- <el-button>添加</el-button> -->
            <el-button type="primary" icon="el-icon-plus">添加</el-button>
          </div>
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
            <el-dropdown trigger="hover" class="el-dropdown">
              <span class="el-dropdown-link">
                . . .
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">
                  重命名
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
          <div class="box-fotter">
            <!-- <el-button>添加</el-button> -->
            <el-button type="primary" icon="el-icon-plus">添加</el-button>
          </div>
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

              </div>
            </div>
            <div class="detail-header-column">
              <div class="target">我的目标</div>
              <div>请输入接待员的目标<i class="el-icon-edit"></i></div>
              <div class="kpi-wrap">
                <div>绩效</div>
                <div class="detail-kpi">

                </div>
              </div>
            </div>

          </div>

          <div>
            <div>服务对象选择</div>
            <div class="set-start"></div>
          </div>
          <div>
            <div>服务对象选择</div>
            <div class="set-end"></div>
          </div>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      activeIndex: 0,
      activeIndex2: 0,
      sceneList: [{
        id: '001',
        name: '新激活用户下单场景'
      }, {
        id: '002',
        name: '老用户下单场景'
      }, {
        id: '003',
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
  margin-bottom 10px
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
  height: 100px;
  width: 100%;
  background: #fafafa;
}
.kpi-wrap {
  display grid;
  grid-template-columns: 45px auto
  grid-column-gap: 20px
}
.detail-kpi {
  height: 200px;
  width: 100%;
  // border 1px solid #ccc
  background: #fafafa;
}
.set-start, .set-end {
  height 200px
  // border 1px solid #ccc
  background: #fafafa;

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
</style>
