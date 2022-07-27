const cache = {
  tagTypeList: [],
  labelDataSourceEnum: []
}

export function getTagGroupList () {
  return this.fetch({
    url: '/api/label/index'
  }).then((data) => {
    if (cache.tagTypeList.length === 0) {
      const tagsTypeEnum = data.tagsTypeEnum
      cache.tagTypeList = Object.keys(tagsTypeEnum).map((key) => {
        return {
          label: tagsTypeEnum[key],
          value: key
        }
      })
    }
    cache.labelDataSourceEnum = data.labelDataSourceEnum
    return data.groupList.map((item) => {
      return {
        id: item.groupId,
        name: item.groupName
      }
    })
  })
}

export function createTagGroup (input) {
  return this.fetch({
    method: 'post',
    url: '/api/labelGroup/add',
    data: input
  })
}

export function getTagTypeList () {
  return Promise.resolve(cache.tagTypeList)
}

export function getDataSourceEnum () {
  return Promise.resolve(cache.labelDataSourceEnum)
}

// 树级菜单列表
export function getTagGroupTreeList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/label/indexTree',
    params
  })
}

// 获取父级id列表
export function getParentIdList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/getGroupsParent',
    params
  })
}

// 编辑标签列表分组
export function editLabelGroup (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/edit',
    params
  })
}

// 通过id查找标签详情
export function findLabelGroupById (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/findByGroupId',
    params
  })
}

// 编辑标签分组
export function editLabelGroupName (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/edit',
    params
  })
}

// 删除标签分组
export function delLabelGroup (params) {
  return this.fetch({
    method: 'get',
    url: '/api/labelGroup/delGroupsList',
    params
  })
}
// 复制标签分组
export function copyLabelGroup (params) {
  return this.fetch({
    method: 'get',
    url: '/api/label/copyByGroups',
    params
  })
}
// 复制单个标签
export function copyLabelSingle (params) {
  return this.fetch({
    method: 'get',
    url: '/api/label/copyByTagIds',
    params
  })
}
// 标签收藏
export function collectTags (data) {
  return this.fetch({
    method: 'post',
    url: '/api/collect/label',
    data
  })
}
// 标签取消收藏
export function cancelCollectTags (data) {
  return this.fetch({
    method: 'delete',
    url: '/api/collect/label?' + 'tagId=' + data.tagId
  })
}
// 标签列表之我的收藏
export function collectTagsList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/collect/label',
    params
  })
}
// 标签列表之组合标签
export function specialTagList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/specialTag/index',
    params
  })
}
// 特定标签--查看
export function specialTagDetailList (params) {
  return this.fetch({
    method: 'get',
    url: `/api/specialTag/list/${params.tagId}`,
    params
  })
}
// 特定标签-查看详情--省份下的市的列表
export function specialTagChild (params) {
  return this.fetch({
    method: 'get',
    url: `/api/specialTag/child/${params.id}`
  })
}
// 特定标签--修改
export function editSpecialTag ({ rulesJson }) {
  return this.fetch({
    method: 'put',
    url: `/api/specialTag`,
    data: rulesJson,
    isJSON: true
  })
}
// 特定标签--新建
export function addSpecialTag ({ rulesJson }) {
  return this.fetch({
    method: 'post',
    url: `/api/specialTag`,
    data: rulesJson,
    isJSON: true
  })
}

export function specialTagDetail ({ specialTagId }) {
  return this.fetch({
    method: 'get',
    url: `/api/specialTag/${specialTagId}`
  })
}

// 删除组合标签下的属性
export function deleteSpecialTagAttr (id) {
  return this.fetch({
    method: 'delete',
    url: `/api/specialTag/${id}`
  })
}

// export function tempCrowdList(params) {
//     return this.fetch({
//         method: 'get',
//         url: `/api/tempCrowd/index`,
//         params
//     })
// }

// 创建、编辑组合标签第一步保存
export function saveSpecialTag (params) {
  return this.fetch({
    method: 'get',
    url: `/api/specialTag/tagList`,
    params
  })
}

// 添加组合标签
export function addSpecialTagType (data) {
  return this.fetch({
    method: 'post',
    url: `/api/specialTag/tags`,
    data,
    isJSON: true
  })
}

// 编辑组合标签
export function editSpecialTagType (data) {
  return this.fetch({
    method: 'put',
    url: `/api/specialTag/tags`,
    data,
    isJSON: true
  })
}

// 删除组合标签
export function deleteSpecialTagType (id) {
  return this.fetch({
    method: 'delete',
    url: `/api/specialTag/tags/${id}`
  })
}

// 标签列表之组合标签
export function searchByGroup (params) {
  return this.fetch({
    method: 'get',
    url: '/api/label/searchByGroup',
    params
  })
}

// 标签列表 - 模型标签
export function searchModelTag (params) {
  return this.fetch({
    method: 'get',
    url: '/api/modelTag/page',
    params
  })
}
// 标签列表 - 模型标签 - 新增
export function addModelTag (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/modelTag/',
    data,
    isJSON: true
  })
}
// 标签列表 - 模型标签 - 编辑
export function editModelTag (data) {
  return this.fetch({
    method: 'PUT',
    url: '/api/modelTag/',
    data,
    isJSON: true
  })
}
// 标签列表 - 模型标签 - 删除
export function deleteModelTag (id) {
  return this.fetch({
    method: 'DELETE',
    url: `/api/modelTag/${id}`
  })
}

// 一鍵投放 - 模型标签勾选列表
export function getModelTag (params) {
  return this.fetch({
    method: 'get',
    url: '/api/modelTag/getTags',
    params
  })
}
