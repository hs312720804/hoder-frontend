export function getTagCategoryList (input) {
  const { pageSize, currentPage: pageNum, name: tagName } = input
  return this.fetch({
    url: '/api/label/index',
    params: {
      groupId: input.groupId,
      tagName,
      pageSize,
      pageNum
    }
  }).then((data) => {
    const { lableDataSourceEnum: dataSourceEnum, tagsTypeEnum: typeEnum } = data
    const { list: itemList, pageSize, pageNum: currentPage, total } = data.pageInfo
    return {
      itemList,
      dataSourceEnum,
      typeEnum,
      pagination: {
        total,
        currentPage,
        pageSize
      }
    }
  })
}

export function upsertTagCategory (input) {
  const url = input.tagId ? '/api/label/update' : '/api/label/save'
  return this.fetch({
    method: 'post',
    url,
    data: input
  })
}

export function deleteTagCategory (input) {
  return this.fetch({
    method: 'post',
    url: '/api/label/del',
    data: input
  })
}

export function readTagCategory ({ id }) {
  return this.fetch({
    url: '/api/label/detail',
    params: {
      tagId: id
    }
  }).then((data) => {
    const { lableDataSourceEnum: dataSourceEnum, tagsTypeEnum: typeEnum, tag: tagCategory } = data
    return {
      dataSourceEnum,
      typeEnum,
      tagCategory
    }
  })
}

export function getDatasource (params) {
  return this.fetch({
    url: '/api/enumData/getDataSource',
    method: 'get',
    params
  })
}
