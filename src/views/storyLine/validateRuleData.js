import { MessageBox, Message } from 'element-ui'
// import { ReorganizationData, putBehaviorRulesJsonTableIndex, getFormPromise, checkNumMostFour, checkNum } from '@/views/crowdStrategy/crowdAddSaveFunc.js'

let timeTagKongList = []

/** 校验普通标签、行为标签、流转规则 的统一封装方法
 * @param {Object} subAttr 附属属性
 *                 - returnDefaultData： 默认需要返回的数据
 *                 - isNeedValidate: 是否需要验证 true-是  false-否  默认为 true
 */
async function validateRule (_this, thisRulesJson, thisBehaviorRulesJson, flowCondition, subAttr = { returnDefaultData: {}, isNeedValidate: true }) {
  // 是否需要校验数据，若不需要校验数据，则只需要处理数据格式即可
  const isNeedValidate = subAttr.isNeedValidate === undefined ? true : subAttr.isNeedValidate

  if (isNeedValidate) {
    // 校验整体大表单：【处理操作】、【流转接待员】
    const valid1 = await new Promise((resolve, reject) => {
      return _this.$refs.form.validate(async valid => {
        resolve(valid)
      })
    })
    console.log('flowCondition--->', flowCondition)
    // 校验【流转指标】
    const valid2 = flowCondition && flowCondition.rules.length > 0
      ? await new Promise((resolve, reject) => {
        return _this.$refs.setCirculationRef.$refs.ruleForm.validate((valid) => {
          resolve(valid)
        })
      })
      : true

    // 校验【普通标签】里面的【流转指标】
    const valid3 = _this.$refs.MultipleSelectRef
      ? await new Promise((resolve, reject) => {
        return _this.$refs.MultipleSelectRef.$refs.ruleForm.validate((valid) => {
          resolve(valid)
        })
      })
      : true

    if (!valid1 || !valid2 || !valid3) return Promise.reject()
  }

  // const form = JSON.parse(JSON.stringify(thisForm))
  const tagIds = []
  const ruleJson = JSON.parse(JSON.stringify(thisRulesJson))
  const behaviorRulesJson = putBehaviorRulesJsonTableIndex(JSON.parse(JSON.stringify(thisBehaviorRulesJson)))

  const rules = ruleJson.rules

  const behaviorRules = behaviorRulesJson.rules

  // 校验【普通标签】规则 (包括行为标签里面的大数据标签规则)
  const { rulesFlag, operateTpye } = validateForm(rules, behaviorRules, _this, isNeedValidate)
  if (!rulesFlag && isNeedValidate) {
    return Promise.reject(operateTpye)
  }

  // 添加 tagIds
  rules.forEach(function (item) {
    item.rules.forEach(function (childItem) {
      if (tagIds.indexOf(childItem.tagId) === -1) {
        tagIds.push(childItem.tagId)
      }
      // delete childItem.startDay
      // delete childItem.endDay
    })
  })

  // ---------------------------- 行为标签的数据 进行重组  start--------------------------------
  behaviorRules.forEach(function (item) {
    item.rules.forEach(function (rulesItem) {
      if (tagIds.indexOf(rulesItem.tagId) === -1) {
        tagIds.push(rulesItem.tagId)
      }
      // 多选的值，保存的时候需要转成字符串 2222
      // if (childItem.tagType === 'string') {
      if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
        rulesItem.value = Array.isArray(rulesItem.value) ? rulesItem.value.join(',') : rulesItem.value
      }

      // if (rulesItem.bav && rulesItem.bav.rang.newValue) { // 日期多选
      if (rulesItem.bav && rulesItem.bav.rang.newValue && rulesItem.bav.rangeType === 'fixed') { // 固定周期 日期多选
        const newValue = rulesItem.bav.rang.newValue
        const data = []
        newValue.forEach(item => {
          if (item.value && item.value.length > 0) data.push({ value: item.value })
        })
        rulesItem.bav.rang.newValue = data
        rulesItem.bav.rang.value = newValue.map(item => {
          if (item.value) return item.value
        }).flat()
      }

      if (rulesItem.tagCode === 'BAV0016' || rulesItem.tagCode === 'BAV0012' || rulesItem.tagCode === 'BAV0011') { // 【综合起播】数据需要重组  showBehaviorValue => behaviorValue
        const rData = []
        const showBehaviorValue = rulesItem.bav.showBehaviorValue
        showBehaviorValue.forEach(item => {
          const itemCopy = JSON.parse(JSON.stringify(item))
          const childArray = ReorganizationData(itemCopy.child)
          const countValue = JSON.parse(JSON.stringify(rulesItem.bav.countValue))
          countValue.child = childArray
          itemCopy.child = [countValue]
          rData.push(itemCopy)
        })
        rulesItem.bav.behaviorValue = rData
      }
    })
  })
  // ---------------------------- 行为标签的数据 进行重组  end--------------------------------

  const data = {
    ...subAttr.returnDefaultData || undefined, // 一些默认返回数据
    rulesJson: JSON.stringify(ruleJson),
    behaviorRulesJson: JSON.stringify(behaviorRulesJson),
    tagIds
  }

  // ----------------------- 校验【行为标签】： 收集需校验的ref   start-----------------------------
  // 周期范围
  const rangeFormList = []
  const rangeRefList = _this.$refs.multipleActionTagSelect && _this.$refs.multipleActionTagSelect.$refs.range ? _this.$refs.multipleActionTagSelect.$refs.range : []

  rangeRefList.forEach(item => {
    rangeFormList.push(item.$refs.rangeForm)
  })

  // value值
  const typeFormList = []
  const typeRefList = _this.$refs.multipleActionTagSelect && _this.$refs.multipleActionTagSelect.$refs.bav ? _this.$refs.multipleActionTagSelect.$refs.bav : []

  const bavFormList = []

  // vue的特性,自动把v-for里面的ref展开成数组的形式，哪怕你的ref名字是唯一的
  typeRefList && typeRefList.forEach(item => {
    if (item.$refs.bav) bavFormList.push(item.$refs.bav)
    if (item.$refs.typeRef && Array.isArray(item.$refs.typeRef)) {
      item.$refs.typeRef.forEach(obj => {
        typeFormList.push(obj.$refs.typeForm)
      })
    } else if (item.$refs.typeRef && typeof (item.$refs.typeRef) === 'object') { // 【设备活跃】tab只有一个 type 组件，因此 typeRef 不为数组
      typeFormList.push(item.$refs.typeRef.$refs.typeForm)
    }
  })

  const allList = rangeFormList.concat(typeFormList, bavFormList)
  // ----------------------- 校验【行为标签】： 收集需校验的ref   end -----------------------------

  // 需要验证时
  if (isNeedValidate) {
    return new Promise((resolve, reject) => {
      //  选择了属性为空的 time 类型的标签, 需要提示
      if (timeTagKongList.length > 0) {
        const tip = timeTagKongList.join(',')
        const h = _this.$createElement
        MessageBox({
          title: '配置提醒',
          message: h('p', null, [
            h('span', null, `${tip}`),
            h('span', null, '标签的属性为空，请确认是否继续?'),
            h('div', { style: 'color: red' }, 'PS：标签为空代表要圈出该属性为空的人群')
          ]),
          showCancelButton: true,
          confirmButtonText: '继续',
          cancelButtonText: '取消'
        }).then(() => {
          if (allList.length > 0) { // 有行为标签的
            // 使用Promise.all去校验结果
            Promise.all(allList.map(getFormPromise)).then(res => {
              const validateResult = res.every(item => !!item)
              if (validateResult) {
                // 新增或编辑
                // fetchAddOrEdit(data)
                resolve(data)
              } else {
                Message.error('请输入必填项')
                reject()
              }
            }).catch(() => {
              Message.error('请至少设置一个行为标签规则')
              reject()
            })
          } else { // 没有行为标签的
            // 新增或编辑
            // fetchAddOrEdit(data)
            resolve(data)
          }
        })
      } else {
        if (allList.length > 0) { // 有行为标签的
          // 使用Promise.all去校验结果
          Promise.all(allList.map(getFormPromise)).then(res => {
            const validateResult = res.every(item => !!item)
            if (validateResult) {
              // 新增或编辑
              // fetchAddOrEdit(data)
              resolve(data)
            } else {
              Message.error('请输入必填项')
              reject()
            }
          }).catch(() => {
            Message.error('请至少设置一个行为标签规则')
            reject()
          })
        } else { // 没有行为标签的
          // 新增或编辑
          // fetchAddOrEdit(data)
          resolve(data)
        }
      }
    })
  } else { // 不需要验证时
    return Promise.resolve(data)
  }
}

