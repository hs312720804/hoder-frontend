// 接口服务器管理
export function getIpManageList(params) {
    return this.fetch({
        method: 'get',
        url: '/api/webApiServer/index',
        params
    })
}
export function getBiList(params) {
    return this.fetch({
        method: 'get',
        url: '/api/webApiServer/biList',
        params
    })
}
export function addIpManage(data) {
    return this.fetch({
        method: 'post',
        url: '/api/webApiServer',
        data,
        isJSON: true
    })
}
export function updateIpManage({data,id}) {
    return this.fetch({
        method: 'put',
        url: '/api/webApiServer/' + id,
        data,
        isJSON: true
    })
}
export function delIpManage(params) {
    return this.fetch({
        method: 'delete',
        url: '/api/webApiServer/' + params
    })
}
export function getIpManageDetail(params) {
    return this.fetch({
        method: 'get',
        url: '/api/webApiServer/' + params
    })
}

