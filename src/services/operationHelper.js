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
    data
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
    data
  })
}

// 下架任务
export function assistantTaskPutway (data) {
  return this.fetch({
    method: 'post',
    url: '/api/assistantTask/putway',
    data
  })
}
