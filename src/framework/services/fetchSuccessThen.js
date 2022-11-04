// const apiPrefix = process.env.VUE_APP_PROJECT_CODE
// 对接口返回参数做修改
export default (data, { args }) => {
  const { url } = args[0]
  // 针对部分接口返回值做额外处理
  const allResponseUrl = ['auth/', 'admin/']
  if (allResponseUrl.some(ele => url.indexOf(ele) === 0)) {
    return data
  } else {
    return data.data
  }
}
