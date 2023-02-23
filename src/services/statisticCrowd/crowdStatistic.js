export function getCrowdUseEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/crowdUsed/detail',
    params
  })
}
export function getCrowdUseSceneEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/crowdApply/detail',
    params
  })
}
export function getTagAllEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/tagCover/detail',
    params
  })
}
export function getTagUseEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/tagUsed/detail',
    params
  })
}
export function getTagUseRadarEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/tagScenesCover/detail',
    params
  })
}
// 业务投放情况
export function getLaunchEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/bizDelivery/detail',
    params
  })
}
// 业务人群使用情况
export function getCrowdBusinessUseEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/bizUse/amount',
    params
  })
}
// 人群对应业务分布情况
export function getCrowdBusinessEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/crowdBizDistric/detail',
    params
  })
}
// 业务使用全流程趋势
export function getBusinessUseTendencyEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/bizUsedProcess',
    params
  })
}
// 活跃时段分布
export function getActiveTimeEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/activeTimeDistric/detail',
    params
  })
}
// 用户分布情况
export function getUseDistributionEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/userDistric/detail',
    params
  })
}// 末次付费的会员产品包
export function getLastPaidProductEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/memlastPaidProductPack/detail',
    params
  })
}// 设备活跃
export function getActiveDeviceEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/activeDevice/detail',
    params
  })
}// 起播活跃率
export function getBroadcastRateEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/initialBroadcastRate/detail',
    params
  })
}// 用户观影偏好分布
export function getUserWatchPreferenceDistributionEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/userViewingPreferenceDistric/detail',
    params
  })
}// 用户权益
export function getUseVipRightsEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/userVipRightsList',
    params
  })
}// 日期列表
export function getinitDateEcharts (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/initDateData1',
    params
  })
}
// 获取用户权益列表
export function getUserVipRightsList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/userVipRightsList',
    params
  })
}

// -----------------  关键指标趋势  --------------------
// 统计人群和策略请求命中数据(1)
export function getStatisticStrategyReqAndHit (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticStrategyReqAndHit',
    params
  })
}

// 折线图-人群增长趋势(2)
export function getStatisticCrowdGrowth (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticCrowdGrowth',
    params
  })
}

// 统计策略请求使用数据(3)
export function getStatisticStrategyUse (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticStrategyUse',
    params
  })
}

// 折线图-标签使用(4)
export function getStatisticTagsGrowth (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticTagsGrowth',
    params
  })
}

// 柱状图-统计人群寿命(5)
export function getStatisticCrowdLife (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticCrowdLife',
    params
  })
}

// 柱状图-统计行为人群寿命(6)
export function getStatisticBehaviorCrowdLife (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticBehaviorCrowdLife',
    params
  })
}

// 柱状图-统计策略寿命(7)
export function getStatisticStrategyLife (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticStrategyLife',
    params
  })
}

// 柱状图-标签使用热度   type = 0 大数据标签，1 账号标签  2 临时标签 (8 9 10)
export function getCountGetTag (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/getTag',
    params
  })
}

// 柱状图-人群使用占比(11)
export function getCountGetCrowdRatio (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/getCrowdRatio',
    params
  })
}

// 柱状图-存储监控(12)
export function getCountGetStore (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/getStore',
    params
  })
}

// 柱状图-存储监控(13)
export function getStatisticCrowdCalcDuration (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticCrowdCalcDuration',
    params
  })
}

// 折线图-存储监控(14)
export function getStatisticCrowdLaunch (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticCrowdLaunch',
    params
  })
}

// // 动态人群效果对比接口 (策略列表的)
export function getPolicySixIndexStats (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/policySixIndexStats',
    params
  })
}

// 动态人群效果对比接口 （人群列表的）
export function getPolicySixIndexStats2 (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/crowdGroupIndexStatistics',
    params
  })
}
// 关键指标总览
export function statisticPieChart (params) {
  return this.fetch({
    method: 'get',
    url: '/api/chart/statisticPieChart',
    params
  })
}
