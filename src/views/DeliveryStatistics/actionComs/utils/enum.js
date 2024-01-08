export const nodeTypeText = {
  // 节点类型:
  1: '周期范围',
  2: '下拉框',
  3: '输入框',
  4: '搜索框',
  5: '范围选择',
  6: '指标框'
}
export const getValueObjFormat = () => {
  return {
    name: '',
    value: '',
    field: '',
    operator: '',
    type: ''
  }
}
export const getNodeTypeValueFormat = (type) => {
  switch (type) {
    // 周期范围
    case 1: {
      return {
        id: '',
        type: 1,
        valueObj: {
          rangeType: '',
          rang: {
            name: '',
            value: ['', ''],
            field: ''
          },
          weekRang: {
            name: '',
            value: [],
            field: ''
          },
          timeRange: {
            name: '',
            value: [],
            field: ''
          }
        }
      }
    }
    // 下拉框
    case 2: {
      return {
        id: '',
        type: 2,
        keyName: '',
        isDiguiNode: false,
        diGuiKeyName: '',
        nextNodeList: [],
        relations: {
          hide: {
            status: false,
            list: []
          }
        },
        valueObj: getValueObjFormat()
      }
    }
    // 指标框
    case 6: {
      return {
        id: '',
        type: 6,
        keyName: '',
        isDiguiNode: false,
        diGuiKeyName: '',
        nextNodeList: [],
        relations: {
          hide: {
            status: false,
            list: []
          }
        },
        valueObj: getValueObjFormat()
      }
    }
  }
}
