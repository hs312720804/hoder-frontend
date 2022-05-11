export function getLaunchList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/manager/biList/getBiListPage',
    params
  })
}
export function editLaunchMenu (data) {
  return this.fetch({
    method: 'get',
    url: '/api/manager/biList/getByBiId',
    data
  })
}
export function addLaunchMenu (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/manager/biList/add',
    data
  })
}
export function updateLaunchMenu (data) {
  return this.fetch({
    method: 'put',
    url: '/api/manager/biList/updateBiList',
    data
  })
}
export function getLaunchMenuList (params) {
  return this.fetch({
    method: 'GET',
    url: '/api/manager/biList/getBiList',
    params
  })
}

// 闭环效果—— 投放分析 ——列表查询接口
export function getEffectData (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getEffectData',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}

// 流量CTR
export function getCtr (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getCtr',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}

// 产品包成交
export function getPackage (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getPackage',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}

// 活跃成交
export function getActive (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getActive',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}

// 观影行为
export function getTv (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getTv',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}

// 观影top
export function getTvTop (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getTvTop',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}

// 观影分类
export function getCategory (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/effect/getCategory',
    data,
    isJSON: true,
    responseType: 'arraybuffer'
  })
}
