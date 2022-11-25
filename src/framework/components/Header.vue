<template>
  <el-header class="header">
    <div class="header__left">
      <SiteName style="margin-left:14px; margin-right:30px;" :name="productName"></SiteName>
      <HeaderNav class="header-nav"></HeaderNav>
    </div>

    <div class="header_right">
      <UserInfo></UserInfo>
      <HeaderHandle class="header-handle"></HeaderHandle>
      <HeaderUserDropDown></HeaderUserDropDown>
    </div>
  </el-header>
</template>

<script>
import SiteName from 'cseed-frame/components/SiteName'
import HeaderNav from 'cseed-frame/components/HeaderNav'
import HeaderHandle from 'cseed-frame/components/HeaderHandle'
import HeaderUserDropDown from 'cseed-frame/components/HeaderUserDropDown'
import UserInfo from 'cseed-frame/components/UserInfo.vue'

export default {
  components: {
    SiteName,
    HeaderNav,
    HeaderHandle,
    HeaderUserDropDown,
    UserInfo
  },
  data () {
    return {
      productName: process.env.VUE_APP_PROJECT_NAME
    }
  },
  methods: { }
}
</script>

<style lang="stylus" scoped>
.el-header
  box-shadow 0 4px 5px rgba(0 0 0 .03), 0 3px 5px rgba(0 0 0 .03), 0 2px 4px rgba(0 0 0 .01)
  display flex
  justify-content space-between
.header
  display flex
  align-items center
  padding 10px 0
  position relative
  border-bottom 1px solid #eaecef
  .header__left,
  .header_right
    display flex
    justify-content center
    align-items center
</style>
