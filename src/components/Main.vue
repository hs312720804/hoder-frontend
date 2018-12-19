<template>
    <el-container class="layout">
        <div>
            <div class="logo">
                <div
                    class="logo__img"
                >
                    {{ isCollapseMenu ? 'SP' : '策略平台'}}
                </div>
            </div>
            <Menu class="main_menu"
                :default-active="$route.name" 
                :items="menu || defaultMenu" 
                :isCollapse="isCollapseMenu" 
            >
            </Menu>
        </div>
        <el-container direction="vertical">
            <el-header 
                class="header"
            >
                <el-button
                    class="collpase-btn"
                    type="text"
                    :icon="isCollapseMenu? 'el-icon-cc-indent' : 'el-icon-cc-outdent'"
                    @click="toggleMenu"
                >
                </el-button>
                <Breadcrumb 
                    class="breadcrumb" 
                    :items="breadcrumb"
                />
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
             <TagNav ref="tag" :init-tags="initTags" />
            <el-main>
                <keep-alive>
                    <router-view v-if="isKeepAlive" />
                </keep-alive>
                <router-view v-if="!isKeepAlive" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { Breadcrumb, Menu, TagNav } from 'admin-toolkit'
export default {
    components: {
        Menu,
        Breadcrumb,
        TagNav
    },
    props: ['menu'],
    data() {
        return {
            breadcrumb: [],
            isCollapseMenu: false,
        }
    },
    computed: {
        isKeepAlive() {
            const meta = this.$route.meta
            return meta && meta.isCache !== false
        },
        defaultMenu() {
            const mainRoute = this.$router.options.routes.find((item) => {
                return item.path === '/'
            })
            function gen({name, meta = {}, children}) {
                if (!meta.hideInMenu) {
                    const currentMenuItem = {
                        title: meta.title,
                        icon: meta.icon,
                        route: name,
                    }
                    if (children) {
                        currentMenuItem.children = children.reduce((result, item) => {
                            const menuItem = gen(item)
                            if (menuItem) {
                                result.push(menuItem)
                            }
                            return result
                        } , [])
                    }
                    return currentMenuItem
                }
            }
            const items = gen(mainRoute).children 
            return items

        },
         initTags() {
            return this.$appState.$get('tags') || []
        }
    },
    methods: {
        handleDropdownCommand(command) {
            if (command === 'logout') {
                this.$logout().then(() => {
                    this.$router.push({name: 'login'})
                })
            }
        },
        toggleMenu() {
            const isCollapseMenu = !this.isCollapseMenu
            this.$appState.$set('isCollapseMenu', isCollapseMenu)
            this.isCollapseMenu = isCollapseMenu
        },
         saveTags() {
            const tags = this.$refs.tag.tags
            this.$appState.$set('tags', tags)
        }
    },
    created() {
        this.isCollapseMenu = !!this.$appState.$get('isCollapseMenu')
        this.$bus.$on('breadcrumb-change', (breadcrumb) => {
            this.breadcrumb = breadcrumb
        })
    },
     mounted() {
        window.addEventListener('beforeunload', this.saveTags)
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.saveTags)
    }
}
</script>

<style lang="stylus" scoped>

.header
    display flex
    align-items center
    padding 10px
    border-left none
    background-color #092035
.logo
    text-align center
    height 60px
    line-height 60px
    font-size 28px
    background-color #092035
    border-right 1px solid #092035
    border-bottom 1px solid #092035
.logo__img
    color #9dc2e8
.collpase-btn
    &,
    &:hover,
    &:focus
        color #606266
.breadcrumb 
    margin-left 10px
.user-info
    margin-left auto
.menu 
    min-height 100vh
    background-color #092035
.menu:not(.el-menu--collapse)
    width 220px
.main_menu
   border-right none
   color red
   >>> .el-menu
         background #17090930 
   >>> span 
         color #c7bfbf
   >>> .el-menu-item:hover,>>>.el-menu-item:focus
        background transparent
   >>> .el-menu-item span:hover,>>>.el-menu-item span:focus
         color white
   >>> .el-menu-item.is-active span
          color #409EFF
   >>> .el-submenu__title:hover
         background transparent
         color hsla(0,0%,100%,.9)

</style>