
class CreateNodesAndEdges {
  constructor (type, crowdList, commonObj, height) {
    this.type = type
    this.crowdList = crowdList
    this.commonObj = commonObj
    this.height = height
  }

  // 初始化连线
  initEdges () {
    const type = this.type
    let arr = []
    const data = this.crowdList
    const commonObj = {
      start: {
        x: 0,
        y: 17
      },
      end: {
        x: 0,
        y: -17
      },
      shape: 'customEdge',
      type: 'edge'
    }
    // 顺序
    if (type === 0 || type === 1) {
      data.reduce((current, item) => {
        arr.push({
          ...commonObj,
          source: current.crowdId.toString(),
          target: item.crowdId.toString(),
          sourceId: current.crowdId.toString(),
          targetId: item.crowdId.toString()
        })
        return item
      }, data[0])

      arr.shift()
    }
    if (type === 1) { // 循环
      arr.push({
        ...commonObj,
        label: '权重',
        source: (data[data.length - 1].crowdId).toString(),
        target: (data[0].crowdId).toString(),
        sourceId: (data[data.length - 1].crowdId).toString(),
        targetId: (data[0].crowdId).toString()
      })
    }

    return arr
  }

  // 初始化节点
  initDefaultNodes () {
    const data = this.crowdList
    const commonObj = this.commonObj
    const height = this.height

    if (this.type === 3) { // 自定义
      commonObj.inPoints = [[0, 0.5]]
      commonObj.outPoints = [[1, 0.5]]
    } else { // 其他流转算法没有出入口
      commonObj.inPoints = undefined
      commonObj.outPoints = undefined
    }
    // this.Y = -90
    // this.X = this.width / 2
    this.X = -200
    this.Y = height / 2
    let arr = data.map((item, index) => {
      const x = this.X += 300
      const y = this.Y += 1

      // const x = this.X += 1
      // const y = this.Y += 150
      const obj = {
        ...commonObj,
        ...item,
        x,
        y,
        name: item.crowdName,
        label: item.crowdName,
        id: item.crowdId.toString(),
        arithmetic: null,
        weight: null,
        degree: 5,
        mainType: this.type // 分组算法
      }

      if (this.type === 3) { // 自定义
        obj.arithmetic = item.arithmetic ? item.arithmetic : 2
        obj.weight = item.weight
      }

      return obj
    })

    return arr
  }

  // 初始化随机节点
  initRandomNodes () {
    const data = this.crowdList
    const commonObj = this.commonObj

    if (this.type === 3) { // 自定义
      commonObj.inPoints = [[0, 0.5]]
      commonObj.outPoints = [[1, 0.5]]
    } else { // 其他流转算法没有出入口
      commonObj.inPoints = undefined
      commonObj.outPoints = undefined
    }

    let arr = data.map((item, index) => {
      const xy = this.returnStyle(index)

      const x = xy.left
      const y = xy.top

      return {
        ...commonObj,
        ...item,
        x,
        y,
        name: item.crowdName,
        label: item.crowdName,
        id: item.crowdId.toString(),
        arithmetic: null
      }
    })

    // 初始数据
    // this.data = {
    //   nodes: arr
    // }

    return arr
  }

  returnStyle (index) {
    const obj = {

      radius: 200,
      // 每一个BOX对应的角度;
      avd: 0,
      // 每一个BOX对应的弧度;
      ahd: 0,
      dotLeft: 635,
      // 中心点纵坐标
      dotTop: 235
    }
    const len = this.crowdList.length
    // // 半径
    // this.radius = 200
    // // 每一个BOX对应的角度;
    obj.avd = 360 / len
    // 每一个BOX对应的弧度;
    obj.ahd = obj.avd * Math.PI / 180

    const ahd = obj.ahd
    const radius = obj.radius
    const dotLeft = obj.dotLeft
    const dotTop = obj.dotTop

    const left = Math.sin(ahd * index) * radius + dotLeft
    const top = Math.cos(ahd * index) * radius + dotTop

    return {
      left,
      top
    }
  }
}

export default CreateNodesAndEdges
