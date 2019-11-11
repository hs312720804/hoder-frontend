export function getCrowdUseEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/crowdUsed/detail',
        params
    })
}
export function getCrowdUseSceneEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/crowdApply/detail',
        params
    })
}
export function getTagAllEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/tagCover/detail',
        params
    })
}
export function getTagUseEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/tagUsed/detail',
        params
    })
}
export function getTagUseRadarEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/tagScenesCover/detail',
        params
    })
}
// 业务投放情况
export function getLaunchEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/bizDelivery/detail',
        params
    })
}
// 业务人群使用情况
export function getCrowdBusinessUseEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/bizUse/amount',
        params
    })
}
// 人群对应业务分布情况
export function getCrowdBusinessEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/crowdBizDistric/detail',
        params
    })
}
// 业务使用全流程趋势
export function getBusinessUseTendencyEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/bizUsedProcess',
        params
    })
}
// 活跃时段分布
export function getActiveTimeEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/activeTimeDistric/detail',
        params
    })
}
// 用户分布情况
export function getUseDistributionEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/userDistric/detail',
        params
    })
}// 末次付费的会员产品包
export function getLastPaidProductEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/memlastPaidProductPack/detail',
        params
    })
}// 设备活跃
export function getActiveDeviceEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/activeDevice/detail',
        params
    })
}// 起播活跃率
export function getBroadcastRateEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/initialBroadcastRate/detail',
        params
    })
}// 用户观影偏好分布
export function getUserWatchPreferenceDistributionEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/userViewingPreferenceDistric/detail',
        params
    })
}// 用户权益
export function getUseVipRightsEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/userVipRightsList',
        params
    })
}// 日期列表
export function getinitDateEcharts(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/initDateData1',
        params
    })
}
// 获取用户权益列表
export function getUserVipRightsList(params) {
    return this.fetch({
        method: 'get',
        url: '/api/chart/userVipRightsList',
        params
    })
}
