export function policyList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/index',
    params
  })
}
export function policyAdd (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/add',
    params
  })
}
export function policyTagSeach (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/tagSeach',
    params
  })
}
/* 新建策略 */
export function policyAddSave (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/policy/save',
    data
  })
}
/** 策略编辑 */
export function policyUpate (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/policy/update',
    data
  })
}
export function policyDel (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/policy/del',
    data
  })
}
export function viewCrowd (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/viewpolicy',
    params
  })
}
export function getTagsByPoliceId (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/getTagsByPolicyId',
    params
  })
}
export function getTagAttr (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/getTagAttr',
    params
  })
}
export function crowdSave (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/crowd/save',
    data
  })
}
// 人群编辑
export function crowdEdit (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/edit',
    params
  })
}
// 人群编辑保存
export function crowdUpdate (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/crowd/update',
    data
  })
}
// 人群删除
export function strategyCrowdDel (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/crowd/del',
    data
  })
}
export function freshService (params) {
  return this.fetch({
    method: 'get',
    url: '/api/api/webServers/reload',
    params
  })
}
export function freshCache (params) {
  return this.fetch({
    method: 'get',
    url: '/api/api/policyGen/lua',
    params
  })
}

// 投放提示
export function alertLaunch (params) {
  return this.fetch({
    method: 'get',
    url: '/api/multiVersionCrowd/alertLaunch',
    params
  })
}

// 人群估算获取类型
export function getEstimateType (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/getCalIdType',
    params
  })
}
// 老人群估算
export function estimatePeople (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/crowdForcast',
    params
  })
}
// 新人群估算
// export function singleCrowdEstimate(params) {
//     return this.fetch({
//         method: 'get',
//         url: 'api/singleCrowdEstimate',
//         params
//     })
// }
// 新人群批量估算
export function batchCrowdEstimate (params) {
  return this.fetch({
    method: 'get',
    url: 'api/batchCrowdEstimate',
    params
  })
}
// 获取估算结果
export function estimateResult (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/crowdForcastLastOnceResult',
    params
  })
}
// 临时人群实时估算
// export function estimateTemp(data) {
//     return this.fetch({
//         method: 'post',
//         url: 'api/syncCrowdEstimate',
//         data
//     })
// }
export function estimateTemp (object) {
  const newFormData = new FormData()
  newFormData.append('crowdRule', JSON.stringify(object))
  return this.fetch({
    method: 'post',
    url: 'api/syncCrowdEstimate',
    data: newFormData
  })
}
// 获取新估算结果
// export function estimateNewResult(params) {
//     return this.fetch({
//         method: 'get',
//         url: 'api/estimateResult',
//         params
//     })
// }
// 查看配置文件
export function seeDevFile (params) {
  return this.fetch({
    method: 'get',
    url: 'api/devTool/loadFile',
    params
  })
}
/**
 * 查看配置文件新增
 * @param {*} params
 * @returns
 */
export function seeDevFileList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/policy/luaMultiVersion',
    params
  })
}

