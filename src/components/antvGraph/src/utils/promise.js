export default class MyPromise {
  static PENDING = '待定'
  static FULFILL = '完成'
  static REJECTED = '拒绝'
  constructor (func) {
    this.func = func
    this.status = MyPromise.PENDING
    this._value = undefined
    this.func(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve (value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILL
      this._value = value
    }
  }
  reject (value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED
      this._value = value
    }
  }
  then (res, rej) {
    if (this.status === MyPromise.FULFILL) {
      setTimeout(() => {
        res(this._value)
      })
    }

    if (this.status === MyPromise.REJECTED) {
      setTimeout(() => {
        rej(this._value)
      })
    }
  }
}
console.log(1)
let a = new MyPromise((resolve, reject) => {
  console.log(2)
  resolve('success')
  reject('error')
})
a.then((res) => {
  console.log(4)
  console.log('res===', res)
}, (err) => {
  console.log('err===', err)
})
console.log(3)
