import { Message } from 'element-ui'
import { validateRule } from '../validateRuleData.js'

// 配置单独属性 - 确认
// 使用中的地方：
// - 批量创建接待员
// - 场景一键投放
function confirmMultiAddServicerFn ({ allPerSetRef }) {
  // const allPerSetRef = this.$refs.multiAddRef.$refs.allPerSetRef
  return new Promise((resolve, reject) => {
    const ruleFormArr = allPerSetRef.$refs.ruleForm || []// 此时为一个数组，因为是循环出来的
    const createClientDialogRef = allPerSetRef.$refs.createClientDialogRef || []// 入口条件，是个数组
    const exportClientDialogRef = allPerSetRef.$refs.exportClientDialogRef || []// 出口条件，是个数组

    const entryValidPromise = []
    const exportValidPromise = []
    let allEntryArr = []
    let allExportArr = []

    Promise.all(ruleFormArr.map(getFormPromise)).then(res => {
      // 入口条件
      createClientDialogRef.forEach(dialogRef => {
        const rulesJson = dialogRef.rulesJson
        const behaviorRulesJson = dialogRef.behaviorRulesJson
        const flowCondition = dialogRef.flowCondition

        const returnDefaultData = {
          ...dialogRef.editRow,
          type: 'entry',
          link: dialogRef.totalLink,
          tagIds: dialogRef.checkedList.join(','),
          delFlag: dialogRef.delFlag,
          receptionistId: dialogRef.receptionistId,
          autoVersion: dialogRef.form.autoVersion,
          isShowAutoVersion: dialogRef.form.isShowAutoVersion
        }

        // 校验规则
        const p = validateRule(dialogRef, rulesJson, behaviorRulesJson, flowCondition, { returnDefaultData })
        entryValidPromise.push(p)
      })

      // 出口条件
      exportClientDialogRef.forEach(dialogRef => {
        const rulesJson = dialogRef.rulesJson
        const behaviorRulesJson = dialogRef.behaviorRulesJson
        const flowCondition = dialogRef.flowCondition

        const returnDefaultData = {
          ...dialogRef.editRow,
          type: 'export',
          link: dialogRef.totalLink,
          stopType: dialogRef.form.stopType,
          nextId: dialogRef.form.nextId,
          tagIds: dialogRef.checkedList.join(','),
          delFlag: dialogRef.delFlag,
          receptionistId: dialogRef.receptionistId,
          autoVersion: dialogRef.form.autoVersion,
          isShowAutoVersion: dialogRef.form.isShowAutoVersion
        }
        // 校验规则
        const p = validateRule(dialogRef, rulesJson, behaviorRulesJson, flowCondition, { returnDefaultData })
        exportValidPromise.push(p)
      })

      // 所有的入口和出口
      Promise.all([...entryValidPromise, ...exportValidPromise]).then(res => {
        // console.log('start===============最终数据============>')
        console.log(res)
        // console.log('end=================最终数据==========')

        allEntryArr = res.filter(item => item.type === 'entry')
        allExportArr = res.filter(item => item.type === 'export')
        // console.log('')
        // console.log('allEntryArr===========================>', allEntryArr)
        // console.log('')
        // console.log('allExportArr===========================>', allExportArr)

        // console.log('需要提交的数据======》', allPerSetRef.allRuleForm)

        const returnReceptionists = restoreData(allPerSetRef.allRuleForm, allEntryArr, allExportArr)

        resolve(returnReceptionists)
        // const params = {
        //   batchId: this.batchId,
        //   receptionists: data
        // }
        // // 第二步保存
        // this.$service.batchSaveSecond(params).then(res => {
        //   // 刷新接待员列表
        //   this.getSceneList('add')
        //   this.dialogVisible2 = false
        //   Message.success('成功保存提交数据')
        // })
      }).catch((err) => {
        if (err && err.openMoveOrClear) {
          // Message.error('单独使用红色标签时，请在设置标签栏填写。请检查后重新提交')
          reject(err)
        } else {
          Message.error('请完善条件')
        }
      })
    })
  })
}

function getFormPromise (form) {
  return new Promise(resolve => {
    form.validate(res => {
      resolve(res)
    })
  })
}

