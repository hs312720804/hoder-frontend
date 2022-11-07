import { Notification } from 'element-ui'
export default (error, { args }) => {
  // const errorApis = JSON.parse(errorApi)
  const argss = args[0]
  errorApi.push({
    results: error,
    apiUrl: argss.url,
    method: argss.method,
    params: argss.params || argss.data
  })
  Notification({
    title: `操作失败（Code = ${error.code}）`,
    type: 'error',
    message: error.message
  })
  throw error
}
