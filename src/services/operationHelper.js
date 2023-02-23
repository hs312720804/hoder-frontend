// 任务列表接口
export function assistantTaskList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/assistantTask/list',
    params
  })
}
// 新增编辑任务接口
export function saveAssistantTask (data) {
  return this.fetch({
    method: 'post',
    url: '/api/assistantTask/save',
    data,
    isJSON: true
  })
}

// 根据任务ID查询任务
export function getAssistantTaskDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/assistantTask/byId',
    params
  })
}

// 新增方案
export function saveAssistantResource (data) {
  return this.fetch({
    method: 'post',
    url: '/api/assistantResource/save',
    data,
    isJSON: true
  })
}

// 下架任务
export function assistantTaskPutway (data) {
  return this.fetch({
    method: 'post',
    url: '/api/assistantTask/putway',
    data,
    isJSON: true
  })
}

export function delAssistantTask (data) {
  return this.fetch({
    method: 'post',
    url: '/api/assistantTask/del',
    data,
    isJSON: true
  })
}

export function getAssistantTaskCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/assistantTask/crowdList',
    params
  })
}
// 获取方案列表
export function getAssistantResourceList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/assistantResource/list',
    params
  })
}
// 人群小助手投后效果
export function getEffect (params) {
  return this.fetch({
    method: 'get',
    url: '/api/operationAssistant/getEffect',
    params
  })
}
// 人群运营助手同步接口
export function genLuaById (params) {
  return this.fetch({
    method: 'get',
    url: '/api/assistantTaskSync/genLuaById',
    params
  })
}

// 人群运营运营助手配置接口
export function getAssistantLuaList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/assistantLua/list',
    params
  })
}
