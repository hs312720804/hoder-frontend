<template>
 <div class='row-wrap'>
    <div class="box">
      <div class="content">
        <div class="title">场景</div>
        <div class="sceneList-wrap">
          <div v-for="item in sceneList" :key="item.id">
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
        </div>
      </div>
    </div>

    <div class="box">
      <div class="content">
        <div class="title">接待员</div>
        <div class="sceneList-wrap">
          <div v-for="item in sceneList" :key="item.id">
            <i class="icon el-icon-user"></i>
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
        </div>
      </div>
    </div>

    <div class="box">
      <div class="content">
        <div>接待员详情</div>
      </div>
    </div>
 </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      sceneList: [{
        id: '001',
        name: '新激活用户下单场景'
      }, {
        id: '002',
        name: '老用户下单场景'
      }, {
        id: '003',
        name: '新激活用户下单场景'
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

}
.box {
  // width: 150px;
  border: 1px solid #000;
  // background: linear-gradient(to bottom, #34538b, #cd0000);
  // background-origin: border-box;
}
.content {
  height 100%
  background-color: #fff;
}

.icon
  font-size 20px
  width 30px

.title
  font-size: 18px;
  padding: 10px;
  border-bottom: 1px dashed;
  margin-bottom: 1px;
.sceneList-wrap > div
  background rgb(237, 239, 255)
  margin-bottom 10px
  // height: 36px;
  // line-height: 36px;
  font-size 14px
  color #666666
  padding 10px
  display flex
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

</style>
