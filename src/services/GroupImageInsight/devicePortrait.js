// 设备画像列表
export function getDevicePortraitList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/devicePortrait/tasks',
    params
  })
}
// 设备画像 文件上传
export function devicePortraitFileUpload (data) {
  return this.fetch({
    method: 'post',
    url: '/api/devicePortrait/fileUpload',
    data
  })
}
// 设备画像 新增保存
export function devicePortraintAddSave (params) {
  return this.fetch({
    method: 'get',
    url: '/api/devicePortrait/save',
    params
  })
}
// 设备画像 删除
export function devicePortraintDel (params) {
  return this.fetch({
    method: 'get',
    url: '/api/devicePortrait/delete',
    params
  })
}
// 设备画像 查看画像
export function seeDevicePortraintCharts ({ params, id }) {
  return this.fetch({
    method: 'get',
    url: '/api/crowd/devPacketPortrait/' + id,
    params
  })
}