// 策略业务调用统计接口圆饼图
export function policyWithBiTotalPie (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/policyTotalWithBiPie',
    params
  })
}
// 策略业务调用统计接口多折线图
export function policyWithBiTotalLine (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/policyTotalWithBiLine',
    params
  })
}
// 人群业务命中统计饼图
export function hitAndBiToTalPie (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/hitAndBiToTalPie',
    params
  })
}
// 人群业务命中统计多折线图
export function hitAndBiToTalLine (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/hitAndBiToTalLine',
    params
  })
}
// 人群总曝光以及各业务的曝光量饼图
export function exposeCrowdTotalPie (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/exposeCrowdTotalPie',
    params
  })
}
// 人群总曝光以及各业务的曝光量折线图
export function exposeCrowdTotalLine (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/exposeCrowdTotalLine',
    params
  })
}
// 该人群总点击以及各业务的点击次数圆饼图
export function clickCrowdTotalPie (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/clickCrowdTotalPie',
    params
  })
}
// 该人群总点击以及各业务的点击次数折线图
export function clickCrowdTotalLine (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/clickCrowdTotalLine',
    params
  })
}
// 漏斗图
export function crowdLanuchData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/hopperDateMap',
    params
  })
}
// 省份分布比例
export function exposeProvinceScale (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowdAndPolicyStatistics/exposeProvinceScale',
    params
  })
}
// 点击投放中调用
export function policyUseInBi (params) {
  return this.fetch({
    method: 'get',
    url: 'api/policy/policyUseInBi',
    params
  })
}
// 人群上下架
export function crowdUpDown (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/updateCrowdPutway',
    params
  })
}
// 人群复制
export function crowdCopy (data) {
  return this.fetch({
    method: 'post',
    url: 'api/crowd/copyPolicyCrowd',
    data
  })
}
// 人群复制之前获取所有策略
export function getAllPolicyList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/getPolicyList',
    params
  })
}
// 人群估算画像基本信息
export function getEstimatedBaseInfo (params) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapBasic/' + params
  })
}
// 人群估算画像省份分布
export function getEstimatedProvinceAndCityData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapProvinceAndCityPct/' + params
  })
}
// 人群估算画像TOP列表
export function getEstimatedCityTopData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapCityTop/' + params
  })
}
// 人群估算画像用户类别
export function getEstimatedUserTypeData (data) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapUserCgy/' + data.id,
    params: {
      'category': data.category
    }
  })
}
// 人群估算画像用户观影习惯
export function getEstimatedUserBehaviorData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapLookBehavior/' + params
  })
}
// 人群估算画像付费分布
export function getEstimatedPayData (data) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapPayPct/' + data.id,
    params: {
      'category': data.category
    }
  })
}
// 人群估算画像获取会员会员权益列表
export function getEstimatedTvEnumData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/enumData/estimateTVEnum',
    params
  })
}
// 人群估算画像行为活跃
export function getEstimatedAcitivityBehaviorData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/map/esCrdStsMapActBehavior/' + params
  })
}
// 人群优先级单独修改
export function updatePrioorityInCrowdList (data) {
  return this.fetch({
    method: 'PUT',
    url: 'api/crowd/updatePriorityInCrowdList',
    data
  })
}
// 人群分流优先级单独修改
export function updateBypassPriorityInCrowdList (data) {
  return this.fetch({
    method: 'PUT',
    url: 'api/crowd/updateBypassPriorityInCrowdList',
    data
  })
}
// 人群AB test 划分新增
export function crowdABTestAdd ({ model, data }) {
  return this.fetch({
    method: 'post',
    url: '/api/crowd/aBTestPartition/' + model,
    data,
    isJSON: true
  })
}
// 人群AB test 划分编辑获取详情
export function crowdABTestEdit (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/aBTestPartition/' + params
  })
}
// 人群AB test 划分编辑保存
export function crowdABTestEditSave ({
  model,
  data
}) {
  return this.fetch({
    method: 'put',
    url: '/api/crowd/aBTestPartition/' + model,
    data,
    isJSON: true
  })
}
// 人群状态追踪
export function getCrowdStatus (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/crowdStatusTrack',
    params
  })
}
// 人群列表请求详情列表
export function crowdRequestDetail (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/trackDetail',
    params
  })
}
// 人群列表查看自人群
export function getAbChilds (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/showAbChilds/' + params
  })
}
// 人群提交历史数据
export function submitPolicyHistoryData (data) {
  return this.fetch({
    method: 'post',
    url: '/api/crowd/submitPolicyCrowd',
    data
  })
}
// 新建多个人群的标签接口
export function tagInfoNew (recordId) {
  return this.fetch({
    method: 'get',
    url: '/api/keyAllLaunch/tagInfo/' + recordId,
    isJSON: true
  })
}

// 一键投放
// 一键投放新建策略
export function oneDropPolicyAddSave (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/keyAllLaunch/tempPolicy',
    data,
    isJSON: true
  })
}
// 获取策略详情
export function oneDropGetPolicyDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/keyAllLaunch/tempPolicy/' + params
  })
}
// 新建保存多个人群
export function tempCrowds ({ rulesJson, recordId }) {
  return this.fetch({
    method: 'post',
    url: '/api/keyAllLaunch/tempCrowds/' + recordId,
    data: rulesJson,
    isJSON: true
  })
}
// 人群列表获取详情
export function getCrowdsDetail (recordId) {
  return this.fetch({
    method: 'get',
    url: '/api/keyAllLaunch/tempCrowds/' + recordId
  })
}
// 人群列表点击暂存
export function oneDropSaveCrowd ({ recordId, data }) {
  return this.fetch({
    method: 'post',
    url: '/api/keyAllLaunch/tempCrowds/notLaunch/' + recordId,
    data,
    isJSON: true
  })
}
// 投放点击投放
export function oneDropCrowdSaveAndLaunch ({ recordId, data }) {
  return this.fetch({
    method: 'post',
    url: '/api/keyAllLaunch/keyLaunch/' + recordId,
    data,
    isJSON: true
  })
}
// 存稿不投放
export function oneDropCrowdSaveAndNotLaunch (recordId) {
  return this.fetch({
    method: 'post',
    url: '/api/keyAllLaunch/saveAndNotLaunch/' + recordId
  })
}

