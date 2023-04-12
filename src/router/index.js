import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { Notification } from 'element-ui'

Vue.use(Router)
function beforeEach (to, from, next) {
  // const filterRoutes = ['/login']
  // if (filterRoutes.indexOf(to.path) !== -1) { // 不需要登录验证
  //   next()
  // } else {
  console.log('from==========>', from)
  console.log('to==========>', to)

  const app = this.app
  app.$isLoggedIn().then(() => {
    debugger
    // next(to.name !== 'login'
    //   ? undefined
    //   : { path: '/' }
    // )
    if (to.name === 'login') {
      next({ path: '/' })
    } else {
      next()
    }
  }).catch(() => {
    debugger
    // catch 中 从别的页面跳转至登录页，被认为是 token 失效
    if (from.path !== '/' && from.name !== 'login' && to.name === 'login' && !to.params.logout) {
      // 提示权限过期
      Notification.error({
        title: '提示',
        message: '登录超时，请重新登录'
        // duration: 0
      })
    }
    if (to.name === 'login') {
      next()
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  })
  // }
}
function afterEach (to) {
  const app = this.app
  const breadcrumb = to.matched.slice(1).map(({ name, meta }) => {
    return {
      name: meta.title,
      to: name
        ? { name }
        : undefined
    }
  })
  app.$nextTick(() => {
    app.$bus.$emit('breadcrumb-change', breadcrumb)
  })
}

const router = new Router({ routes })
// const router = new Router({ routes, base: '/', mode: 'history' })

router.beforeEach(beforeEach.bind(router))
router.afterEach(afterEach.bind(router))

export default router
