export function policyList(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/index',
        params
      })
}
export function policyAdd(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/add',
        params
      })
}
export function policyTagSeach(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/tagSeach',
        params
      })
}
/*新建策略*/
export function policyAddSave(data){
    return this.fetch({
        method: 'POST',
        url: '/api/policy/save',
        data
      })
}
/** 策略编辑*/
export function policyUpate(data){
    return this.fetch({
        method: 'POST',
        url: '/api/policy/update',
        data
      })
}
export function policyDel(data){
    return this.fetch({
        method: 'POST',
        url: '/api/policy/del',
        data
      })
}
export function viewCrowd(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/viewpolicy',
        params
      })
}
export function getTagsByPoliceId(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/getTagsByPolicyId',
        params
      })
}
export function getTagAttr(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowd/getTagAttr',
        params
      })
}
export function crowdSave(data){
    return this.fetch({
        method: 'POST',
        url: '/api/crowd/save',
        data
      })
}
//人群编辑
export function crowdEdit(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowd/edit',
        params
      })
}
//人群编辑保存
export function crowdUpdate(data){
    return this.fetch({
        method: 'POST',
        url: '/api/crowd/update',
        data
      })
}
//人群删除
export function strategyCrowdDel(data){
    return this.fetch({
        method: 'POST',
        url: '/api/crowd/del',
        data
      })
}
export function freshService(params){
    return this.fetch({
        method: 'get',
        url: '/api/api/webServers/reload',
        params
      })
}
export function freshCache(params){
    return this.fetch({
        method: 'get',
        url: '/api/api/policyGen/lua',
        params
      })
}
//人群估算获取类型
export function getEstimateType(params) {
    return this.fetch({
        method: 'get',
        url: '/api/crowd/getCalIdType',
        params
    })
}
// 人群估算
export function estimatePeople(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowd/crowdForcast',
        params
    })

}
// 获取估算结果
export function estimateResult(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowd/crowdForcastLastOnceResult',
        params
    })

}
// 查看配置文件
export function seeDevFile(params) {
    return this.fetch({
        method: 'get',
        url: 'api/devTool/loadFile',
        params
    })

}
// 策略业务调用统计接口圆饼图
export function policyWithBiTotalPie(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/policyTotalWithBiPie',
        params
    })
}
// 策略业务调用统计接口多折线图
export function policyWithBiTotalLine(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/policyTotalWithBiLine',
        params
    })
}
// 人群业务命中统计饼图
export function hitAndBiToTalPie(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/hitAndBiToTalPie',
        params
    })
}
// 人群业务命中统计多折线图
export function hitAndBiToTalLine(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/hitAndBiToTalLine',
        params
    })
}
// 人群总曝光以及各业务的曝光量饼图
export function exposeCrowdTotalPie(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/exposeCrowdTotalPie',
        params
    })
}
// 人群总曝光以及各业务的曝光量折线图
export function exposeCrowdTotalLine(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/exposeCrowdTotalLine',
        params
    })
}
// 该人群总点击以及各业务的点击次数圆饼图
export function clickCrowdTotalPie(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/clickCrowdTotalPie',
        params
    })
}
// 该人群总点击以及各业务的点击次数折线图
export function clickCrowdTotalLine(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/clickCrowdTotalLine',
        params
    })
}
// 漏斗图
export function crowdLanuchData(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/hopperDateMap',
        params
    })
}
// 省份分布比例
export function exposeProvinceScale(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowdAndPolicyStatistics/exposeProvinceScale',
        params
    })
}
// 点击投放中调用
export function policyUseInBi(params) {
    return this.fetch({
        method: 'get',
        url: 'api/policy/policyUseInBi',
        params
    })
}
// 人群上下架
export function crowdUpDown(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowd/updateCrowdPutway',
        params
    })
}
// 人群复制
export function crowdCopy(data) {
    return this.fetch({
        method: 'post',
        url: 'api/crowd/copyPolicyCrowd',
        data
    })
}
// 人群复制之前获取所有策略
export function getAllPolicyList(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowd/getPolicyList',
        params
    })
}
// 人群估算画像基本信息
export function getEstimatedBaseInfo(params) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapBasic/'+params
    })
}
// 人群估算画像省份分布
export function getEstimatedProvinceAndCityData(params) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapProvinceAndCityPct/'+params
    })
}
// 人群估算画像TOP列表
export function getEstimatedCityTopData(params) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapCityTop/'+params
    })
}
// 人群估算画像用户类别
export function getEstimatedUserTypeData(data) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapUserCgy/'+data.id,
        params: {
           'category': data.category
        }
    })
}
// 人群估算画像用户观影习惯
export function getEstimatedUserBehaviorData(params) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapLookBehavior/'+params
    })
}
// 人群估算画像付费分布
export function getEstimatedPayData(data) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapPayPct/'+data.id,
        params: {
            'category': data.category
        }
    })
}
// 人群估算画像获取会员会员权益列表
export function getEstimatedTvEnumData(params) {
    return this.fetch({
        method: 'get',
        url: 'api/enumData/estimateTVEnum',
        params
    })
}
// 人群估算画像行为活跃
export function getEstimatedAcitivityBehaviorData(params) {
    return this.fetch({
        method: 'get',
        url: 'api/map/esCrdStsMapActBehavior/'+params
    })
}
// 人群优先级单独修改
export function updatePrioorityInCrowdList(data) {
    return this.fetch({
        method: 'PUT',
        url: 'api/crowd/updatePriorityInCrowdList',
        data
    })
}
// 人群AB test 划分新增
export function crowdABTestAdd({model,data}) {
    return this.fetch({
        method: 'post',
        url: '/api/crowd/aBTestPartition/'+model,
        data,
        isJSON: true
    })
}
// 人群AB test 划分编辑获取详情
export function crowdABTestEdit(params) {
    return this.fetch({
        method: 'get',
        url: '/api/crowd/aBTestPartition/'+params,
    })
}
// 人群AB test 划分编辑保存
export function crowdABTestEditSave({model,data}) {
    return this.fetch({
        method: 'put',
        url: '/api/crowd/aBTestPartition/'+model,
        data,
        isJSON: true
    })
}
// 人群状态追踪
export function getCrowdStatus(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowd/crowdStatusTrack',
        params
    })
}
// 人群列表查看自人群
export function getAbChilds(params) {
    return this.fetch({
        method: 'get',
        url: 'api/crowd/showAbChilds/'+params
    })
}
// 人群提交历史数据
export function submitPolicyHistoryData(data) {
    return this.fetch({
        method: 'post',
        url: '/api/crowd/submitPolicyCrowd',
        data
    })
}

