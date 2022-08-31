// 临时人群列表
export function getTempCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd/index',
    params
  })
}
// 临时人群新增
export function addTempCrowd (data) {
  return this.fetch({
    method: 'post',
    url: '/api/tempCrowd',
    isJSON: true,
    data
  })
}
// 临时人群修改
export function updateTempCrowd (data) {
  return this.fetch({
    method: 'put',
    url: '/api/tempCrowd',
    isJSON: true,
    data
  })
}

export function delNewTempCrowd (params) {
  return this.fetch({
    method: 'delete',
    url: '/api/multiVersionCrowd/delTempCrowd',
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

// 临时人群列表过滤掉还在计算中的
export function getCalculatedTempCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/tempCrowd/calculatedList',
    params
  })
}

// 新增、编辑投放获取临时人群列表; 获取行为人群 - 人群列表
export function getTempLaunchList (data) {
  return this.fetch({
    method: 'post',
    url: '/api/multiVersionCrowd/getTempLaunchList',
    data
  })
}
// 新增投放 - 获取行为人群 - 策略列表
export function getBehaviorABPolicy (data) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/getBehaviorABPolicy',
    data
  })
}

// 根据策略ID获取行为人群AB子人群接口
export function getABChildByPolicyId (params) {
  return this.fetch({
    method: 'GET',
    url: '/api/crowd/getABChildByPolicyId',
    params
  })
}
// 根据策略ID获取行为人群
export function getBehaviorCrowdByPolicyId (params) {
  return this.fetch({
    method: 'GET',
    url: '/api/crowd/getBehaviorCrowdByPolicyId',
    params
  })
}

// 人群标签查询接口
export function getCrowdCrowdTagList (params) {
  return this.fetch({
    method: 'GET',
    url: '/api/policy/getCrowdCrowdTagList',
    params
  })
}