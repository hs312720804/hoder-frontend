export function getTempTagList(params) {
    return this.fetch({
        method: 'get',
        url: 'api/dataSearcher/tempTagList',
        params
    })
}
export function getTempTagAttrList(params) {
    return this.fetch({
        method: 'get',
        url: 'api/dataSearcher/tempTagAttrList',
        params
    })
}
export function getUserTagList(params) {
    return this.fetch({
        method: 'get',
        url: 'api/dataSearcher/queryMacTags',
        params
    })
}
