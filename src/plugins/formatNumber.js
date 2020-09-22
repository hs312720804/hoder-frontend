import Vue from 'vue'
Vue.prototype.cc_format_number = function(n) {
    // 如果不是字符或者数字，则直接返回
    if (typeof n !== 'string' && typeof n !== 'number') {
        return n
    }
    if(typeof n !== 'string') {
        n = n.toString()
    }
    var len = n.length
    if (len <= 3) { return n }
    var r = len % 3
    const start = n.slice(0, r)
    const end = n.slice(r).match(/\d{3}/g).join(',')
    return r > 0 ? start + ',' + end : end
}
