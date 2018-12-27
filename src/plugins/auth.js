import Vue from 'vue'
function getInitData(app) {
    return app.$service.getConstants({token:app.$service.service.state.token}).then((res) => {
      return res;
    })
}
Vue.prototype.$isLoggedIn = async function() {
    const $appState = this.$appState
    //memory
    if($appState.user) {
        return
    }
    // storage
    const user = $appState.$get('user')
    if (user) {
        // try login
        this.$service.service.state = user
        return getInitData(this).then((res) => {
            this.$appState.user = user
            this.$appState.permissions=res.permissions
            this.$appState.menus=res.menus;
        })
    }
    throw {}
}
Vue.prototype.$login = async function(data) {
    return this.$service.login(data).then((res) => {
        const user = {
            name: data.username,
            token: res.jwtToken,
            password: data.password
        }
        this.$service.service.state = user
        this.$appState.user = user
        this.$appState.$set('user', user)
        this.$appState.menus=res.menus;
        this.$appState.permissions=res.permissions
    })
}

Vue.prototype.$logout = async function() {
    this.$appState.user = undefined
    this.$appState.$remove('user')
    return
}