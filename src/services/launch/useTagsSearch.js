export function getTempTagList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/dataSearcher/tempTagList',
    params
  })
}
export function getTempTagAttrList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/dataSearcher/tempTagAttrList',
    params
  })
}
export function getUserTagList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/dataSearcher/queryMacTags',
    params
  })
}
// 大数据命中标签查询
export function getBigDataUserTagList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/crowd/mac/tagInfo',
    params
  })
}
// 命中查询
// 查询
export function getHitSearchData (params) {
  return this.fetch({
    method: 'get',
    url: 'api/dataSearcher/validatePolicyHit',
    params
  })
}
// 自动填充参数
export function getAutoFilledParams (params) {
  return this.fetch({
    method: 'get',
    url: 'api/dataSearcher/queryMacVisitedLog',
    params
  })
}
