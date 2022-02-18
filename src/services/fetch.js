import qs from 'qs'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export default function fetch ({
  method = 'get',
  url,
  data,
  params,
  isReturnAllInfor = false,
  isJSON = false,
  contentType
}) {
  NProgress.start()
  let option = {
    method,
    url,
    data: data instanceof FormData
      ? data
      : isJSON
        ? data
        : qs.stringify(data),
    params,
    contentType,
    paramsSerializer: params => { // get请求参数序列化
      return qs.stringify(params, { indices: false })
    }
  }
  // debugger
  if (url !== '/api/login') option.headers = { Authorization: this.state.token }
  if (option.contentType) option.headers['Content-Type'] = option.contentType
  return axios(option)
    .then(function ({ data }) {
      NProgress.done()
      const codeFormat = parseInt(data.code)
      if (codeFormat === 0 || codeFormat === 1000) {
        return isReturnAllInfor ? data : data.data
      } else if (codeFormat === 400001 || codeFormat === 9999) {
        location.href = location.origin + location.pathname + '#/login'
      } else {
        console.log('errData==>', data)
        if ((data.status && data.status == '401') || (data.statusText && data.statusText == 'No Transport')) {
          console.log('401==>', data)
          var currentUrl = window.location.href
          window.location.href = currentUrl
          return
        }
        throw {
          code: data.code,
          message: data.msg
        }
      }
    })
    .catch(e => {
      console.log('errData==>', e)
      // Error: Network Error
      // 异常时，跳转至登录页
      // location.href = location.origin + location.pathname + '#/login'
      NProgress.done()
      throw e
    })
}
