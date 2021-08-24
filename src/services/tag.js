export function getTagList (input) {
  const {
    pageSize,
    currentPage: pageNum,
    name: attrName,
    tagCategoryId: tagId
  } = input
  return this.fetch({
    url: 'api/label/detail',
    params: {
      tagId,
      attrName,
      pageSize,
      pageNum
    }
  }).then((data) => {
    const { list: itemList, pageSize, pageNum: currentPage, total } = data.pageInfo
    return {
      itemList,
      pagination: {
        total,
        currentPage,
        pageSize
      }
    }
  })
}

export function upsertTag (input) {
  const url = input.attrId ? 'api/labelAttr/update' : 'api/labelAttr/save'
  return this.fetch({
    method: 'post',
    url,
    data: input
  })
}

export function deleteTag (input) {
  return this.fetch({
    method: 'post',
    url: 'api/labelAttr/del',
    data: input
  })
}

export function tagBatchsave (input) {
  return this.fetch({
    method: 'post',
    url: 'api/labelAttr/batchSave',
    data: input
  })
}

// 标签字典库
export function getTagDictDatabaseList (params) {
  return this.fetch({
    method: 'get',
    url: 'api/tagDict/index',
    params
  })
}

// 行为标签
export function getBavTagList (params) {
  return this.fetch({
    method: 'get',
    url: `api/auto/getBehaviorTagDict/${params.id}`
  })
}

// 行为标签- 模块活跃-推荐位,板块位，版面位下拉信息
export function moduleMatch (params) {
  return this.fetch({
    method: 'get',
    url: `api/auto/module/match/${params.type}`,
    params
  })
}

// 行为标签- 起播行为-查询影视内容接口
export function tvContentMatch (params) {
  return this.fetch({
    method: 'get',
    url: `api/auto/play/tvContent/${params.source}`,
    params
  })
}

// 行为标签- 起播行为-查询影视内容接口
export function getTvEpisodes (params) {
  return this.fetch({
    method: 'get',
    url: `api/auto/play/tvEpisodes/${params.source}/${params.id}`,
    params
  })
}

// 指令重发
export function manualLaunch (params) {
  return this.fetch({
    method: 'get',
    url: `api/multiVersionCrowd/manualLaunch`,
    params
  })
}

// 指令重发
export function getManualLaunchList (params) {
  return this.fetch({
    method: 'get',
    url: `api/multiVersionCrowd/manualLaunchList`,
    params
  })
}

// 行为标签 - 查询博主
export function getShortVideoAuthor (params) {
  return this.fetch({
    method: 'get',
    url: 'api/auto/getShortVideoAuthor',
    params
  })
}

// 行为标签 - 查询影片
export function getVideoEpisode (params) {
  return this.fetch({
    method: 'get',
    url: 'api/auto/getVideoEpisode',
    params
  })
}
