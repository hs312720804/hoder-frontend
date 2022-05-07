<template>
    <div :class="theme">
        <el-button class="tag-nav__btn tag-nav__left" icon="el-icon-arrow-left" @click="handleScroll('left')"></el-button>
        <el-button class="tag-nav__btn tag-nav__right" icon="el-icon-arrow-right" @click="handleScroll('right')"></el-button>
        <el-dropdown split-button class="tag-nav__btn tag-nav__more">
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCloseOther">关闭其它</el-dropdown-item>
                <el-dropdown-item @click.native="handleCloseAll">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <div
                ref="viewPort"
                class="tag-nav__view-port">
            <ul
                    class="tag-nav__list"
                    ref="tagList"
                    :style="{'margin-left': -cursor + 'px'}"
            >
                <li
                        v-for="(item, index) in tags"
                        :class="{
            'tag-nav__item': true,
            'tag-nav__item--active': item.meta.tagId === $route.meta.tagId
          }"
                        :key="index"
                        :title="getTitle(item)"
                        @click="handleNavigate(item)"
                >
                    <span class="tag-nav__dot"></span>
                    <span class="tag-nav__text">{{ getTitle(item) }}</span>
                    <i v-if="item.isCloseable!==false" class="el-icon-close tag-nav__close-item" @click.stop="handleClose(item)"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

class TagHistory {
  constructor ({ router, stack, cursor }) {
    this.cursor = cursor !== undefined ? cursor : -1
    this.stack = stack || []
    this.router = router
    this.isGoing = false
    this.isNavigating = false
  }
  clear () {
    this.cursor = -1
    this.stack = []
  }
  push (route) {
    if (!this.isGoing && !this.isNavigating) {
      let { cursor, stack } = this
      if (cursor !== stack.length - 1) {
        // 如果不是在末端
        // 截取前面的
        stack = stack.slice(0, cursor + 1)
      }
      // 压到最新
      stack.push(route)
      this.stack = stack
      this.cursor = ++cursor
    } else {
      this.isGoing = false
      this.isNavigating = false
    }
  }
  active () {
    const path = this.stack[this.cursor].fullPath
    this.isNavigating = true
    this.router.push({ path }, undefined, () => {
      this.isNavigating = false
    })
  }
  go (position) {
    const { cursor, stack, router } = this
    const nextCursor = cursor + position
    const nextRoute = stack[nextCursor]
    if (nextRoute) {
      // 前后移动的时候不需要修改栈
      this.isGoing = true
      router.push({ path: nextRoute.fullPath }, () => {
        this.cursor = nextCursor
      }, () => {
        this.isGoing = false
      })
    }
  }
}

