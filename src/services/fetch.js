import qs from 'qs'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'

// http request拦截
axios.interceptors.request.use(
  config => {
    // 添加断开请求的方法---------------------这里为重点-----------------------------
    config.cancelToken = new axios.CancelToken((cancel) => {
      Vue.$httpRequestList.push(cancel) // 存储cancle
    })

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器, 401 状态码时，跳转至登录页
axios.interceptors.response.use((response) => {
  // console.log('response===', response)
  return response
}, function (error) {
  // if (error.response && error.response.status === 401) {
  //   // const lo = location.origin + location.pathname + '#/login'
  //   // console.log('router--->', router)
  //   // console.log('location--->', lo)
  //   // // window.location = lo
  //   // location.href = lo
  //   // // router.replace('/login')
  //   // console.log('token 失效啦')
  //   // window.location = '/login'
  //   // window.location.reload()
  //   // NProgress.done()
  //   // window.location = location.origin + location.pathname + '#/login'
  //   // console.log('location.href--->', location.href)
  //   // router.replace('/login').catch(() => {})
  //   // return new Promise(function () {}) // 空的Promise对象，没有机会执行catch，进而不做错误提示了
  //   return Promise.reject({
  //     code: 41
  //   })
  // }
  return Promise.reject(error)
})

export default function fetch ({
  method = 'get',
  url,
  data,
  params,
  isReturnAllInfor = false,
  isJSON = false,
  isFileStream = false,
  contentType
}) {
  NProgress.start()
  const option = {
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
  if (url !== '/api/login') option.headers = { Authorization: this.state.token }
  // if (url !== '/api/login') option.headers = { Authorization: 'this.state.token' }
  if (option.contentType) option.headers['Content-Type'] = option.contentType
  return axios(option)
    .then(function ({ data }) {
      NProgress.done()
      const codeFormat = parseInt(data.code)
      if (isFileStream) {
        return isReturnAllInfor ? data : data.data
      }
      // 3000 - 警告
      if (codeFormat === 0 || codeFormat === 1000 || codeFormat === 3000) {
        // return isReturnAllInfor ? data : data.data
        if (isReturnAllInfor) {
          return data
        } else if (!data.data && data.result) {
          return { data: data.result }
        } else {
          return data.data
        }
      } else if (codeFormat === 400001 || codeFormat === 9999) {
        location.href = location.origin + location.pathname + '#/login'
      } else {
        console.log('errData==>', data)
        if ((data.status && data.status == '401') || (data.statusText && data.statusText == 'No Transport')) {
          console.log('401==>', data)
          const currentUrl = window.location.href
          window.location.href = currentUrl
          return
        }
        throw {
          code: data.code,
          message: data.msg
        }
      }
    })
    .catch(err => {
      console.log('errData==>', err)
      // Error: Network Error
      NProgress.done()
      // 异常时，跳转至登录页
      // if (errString && (errString.indexOf('401') > -1 || errString.code.indexOf('401') > -1)) {
      // if (errString && errString.code && (errString.code.indexOf('401') > -1)) {
      //   Message.info({ type: 'danger', message: '身份已经过期，请重新登录' })
      //   location.href = location.origin + location.pathname + '#/login'
      //   return
      // }
      throw err
    })
}
