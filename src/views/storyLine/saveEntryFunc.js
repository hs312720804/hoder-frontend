import { ReorganizationData, putBehaviorRulesJsonTableIndex, getFormPromise, checkNumMostFour } from '@/views/crowdStrategy/crowdAddSaveFunc.js'

let timeTagKongList = []

async function handleSave (_this, thisRulesJson, thisBehaviorRulesJson, fetchAddOrEdit, flowCondition) {
  // 校验form 表单： 普通标签规则、行为标签规则
  const valid1 = await new Promise((resolve, reject) => {
    return _this.$refs.form.validate(async valid => {
      resolve(valid)
    })
  })

  // 校验流转指标
  const valid2 = flowCondition && flowCondition.rules.length > 0
    ? await new Promise((resolve, reject) => {
      return _this.$refs.setCirculationRef.$refs.ruleForm.validate((valid) => {
        resolve(valid)
      })
    })
    : true

  // 校验普通标签里面的流转指标
  const valid3 = await new Promise((resolve, reject) => {
    return _this.$refs.MultipleSelectRef.$refs.ruleForm.validate((valid) => {
      resolve(valid)
    })
  })

  if (!valid1 || !valid2 || !valid3) return

  console.log('aa--->', valid2)
  // const form = JSON.parse(JSON.stringify(thisForm))
  const tagIds = []
  const ruleJson = JSON.parse(JSON.stringify(thisRulesJson))
  const behaviorRulesJson = putBehaviorRulesJsonTableIndex(JSON.parse(JSON.stringify(thisBehaviorRulesJson)))

  const rules = ruleJson.rules

  const behaviorRules = behaviorRulesJson.rules

  if (!validateForm(rules, behaviorRules, _this)) {
    return
  }

  // 添加tagIds
  rules.forEach(function (item) {
    item.rules.forEach(function (childItem) {
      if (tagIds.indexOf(childItem.tagId) === -1) {
        tagIds.push(childItem.tagId)
      }
      // delete childItem.startDay
      // delete childItem.endDay
    })
  })
  // dynamicPolicyRules.forEach(function (item) {
  //   item.rules.forEach(function (childItem) {
  //     if (tagIds.indexOf(childItem.tagId) === -1) {
  //       tagIds.push(childItem.tagId)
  //     }
  //   })
  // })
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

  const data = {
    rulesJson: JSON.stringify(ruleJson),
    behaviorRulesJson: JSON.stringify(behaviorRulesJson)
  }

  // 获取到组件中的form  校验必填项
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

  // 选择了属性为空的 time 类型的标签, 需要提示
  if (timeTagKongList.length > 0) {
    const tip = timeTagKongList.join(',')
    const h = _this.$createElement
    _this.$msgbox({
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
            fetchAddOrEdit(data)
          } else {
            _this.$message.error('请输入必填项')
          }
        }).catch(() => {
          _this.$message.error('请至少设置一个行为标签规则')
        })
      } else { // 没有行为标签的
        // 新增或编辑
        fetchAddOrEdit(data)
      }
    })
  } else {
    if (allList.length > 0) { // 有行为标签的
      // 使用Promise.all去校验结果
      Promise.all(allList.map(getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          // 新增或编辑
          fetchAddOrEdit(data)
        } else {
          _this.$message.error('请输入必填项')
        }
      }).catch(() => {
        _this.$message.error('请至少设置一个行为标签规则')
      })
    } else { // 没有行为标签的
      // 新增或编辑
      fetchAddOrEdit(data)
    }
  }
}

function validateForm (rules, behaviorRules = [], _this) {
  timeTagKongList = []
  // 判断设置标签里是否有未填写的项
  let i
  let j = 0
  const ruleLength = rules.length
  // const dynamicPolicyRulesLength = dynamicPolicyRules.length
  let rulesFlag = true

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
                _this.$message.error(
                  '第' +
                    (i + 1) +
                    '设置标签块里面的第' +
                    (j + 1) +
                    '行的天数值后面的值必须大于前面的'
                )
                rulesFlag = false
                break
              }
            } else {
              _this.$message.error(
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
        } else if (rulesItem.tagType === 'string' && rulesItem.operator === 'null') {
          rulesItem.operator = '='
        }
        // ------ 处理数据格式 end  -----

        if ('value' in rulesItem && (rulesItem.value === '' || rulesItem.value.length === 0)) {
          _this.$message.error(
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
  const behaviorRulesLength = behaviorRules.length
  let x
  let y = 0
  // 判断是否有未填写的项

  for (x = 0; x < behaviorRulesLength; x++) {
    for (y = 0; y < behaviorRules[x].rules.length; y++) {
      const rulesItem = behaviorRules[x].rules[y]

      if (rulesItem.isOldversion) { // 行为标签中的【起播活跃】行为标签规则校验 兼容性处理
        _this.$message.error('【起播活跃 - BAV0011】组件升级，若要编辑请删除后重新创建')
        rulesFlag = false
        break
      }
      // 如果是 time 类型的标签， 并且 dateAreaType 为 0，那么 value 可以为空
      const isTimeTagKong = rulesItem.tagType === 'time' && rulesItem.dateAreaType === 0
      if (isTimeTagKong) {
        if (!timeTagKongList.includes(rulesItem.tagName)) {
          timeTagKongList.push(rulesItem.tagName)
        }
      } else if (rulesItem.value && (rulesItem.value === '' || rulesItem.value.length === 0)) {
        _this.$message.error(
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
            this.checkNum(rulesItem.startDay) &&
            this.checkNum(rulesItem.endDay)
          ) {
            if (parseInt(rulesItem.startDay) < parseInt(rulesItem.endDay)) {
              rulesItem.value = rulesItem.startDay + '-' + rulesItem.endDay
            } else {
              _this.$message.error(
                '第' +
                  (x + 1) +
                  '行为标签块里面的第' +
                  (y + 1) +
                  '行的天数值后面的值必须大于前面的'
              )
              rulesFlag = false
              break
            }
          } else {
            _this.$message.error(
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
  // if (!rulesFlag) break

  // ------------------- 动态因子规则校验 --------------------------
  // for (i = 0; i < dynamicPolicyRulesLength; i++) {
  //   for (j = 0; j < dynamicPolicyRules[i].rules.length; j++) {
  //     const rulesItem = dynamicPolicyRules[i].rules[j]
  //     if (rulesItem.value === '' || rulesItem.dynamic.version === '') {
  //       _this.$message.error(
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
  return rulesFlag
}

export { handleSave }
