/**
 * 对接口返回参数做修改
 */
export default (data, { args }) => {
  const { url, isReturnAllInfor, isFile } = args[0]
  /**
   * 针对部分接口返回值做额外处理 接口以auth/ admin/开头或 isReturnAllInfor为true的接口返回所有数据
   * 其它接口只返回data值
   */
  //
  const allResponseUrl = ['auth/', 'admin/']
  if (allResponseUrl.some(ele => url.indexOf(ele) === 0) || isReturnAllInfor || isFile) {
    return data
  } else {
    return data.data
  }
}
