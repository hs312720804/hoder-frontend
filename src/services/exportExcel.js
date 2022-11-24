import fetch from 'cseed-frame/services/_fetch'
import download from 'downloadjs'
import { Message } from 'element-ui'
export function exportFile ({ url, method, data, params }) {
  return fetch({
    method,
    url,
    params,
    data,
    isJSON: false,
    isFile: true,
    options: {
      responseType: 'blob'
    }
  }).then(res => {
    const { headers: { 'content-disposition': contentDisposition } } = res
    if (!contentDisposition) {
      Message.error('缺少文件类型，无法下载')
    }
    const reg = new RegExp(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    const resList = contentDisposition.match(reg)
    if (resList.length > 1) {
      download(res.data, decodeURIComponent(resList[1]))
    } else {
      Message.error('缺少文件类型，无法下载')
    }
  })
}