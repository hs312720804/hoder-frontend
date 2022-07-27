// 本地人群列表
export function getLocalCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd/localCrowd/index',
    params
  })
}
// 本地人群新增
export function addLocalCrowd (data) {
  return this.fetch({
    method: 'post',
    url: '/api/tempCrowd/localCrowd',
    isJSON: true,
    data,
    contentType: 'multipart/form-data'
  })
}
// 本地人群修改
export function updateLocalCrowd (data) {
  return this.fetch({
    method: 'put',
    url: `/api/tempCrowd/localCrowd/${data.id}`,
    // url: `/api/tempCrowd/localCrowd`,
    data: data.formData
  })
}
// 本地人群下架
export function OnOrOffLocalCrowd (data) {
  return this.fetch({
    method: 'post',
    url: `/api/tempCrowd/localCrowd/OnOrOff/${data.localCrowdId}`,
    data
  })
}
// ------------------------------------------
// 临时人群删除
export function delTempCrowd (params) {
  return this.fetch({
    method: 'delete',
    url: '/api/tempCrowd',
    params
  })
}
// 临时人群获取
export function getTempCrowd (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd',
    params
  })
}
// 临时人群计算
export function calculateTempCrowd (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd/calculate',
    params
  })
}
// 获取标签树类型新接口
export function getNewTreeList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/tree',
    params
  })
}
