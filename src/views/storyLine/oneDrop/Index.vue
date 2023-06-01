<template>
<div>
  <!-- <el-steps :active="activeStep" finish-status="success" simple >
      <el-step title="1.配置公共属性" icon="el-icon-edit"></el-step>
      <el-step title="第二步：圈出人群" icon="el-icon-edit"></el-step>
  </el-steps> -->
  <!-- <div style="color: red">

    sceneId --- {{ sceneId }}
    <br/>
    sceneDetail --- {{ sceneDetail }}
    <br/>
    receptionistList --- {{ receptionistList }}
    <br/>
    formScene --- {{ formScene }}
    <br/>
    policyId --- {{ policyId }}

  </div> -->

  <el-steps :active="activeStep" class="step-sty">
    <el-step title="添加场景"></el-step>
    <el-step title="选择创建方式"></el-step>
    <el-step :title="createType === 1 ? '创建接待员': '配置公共属性'"></el-step>
    <el-step :title="createType === 1 ? '配置接待员': '配置单独属性'"></el-step>
    <el-step title="投放"></el-step>
  </el-steps>

  <!-- 第一步 -->
  <el-form v-if="activeStep === 0" :model="formScene" :rules="formSceneRules" ref="formSceneRef" class="form-class" @submit.native.prevent>
    <div class="div-class">

      <el-form-item label="场景名：" label-width="90px" prop="name">
        <el-input v-model.trim="formScene.name" autocomplete="off" clearable></el-input>
      </el-form-item>
    </div>
  </el-form>

  <!-- 第二步 -->
  <el-form v-if="activeStep === 1" class="form-class">
    <div class="div-class">

      <el-form-item label=" 创建方式：" label-width="90px">
        <el-radio v-model="createType" :label="1" style="margin-right: 15px">逐个创建</el-radio>
        <el-radio v-model="createType" :label="2">批量创建</el-radio>
      </el-form-item>
    </div>
  </el-form>

  <!-- 第三步 -->
  <OneByOneAdd
    v-if="activeStep === 2 && createType === 1"
    v-model="receptionistList"
  ></OneByOneAdd>

  <CommonSet
    v-else-if="activeStep === 2 && createType === 2"
    ref="commonSetRef"
    :sceneId="sceneId"
  ></CommonSet>

  <!-- 第四步 -->
  <AllPerSet
    v-else-if="activeStep === 3"
    ref="allPerSetRef"
    :sceneId="sceneId"
  >
  </AllPerSet>

  <!-- 第五步 -->
  <LaunchToBusiness
    ref="launchToBusinessRef"
    v-else-if="activeStep === 4"
    :recordId="policyId"
    :tempPolicyAndCrowd="tempPolicyAndCrowd"
    :fromStoryline="true"
    :hiddenButton="true"
  ></LaunchToBusiness>

  <div class="el-dialog__footer">
    <!-- 第 1 步 -->
    <template v-if="activeStep === 0">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button type="warning" @click="skipSave">跳过保存</el-button>
      <el-button type="primary" @click="oneDropNextStep">下一步</el-button>
    </template>
    <!-- 第 5 步 -->
    <template v-else-if="activeStep === 4">
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="warning" @click="skipSave">跳过保存</el-button>
      <el-button type="primary" @click="oneDropNextStep">确认</el-button>
    </template>
    <!-- 第 2、3、4 步 -->
    <template v-else>
      <el-button type="primary" @click="backStep">上一步</el-button>
      <el-button type="warning" @click="skipSave">跳过保存</el-button>
      <el-button type="primary" @click="oneDropNextStep">下一步</el-button>
    </template>
  </div>
</div>
</template>
<script>
import CommonSet from '../multiAdd/CommonSet.vue'
import AllPerSet from '../multiAdd/AllPerSet.vue'
import OneByOneAdd from './OneByOneAdd.vue'
import LaunchToBusiness from '@/views/launch/StrategyPutIn.vue'
import { confirmMultiAddServicerFn, multiAddNextStepFn } from '../multiAdd/func.js'
import { Loading } from 'element-ui'
import { moveToRule } from '@/views/storyLine/validateRuleData.js'