function restoreData (allRuleForm, allEntryArr, allExportArr) {
  const returnData = allRuleForm.map(ruleForm => {
    const oldEntry = ruleForm.entryConditions
    const oldExport = ruleForm.exportConditions

    // 删除的项目
    // const delEntry = oldEntry.filter(old => old.id !== '' && allEntryArr.findIndex(item => item.id === old.id) === -1)
    // const delExport = oldExport.filter(old => old.id !== '' && allExportArr.findIndex(item => item.id === old.id) === -1)
    // const delEntryMap = delEntry.map(item => {
    //   return {
    //     ...item,
    //     delFlag: 2
    //   }
    // })
    // const delExportMap = delExport.map(item => {
    //   return {
    //     ...item,
    //     delFlag: 2
    //   }
    // })
    // const newEntry = allEntryArr.filter(item => item.receptionistId === ruleForm.id).concat(delEntryMap)
    const newEntry = allEntryArr.filter(item => item.receptionistId === ruleForm.id)
    // const newExport = allExportArr.filter(item => item.receptionistId === ruleForm.id).concat(delExportMap)
    const newExport = allExportArr.filter(item => item.receptionistId === ruleForm.id)

    return {
      ...ruleForm,
      entryConditions: newEntry,
      exportConditions: newExport
    }
  })
  return returnData
}
// 配置公共属性
// 使用中的地方：
// - 批量创建接待员
// - 场景一键投放
function multiAddNextStepFn ({ commonSetRef }) {
  return new Promise((resolve) => {
    // const commonSetRef = this.$refs.multiAddRef.$refs.commonSetRef
    const ruleForm = commonSetRef.$refs.ruleForm || []
    const createClientDialogRef = commonSetRef.$refs.createClientDialogRef || [] // 入口条件，是个数组
    const exportClientDialogRef = commonSetRef.$refs.exportClientDialogRef || [] // 出口条件，是个数组
    const ruleFormData = commonSetRef.ruleForm
    console.log('333ruleForm--->', commonSetRef)

    const entryValidPromise = []
    const exportValidPromise = []
    let allEntryArr = []
    let allExportArr = []

    ruleForm.validate(valid => {
      if (valid) {
        // 入口条件
        createClientDialogRef.forEach(dialogRef => {
          const rulesJson = dialogRef.rulesJson
          const behaviorRulesJson = dialogRef.behaviorRulesJson
          const flowCondition = dialogRef.flowCondition

          // console.log('---------------入口条件 start------------------------------')
          // console.log('rulesJson', rulesJson)
          // console.log('behaviorRulesJson', behaviorRulesJson)
          // console.log('flowCondition', flowCondition)
          // console.log('---------------入口条件 end------------------------------')

          // 存数据
          // allEntryArr.push({ rulesJson, behaviorRulesJson })
          const returnDefaultData = {
            type: 'entry',
            link: dialogRef.totalLink,
            tagIds: dialogRef.checkedList.join(','), // 所选的标签
            delFlag: 1,
            autoVersion: dialogRef.form.autoVersion,
            isShowAutoVersion: dialogRef.form.isShowAutoVersion
          }

          // 校验规则
          const p = validateRule(dialogRef, rulesJson, behaviorRulesJson, flowCondition, { returnDefaultData, isNeedValidate: false })
          entryValidPromise.push(p)
        })

        // 出口条件
        exportClientDialogRef.forEach(dialogRef => {
          const rulesJson = dialogRef.rulesJson
          const behaviorRulesJson = dialogRef.behaviorRulesJson
          const flowCondition = dialogRef.flowCondition

          // console.log('-----------------出口条件 start----------------------------')
          // console.log('rulesJson', rulesJson)
          // console.log('behaviorRulesJson', behaviorRulesJson)
          // console.log('flowCondition', flowCondition)
          // console.log('-----------------出口条件 end----------------------------')

          // const stopType = dialogRef.form.stopType // 处理操作
          // const nextId = dialogRef.form.nextId // 流转接待员
          // console.log('stopType--->', stopType)
          // console.log('nextId--->', nextId)

          // 存数据
          // allExportArr.push({ rulesJson, behaviorRulesJson })
          const returnDefaultData = {
            type: 'export',
            link: dialogRef.totalLink,
            stopType: dialogRef.form.stopType,
            nextId: dialogRef.form.nextId,
            tagIds: dialogRef.checkedList.join(','), // 所选的标签
            delFlag: 1,
            autoVersion: dialogRef.form.autoVersion,
            isShowAutoVersion: dialogRef.form.isShowAutoVersion
          }
          // 校验规则
          const p = validateRule(dialogRef, rulesJson, behaviorRulesJson, flowCondition, { returnDefaultData, isNeedValidate: false })
          exportValidPromise.push(p)
        })

        // // 所有的入口
        // Promise.all(entryValidPromise).then(res => {
        //   console.log('allEntryArr--->', res)
        //   // 存数据
        //   console.log('最终数据==========allEntryArr==>')
        //   allEntryArr = res
        //   console.log(allEntryArr)
        //   console.log('最终数据==========allEntryArr==>', allEntryArr)
        // })

        // // 所有的出口
        // Promise.all(exportValidPromise).then(res => {
        //   console.log('allExportArr--->', res)
        //   // 存数据
        //   console.log('最终数据==========allExportArr==>')
        //   allExportArr = res
        //   console.log(allExportArr)
        //   console.log('最终数据==========allExportArr==>', allExportArr)
        // })

        // 所有的入口和出口
        Promise.all([...entryValidPromise, ...exportValidPromise]).then(res => {
          console.log('start===============最终数据============>')
          console.log(res)
          console.log('end=================最终数据==========')

          allEntryArr = res.filter(item => item.type === 'entry')
          allExportArr = res.filter(item => item.type === 'export')
          console.log('')
          console.log('allEntryArr===========================>', allEntryArr)
          console.log('')
          console.log('allExportArr===========================>', allExportArr)

          // Message.success('所有条件都已经通过')
          resolve({ allEntryArr, allExportArr, ruleFormData })
          // this.batchSaveFirst({ allEntryArr, allExportArr, ruleFormData })
        }).catch((err) => {
          if (err.openMoveOrClear) {
            Message.error('单独使用红色标签时，请在设置标签栏填写。请检查后重新提交')
          } else {
            Message.error('请完善条件')
          }
        })
      }
    })
  })
}

export {
  confirmMultiAddServicerFn,
  multiAddNextStepFn
}
