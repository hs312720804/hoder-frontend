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

// 获取标签树类型新接口
export function getNewTreeList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/tree',
    params
  })
}
// 标签广场 - 神策分析
export function sensorCrowdAnalysis (params) {
  return this.fetch({
    method: 'get',
    url: '/api/multiVersionCrowd/sensorCrowdAnalysis',
    params,
    isReturnAllInfor: true
  })
}
// 人群列表 - 神策分析
export function sensorHitData (params) {
  return this.fetch({
    method: 'get',
    url: '/api/multiVersionCrowd/sensorHitData',
    params,
    isReturnAllInfor: true
  })
}
// 查询分组内人群流转路径效果接口
export function getCrowdFlowPath (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowdFlowPath',
    params
  })
}

// ES数据导出接口
export function checkMackFileIsExist (params) {
  return this.fetch({
    method: 'get',
    url: '/api/macExport/checkMackFileIsExist',
    params
  })
}

// ES数据导出接口
export function downloadMacFile (params) {
  return this.fetch({
    method: 'get',
    url: '/api/macExport/downloadMacFile',
    params
  })
}
// 本地人群发送神策
export function sensorAnalysis (params) {
  return this.fetch({
    method: 'get',
    url: '/api/multiVersionCrowd/localCrowd/sensorAnalysis',
    params
  })
}
// 人群命中监测接口
export function queryCrowdHitAlertList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/queryCrowdHitAlertList',
    params
  })
}
// 增加或修改监测数据
export function addCrowdHitAlert (data) {
  return this.fetch({
    method: 'post',
    url: '/api/crowd/addCrowdHitAlert',
    data,
    isJSON: true
  })
}
// 删除监测数据
export function deleteCrowdHitAlert (params) {
  return this.fetch({
    method: 'delete',
    url: '/api/crowd/deleteCrowdHitAlert',
    params
  })
}

// 本地标签 - 异常导出
export function checkErrorMacFileIsExist (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd/checkErrorMacFileIsExist',
    params
  })
}

// 本地标签 - 异常导出
export function downloadErrorMacFile (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd/downloadErrorMacFile',
    params
  })
}
