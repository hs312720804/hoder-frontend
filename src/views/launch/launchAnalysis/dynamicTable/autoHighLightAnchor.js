// https://juejin.cn/post/6844904008327364615#heading-9
class AutoHighLightAnchor {
  // anchors;
  // ScrollContrainer;
  // throttleFn;
  // strategy;
  constructor (anchorsContainer, ScrollContrainer, strategy = 'type1') {
    debugger
    console.log('anchorsContainer------->', anchorsContainer)
    this.anchors = anchorsContainer.querySelectorAll('a')
    console.log('anchors------->', this.anchors)
    this.ScrollContrainer = ScrollContrainer
    this.strategy = strategy
    this.init()
  }

  init (strategy = this.strategy) {
    debugger
    if (this.throttleFn) {
      this.remove()
    }
    this.throttleFn = throttle(this[strategy].bind(this), 100)
    this.throttleFn() // 初始执行一次更新位置
    console.log('this.ScrollContrainer========>', this.ScrollContrainer)
    this.ScrollContrainer.addEventListener('scroll', this.throttleFn, {
      passive: true
    })
  }

  remove () {
    this.ScrollContrainer.removeEventListener('scroll', this.throttleFn, {
      passive: true
    })
  }

  highLightAnchor (id) {
    this.anchors.forEach(element => {
      element.classList.remove('highLight')
      if (element.getAttribute('to') === id) {
        element.classList.add('highLight')
      }
    })
  }

  type1 (e) {
    console.log('e---------->', e)
    let highligthId
    const windowHeight = this.ScrollContrainer.offsetHeight
    this.anchors.forEach(element => {
      console.log('element----->', element.hash)
      const id = element.getAttribute('to')
      const target = document.getElementById(id)
      console.log('target----->', target)
      if (target) {
        const {
          top
        } = target.getBoundingClientRect()
        // 当元素头部可见时
        if (top < windowHeight) {
          highligthId = id
        }
      }
    })
    if (highligthId) {
      this.highLightAnchor(highligthId)
    }
  }

  type4 (e, offsetTop = 0) {
    const highligthId = Array.prototype.reduce.call(this.anchors, (prev, curr) => {
      const id = curr.getAttribute('to')
      const target = document.getElementById(id)
      if (target) {
        const {
          top
        } = target.getBoundingClientRect()
        // 当元素头部距离顶部小于规定范围时 即 top <= offsetTop
        return top <= offsetTop && top > prev.top
          ? {
              id,
              top
            }
          : prev
      } else {
        return prev
      }
    }, {
      id: null,
      top: -Infinity
    }).id

    if (highligthId) {
      this.highLightAnchor(highligthId)
    }
  }
}

function throttle (fn, interval = 1000) {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.call(this, ...args)
      }, interval)
    }
  }
}

export default AutoHighLightAnchor
