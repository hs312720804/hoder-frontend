export function setClearCache(params) {
    return this.fetch({
        method: 'get',
        url: '/api/devTool/clearCache',
        params
    })
}