// 校验普通标签规则 (包括行为标签里面的大数据标签规则)
function validateForm (rules, behaviorRules = [], _this, isNeedValidate) {
  timeTagKongList = []
  // 判断设置标签里是否有未填写的项
  let i
  let j = 0
  const ruleLength = rules.length
  // const dynamicPolicyRulesLength = dynamicPolicyRules.length
  let rulesFlag = true
  let operateTpye = false

  // ------------------- 普通标签规则校验 --------------------------
  for (i = 0; i < ruleLength; i++) {
    for (j = 0; j < rules[i].rules.length; j++) {
      const rulesItem = rules[i].rules[j]

      // 多选的值，保存的时候需要转成字符串 2222
      if (rulesItem.tagType === 'string' && rulesItem.operator !== 'null') {
        rulesItem.value = rulesItem.value.join(',')
      }
      // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
      const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
      if (isTimeTagKong) {
        if (!timeTagKongList.includes(rulesItem.tagName)) {
          timeTagKongList.push(rulesItem.tagName)
        }
      } else {
        // ------ 处理数据格式 start  -----
        if (rulesItem.tagType === 'time' && rulesItem.isDynamicTime === 3) {
          // 二期之后的
          if (rulesItem.version > 0) {
            const startDay = rulesItem.startDay ? rulesItem.startDay : '@'
            const endDay = rulesItem.endDay ? rulesItem.endDay : '@'
            rulesItem.value = startDay + '~' + endDay
          } else { // 一期
            if (
              checkNumMostFour(rulesItem.startDay) &&
                checkNumMostFour(rulesItem.endDay)
            ) {
              if (
                parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)
              ) {
                rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
              } else {
                // 需要验证时，才进行提示
                if (isNeedValidate) {
                  Message.error(
                    '第' +
                        (i + 1) +
                        '设置标签块里面的第' +
                        (j + 1) +
                        '行的天数值后面的值必须大于前面的'
                  )
                  rulesFlag = false
                  break
                }
              }
            } else {
              // 需要验证时，才进行提示
              if (isNeedValidate) {
                Message.error(
                  '第' +
                      (i + 1) +
                      '设置标签块里面的第' +
                      (j + 1) +
                      '行的值是大于等于0的整数且不能超过4位数'
                )
                rulesFlag = false
                break
              }
            }
          }
        } else if (rulesItem.tagType === 'string' && rulesItem.operator === 'null') {
          rulesItem.operator = '='
        }
        // ------ 处理数据格式 end  -----

        // 需要验证时，才进行提示
        if ('value' in rulesItem && (rulesItem.value === '' || rulesItem.value.length === 0) && isNeedValidate) {
          Message.error(
            '请正确填写第' +
                (i + 1) +
                '设置标签块里面的第' +
                (j + 1) +
                '行的值！'
          )
          rulesFlag = false
          break
        }
      }

      if (!rulesFlag) break
    }
    if (!rulesFlag) break
  }

  // ------------------- 行为标签中的大数据标签规则校验 --------------------------
  // ------------------- 行为标签中的【起播活跃】行为标签规则校验 兼容性处理--------------------------
  // const behaviorRulesJsonData = JSON.parse(JSON.stringify(rulesJson[index].behaviorRulesJson))
  // const behaviorRules = JSON.parse(JSON.stringify(behaviorRulesJsonData.rules))
  // 拥有行为标签规则
  let hasBehaviorRule = false
  const behaviorRulesLength = behaviorRules.length
  let x
  let y = 0
  // 判断是否有未填写的项

  for (x = 0; x < behaviorRulesLength; x++) {
    for (y = 0; y < behaviorRules[x].rules.length; y++) {
      const rulesItem = behaviorRules[x].rules[y]
      if (rulesItem.dataSource === 8) {
        hasBehaviorRule = true
      }
      // 需要验证时，才进行提示
      if (rulesItem.isOldversion && isNeedValidate) { // 行为标签中的【起播活跃】行为标签规则校验 兼容性处理
        Message.error('【起播活跃 - BAV0011】组件升级，若要编辑请删除后重新创建')
        rulesFlag = false
        break
      }
      // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
      const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
      if (isTimeTagKong) {
        if (!timeTagKongList.includes(rulesItem.tagName)) {
          timeTagKongList.push(rulesItem.tagName)
        }
        // 需要验证时，才进行提示
      } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0) && isNeedValidate) {
        Message.error(
          '请正确填写第' +
              (x + 1) +
              '行为标签块里面的第' +
              (y + 1) +
              '行的值！'
        )
        rulesFlag = false
        break
      } else if (
        rulesItem.tagType === 'time' &&
          rulesItem.isDynamicTime === 3
      ) {
        // 二期之后的
        if (rulesItem.version > 0) {
          const startDay = rulesItem.startDay ? rulesItem.startDay : '@'
          const endDay = rulesItem.endDay ? rulesItem.endDay : '@'
          rulesItem.value = startDay + '~' + endDay
        } else { // 一期
          if (
            checkNum(rulesItem.startDay) &&
              checkNum(rulesItem.endDay)
          ) {
            if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) {
              rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
            } else {
              // 需要验证时，才进行提示
              if (isNeedValidate) {
                Message.error(
                  '第' +
                      (x + 1) +
                      '行为标签块里面的第' +
                      (y + 1) +
                      '行的天数值后面的值必须大于前面的'
                )
                rulesFlag = false
                break
              }
            }
          } else {
            // 需要验证时，才进行提示
            if (isNeedValidate) {
              Message.error(
                '第' +
                    (x + 1) +
                    '行为标签块里面的第' +
                    (y + 1) +
                    '行的值是大于等于0的整数且不能超过4位数'
              )
              rulesFlag = false
              break
            }
          }
        }
      }
    }
  }

  if (behaviorRules.length > 0 && !hasBehaviorRule) {
    // MessageBox.confirm('单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?', '提示', {
    //   confirmButtonText: '确定移入',
    //   cancelButtonText: '不保存',
    //   type: 'warning'
    // }).then(() => {
    //   operateTpye = { moveOrClear: 'move' }
    // }).catch(() => {
    //   operateTpye = { moveOrClear: 'clear' }
    // })
    rulesFlag = false
    operateTpye = { openMoveOrClear: true }
  }
  // if (!rulesFlag) break

  // ------------------- 动态因子规则校验 --------------------------
  // for (i = 0; i < dynamicPolicyRulesLength; i++) {
  //   for (j = 0; j < dynamicPolicyRules[i].rules.length; j++) {
  //     const rulesItem = dynamicPolicyRules[i].rules[j]
  //     if (rulesItem.value === '' || rulesItem.dynamic.version === '') {
  //       Message.error(
  //         '请正确填写第' +
  //           (i + 1) +
  //           '动态因子里面的第' +
  //           (j + 1) +
  //           '行的值！'
  //       )
  //       rulesFlag = false
  //       break
  //     }
  //     if (!rulesFlag) break
  //   }
  //   if (!rulesFlag) break
  // }
  // if (!dynamicPolicyFlag) return
  // console.log('1111111->', { rulesFlag, operateTpye })
  // return rulesFlag
  // console.log('rulesFlag', rulesFlag)
  // console.log('operateTpye', operateTpye)
  return { rulesFlag, operateTpye }
}