export default {
  data () {
    return {
      tags: [],
      cursor: 0,
      tagHistories: {}
    }
  },
  computed: {
    historyCursor () {
      const route = this.$route
      let cursor = 0
      if (route.meta && route.meta.tagId) {
        const history = this.tagHistories[route.meta.tagId]
        if (history) {
          cursor = history.cursor
        }
      }
      return cursor
    }
  },
  props: {
    defaultPath: {
      type: String,
      default: '/statisticsHomePage'
    },
    initTags: {
      type: Array,
      default () {
        return []
      }
    },
    titles: {
      type: Object,
      default () {
        return {}
      }
    },
    theme: {
      type: String,
      default () {
        return 'tag-nav'
      }
    }
  },
  watch: {
    $route: 'handleRouteChange',
    tags: {
      handler (val) {
        this.$emit('setCurrentTags', val)
      }
    }
  },
  methods: {
    getTitle ({ meta, name }) {
      return this.titles[name] || (meta && meta.title) || name
    },
    handleNavigate (route) {
      this.$router.push({ path: route.fullPath })
      this.$emit('navigate', route)
    },
    handleClose (route) {
      const currentRoute = this.$route
      const tags = this.tags
      const index = tags.indexOf(route)
      this.tagHistories[route.meta.tagId] = undefined
      tags.splice(index, 1)
      const length = tags.length
      const defaultPath = this.defaultPath
      if (length === 0) {
        this.$router.push(defaultPath)
      } else if (currentRoute.name === route.name) {
        // 把后面一个激活
        // 如果后面一个不存在，
        // 如果当前不是第一个,则激活前一个
        const activeRoute = index < length
          ? tags[index]
          : index > 0
            ? tags[index - 1]
            : undefined
        const path = activeRoute ? activeRoute.fullPath : defaultPath
        this.$router.push(path)
      }
    },
    handleCloseOther () {
      const currentRoute = this.$route
      this.tags = this.tags.filter((item) => {
        return item.name === currentRoute.name || item.isCloseable === false
      })
    },
    handleCloseAll () {
      this.tags = this.tags.filter((item) => {
        return item.isCloseable === false
      })
      this.$router.push(this.defaultPath)
    },
    handleScroll (side) {
      const { viewPort, tagList } = this.$refs
      const listWidth = tagList.scrollWidth
      const value = (side === 'left' ? (-1) : 1) * Math.max(200, (listWidth / 4))
      const navViewPortWidth = viewPort.clientWidth
      const maxValue = listWidth - navViewPortWidth
      const minValue = 0
      this.cursor = Math.max(minValue, Math.min(this.cursor + value, maxValue))
    },

    handleRouteChange (route) {
      this.addTag(route)
      this.$nextTick(this.scrollIntoView)
    },

    handleForward () {
      const history = this.tagHistories[this.$route.meta.tagId]
      if (history) {
        history.go(-1)
      }
    },

    handleBack () {
      const history = this.tagHistories[this.$route.meta.tagId]
      if (history) {
        history.go(-1)
      }
    },

    addTag (route) {
      const meta = route.meta
      if (meta && meta.tagId) {
        const tagId = meta.tagId
        const item = this.tags.find((item) => item.meta.tagId === tagId)
        const tagItem = {
          name: route.name,
          meta,
          fullPath: route.fullPath,
          isCloseable: meta.hasOwnProperty('isCloseable') ? meta.isCloseable : true
        }
        if (!item) {
          this.tags.push(tagItem)
        } else {
          Object.assign(item, tagItem)
        }
      }
    },
    init () {
      // const router = this.$router
      this.tags = this.initTags
    },
    scrollIntoView () {
      const activeItem = this.$el.querySelector('.tag-nav__item--active')
      if (activeItem) {
        const viewPort = this.$refs.viewPort
        const tagList = this.$refs.tagList
        const viewPortWidth = viewPort.clientWidth
        const tagListScrollWidth = tagList.scrollWidth
        const activeItemWidth = activeItem.clientWidth
        const cursor = this.cursor
        const position = activeItem.offsetLeft
        if (position < cursor) {
          this.cursor = position
        } else if (position + activeItemWidth - cursor > viewPortWidth) {
          this.cursor = Math.min(tagListScrollWidth - viewPortWidth, position - viewPortWidth / 2)
        }
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    if (this.$route) {
      this.addTag(this.$route)
    }
    this.$nextTick(this.scrollIntoView)
  }
}
</script>

<style lang="stylus" scoped>
    .tag-nav
        position relative
        padding 0 55px 0 25px
        background #f0f0f0
        overflow hidden
        font-size 12px
        min-height 42px
        .tag-nav__view-port
            overflow hidden

        .tag-nav__list
            position relative
            height 40px
            padding 0
            margin 0
            border-bottom 1px solid #f0f0f0
            border-top 1px solid #f0f0f0
            white-space nowrap
            user-select none
            transition margin-left .2s ease

        .tag-nav__item
            position relative
            display inline-block
            height 32px
            padding 0 30px
            margin 4px 0 0 5px
            background #fff
            cursor pointer

        .tag-nav__dot
            position absolute
            top 50%
            left 10px
            height 12px
            width 12px
            margin-top -6px
            border-radius 6px
            background #f0f0f0
            transition background .2s ease

        .tag-nav__close-item
            position absolute
            top 50%
            right 10px
            margin-top -6px
            opacity 0.5
            &:hover
                opacity 1

        .tag-nav__text
            line-height 32px

        .tag-nav__item--active
            .tag-nav__dot
                background #2d8cf0

        .tag-nav__btn
            position absolute
            height 100%
            z-index 1
            >>> .el-button-group
            >>> .el-button
                height 100%

        .tag-nav__left
            left 0
        .tag-nav__right
            right 28px
        .tag-nav__left,
        .tag-nav__right
            padding 12px 5px
        .tag-nav__back
            right 28px
        .tag-nav__more
            right 0
            >>> .el-button:first-child
                display none
            >>> .el-dropdown__caret-button::before
                background #eee
    .tag-nav-two
        position relative
        padding 0 52px 0 23px
        background #f0f0f0
        overflow hidden
        font-size 12px
        min-height 42px
        border:1px solid #e6e6e6
        .tag-nav__view-port
            overflow hidden
            background #fff
        .tag-nav__list
            position relative
            height 42px
            padding 0
            margin 0
            white-space nowrap
            user-select none
            transition margin-left .2s ease

        .tag-nav__item
            position relative
            display inline-block
            height 42px
            padding 0 30px
            margin 0
            background #fff
            cursor pointer

        .tag-nav__dot
            position absolute
            top 50%
            left 10px
            height 12px
            width 12px
            margin-top -6px
            border-radius 6px
            background #f0f0f0
            transition background .2s ease

        .tag-nav__close-item
            position absolute
            top 50%
            right 10px
            margin-top -6px
            opacity 0.5
            &:hover
                opacity 1

        .tag-nav__text
            line-height 42px

        .tag-nav__item--active
            .tag-nav__dot
                background #2d8cf0
        .tag-nav__item:hover .tag-nav__dot
            background rgb(254, 183, 154)

        .tag-nav__btn
            position absolute
            height 100%
            z-index 1
            >>> .el-button-group
            >>> .el-button
                height 100%
                border none
                border-radius 0
        .tag-nav__btn,
        .tag-nav__btn button
            border-radius 0
            border none
        .tag-nav__left
            left 0
            border-right 1px solid #f0f0f0
        .tag-nav__right
            right 28px
            border-left 1px solid #f0f0f0
        .tag-nav__left,
        .tag-nav__right
            padding 11px 5px
        .tag-nav__back
            right 28px
        .tag-nav__more
            right 0
            >>> .el-button:first-child
                display none
            >>> .el-dropdown__caret-button::before
                background #eee
    .gray-tab
        position relative
        background #e6e6e6
        font-size 12px
        min-height 42px
        padding 0 55px 0 24px
        .tag-nav__view-port
            overflow hidden
            height 42px
        .tag-nav__list
            position relative
            height 40px
            padding 0
            margin 0
            // border-bottom 1px solid #f0f0f0
            // border-top 1px solid #f0f0f0
            white-space nowrap
            user-select none
            transition margin-left .2s ease
        .tag-nav__item
            position relative
            display inline-block
            height 38px
            padding 0 30px 0 18px
            margin 2px 0 0 2px
            background #fff
            cursor pointer
            transition background .2s ease
            &:hover
                background #f2f2f2
        .tag-nav__dot
            display none
        .tag-nav__close-item
            position absolute
            top 50%
            right 10px
            margin-top -6px
            opacity 0.5
            &:hover
                opacity 1
        .tag-nav__text
            line-height 38px
        .tag-nav__item--active
            background #f2f2f2
            height 40px
            .tag-nav__dot
                background #2d8cf0

        .tag-nav__btn
            position absolute
            height 100%
            z-index 1
            border-radius 0
            >>> .el-button-group
            >>> .el-button
                height 100%
                border-radius 0
        .tag-nav__left
            left 0
            border 2px solid #e6e6e6
        .tag-nav__right
            right 28px
            border 2px solid #e6e6e6
        .tag-nav__left,
        .tag-nav__right
            padding 12px 5px
        .tag-nav__back
            right 28px
        .tag-nav__more
            right 0
            border-radius 0
            >>> .el-button:first-child
                display none
            >>> .el-dropdown__caret-button
                border 2px solid #e6e6e6
            >>> .el-dropdown__caret-button::before
                background #eee
                visibility hidden
    .white-tab
        position relative
        background #e6e6e6
        font-size 12px
        min-height 42px
        padding 0 55px 0 24px
        .tag-nav__view-port
            overflow hidden
            height 42px
        .tag-nav__list
            position relative
            height 40px
            padding 0
            margin 0
            // border-bottom 1px solid #f0f0f0
            // border-top 1px solid #f0f0f0
            white-space nowrap
            user-select none
            transition margin-left .2s ease
        .tag-nav__item
            position relative
            display inline-block
            height 38px
            padding 0 30px 0 18px
            margin 2px 0 0 2px
            background #f2f2f2
            cursor pointer
            transition background .2s ease
            &:hover
                background #ffffff
        .tag-nav__dot
            display none
        .tag-nav__close-item
            position absolute
            top 50%
            right 10px
            margin-top -6px
            opacity 0.5
            &:hover
                opacity 1
        .tag-nav__text
            line-height 38px
        .tag-nav__item--active
            background #ffffff
            height 40px
        .tag-nav__btn
            position absolute
            height 100%
            z-index 1
            border-radius 0
            >>> .el-button-group
            >>> .el-button
                height 100%
                border-radius 0
        .tag-nav__left
            left 0
            border 2px solid #e6e6e6
        .tag-nav__right
            right 28px
            border 2px solid #e6e6e6
        .tag-nav__left,
        .tag-nav__right
            padding 12px 5px
        .tag-nav__back
            right 28px
        .tag-nav__more
            right 0
            border-radius 0
            >>> .el-button:first-child
                display none
            >>> .el-dropdown__caret-button
                border 2px solid #e6e6e6
            >>> .el-dropdown__caret-button::before
                background #eee
                visibility hidden
</style>
