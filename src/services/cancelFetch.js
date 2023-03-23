// 取消重复请求
import Vue from 'vue'
import axios from 'axios'

// generateReqKey：用于根据当前请求的信息，生成请求 Key；

export function generateReqKey (config) {
  const { method, url } = config
  return [method, url].join('&')
}

// addPendingRequest：用于把当前请求信息添加到pendingRequest对象中；

export function addPendingRequest (config) {
  const pendingRequest = Vue.$httpRequestList
  const requestKey = generateReqKey(config)
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (pendingRequest.has(requestKey)) {
      const list = pendingRequest.get(requestKey)
      const cancelTokenList = [...list, cancel]
      pendingRequest.set(requestKey, cancelTokenList)
    } else {
      pendingRequest.set(requestKey, [cancel])
    }
  })
}

// removePendingRequest：检查是否存在重复请求，若存在则取消已发的请求。

export function removePendingRequest ({ method, url }) {
  const pendingRequest = Vue.$httpRequestList
  const requestKey = generateReqKey({ method, url })
  if (pendingRequest.has(requestKey)) {
    const cancelTokenList = pendingRequest.get(requestKey)
    // cancelToken(requestKey)
    cancelTokenList.forEach(cancel => {
      // 给个标志，中断请求
      cancel()
      console.log('中断请求', cancel)
    })
    pendingRequest.delete(requestKey)
  }
}

// Vue.prototype.clearHttpRequestingList = function (url) {
//   // 判断是否有存储的cancle
//   console.log('Vue.$httpRequestList-->', Vue.$httpRequestList)
//   if (Vue.$httpRequestList.length > 0) {
//     Vue.$httpRequestList.forEach(cancel => {
//     // 给个标志，中断请求
//       cancel()
//       console.log('中断请求', cancel)
//     })
//     Vue.$httpRequestList = []
//   }
// }
