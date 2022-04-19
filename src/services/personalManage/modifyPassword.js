export function modifyPwd (params) {
  return this.fetch({
    method: 'post',
    url: '/api/manage/user/modifyPwd',
    params
  }).then((data) => {
    return data
  })
}
