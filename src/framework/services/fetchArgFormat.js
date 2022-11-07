/**
 * services 发请求前处理
 */
export default args => {
  const args0 = args[0]
  const { url, successCodes } = args0 || { url: '' }
  // 当接口未设置 isJSON属性 设置isJSON默认为false
  if (!Object.keys(args[0]).includes('isJSON')) {
    args0.isJSON = false
  }

  if (url.indexOf('/api') === 0) {
    args0.url = url.replace('/api', `${process.env.VUE_APP_PROJECT_CODE}`)
  }

  args0.successCodes = successCodes || [0, undefined] // 当 code 为空时也返回正常数据
  return args
}
