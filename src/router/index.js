import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
Vue.use(Router)
function beforeEach (to, from, next) {
  const filterRoutes = ['/login']
  if (filterRoutes.indexOf(to.path) !== -1) { // 不需要登录验证
    next()
  } else {
    const app = this.app
    app.$isLoggedIn().then(() => {
      next(to.name !== 'login'
        ? undefined
        : { name: 'dashboard' }
      )
    }).catch(() => {
      debugger
      if (to.name === 'login') {
        next()
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } })
      }
    })
  }
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
