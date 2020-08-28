// 临时人群列表
export function getTempCrowdList(params) {
    return this.fetch({
        method: 'get',
        url: 'api/tempCrowd/index',
        params
    })
}
// 临时人群新增
export function addTempCrowd(data) {
    return this.fetch({
        method: 'post',
        url: 'api/tempCrowd',
        data
    })
}
// 临时人群修改
export function updateTempCrowd(data) {
    return this.fetch({
        method: 'put',
        url: 'api/tempCrowd',
        data
    })
}
// 临时人群删除
export function delTempCrowd(params) {
    return this.fetch({
        method: 'delete',
        url: 'api/tempCrowd',
        params
    })
}
// 临时人群获取
export function getTempCrowd(params) {
    return this.fetch({
        method: 'get',
        url: 'api/tempCrowd',
        params
    })
}
// 临时人群计算
export function calculateTempCrowd(params) {
    return this.fetch({
        method: 'get',
        url: 'api/tempCrowd/calculate',
        params
    })
}

