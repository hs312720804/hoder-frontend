/**
 *设置画布可拖拽，滚动放大缩小
 * @parent         可拖拽的范围
 * @current        可拖拽元素
 */
export default function setMoveAndDrag (parent, current) {
  // const oBox = document.querySelector('#wrap')
  // const oDiv = document.querySelector('#canvas')
  const oBox = document.querySelector(parent)
  const oDiv = document.querySelector(current)
  let x // 鼠标按下时图片相对浏览器的位置
  let y // 鼠标按下时图片相对浏览器的位置
  const DELTA = 1.1 // 每次放大/缩小的倍数

  // 鼠标按下 获取位置并添加事件监听
  const mouseDown = e => {
    const transf = getTransform(oDiv)
    x = e.clientX - transf.transX // 图片初始位置
    y = e.clientY - transf.transY // 图片初始位置
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
  }

  // 鼠标拖动 更新transform
  const mouseMove = e => {
    const multiple = getTransform(oDiv).multiple
    const moveX = e.clientX - x // x向移动距离
    const moveY = e.clientY - y // y向移动距离
    const newTransf = limitBorder(oDiv, oBox, moveX, moveY, multiple)
    oDiv.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf.transX}, ${newTransf.transY})`
  }

  // 鼠标抬起 移除监听器
  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
  }

  // 鼠标滚轮缩放 更新transform
  const zoom = e => {
    const transf = getTransform(oDiv)
    if (e.deltaY < 0) {
      transf.multiple *= DELTA // 放大DELTA倍
    } else {
      transf.multiple /= DELTA // 缩小DELTA倍
    }
    const newTransf = limitBorder(oDiv, oBox, transf.transX, transf.transY, transf.multiple)
    oDiv.style.transform = `matrix(${transf.multiple}, 0, 0, ${transf.multiple}, ${newTransf.transX}, ${newTransf.transY})`
  }

  /**
     * 通过getComputedStyle获取transform矩阵 并用split分割
     * 如 oDiv 的 transform: translate(100, 100);
     * getComputedStyle可以取到"matrix(1, 0, 0, 1, 100, 100)"
     * 当transform属性没有旋转rotate和拉伸skew时
     * metrix的第1, 4, 5, 6个参数为 x方向倍数, y方向倍数, x方向偏移量, y方向偏移量
     * 再分别利用 字符串分割 取到对应参数
     */
  const getTransform = DOM => {
    const arr = getComputedStyle(DOM).transform.split(',')
    return {
      transX: isNaN(+arr[arr.length - 2]) ? 0 : +arr[arr.length - 2], // 获取translateX
      transY: isNaN(+arr[arr.length - 1].split(')')[0]) ? 0 : +arr[arr.length - 1].split(')')[0], // 获取translateX
      multiple: +arr[3] // 获取图片缩放比例
    }
  }

  /**
     * 获取边框限制的 transform 的 x, y 偏移量
     * innerDOM: 内盒子DOM
     * outerDOM: 边框盒子DOM
     * moveX: 盒子的x移动距离
     * moveY: 盒子的y移动距离
     */
  const limitBorder = (innerDOM, outerDOM, moveX, moveY, multiple) => {
    const { clientWidth: innerWidth, clientHeight: innerHeight, offsetLeft: innerLeft, offsetTop: innerTop } = innerDOM
    const { clientWidth: outerWidth, clientHeight: outerHeight } = outerDOM
    let transX
    let transY
    // 放大的图片超出box时 图片最多拖动到与边框对齐
    // if (innerWidth * multiple > outerWidth || innerHeight * multiple > outerHeight) {
    //     if (innerWidth * multiple > outerWidth && innerWidth * multiple > outerHeight) {
    //         transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 ), innerWidth * (multiple - 1) / 2)
    //         transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2), innerHeight * (multiple - 1) / 2)
    //     } else if (innerWidth * multiple > outerWidth && !(innerWidth * multiple > outerHeight)) {
    //         transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 ), innerWidth * (multiple - 1) / 2)
    //         transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 ), innerHeight * (multiple - 1) / 2)
    //     } else if (!(innerWidth * multiple > outerWidth) && innerWidth * multiple > outerHeight) {
    //         transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 ), innerWidth * (multiple - 1) / 2)
    //         transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2), innerHeight * (multiple - 1) / 2)
    //     }
    // }
    // 图片小于box大小时 图片不能拖出边框
    // else {
    // console.log('bottom=====', outerHeight - 50)
    // console.log('top=====', -innerHeight * (multiple) + 50)
    // console.log('multiple=====', multiple)

    // transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 ), innerWidth * (multiple - 1) / 2)
    // transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 ), innerHeight * (multiple - 1) / 2)
    // }

    // transX = Math.max(Math.min(moveX, right), left)
    // transY = Math.max(Math.min(moveY, bottom), top)
    const limitDistance = 50
    transX = Math.max(Math.min(moveX, outerWidth + (innerWidth * (multiple - 1) / 2) - limitDistance), -innerWidth * (multiple + 1) / 2 + limitDistance)
    transY = Math.max(Math.min(moveY, outerHeight + (innerHeight * (multiple - 1) / 2) - limitDistance), -innerHeight * (multiple + 1) / 2 + limitDistance)

    return { transX, transY }
  }

  const init = () => {
    // 禁止选中文字/图片
    document.addEventListener('selectstart', e => { e.preventDefault() })
    // 鼠标按下事件
    oDiv.addEventListener('mousedown', mouseDown)
    // 图片缩放
    oDiv.addEventListener('wheel', zoom)
  }

  init()
}
