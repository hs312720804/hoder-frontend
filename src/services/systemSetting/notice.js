export function noticeList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/manager/notice/getNoticePage',
    params
  })
}
export function noticeAdd (data) {
  return this.fetch({
    method: 'post',
    url: '/api/manager/notice/addNotice',
    data
  })
}
export function noticeDetail (params) {
  return this.fetch({
    method: 'get',
    url: '/api/manager/notice/getByNoticeId',
    params
  })
}
export function noticeEdit (data) {
  return this.fetch({
    method: 'put',
    url: '/api/manager/notice/updateNotice',
    data
  })
}
export function noticeDel (params) {
  return this.fetch({
    method: 'delete',
    url: '/api/manager/notice/deleteNotice',
    params
  })
}
export function getNoticeHeaderList (params) {
  return this.fetch({
    method: 'get',
    url: '/api/manager/notice/getByNoticeType',
    params
  })
}
