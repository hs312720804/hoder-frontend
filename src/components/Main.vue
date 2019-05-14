<template>
  <el-container class="layout">
    <div class="leftMenu">
      <div class="logo">
        <div class="logo__img">

          <!-- {{ isCollapseMenu ? 'SP' : '策略平台'}} -->
           <i class="el-icon-cc-celve2"></i>
          <span v-show="!isCollapseMenu">人群平台</span>
        </div>
        <div class="version">{{$appState.user.version}}</div>
      </div>
      <el-menu
        :default-active="$route.name"
        class="main_menu menu"
        :collapse="isCollapseMenu"
      >
        <template v-for="(item, index) in $appState.menus">
          <el-submenu v-if="item.child" :key="index" :index="index+''">
            <template slot="title">
              <i v-if="item.icons" :class="item.icons"></i>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="(child, idx) in item.child">
              <el-menu-item v-if="!child.child.length>0" :key="idx" :index="idx + ''" @click.native="getRouter(child.url)">
                <i v-if="child.icons" :class="child.icons"></i>
                <!-- {{routerMap[child.url]}} aa -->
                <span slot="title">{{ child.name }} </span>
              </el-menu-item>
              <el-submenu v-else :key="idx" :index="index+'-'+idx">
                <template slot="title">
                  <i v-if="child.icons" :class="child.icons"></i>
                  <span>{{ child.name }}</span>
                </template>
                <template v-for="(c,n) in child.child">
                       <el-menu-item :key="n" :index="routerMap[c.url]" @click.native="getRouter(c.url)">
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
        <Breadcrumb class="breadcrumb" :items="breadcrumb"/>
        <div class="user-info">
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
      <TagNav ref="tag" :init-tags="initTags" class="tagNav"/>
      <el-main>
        <keep-alive>
          <router-view v-if="isKeepAlive"/>
        </keep-alive>
        <router-view v-if="!isKeepAlive"/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { Breadcrumb, Menu, TagNav } from "admin-toolkit";
export default {
  components: {
    Menu,
    Breadcrumb,
    TagNav
  },
  props: ["menu"],
  data() {
    return {
      breadcrumb: [],
      isCollapseMenu: false,
      routerMap: {
          "label/index": "tag-group-read",
          "launchHelp/index": "validate",
          "launchCrowd/index": "crowd",
          "launchPolicy/index": "strategy",
          "/policy/index": "strategyList",
          "/manage/menu/index": "menuSetting",
          "/manage/email/index": "emailNotice",
          "/manage/user/index": "personManage",
          "/manage/office/index": "organManage",
          "/manage/role/index": "roleManage",
          "/manage/user/personalInformation": "personalInformation",
          "/manage/user/modifyPassword": "password",
          "/manage/loginLog/index": "loginLog",
          "/manage/operateLog/index": "operateLog",
          "/crowdDataPos/index": "dataManage",
          "/tagDict/index": "tagDictDatabase",
      }
    };
  },
  computed: {
    isKeepAlive() {
      const meta = this.$route.meta;
      return meta && meta.isCache !== false;
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
    initTags() {
      return this.$appState.$get("tags") || [];
    }
  },
  methods: {
    getRouter(url){
       this.$router.push({name:this.routerMap[url]});
    },
    handleDropdownCommand(command) {
      if (command === "logout") {
        this.$logout().then(() => {
          this.$router.push({ name: "login" });
        });
      }
    },
    toggleMenu() {
      const isCollapseMenu = !this.isCollapseMenu;
      this.$appState.$set("isCollapseMenu", isCollapseMenu);
      this.isCollapseMenu = isCollapseMenu;
    },
    saveTags() {
      const tags = this.$refs.tag.tags;
      this.$appState.$set("tags", tags);
    }
  },
  created() {
    this.isCollapseMenu = !!this.$appState.$get("isCollapseMenu");
    this.$bus.$on("breadcrumb-change", breadcrumb => {
      this.breadcrumb = breadcrumb;
    });
  },
  mounted() {
    window.addEventListener("beforeunload", this.saveTags);
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.saveTags);
  }
};
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
  >>> .el-menu-item.is-active span
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
.el-icon-cc-iconset0225,.el-icon-cc-menu1,.el-icon-cc-team,.el-icon-cc-jiaose,.el-icon-cc-xitong
  font-size 21px
.version
  color #ccc
  font-size 14px
</style>
