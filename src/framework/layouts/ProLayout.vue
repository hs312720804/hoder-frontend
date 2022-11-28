<!-- 勿动：当前组件只能在SAAS环境( window.__POWERED_BY_QIANKUN__ === true )下使用 -->
<template>
  <el-scrollbar class="c-scrollbar" wrap-style="overflow-x:hidden;">
    <div class="c-scrollbar--box">
      <keep-alive>
        <router-view v-if="mId" :menu-id="mId" :key="$route.path"></router-view>
      </keep-alive>
    </div>
  </el-scrollbar>
</template>
<script>
import { defineComponent, ref, watch, nextTick, onMounted, getCurrentInstance, provide } from 'vue'
import layoutSetup from 'cseed-frame/layouts/setup'

export default defineComponent({
  props: {
    menuId: {
      type: Number,
      default: undefined
    }
  },
  setup (props, ctx) {
    const _this = getCurrentInstance().proxy // ctx.root
    const mId = ref(props.menuId)

    provide('cseedFrameMenuId', mId)

    watch(() => _this.$route, () => {
      setMenuId()
    })

    function setMenuId () {
      const { meta: { tagId } } = _this.$mainState.router.currentRoute
      mId.value = tagId
    }

    // function getId (path) {
    //   return path && path.split('/').length > 0 ? path.split('/')[1] : undefined
    // }

    onMounted(() => {
      nextTick(() => {
        setMenuId()
        _this.$mainState.store.commit('SET_MIRCOLOADING', false)
      })
    })

    layoutSetup.bind(_this)()
    return {
      mId
    }
  }
})
</script>
