// 投放统计图表页面接口

// 获取策略数据统计
export function get_total_policy (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/getTotalPolicy',
    params
  })
}

// 人群调用总量
export function get_crowd_pv_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdPVTotal',
    params
  })
}

// 人群预算总量
export function get_crowd_forcas_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdForcasTotal',
    params
  })
}

// 人群命中总量
export function get_crowd_uv_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdUVTotal',
    params
  })
}

// 人群下发总量
export function get_crowd_send_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdSendTotal',
    params
  })
}

// 人群点击曝光总量
export function get_crowd_click_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdClickTotal',
    params
  })
}

// 人群调用总量按业务下钻
export function get_crowd_bi_pv_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdBiPVTotal',
    params
  })
}

// 人群命中总量按业务下钻
export function get_crowd_bi_uv_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdBiUVTotal',
    params
  })
}

// 人群下发总量按业务下钻
export function get_crowd_send_bi_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdSendBiTotal',
    params
  })
}

// 人群点击曝光总量按业务下钻
export function get_crowd_click_bi_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/crowdClickBiTotal',
    params
  })
}

// 人群画像性别
export function get_crowd_sex_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/total/crowdSexTotal',
    params
  })
}

// 人群调年龄分布
export function get_crowd_age_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/total/crowdAgeTotal',
    params
  })
}

// 产品等级分布
export function get_device_level_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/total/deviceLevelTotal',
    params
  })
}

// 人群城市分布
export function get_crowd_province_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/total/crowdProvinceTotal',
    params
  })
}
// 人群城市分布
export function get_crowd_all_total (params) {
  return this.fetch({
    method: 'get',
    url: '/api/statistic/getCrowdAllTotal',
    params
  })
}
// 主页推荐位分人群情况
export function getHomePageRecommend (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/recommendCrowd/detail',
    params
  })
}
// 主页推荐位分人群折线图
export function getHomePageRecommendLine (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/recommendAllTotal/detail',
    params
  })
}

// 精细化人群 - 查询策略人群树状数据
export function refinementPolicyTree (params) {
  return this.fetch({
    method: 'get',
    url: '/api/refinementPolicy/policy/tree',
    params
  })
}
// 精细化人群 - 查询子人群列表
export function refinementPolicyCrowdSearch (params) {
  return this.fetch({
    method: 'get',
    url: '/api/refinementPolicy/crowd/search',
    params
  })
}
// 精细化人群 - 权益分类
export function refinementPolicyProduct (params) {
  return this.fetch({
    method: 'get',
    url: '/api/refinementPolicy/product',
    params
  })
}
// 精细化人群 - 人群复制
export function copyPolicyCrowd (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/refinementPolicy/copyPolicyCrowd',
    data,
    isJSON: true
  })
}
// 精细化人群 - 创建策略组
export function saveRefinementPolicy (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/refinementPolicy/policy/save',
    data,
    isJSON: true
  })
}
