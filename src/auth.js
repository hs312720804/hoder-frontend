import Vue from 'vue'
const storageName = 'activity'
Vue.prototype.$isLoggedIn = async function() {
    const $appState = this.$appState
    // memory
    if($appState.user) {
        return
    }
    // storage
    const user = $appState.$storage(storageName).$get('user')
    if (user) {
        // try login
        this.$appState.user = user
        return 
    }
    
    throw {}
}

Vue.prototype.$login = async function(data) {
    this.$appState.$storage(storageName).$set('user', data)
    this.$appState.user = data
    return
}

Vue.prototype.$logout = async function() {
    this.$appState.user = undefined
    this.$appState.$storage(storageName).$remove('user')
    return
}