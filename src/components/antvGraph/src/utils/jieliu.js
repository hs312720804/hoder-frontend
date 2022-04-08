export function jieliu (cb, delay) {
  let timer
  // console.log('cb==', cb)
  // console.log('delay==', delay)
  return function () {
    let context = this
    if (timer) {
      return
    }

    timer = setTimeout(function () {
      console.log(cb)
      cb.apply(this, arguments)
      timer = null
    }, delay)
  }
}

export function fangdou (cb, delay) {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb.apply(this, arguments)
    }, delay)
  }
}
