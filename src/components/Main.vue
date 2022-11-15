<template>
  <el-container class="layout">
    <div class="leftMenu">
      <div class="logo">
        <div class="logo__img" @click="handleLogoClick">

          <!-- {{ isCollapseMenu ? 'SP' : '策略平台'}} -->
          <!-- <i class="el-icon-cc-celve2"></i>
          <span v-show="!isCollapseMenu">极光引擎</span> -->

          <!-- <image src="../assets/img/bg1.jpg"/> -->
          <span class="logo-img" :class="{'logo-img-collapse' : isCollapseMenu}"></span>
          <span v-show="!isCollapseMenu" class="logo-text-img"></span>
        </div>

        <div v-if="isCollapseMenu" style="color: #fff; font-size: 15px; font-weight: 600">
          <div>极光</div>
          <div>引擎</div>
          <div class="version">{{ $appState.user.version.split(':')[1] }}</div>
        </div>

        <div v-else class="version">{{ $appState.user.version }}</div>
      </div>
      <el-menu
        :default-active="activeRouteName"
        class="main_menu menu"
        :collapse="isCollapseMenu">
        <template v-for="(item, index) in $appState.menus">
          <el-menu-item
                  v-if="item.child.length === 0"
                  :index="routerMap[item.url]"
                  :key="routerMap[item.url]+'_'+index"
                  @click.native="getRouter(item.url)"
                  class="no-child-menu"
          >
            <i v-if="item.icons" :class="item.icons"></i>
            <span>{{item.name}}</span>
          </el-menu-item>
          <el-submenu
                  v-else
                  :key="index"
                  :index="index+''"
          >
            <template slot="title">
              <i v-if="item.icons" :class="item.icons"></i>
              <span>{{item.name}}</span>
            </template>
            <template v-for="(child, idx) in item.child">
              <el-menu-item
                      v-if="( !child.child.length > 0 ) && routerMap[child.url] !== undefined"
                      :key="child.id"
                      :index="routerMap[child.url]"
                      @click.native="getRouter(child.url)"
              >
                <i v-if="child.icons" :class="child.icons"></i>
                <span slot="title">{{child.name}}</span>
              </el-menu-item>
              <el-submenu v-else :key="idx" :index="index+'-'+idx">
                <template slot="title">
                  <i v-if="child.icons" :class="child.icons"></i>
                  <span>{{child.name}}</span>
                </template>
                <template v-for="(c) in child.child">
                  <el-menu-item :key="c.id" :index="routerMap[c.url]" @click.native="getRouter(c.url)">
                    <i v-if="c.icons" :class="c.icons"></i>
                    <span slot="title">{{c.name}}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <el-container direction="vertical">
      <el-header class="header">
        <el-button
          class="collpase-btn"
          type="text"
          :icon="isCollapseMenu? 'el-icon-cc-indent' : 'el-icon-cc-outdent'"
          @click="toggleMenu"
        ></el-button>
        <c-breadcrumb class="breadcrumb" :items="breadcrumb"/>
        <div class="user-info">
          <!-- <el-button type="text" @click="handelGo('http://192.168.2.127:8888/index')">数据部应用平台</el-button> -->
          <i class="el-icon-question" style="color: #409EFF; font-size: 18px; margin-right: 5px;"></i>
          <el-button
            type="text"
            @click="handelGo('http://wiki.cc0808.com/pages/viewpage.action?pageId=49470290')"
            style="font-size: 16px;font-weight: 600;"
          >
            使用文档
          </el-button>
          <el-dropdown trigger="hover">
            <el-badge :value="unReadMessage" class="item">
              <i class="el-icon-bell"></i>
            </el-badge>
            <el-dropdown-menu slot="dropdown" class="notice-dropdown">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="升级通知" name="first">
                  <div v-for="updateItem in updateMessage" :key="updateItem.noticeId" class="tab-content">
                    <div
                      :class="['notice-title', updateItem.noticeStatus === 0 ? 'red-dot-title': '']"
                      @click="handleReadMessage(updateItem.noticeId)"
                    >{{updateItem.noticeTitle}}</div>
                    <div class="notice-time">{{updateItem.pushTime}}</div>
                  </div>
                  <div class="see-more" v-if="showMoreUpdate" @click="handleSeeAllMessage">查看全部</div>
                </el-tab-pane>
                <el-tab-pane label="系统通知" name="second">
                  <div v-for="systemItem in systemMessage" :key="systemItem.noticeId" class="tab-content">
                    <div
                      :class="['notice-title',systemItem.noticeStatus === 0 ? 'red-dot-title': '']"
                      @click="handleReadMessage(systemItem.noticeId)"
                    >{{systemItem.noticeTitle}}</div>
                    <div class="notice-time">{{systemItem.pushTime}}</div>
                  </div>
                  <div class="see-more" v-if="showMoreSystem" @click="handleSeeAllMessage">查看全部</div>
                </el-tab-pane>
              </el-tabs>
              <!--<el-dropdown-item class="clearfix">-->
                <!--<el-badge is-dot class="item">数据查询</el-badge>-->
              <!--</el-dropdown-item>-->
              <!--<el-dropdown-item class="clearfix">-->
                <!--<el-badge is-dot class="item">数据查询1</el-badge>-->
              <!--</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown :hide-on-click="false" @command="handleDropdownCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-cc-user"></i>
                 {{ $appState.user.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <TagNav ref="tag" :init-tags="initTags" @setCurrentTags="setCurrentTags" class="tagNav"/>

      <el-main>
        <keep-alive :exclude="noCacheMenu">
          <router-view v-if="isKeepAlive && isCache"/>
        </keep-alive>
        <router-view v-if="!(isKeepAlive && isCache)" :key="$route.fullpath"/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import TagNav from './TagNav.vue'
export default {
  components: {
    TagNav
  },
  props: ['menu'],
  data () {
    return {
      activeRouteName: '',
      activeIndex: '',
      breadcrumb: [],
      isCollapseMenu: false,
      routerMap: {
        'label/index': 'labelSquare',
        // "label/index": "tag",
        'launchHelp/index': 'validate',
        'launchCrowd/index': 'crowd',
        'launchPolicy/index': 'strategy',
        '/policy/index': 'strategyList',
        '/manage/menu/index': 'menuSetting',
        '/manage/email/index': 'emailNotice',
        '/manage/user/index': 'personManage',
        '/manage/office/index': 'organManage',
        '/manage/role/index': 'roleManage',
        '/manage/user/personalInformation': 'personalInformation',
        '/manage/user/modifyPassword': 'password',
        '/manage/loginLog/index': 'loginLog',
        '/manage/operateLog/index': 'operateLog',
        '/crowdDataPos/index': 'dataManage',
        '/tagDict/index': 'tagDictDatabase',
        '/total/index': 'statisticsHomePage',
        '/total/key': 'keyIndicatorTrends',
        '/indexTotal/index': 'OverallDeliveryStatistics',
        '/crowTotal/index': 'OverallCrowdStatistics',
        '/tagStructure/index': 'tabStructure',
        '/crowdCategory/index': 'CurrentPopulationClassification',
        '/crowdPortrayal/index': 'crowdPortrayal',
        '/biIndex/index': 'indexBI',
        '/ottIndex/index': 'OTTBigscreenIndex',
        '/thirdDMP/index': 'thirdPartyDMP',
        '/monitor/index': 'DeliveryMonitor',
        '/portrayal/index': 'DeliveryAfterPeopleDraw',
        '/dataAnalyze/index': 'DeliveryDataAnalyse',
        '/thirdInterfaceConf/index': 'thirdInterface',
        '/devTool/clearCache': 'clearCache',
        '/webApiServers/index': 'ipManage',
        '/multiVersionCrowd/index': 'multiVersionCrowd',
        '/manager/biList': 'launchSettings',
        '/manager/notice/index': 'notice',
        '/launchAdmin': 'launchTabList',
        '/launchAnalysis': 'launchAnalysis',
        '/launchAnalysisTable': 'launchAnalysisTable',
        '/anomaly/index': 'anomalyEcharts',
        '/crowdCirculationTrack': 'crowdCirculationTrack',
        '/myPolicy/index': 'myPolicy',
        '/groupImageInsight/index': 'groupImageInsight',
        '/userTagsSearch/index': 'userTagsSearch',
        '/hitSearch/index': 'hitSearch',
        '/oneTouchDrop/index': 'oneTouchDrop',
        '/specialTag/index': 'specialTag',
        '/launchHelper/status': 'launchStatus',
        '/launchHelper/resendCommand': 'resendCommand',
        '/hitQuery': 'hitQuery',
        '/storyLine': 'storyLine',
        '/operationHelper': 'operationHelper'
      },
      activeName: 'first',
      updateMessage: [],
      systemMessage: [],
      messageTypeEnum: {
        first: 1,
        second: 2
      },
      unReadMessage: undefined,
      showMoreUpdate: false,
      showMoreSystem: false,
      noCacheMenu: [],
      currentTags: [], // 现在已打开的菜单
      isCache: true // 打开的菜单页面可以缓存，未打开的菜单页面不能缓存
    }
  },
  watch: {
    $route: 'handleRouteChange'
  },
  computed: {
    isKeepAlive () {
      // 根据路由信息判断是否需要缓存
      const meta = this.$route.meta
      return meta && meta.isCache !== false
    },
    // defaultMenu() {
    //   const mainRoute = this.$router.options.routes.find(item => {
    //     return item.path === "/";
    //   });
    //   function gen({ name, meta = {}, children }) {
    //     if (!meta.hideInMenu) {
    //       const currentMenuItem = {
    //         title: meta.title,
    //         icon: meta.icon,
    //         route: name
    //       };
    //       if (children) {
    //         currentMenuItem.children = children.reduce((result, item) => {
    //           const menuItem = gen(item);
    //           if (menuItem) {
    //             result.push(menuItem);
    //           }
    //           return result;
    //         }, []);
    //       }
    //       return currentMenuItem;
    //     }
    //   }
    //   const items = gen(mainRoute).children;
    //   return items;
    // },
    initTags () {
      const tagsInfo = this.$appState.$get('tags')
      if (tagsInfo && tagsInfo.userName === this.$appState.user.name) {
        return tagsInfo.tags
      } else {
        return []
      }
      // return this.$appState.$get("tags") || [];
    }
  },
  methods: {
    handelGo (url) {
      // const url = 'http://wiki.skyoss.com/pages/viewpage.action?pageId=49470290'
      window.open(url, '_blank')
    },

    setCurrentTags (val) {
      this.currentTags = val
    },

    handleRouteChange () {
      if (this.$route.name === 'oneTouchDrop') {
        this.activeRouteName = 'strategyList'
      } else if (this.$route.name === 'specialTag') {
        this.activeRouteName = 'labelSquare'
      } else {
        this.activeRouteName = this.$route.name
      }

      // 打开的菜单页面可以缓存，未打开的菜单页面不能缓存
      const meta = this.$route.meta

      const obj = this.currentTags.find(item => {
        return item.meta.tagId === meta.tagId
      })

      if (obj) { // 菜单在已打开的菜单中存在，则缓存
        this.isCache = true // 缓存
      } else {
        this.isCache = false // 不缓存
      }
    },
    getRouter (url) {
      const name = this.routerMap[url] + 'AA'
      this.noCacheMenu.push(name)
      this.$router.push({ name: this.routerMap[url] })
      this.$nextTick(() => {
        this.noCacheMenu = []
      })
    },
    handleDropdownCommand (command) {
      if (command === 'logout') {
        this.$logout().then(() => {
          this.$router.push({ name: 'login' })
        })
      }
    },
    toggleMenu () {
      const isCollapseMenu = !this.isCollapseMenu
      this.$appState.$set('isCollapseMenu', isCollapseMenu)
      this.isCollapseMenu = isCollapseMenu
    },
    saveTags () {
      const tags = { tags: this.$refs.tag.tags, userName: this.$appState.user.name }
      this.$appState.$set('tags', tags)
    },
    setMetaTitle () {
      const routes = this.$router.options.routes
      const findRouteByName = (name, route) => {
        if (Array.isArray(route)) {
          let length = route.length
          while (--length >= 0) {
            const found = findRouteByName(name, route[length])
            if (found) {
              return found
            }
          }
        } else {
          if (route.name === name) {
            return route
          } else if (route.children) {
            return findRouteByName(name, route.children)
          }
        }
      }
      const menus = this.$appState.menus
      const findMenuByUrl = (url, menu) => {
        if (Array.isArray(menu)) {
          let length = menu.length
          while (--length >= 0) {
            const found = findMenuByUrl(url, menu[length])
            if (found) {
              return found
            }
          }
        } else {
          if (menu.url === url) {
            return menu
          } else if (menu.child) {
            return findMenuByUrl(url, menu.child)
          }
        }
      }
      const routerMap = this.routerMap
      Object.keys(routerMap).forEach((url) => {
        const menu = findMenuByUrl(url, menus)
        const route = findRouteByName(routerMap[url], routes)
        if (route && route.meta && menu) {
          route.meta.title = menu.name
        }
      })
    },
    handleLogoClick () {
      this.$router.push({
        path: '/statisticsHomePage'
      })
    },
    handleClick (tab) {
      this.getNoticeMessages(this.messageTypeEnum[tab.name])
    },
    getNoticeMessages (type) {
      const noticeType = type
      this.$service.getNoticeHeaderList({ noticeType }).then((data) => {
        const interfaceData = data['消息列表']
        const statusData = data['消息状态']
        this.unReadMessage = data['未读数量'] > 0 ? data['未读数量'] : undefined
        interfaceData.forEach((item, index) => {
          item.noticeStatus = statusData[index]
        })
        const dataList = interfaceData
        if (type === 1) {
          if (dataList.length > 5) {
            this.showMoreUpdate = true
            // 只取前五条
            this.updateMessage = dataList.slice(0, 5)
          } else {
            this.updateMessage = dataList
          }
        } else {
          if (dataList.length > 5) {
            this.showMoreSystem = true
            this.systemMessage = dataList.slice(0, 5)
          } else {
            this.systemMessage = dataList
          }
        }
      })
    },
    handleSeeAllMessage () {
      this.$router.push({ name: 'notice' })
    },
    handleReadMessage (noticeId) {
      this.$router.push({
        name: 'notice',
        query: { noticeId: noticeId, mode: 'read' }
      })
    },
    scrollMenuIntoView () {
      setTimeout(() => {
        const $activeSubMenu = document.querySelector('.el-submenu.is-active')
        const $activeMenu = document.querySelector('.el-menu-item.is-active')
        if ($activeMenu) {
          $activeMenu.scrollIntoViewIfNeeded()
        }
        if ($activeSubMenu) {
          $activeSubMenu.scrollIntoViewIfNeeded()
        }
      }, 1000)
    }
    // handleDropDownChange() {
    //     this.getNoticeMessages(this.messageTypeEnum[this.activeName])
    // }
  },
  created () {
    this.isCollapseMenu = !!this.$appState.$get('isCollapseMenu')
    this.$bus.$on('breadcrumb-change', breadcrumb => {
      this.breadcrumb = breadcrumb
      this.scrollMenuIntoView()
    })
    this.setMetaTitle()
    this.getNoticeMessages(this.messageTypeEnum[this.activeName])
    this.$root.$on('refresh-notifications', () => {
      this.getNoticeMessages(this.messageTypeEnum[this.activeName])
    })
  },
  mounted () {
    this.activeRouteName = this.$route.name
    window.addEventListener('beforeunload', this.saveTags)
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.saveTags)
  }
}
</script>
<style lang="stylus" scoped>
  .header
    display: flex
    align-items: center
    padding: 10px
    border-left: none
    background-color white
  .logo
    text-align: center
    font-size: 28px
    margin 15px
    background-color: #092035
    border-right: 1px solid #092035
    border-bottom: 1px solid #092035
    cursor pointer
  .logo__img
    color: #409eff
    font-size 22px
    font-weight bolder
  .logo__img i
    font-size 28px
    font-weight bolder
    margin-right 5px
  .collpase-btn
    color: #191414
  .collpase-btn i
    color: #191414
  .collpase-btn
    &, &:hover, &:focus
      color: #191414
  .breadcrumb
    margin-left: 10px
  .user-info
    margin-left: auto
  .menu
    background-color: #092035
  .menu:not(.el-menu--collapse)
    width: 220px
  .leftMenu
    height 100vh
    display flex
    flex-direction column
    background-color #092035
    // align-items: center
  .leftMenu >>> .menu
    flex-grow 1
    overflow-y auto
  .tagNav
    overflow: visible
  .layout
    height: 100%
  .breadcrumb >>> .el-breadcrumb__inner
    color: #191414
  .user-info
    cursor: pointer
  .main_menu
    border-right: none
    overflow: auto
    >>> .el-menu
      background: #17090930
    >>> span
      color: #c7bfbf
    >>> .el-menu-item:hover, >>>.el-menu-item:focus
      background: transparent
    >>> .el-menu-item span:hover, >>>.el-menu-item span:focus
      color: white
    >>> .el-menu-item.is-active
        border-left 2px solid
        span
            color: #409EFF
    >>> .el-submenu__title:hover
      background: transparent
      color: hsla(0, 0%, 100%, 0.9)
  .tagNav
    padding-right 50px
    >>> .tag-nav__right
      right 25px
    >>> .tag-nav__back
      display none
  .user-info >>> .el-dropdown
    color #191414
    margin-left 30px
  .el-icon-cc-iconset0225,.el-icon-cc-menu1,.el-icon-cc-team,.el-icon-cc-jiaose,.el-icon-cc-xitong
    font-size 21px
  .version
    color #ccc
    font-size 14px
    margin-top: 5px;
  .notice-title
      width 300px
      margin 5px 10px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      cursor pointer
  .notice-time
    color #999
    font-size 14px
    margin 0 10px
  .notice-dropdown >>> .el-tabs__item
    width 160px
    text-align center
  .notice-dropdown >>> .red-dot-title
    position relative
    padding-left 12px
    &:before
      position absolute
      width 8px
      height 8px
      border-radius 10px
      content ""
      background-color red
      left 0
      top 7px
  .see-more
      text-align center
      color #999
      font-size 14px
      margin 15px 0
      cursor pointer
  .no-child-menu
      color #fff
  .no-child-menu.is-active
      color: #409EFF
.logo-img
  background url('../assets/img/logo.png');
  background-size cover
  width 50px
  height 50px
  display inline-block
  vertical-align middle
  margin-left: -7px;
.logo-img-collapse
  width 34px
  height 40px
  margin-left: 0

.logo-text-img
  background url('../assets/img/logo_text.png');
  background-size cover
  width 95px
  height 23px
  display inline-block
  vertical-align middle
</style>
