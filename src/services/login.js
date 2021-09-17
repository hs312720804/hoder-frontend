export default function login (data) {
  return this.fetch({
    method: 'post',
    url: '/api/login',
    data
  }).then((user) => {
    this.state = user
    return user
  })
}
