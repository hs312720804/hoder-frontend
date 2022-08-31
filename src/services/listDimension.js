// 获取列表维度
// type = 1 策略列表 创建时间  创建人      投放状态      业务部门
// type = 2 人群列表 创建时间  创建人      是否生效      业务部门       备注       是否有效期内
// type = 3 投放列表 创建时间  创建人      投放状态      业务部门     微信OpenId数量     手机号数量      酷开OpenId数量
// type = 4 标签列表 标签code  示例值      标签定义      类型     备注
// type = 5 临时人群列表 创建人  创建时间      投放状态      业务部门
export function getListDimension (params) {
  return this.fetch({
    method: 'get',
    url: '/api/behavior/show',
    params
  })
}
// 保存页面展示字段
export function saveListDimension (data) {
  return this.fetch({
    method: 'post',
    url: '/api/behavior/show',
    data
  })
}
// 保存页面展示字段
export function rightsInterestsOutcome (params) {
  return this.fetch({
    method: 'get',
    url: '/api/rightsInterestsOutcome',
    params
  })
}
