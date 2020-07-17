// 长期未使用人群
export function longTimeNoUseEcharts(params){
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/longTimeUnusedCrowd/'+params.day,
        params
    })
}
// 临时人群异常情况
export function tempCrowdEcharts(params){
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/tempCrowd',
        params
    })
}
// 已过期AB实验人群
export function abTestEcharts(params){
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/abcrowdHasExpired',
        params
    })
}
// 临时标签
export function getTempTagAnomalyEcharts(params){
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/tempTag',
        params
    })
}
// dmp接口分布情况
export function getDmpApiRequestEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpApiRequest',
        params
    })
}
// dmp接口调用正确率
export function getDmpApiRequestAccuracyEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpApiRequestAccuracyRate',
        params
    })
}
// dmp调用报错率
export function getDmpApiRequestErrorEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpApiRequestErrorRate',
        params
    })
}
// dmp调用报错原因分布
export function getDmpApiRequestErrorReasonEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpApiRequestErrorReason',
        params
    })
}
// 任务调度系统稳定性
export function getDmpTaskEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpTask',
        params
    })
}
// 任务调度系统失败原因
export function getDmpTaskFailReasonEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpTaskFailReason',
        params
    })
}
// QPS(每日单次请求峰值)
export function getDmpQpsApiRequestEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/dmpQpsApiRequest',
        params
    })
}
// 单人群查询最长耗时（每日）
export function getSelectCrowdTimeEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/selectOneCrowdTimeConsuming',
        params
    })
}
// 命中、曝光、点击今日突降50%以上人群数（投放中）
export function getCrowdHitCountDeclineEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/crowdHitCountDecline50',
        params
    })
}
// 单人群查询最长耗时（每日）
export function getCrowdHitCountDeclineToZeroEcharts(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/chart/expStat/crowdHitCountDecline0',
        params
    })
}