export default {
  components: {
    CommonSet,
    AllPerSet,
    OneByOneAdd,
    LaunchToBusiness
  },
  data () {
    return {
      receptionistList: [],
      sceneId: '',
      activeStep: 0,
      createType: 1,
      formSceneRules: {
        name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      formScene: {
        name: ''
      },
      sceneDetail: {}
    }
  },
  watch: {
    // sceneName: this.formScene.name,
    // createType: this.createType
    'this.formScene.name' (val) {
      this.sceneDetail.sceneName = val
    },
    createType (val) {
      this.sceneDetail.createType = val
    }
  },
  computed: {
    policyId () {
      return this.sceneDetail.policyId
    },
    tempPolicyAndCrowd () {
      console.log('sceneDetail-->', this.sceneDetail)
      return {
        policyId: this.sceneDetail.policyId,
        policyName: this.sceneDetail.sceneName,
        smart: true
      }
    }
  },
  methods: {
    // 上一步
    backStep () {
      switch (this.activeStep) {
        // 当前为第 2 步
        case 1:
          this.getSceneDetail()

          break
        // 当前为第 3 步
        case 2:
          this.getSceneDetail()
          break
        // 当前为第 4 步
        case 3:
          // 逐个创建
          if (this.createType === 1) {
            this.getListbySceneId()
          } else {
          // 批量创建
            this.batchSetLast()
          }

          break
        // 当前为第 5 步
        case 4:
          // this.getListbySceneId()
          break
        default:
          break
      }
      this.cutActiveStep()
    },
    // 跳过保存
    skipSave () {
      switch (this.activeStep) {
        // 当前为第 1 步
        case 0:
          this.sceneSkip()
          break
        // 当前为第 2 步
        case 1:
          this.createTypeSkip()
          break
          // 当前为第 3 步
        case 2:
          // 逐个创建
          if (this.createType === 1) {
            this.oneByOneListSkip()
          } else {
          // 批量创建
            this.batchSetSkip()
          }
          break
        // 当前为第 4 步
        case 3:
          this.batchListSkip()
          break
        // 当前为第 5 步
        case 4:
          this.putInDraft()
          break
        default:
          break
      }
    },
    // 下一步
    oneDropNextStep () {
      switch (this.activeStep) {
        // 当前为第 1 步
        case 0:
          this.sceneNext()
          break
        // 当前为第 2 步
        case 1:
          this.createTypeNext()
          break
        // 当前为第 3 步
        case 2:
          // 逐个创建
          if (this.createType === 1) {
            this.oneByOneListNext()
          } else {
          // 批量创建
            this.batchSetNext()
          }
          break
        // 当前为第 4 步
        case 3:
          this.batchListNext()
          break
        // 当前为第 5 步
        case 4:
          this.putInRelease()
          break
        default:
          break
      }
    },

    cutActiveStep () {
      this.activeStep = this.activeStep - 1
    },
    addActiveStep () {
      this.activeStep = this.activeStep + 1
    },
    // 查询批量公共属性
    async batchSetLast () {
      const parmas = {
        sceneId: this.sceneId
      }
      await this.$service.batchSetLast(parmas).then(res => {
        // this.cutActiveStep()
        this.receptionistList = res
      })
    },
    // 获取接待员列表
    async getListbySceneId () {
      if (this.sceneId) {
        const parmas = {
          sceneId: this.sceneId
        }
        await this.$service.getListbySceneId(parmas).then(res => {
          // this.cutActiveStep()
          this.receptionistList = res.length === 0 ? [{ receptionist: '' }] : res
        })
      }
    },
    async getSceneDetail () {
      const parmas = {
        sceneId: this.sceneId
      }
      await this.$service.getSceneDetail(parmas).then(res => {
        // this.cutActiveStep()
        this.sceneDetail = res

        this.formScene.name = res.sceneName // 场景名
        this.createType = res.createType // 创建类型
      })
    },

    // 5: 投放  - putInDraft
    putInDraft () {
      const launchToBusinessRef = this.$refs.launchToBusinessRef

      launchToBusinessRef.$refs.crowdForm.validate((valid) => {
        if (valid) {
          const parmas = {
            id: this.sceneId,
            startTime: launchToBusinessRef.value1[0] || undefined,
            endTime: launchToBusinessRef.value1[1] || undefined
          }
          this.$service.putInDraft(parmas, '保存成功').then(res => {
            // 更新场景列表
            this.$emit('updateSceneList')
            // 关闭弹窗
            this.$emit('closeDialog')
          })
        }
      })
    },
    // 5: 投放  - 下一步
    putInRelease () {
      const launchToBusinessRef = this.$refs.launchToBusinessRef

      launchToBusinessRef.$refs.crowdForm.validate((valid) => {
        if (valid) {
          const loadingInstance = Loading.service({
            fullscreen: true,
            text: '投放中，请稍候',
            background: 'rgba(0, 0, 0, 0.5)'
          })

          const parmas = {
            sceneId: this.sceneId,
            biIds: launchToBusinessRef.crowdForm.biIdsPull,
            policyIds: [this.policyId],
            startTime: launchToBusinessRef.value1[0] || undefined,
            endTime: launchToBusinessRef.value1[1] || undefined
          }
          this.$service.putInRelease(parmas).then(async res => {
            const parmas = { policyId: this.policyId }
            await this.$service.freshCache(parmas, '投放成功')
            // this.fullscreenLoading = false
            loadingInstance.close()
            // 更新场景列表
            this.$emit('updateSceneList')
            // 关闭弹窗
            this.$emit('closeDialog')
          })
        }
      })
    },

    // 4：配置单独属性  - 跳过保存
    batchListSkip () {
      const allPerSetRef = this.$refs.allPerSetRef
      const p = confirmMultiAddServicerFn({ allPerSetRef })
      console.log('a--->', p)

      p.then(receptionists => {
        console.log('receptionists===>', receptionists)

        const parmas = {
          sceneId: this.sceneId,
          receptionists
        }
        this.$service.batchListSkip(parmas).then(res => {
          // 更新场景列表
          this.$emit('updateSceneList')
          // 关闭弹窗
          this.$emit('closeDialog')
        })
      }).catch(err => {
        if (err.openMoveOrClear) {
          this.openMoveOrClear(allPerSetRef)
        }
      })
    },
    // 单独使用红色标签时，是否允许移入设置标签栏
    openMoveOrClear (allPerSetRef) {
      this.$confirm('单独使用红色标签时，请在设置标签栏填写。是否允许移入设置标签栏?', '提示', {
        confirmButtonText: '确定移入',
        cancelButtonText: '不保存',
        type: 'warning'
      }).then(() => {
        // console.log('allPerSetRef--->', allPerSetRef)
        const dialogRef1 = allPerSetRef.$refs && allPerSetRef.$refs.createClientDialogRef ? allPerSetRef.$refs.createClientDialogRef : []
        const dialogRef2 = allPerSetRef.$refs && allPerSetRef.$refs.exportClientDialogRef ? allPerSetRef.$refs.exportClientDialogRef : []
        const arr = [...dialogRef1, ...dialogRef2]
        arr.forEach(moveToRule)
      }).catch(() => {
        // 清空行为标签
        // console.log('allPerSetRef--->', allPerSetRef)
        const dialogRef1 = allPerSetRef.$refs && allPerSetRef.$refs.createClientDialogRef ? allPerSetRef.$refs.createClientDialogRef : []
        const dialogRef2 = allPerSetRef.$refs && allPerSetRef.$refs.exportClientDialogRef ? allPerSetRef.$refs.exportClientDialogRef : []
        const arr = [...dialogRef1, ...dialogRef2]
        arr.forEach(item => moveToRule(item, 'clear'))
      })
    },
    // 4： 配置单独属性  - 下一步
    batchListNext () {
      const allPerSetRef = this.$refs.allPerSetRef
      const p = confirmMultiAddServicerFn({ allPerSetRef })
      console.log('a--->', p)

      p.then(receptionists => {
        console.log('receptionists===>', receptionists)

        const parmas = {
          sceneId: this.sceneId,
          receptionists
        }
        this.$service.batchListNext(parmas).then(res => {
          this.addActiveStep()
        })
      }).catch(err => {
        if (err.openMoveOrClear) {
          this.openMoveOrClear(allPerSetRef)
        }
      })
    },
    // 3： 批量创建 - 跳过保存
    batchSetSkip () {
      const commonSetRef = this.$refs.commonSetRef
      const p = multiAddNextStepFn({ commonSetRef })
      p.then(res => {
        const { allEntryArr, allExportArr, ruleFormData } = res
        this.batchSaveFirst({ allEntryArr, allExportArr, ruleFormData }, 'batchSetSkip')
      })
    },
    batchSaveFirst ({ allEntryArr, allExportArr, ruleFormData }, api) {
      console.log('ruleFormData--->', ruleFormData)

      const parmas = {
        sceneId: this.sceneId,
        // policyId: this.policyId,
        namePre: ruleFormData.prependName,
        nameSuf: ruleFormData.appendName,
        tagIds: ruleFormData.resource,
        entry: allEntryArr,
        export: allExportArr
      }
      this.$service[api](parmas).then(res => {
        this.addActiveStep()
      })
    },
    // 3： 批量创建 - 下一步
    batchSetNext () {
      const commonSetRef = this.$refs.commonSetRef
      const p = multiAddNextStepFn({ commonSetRef })
      p.then(res => {
        const { allEntryArr, allExportArr, ruleFormData } = res
        this.batchSaveFirst({ allEntryArr, allExportArr, ruleFormData }, 'batchSetNext')
      })
    },
    // 3： 逐个创建名称 - 跳过保存
    oneByOneListSkip () {
      const parmas = {
        sceneId: this.sceneId,
        receptionists: this.receptionistList
      }
      this.$service.oneByOneListSkip(parmas).then(res => {
        // 更新场景列表
        this.$emit('updateSceneList')
        // 关闭弹窗
        this.$emit('closeDialog')
      })
    },
    // 3： 逐个创建名称 - 下一步
    oneByOneListNext () {
      const parmas = {
        sceneId: this.sceneId,
        receptionists: this.receptionistList
        // sceneName: this.formScene.name,
        // createType: this.createType
      }
      this.$service.oneByOneListNext(parmas).then(res => {
        this.addActiveStep()
      })
    },
    // 2: 创建方式 - 跳过保存
    createTypeSkip () {
      const parmas = {
        ...this.sceneDetail,
        createType: this.createType
      }
      this.$service.createTypeSkip(parmas).then(res => {
        // 更新场景列表
        this.$emit('updateSceneList')
        // 关闭弹窗
        this.$emit('closeDialog')
      })
    },
    // 2： 创建方式 - 下一步
    createTypeNext () {
      const parmas = {
        ...this.sceneDetail
        // sceneName: this.formScene.name,
        // createType: this.createType
      }
      this.$service.createTypeNext(parmas).then(res => {
        this.getListbySceneId()
        this.addActiveStep()
      })
    },
    // 1： 场景 - 跳过保存
    sceneSkip () {
      this.$refs.formSceneRef.validate(valid => {
        if (valid) {
          const parmas = {
            sceneName: this.formScene.name
          }

          this.$service.sceneSkip(parmas).then(res => {
            // 更新场景列表
            this.$emit('updateSceneList')
            // 关闭弹窗
            this.$emit('closeDialog')
          })
        }
      })
    },
    // 1： 场景 - 下一步
    sceneNext () {
      this.$refs.formSceneRef.validate(valid => {
        if (valid) {
          const parmas = {
            ...this.sceneDetail,
            sceneName: this.formScene.name
          }

          this.$service.sceneNext(parmas).then(res => {
            this.sceneId = res
            this.addActiveStep()
            this.getSceneDetail()
          })
        }
      })
    },
    cancel () {
      // 关闭弹窗
      this.$emit('closeDialog')
    }
    // confirmAddScene () {
    //   // console.log('this.formScene.length--------', this.sceneList.length)
    //   this.$refs.formSceneRef.validate(valid => {
    //     if (valid) {
    //       const parmas = {
    //         sceneName: this.formScene.name
    //         // id: this.sceneList.length + 1
    //       }

    //       this.$service.addScene(parmas).then(res => {
    //         this.getSceneList('add')
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang='stylus' scoped>
@import './index.styl'
</style>
