// 场景列表
export function getSceneList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/scene/list',
    params
  })
}

// 新增场景
export function addScene (data) {
  return this.fetch({
    method: 'post',
    url: '/api/scene/add',
    isJSON: true,
    data
  })
}
// 编辑场景
export function editScene (data) {
  return this.fetch({
    method: 'post',
    url: '/api/scene/edit',
    isJSON: true,
    data
  })
}

// 接待员列表
export function getReceptionistList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/list',
    params
  })
}

// 新增接待员
export function addReceptionist (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/add',
    isJSON: true,
    data
  })
}

// 编辑接待员
export function editReceptionist (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/edit',
    isJSON: true,
    data
  })
}

// 根据场景ID获取技能列表
export function getSceneSkillList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/sceneSkill/list',
    params
  })
}

// 新增场景技能
export function addSceneSkill (data) {
  return this.fetch({
    method: 'post',
    url: '/api/sceneSkill/add',
    isJSON: true,
    data
  })
}

// 新增入口条件
export function addEntry (data) {
  return this.fetch({
    method: 'post',
    url: '/api/entry/add',
    isJSON: true,
    data
  })
}

// 根据接待员ID获取入口列表
export function getEntryList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/entry/list',
    params
  })
}
// 根据入口条件ID查询标签属性
export function getTagsByEntryId (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/getTagsByEntryId',
    params
  })
}
// 根据出口条件ID查询标签属性
export function getTagsByExportId (params) {
  return this.fetch({
    method: 'get',
    url: '/api/policy/getTagsByExportId',
    params
  })
}

// 新增出口条件
export function addExport (data) {
  return this.fetch({
    method: 'post',
    url: '/api/export/add',
    isJSON: true,
    data
  })
}

// 根据接待员ID获取入口列表
export function getExportList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/export/list',
    params
  })
}

// 动态人群创建场景，接待员
export function addScenedynamic (data) {
  return this.fetch({
    method: 'post',
    url: '/api/scene/dynamic',
    isJSON: true,
    data
  })
}
// 新建分组
export function addGroup (data) {
  return this.fetch({
    method: 'post',
    url: `/api/scene/addGroup/${data.sceneType}`,
    isJSON: true,
    data: data.list
  })
}

// 删除分组
export function delGroup (data) {
  return this.fetch({
    method: 'post',
    url: `/api/scene/delGroup/${data.groupId}`
  })
}

// 根据场景 ID 获取分组列表
export function getListGroup (params) {
  return this.fetch({
    method: 'get',
    url: '/api/scene/listGroup',
    params
  })
}
// 接待员绩效目标查询接口
export function getPerformanceGoalData (params) {
  return this.fetch({
    method: 'get',
    url: '/api/getPerformanceGoalData',
    params
  })
}
// 接待员复制接口
export function copyServicer (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/copy',
    isJSON: true,
    data
  })
}

// 查询影片接口
export function getReceptionistVideo (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/getVideo',
    params
  })
}
// 获取内容源接口
export function getReceptionistVideoSource (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/getVideoSource',
    params
  })
}
// 保存绩效指标接口
export function saveEditIndicator (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/editIndicator',
    isJSON: true,
    data
  })
}

// 获取内容源接口
export function getTargetById (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/getReceptionistById',
    params
  })
}
// 动态人群新增影视模型标签
export function getUptmTree (params) {
  return this.fetch({
    method: 'get',
    url: '/api/uptm/tree',
    params
  })
}

// 动态人群新增影视模型标签
export function getUptmTag (params) {
  return this.fetch({
    method: 'get',
    url: '/api/uptm/getTag',
    params
  })
}

// 获取某内容源推荐影片接口
export function getTopRecommendResourceList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/uptm/getTopRecommendResourceList',
    params
  })
}
// 获取内容源列表接口
export function getSourceList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/uptm/getSourceList',
    params
  })
}
// 复用接待员接口
export function reuseReceptionist (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/reuse',
    data,
    isJSON: true
  })
}
// 复用接待员 - 修改处理方式接口
export function updateExport (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/updateExport',
    data,
    isJSON: true
  })
}
// 判断一个接待员是否编辑权限接口
export function getCanReuse (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/canReuse',
    params
  })
}
// 维度接口
export function getBatchUptm (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/batch/uptm',
    params
  })
}

// 第一步保存
export function batchSaveFirst (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/batch/saveFirst',
    data,
    isJSON: true
  })
}

// 第二步获取接待员列表
export function getBatchList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/batch/list',
    params
  })
}

// 第二步保存
export function batchSaveSecond (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/batch/saveSecond',
    data,
    isJSON: true
  })
}

// --------------- 一键投放相关接口  start------------------------

/// 1：场景 - 跳过保存
export function sceneSkip (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/sceneSkip',
    data,
    isJSON: true
  })
}
// 1：场景 - 下一步
export function sceneNext (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/sceneNext',
    data,
    isJSON: true
  })
}

// 每个步骤公用的：获取当前场景详情
export function getSceneDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/getSceneDetail',
    params
  })
}

// 2： 创建方式 - 跳过保存
export function createTypeSkip (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/createTypeSkip',
    data,
    isJSON: true
  })
}
// 2：创建方式 - 下一步
export function createTypeNext (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/createTypeNext',
    data,
    isJSON: true
  })
}

// 查询接待员列表
export function getListbySceneId (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/getListbySceneId',
    params
  })
}
// 查询批量公共属性
export function batchSetLast (params) {
  return this.fetch({
    method: 'get',
    url: '/api/receptionist/batchSetLast',
    params
  })
}

// 3： 逐个创建名称 - 跳过保存
export function oneByOneListSkip (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/oneByOneListSkip',
    data,
    isJSON: true
  })
}

// 3： 逐个创建名称 - 下一步
export function oneByOneListNext (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/oneByOneListNext',
    data,
    isJSON: true
  })
}

// 3： 批量创建 - 跳过保存
export function batchSetSkip (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/batchSetSkip',
    data,
    isJSON: true
  })
}

// 3： 批量创建 - 下一步
export function batchSetNext (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/batchSetNext',
    data,
    isJSON: true
  })
}
// 4： 统一配置 - 跳过保存
export function batchListSkip (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/batchListSkip',
    data,
    isJSON: true
  })
}

// 4： 统一配置 - 下一步
export function batchListNext (data) {
  return this.fetch({
    method: 'post',
    url: '/api/receptionist/batchListNext',
    data,
    isJSON: true
  })
}

// --------------- 一键投放相关接口  end------------------------
