import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

function beforeEach(to, from, next) {
    const app = this.app
    app.$isLoggedIn().then(() => {
        next(to.name !== 'login'
            ? undefined
            : {name: 'home'}
        )
    }).catch(() => {
        next(to.name === 'login'
            ? undefined
            : {name: 'login', query: {redirect: to.fullPath}}
        )
    })
}

function afterEach(to) {
    const app = this.app
    const breadcrumb = to.matched.slice(1).map(({name, meta}) => {
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

const router = new Router ({ routes })
router.beforeEach(beforeEach.bind(router))
router.afterEach(afterEach.bind(router))


export default router