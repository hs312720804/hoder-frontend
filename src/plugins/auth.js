import Vue from 'vue'

function getInitData(app) {
    return app.$service.service.getConstants().then((constants) => {
        app.$appState.constants = constants
    })
}

Vue.prototype.$isLoggedIn = async function() {
    const $appState = this.$appState
    // memory
    if($appState.user) {
        return
    }
    // storage
    const user = $appState.$get('user')
    if (user) {
        // try login
        this.$service.service.state = user
        return getInitData(this).then(() => {
            this.$appState.user = user
        })
    }
    
    throw {}
}

Vue.prototype.$login = async function(data) {
    debugger
    return this.$service.login(data).then((res) => {
        const user = {
            name: data.userName,
            token: res.token
        }
        this.$service.service.state = user
        return getInitData(this).then(() => {
            this.$appState.user = user
            this.$appState.$set('user', user)
        })
    })
}

Vue.prototype.$logout = async function() {
    this.$appState.user = undefined
    this.$appState.$remove('user')
    return
}