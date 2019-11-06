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

