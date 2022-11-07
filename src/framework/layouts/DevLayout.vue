
<!-- 勿动：当前组件涉及到用户、角色、权限、路由等功能，如对当前框架不是很了解，请不要随意改动！-->
<!-- 当前组件只能在独立访问的环境( window.__POWERED_BY_QIANKUN__ === false )下使用111 -->
<template>
  <el-container class="dev-layout" direction="vertical">
    <LayoutHeader></LayoutHeader>
    <el-container class="dev_content">
      <el-aside width="200px">
        <c-menu
          :default-active="$route.name"
          :items="prodMenus">
        </c-menu>
      </el-aside>
      <el-main class="dev_main">
        <el-scrollbar class="c-scrollbar" wrap-style="overflow-x:hidden;">
          <div class="c-scrollbar--box">
            <keep-alive>
              <router-view v-if="menuId" :menu-id="menuId" :key="$route.path" ></router-view>
            </keep-alive>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { defineComponent, ref, watch, reactive, getCurrentInstance, provide } from 'vue'
import { CMenu } from '@cseed/admin-toolkit'
import store from 'cseed-frame/store/_index'
import LayoutHeader from 'cseed-frame/components/Header.vue'
import { getMenusService } from 'cseed-frame/services/_common'
import layoutSetup from 'cseed-frame/layouts/setup'

export default defineComponent({
  components: { CMenu, LayoutHeader },
  setup () {
    const _this = getCurrentInstance().proxy // ctx.root
    const menuIdMap = reactive({ dashboard: true })
    const menuId = ref()
    const prodMenus = ref([])

    provide('cseedFrameMenuId', menuId)

    watch(
      () => _this.$route,
      () => {
        updateMenuId()
      }
    )
    function updateMenuId () {
      const { name } = _this.$route
      menuId.value = menuIdMap[name]
    }
    function genCMenu ({ id, alias, name, icon, children }) {
      menuIdMap[alias] = id
      const currentMenuItem = {
        title: name,
        icon: icon,
        route: alias
      }
      if (children) {
        currentMenuItem.children = children.reduce((result, item) => {
          const menuItem = genCMenu(item)
          if (menuItem) {
            result.push(menuItem)
          }
          return result
        }, [])
      }
      return currentMenuItem
    }
    function setMenus () {
      getMenusService({
        productKey: process.env.VUE_APP_PROJECT_CODE
      }).then(res => {
        const { buttons } = res
        const menus = res.tenantMenus || res
        prodMenus.value = menus.map(genCMenu)
        store.commit('dev/setAccess', { buttons, menus })
        updateMenuId()
      })
    }
    setMenus()
    layoutSetup.bind(_this)()
    return {
      prodMenus,
      productName: process.env.VUE_APP_PROJECT_NAME,
      menuId
    }
  }
})
</script>
<style lang="stylus" scoped>
.dev-layout
  height 100%
  .dev_header
    text-align right
    font-size 14px
    color #fff
    display flex
    justify-content space-between
    align-items center
    .dev_setting
      .icon
        cursor pointer
        margin-right 15px
        &:hover
          color #eb603a
  .dev_content
    height calc(100% - 60px)
</style>
