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
