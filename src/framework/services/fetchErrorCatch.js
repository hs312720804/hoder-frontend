/**
 * 对接口请求错误信息进行处理
 * 应用使用者可以在自身项目的 src/framework/services/ 目录下创建同名的文件进行覆盖
 */
import { Notification } from 'element-ui'
export default (error, { args }) => {
  // const argss = args[0]
  // errorApi.push({
  //   results: error,
  //   apiUrl: argss.url,
  //   method: argss.method,
  //   params: argss.params || argss.data
  // })
  Notification({
    title: `操作失败（Code = ${error.code}）`,
    type: 'error',
    message: error.message
  })
  throw error
}
