// 路由钩子
export default (router, store) => {
  router.beforeEach((to, from, next) => {
    console.log('router beforeEach')
    next()
  })

  router.afterEach(to => {
    console.log('router afterEach')
  })
}