function checkNum (num) {
  if (/(^\d+$)/.test(num)) {
    return true
  } else {
    Message.error('该值为必填项，且必须是大于等于0整数')
    return false
  }
}
function ReorganizationData (data) { // 将数组变成层级关系
  let rData = []
  const len = data.length
  // for (var i = len - 1; i > -1; i--) {
  //   debugger
  //   rData = data[i]
  //   if (data[i - 1]) {
  //     rData = this.checkIfChildrenExist(data[i - 1], rData)
  //   }
  // }
  if (len > 1) {
    for (let i = len - 1; i > -1; i--) {
      rData = data[i]
      if (data[i - 1]) {
        rData = checkIfChildrenExist(data[i - 1], rData)
      }
    }
  } else {
    rData = data
    if (data[0] && data[0].child && data[0].child.length > 1) {
      rData[0].child = ReorganizationData(data[0].child)
    }
  }
  return rData
}

function checkIfChildrenExist (data1, data2) {
  if (data1.child == null || data1.child.length === 0) {
    data1.child.push(data2)
    return data1
  }
  // 递归
  checkIfChildrenExist(data1.child[0], data2)
}

// 给 behaviorRulesJson 中的table 添加序号
function putBehaviorRulesJsonTableIndex (val) {
  if (val) {
    let tableIndex = 0
    const ruleList = val.rules
    ruleList.forEach(rule => {
      const ruleGroup = rule.rules
      ruleGroup.forEach(item => {
        tableIndex = tableIndex + 1
        item.table = item.table.split('$')[0] + '$' + tableIndex
        if (item.bav) item.bav.table = item.bav.table.split('$')[0] + '$' + tableIndex
      })
    })
  } else {
    val = { link: 'AND', condition: 'OR', rules: [] }
    // val = ''
  }
  return val
}

function getFormPromise (form) {
  return new Promise(resolve => {
    form.validate(res => {
      resolve(res)
    })
  })
}

function checkNumMostFour (num, _this) {
  const numInt = parseInt(num)
  if (/(^\d+$)/.test(num) && numInt <= 9999) {
    return true
  } else {
    Message.error(
      '该值为必填项，且必须是大于等于0的整数且不能超过4位数'
    )
    return false
  }
}

export { validateRule }
