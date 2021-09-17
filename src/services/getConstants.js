export default function (data) {
  return this.fetch({
    method: 'POST',
    url: '/api/getRoleMenus',
    data
  })
}
