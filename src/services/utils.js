import { Notification, MessageBox, Message } from 'element-ui'
import { throttle } from 'lodash'

// 错误信息根据关键词过滤，得出错误标题
function filterContentFromMessage (message) {
  let returnmessage = false

  const keyValue = {
    NullPointException: '空指针异常',
    ArrayIndexOutOfBoundsException: '数组越界异常',
    ClassCastException: '强制类型转换异常',
    NumberFormatException: '数字格式化异常',
    InputMismatchException: '输入类型不匹配异常',
    ArithmeticException: '算数运算符异常',
    IndexOutOfBoundsException: '索引越界异常',
    SQLException: 'SQL异常',
    OutOfMemoryError: '内存溢出异常',
    IOException: 'IO异常',
    FileNotFoundException: '找不到文件异常'
    // Other: '其他异常信息'
  }

  // 根据【筛选规则】匹配得出的
  for (const key in keyValue) {
    if (message.includes(key)) {
      returnmessage = keyValue[key]
      break
    }
  }

  // 能匹配，就返回匹配结果，否则返回 false
  return returnmessage
}

// 错误提示方法
function onMessage (options) {
  const { message, apiUrl } = options

  // 正文，匹配【筛选规则】
  // filterContentFromMessage() 方法待完善
  let content = filterContentFromMessage(message)

  // 【查看】按钮是否展示
  let hasOpen = true

  // 无法匹配【筛选规则】
  if (!content) {
    if (message.length > 100) {
      content = `${apiUrl}异常`
    } else {
      content = `${message}`
      // 无法匹配规则 并且 小于100字时，隐藏【查看】按钮
      hasOpen = false
    }
  }

  const filterMessage = `
    <p class='message-div'>
      ${content}
      ${hasOpen ? '<span style="color:#0066ff; cursor:pointer"> 查看</span>' : ''}
    </p>`

  const notify = Message({
    // title: '服务异常', // 默认
    dangerouslyUseHTMLString: true,
    message: filterMessage,
    type: 'error'
  })
  // 是否有【查看】按钮
  if (hasOpen) {
    notify.$el.querySelector('span').onclick = () => {
      // 点击后关闭notify 不需要的话可注释
      notify.close()

      MessageBox({
        // ...options,
        title: content,
        message: `
        <p class='message-div' style="max-height:500px; overflow: auto;">
          ${message}
        </p>`,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了'
      })
    }
  }
}

export default throttle(onMessage)
