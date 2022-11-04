export default args => {
  const { url, successCodes } = args[0] || { url: '' }
  if (url.indexOf('/api') === 0) {
    args[0].url = url.replace('/api', `${process.env.VUE_APP_PROJECT_CODE}`)
  }
  args[0].successCodes = successCodes || [0, undefined] // 当 code 为空时也返回正常数据
  return args
}
