export function setClearCache(params) {
    return this.fetch({
        method: 'get',
        url: '/api/devTool/clearCache',
        params
    })
}
export function setClearAllCache(params) {
    return this.fetch({
        method: 'get',
        url: '/api/api/settings/updateApiCacheVersion',
        params
    })
}