// 查看主页投放后的列表
export function getHomepageReleaseRecordList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/businessDelivery/getBdList',
    params
  })
}

// 主页投后数据漏斗图
export function getHomepageReleaseRecordFunnel (params) {
  return this.fetch({
    method: 'get',
    url: '/api/businessDelivery/getFunnels',
    params
  })
}

// 主页数据状态列举接口
export function getHomepageReleaseRecordTypeEnum (params) {
  return this.fetch({
    method: 'get',
    url: '/api/businessDelivery/getDataStatus',
    params
  })
}

// 我的人群策略列表分页及查询
export function getMyCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/index/my',
    params
  })
}

// 人群重定向列表
export function getRedirectCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/reLaunch/index/' + params.crowdId,
    params
  })
}
// 人群估算画像接口统一，通过type区分
export function getCrowdCountMap ({ params, crowdId }) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/crowdPortrait/' + crowdId,
    params
  })
}
// 人群重定向新增
export function getRedirectCrowdAdd ({ policyId, params }) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/reLaunch/' + policyId,
    params
  })
}
// 人群收藏
export function collectPolicy (data) {
  return this.fetch({
    method: 'post',
    url: '/api/collect/policy',
    data
  })
}
// 人群删除收藏
export function removeCollectPolicy (params) {
  return this.fetch({
    method: 'delete',
    url: '/api/collect/policy?policyId=' + params.policyId
  })
}

// 策略列表根据id单独获取策略维度
export function getSrtategyTagsList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/policyUsedTag',
    params
  })
}

// 设备命中查询
export function searchHitCrowd ({ crowdId, params }) {
  return this.fetch({
    method: 'get',
    url: '/api/dataSearcher/macCrowdTagValue/' + crowdId,
    params
  })
}
// mac在主页命中明细查询接口
export function macHitDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/homePage/hit/log',
    params
  })
}
// mac在主页请求明细查询
export function macRequestDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/homePage/request/log',
    params
  })
}
// 人群mac维度命中请求统计查询
export function macLogSearch ({ mac, params }) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/log/mac/' + mac,
    params
  })
}
// 人群分流人群列表下拉框数据
export function getBypassCrowdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/bypassPartition/crowdsList/' + params.policyId
  })
}
// 人群分流新增保存
export function saveBypassCrowdAdd ({ data, params }) {
  return this.fetch({
    method: 'post',
    url: '/api/policy/bypassPartition/' + params.policyId,
    data,
    isJSON: true
  })
}
// 人群分流编辑保存
export function saveBypassCrowdEdit ({ data, params }) {
  return this.fetch({
    method: 'put',
    url: '/api/policy/bypassPartition/' + params.policyId,
    data,
    isJSON: true
  })
}
// 人群分流删除
export function delBypassCrowd (params) {
  return this.fetch({
    method: 'delete',
    url: '/api/policy/bypassPartition/ratio/' + params.pid
  })
}
// 人群分流数据回显
export function getBypassCrowdDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/bypassPartition/' + params.policyId
  })
}
/**
 * 接口测试
 * @param {*} params
 */
export function polisyTest (params) {
  return this.fetch({
    method: 'get',
    isReturnAllInfor: true,
    url: `/api/policy/invoker/${params.policyId}/${params.mac}/${params.crowdId}`
  })
}

/**
 * 人群流程图创建
 * @param data
 * @param param
 */
export function smartProgramme ({ data }) {
  return this.fetch({
    method: 'post',
    url: '/api/smartProgramme',
    data,
    isJSON: true
  })
}

/**
 * 策略人群获取详情
 * @param params
 */
export function smartProgrammeDetail (policyId) {
  return this.fetch({
    method: 'get',
    isReturnAllInfor: true,
    url: '/api/smartProgramme/policy/' + policyId
  })
}

/**
 * 根据策略id获取策略维度详情
 * @param policyId
 */
export function smartProframPolicyInfo (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/edit',
    params
  })
}

/**
 * 方案修改
 * @param policyId
 */
export function smartProframPolicyUpdate ({ data, params }) {
  return this.fetch({
    method: 'put',
    url: '/api/smartProgramme/' + params.programmeId,
    data,
    isJSON: true
  })
}

export function sendEffectCommand (data) {
  return this.fetch({
    method: 'post',
    url: '/api/effect/sendCommand',
    data,
    isJSON: true
  })
}

export function getEffectCrowd (params) {
  return this.fetch({
    method: 'get',
    url: '/api/effect/getCrowd',
    params
  })
}

export function getResource (params) {
  return this.fetch({
    method: 'get',
    url: '/api/effect/getResource',
    params
  })
}
