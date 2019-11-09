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
//
export function  getRows () {
    return [{
        'word': 'visualMap',
        'count': 22199
    }, {
        'word': 'continuous',
        'count': 10288
    }, {
        'word': 'contoller',
        'count': 620
    }, {
        'word': 'series',
        'count': 274470
    }, {
        'word': 'gauge',
        'count': 12311
    }, {
        'word': 'detail',
        'count': 1206
    }, {
        'word': 'piecewise',
        'count': 4885
    }, {
        'word': 'textStyle',
        'count': 32294
    }, {
        'word': 'markPoint',
        'count': 18574
    }, {
        'word': 'pie',
        'count': 38929
    }, {
        'word': 'roseType',
        'count': 969
    }, {
        'word': 'label',
        'count': 37517
    }, {
        'word': 'emphasis',
        'count': 12053
    }, {
        'word': 'yAxis',
        'count': 57299
    }, {
        'word': 'name',
        'count': 15418
    }, {
        'word': 'type',
        'count': 22905
    }, {
        'word': 'gridIndex',
        'count': 5146
    }, {
        'word': 'normal',
        'count': 49487
    }, {
        'word': 'itemStyle',
        'count': 33837
    }, {
        'word': 'min',
        'count': 4500
    }, {
        'word': 'silent',
        'count': 5744
    }, {
        'word': 'animation',
        'count': 4840
    }, {
        'word': 'offsetCenter',
        'count': 232
    }, {
        'word': 'inverse',
        'count': 3706
    }, {
        'word': 'borderColor',
        'count': 4812
    }, {
        'word': 'markLine',
        'count': 16578
    }, {
        'word': 'line',
        'count': 76970
    }, {
        'word': 'radiusAxis',
        'count': 6704
    }, {
        'word': 'radar',
        'count': 15964
    }, {
        'word': 'data',
        'count': 60679
    }, {
        'word': 'dataZoom',
        'count': 24347
    }, {
        'word': 'tooltip',
        'count': 43420
    }, {
        'word': 'toolbox',
        'count': 25222
    }, {
        'word': 'geo',
        'count': 16904
    }, {
        'word': 'parallelAxis',
        'count': 4029
    }]
}

