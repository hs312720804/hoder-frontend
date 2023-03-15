<template>
  <div class="total-wrap" :class="styleType ? 'dark' : 'light'">
    <!-- {{groupServicer}} -->
    <!-- <div style="color: red; position: absolute; z-index: 999">
      【{{$route.params.sceneId}}】
      【{{selectedScene.id}}】
    </div> -->
    <div class='row-wrap' >
      <el-button v-if="$route.params.sceneId === selectedScene.id" type="primary" @click="returnCrowd" style="position: absolute; right: 34px; top: 35px; z-index: 9">
        继续编辑
      </el-button>

      <el-button type="text" @click="changeStyle" class="change-style-btn">{{ styleType ? '深色版' : '浅色版' }}</el-button>
      <div class="box">
        <div class="content">

            <div class="title">场景</div>

            <div class="search">
              <el-input placeholder="场景名/创建人" v-model="searchScene" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getSceneList"></el-button>
              </el-input>
            </div>

            <div class="sceneList-wrap">
              <!-- {{sceneList}} -->
              <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
                <div v-if="sceneList.length === 0" class="no-data-wrap">
                  暂时木有内容呀～～
                </div>
                <div
                  v-for="(item) in sceneList"
                  :key="item.id"
                  @click="selectScene(item.id)"
                  :class="{active: activeIndex === item.id, 'gray-row': item.putway === 2}"
                  class="lists-item">
                  <!-- <i class="icon el-icon-video-camera-solid"></i> -->
                  <i class="icon el-icon-monitor"></i>
                  <span class="item-content">
                    {{ item.sceneName }}
                  </span>
                  <span class="item-index">{{ item.id }}</span>
                  <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" @command="handleSceneCommand">
                    <span class="el-dropdown-link">
                      . . .
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="clearfix" :key="item.id" :command="['rename', item]">
                        <!-- <el-popover
                          placement="top"
                          width="160"
                          v-model="renameVisible"
                          trigger="manual"
                        > -->
                          <!-- <div slot="reference">重命名</div> -->
                          <!-- <template #reference>
                            <span @click="renameVisible = true">重命名</span>
                          </template>
                          <p>这是一段内容这是一段内容确定删除吗？</p> -->
                          <!-- <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="renameVisible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="renameVisible = false">确定</el-button>
                          </div> -->

                        <!-- </el-popover> -->
                        <el-popover placement="top" trigger="click" ref="pop" >
                          <div slot="reference">重命名</div>
                          <div style="display: flex">
                            <el-input
                              class="re-name-input"
                              type="text"
                              placeholder="请输入内容"
                              v-model="rename"
                              maxlength="50"
                              show-word-limit
                              clearable
                              style="width: 250px"
                            >
                            </el-input>

                            <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                            <el-button type="primary" size="mini" @click="handelRename(item)">确定</el-button>
                          </div>
                        </el-popover>

                      </el-dropdown-item>

                      <!-- 场景的 planId 为 null, 才展示按钮 -->
                      <!-- :disabled="servicer.length === 0" -->
                      <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['putIn', item]" >
                        投放
                      </el-dropdown-item>
                      <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['offSet', item]">
                        <!-- putway : 1 - 上架中； 2 - 下架中 -->
                        {{ item.putway === 1 ? '下架' : '上架' }}
                      </el-dropdown-item>
                      <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['deleteScene', item]">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-scrollbar>
            </div>
            <div class="box-fotter">
              <!-- <el-button>添加</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="addScene">添加</el-button>
            </div>
        </div>
      </div>

      <div class="box">
        <div class="content">
          <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
            <div class="title">
              接待员
              <el-button v-if="servicer.length > 0" type="text" style="position: absolute;right: 14px;top: 6px;" icon="el-icon-plus" size="mini" @click="addGroup">分组</el-button>
            </div>

            <div class="search">
              <el-input placeholder="接待员/创建人" v-model="searchServicer" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getServiceList"></el-button>
              </el-input>
            </div>
            <div class="sceneList-wrap" >
              <el-scrollbar style="height:100%" wrap-style="overflow-x: hidden;">
                <div v-if="servicer.length === 0" class="no-data-wrap">
                  暂时木有内容呀～～
                </div>
                <div
                v-for="(group) in groupServicer"
                :key="group.groupId"
                :class="{ 'group-sty': group.groupId !== 0 }"
                >
                  <!-- {{group.groupId}} -->
                  <div class="lists-item" v-for="item in group.child" :key="item.id"  @click="selectServicer(item.id)" :class="{active: activeIndex2Id === item.id, 'gray-row': item.putway === 2}">
                    <i class="icon el-icon-user"></i>
                    <span class="item-content">
                      {{ item.receptionist }}
                    </span>
                    <span class="item-index">{{ item.id }}</span>
                    <el-dropdown trigger="hover" class="el-dropdown" :hide-on-click="false" placement="bottom" @command="handleServiceCommand">
                      <span class="el-dropdown-link">
                        . . .
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :disabled="!!item.referenceId" class="clearfix" :command="['rename', item]" >

                          <el-popover placement="top" trigger="click" ref="pop">
                            <div slot="reference">重命名</div>
                            <div style="display: flex">

                                <el-input
                                  type="text"
                                  placeholder="请输入内容"
                                  v-model="rename2"
                                  maxlength="50"
                                  show-word-limit
                                  clearable
                                  style="width: 250px"
                                >
                                </el-input>

                              <el-button size="mini" type="text" @click="handelClosePop()" style="margin-left: 10px">取消</el-button>
                              <el-button type="primary" size="mini" @click="handelRename2(item)">确定</el-button>
                            </div>
                          </el-popover>

                        </el-dropdown-item>
                        <el-dropdown-item class="clearfix" :command="['offSet', item]">
                          {{ item.putway === 1 ? '下架' : '上架' }}
                        </el-dropdown-item>
                        <el-dropdown-item class="clearfix" :command="['copy', item]">
                          复制
                        </el-dropdown-item>
                        <el-dropdown-item class="clearfix" :command="['copyUse', item]" :disabled="!!item.referenceId">
                          复用
                        </el-dropdown-item>
                        <el-dropdown-item class="clearfix" :command="['deleteService', item]">
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>

              </el-scrollbar>
            </div>
            <div class="box-fotter">
              <!-- <el-button>添加</el-button> -->
              <el-button type="primary" icon="el-icon-plus" @click="addServicer">添加</el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="box">
        <!-- 接待员详情 -->
        <servicerDetail
          :servicer="servicer"
          :selectedScene="selectedScene"
          :selectedServicer="selectedServicer"
          :entryList="entryList"
          :exportList="exportList"
          :activeIndex2Id="activeIndex2Id"
          :styleType="styleType"
          @updataEntryList="getEntryListByReceptionistId"
          @updataExportList="getExportListByReceptionistId"
          @selectScene="selectScene"
          @selectServicer="selectServicer"
          @editReceptionist="editReceptionist"
        ></servicerDetail>
      </div>
      <el-dialog
        title="添加场景"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-form :model="formScene">
          <el-form-item label="场景名：" label-width="70px">
            <el-input v-model="formScene.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddScene">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加接待员"
        :visible.sync="dialogVisible2"
        width="30%"
        >
        <el-form :model="formServicer">
          <el-form-item label="接待员名：" label-width="90px">
            <el-input v-model="formServicer.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddServicer">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="showLaunchToBusiness" v-if="showLaunchToBusiness">
        <LaunchToBusiness
          :recordId="tempPolicyAndCrowd.policyId"
          :tempPolicyAndCrowd="tempPolicyAndCrowd"
          @closeDialog="handleCloseDialog"
        ></LaunchToBusiness>
      </el-dialog>
      <el-dialog :visible.sync="showDragVisible" v-if="showDragVisible" title="添加分组" width="550px" :close-on-click-modal="false">
        <!-- {{ groupData }} -->
        <drag
          :list="noGroupService"
          :groupData.sync="groupData"
          :launchPlatformData="launchPlatformData"
        ></drag>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDragVisible = false">取 消</el-button>
          <el-button type="primary" @click="addServicerGroup">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :visible.sync="showLaunchToBusiness" v-if="showLaunchToBusiness">
        <LaunchToBusiness
          :recordId="tempPolicyAndCrowd.policyId"
          :tempPolicyAndCrowd="tempPolicyAndCrowd"
          @closeDialog="handleCloseDialog"
        ></LaunchToBusiness>
      </el-dialog>

      <!-- 复制/复用 接待员 -->
      <el-dialog :visible.sync="copyDialogVisible" :title="`${copyType === 'copyUse' ? '复用接待员到场景' : '将接待员复制到以下场景'}`" width="550px">
        <el-form :model="copyForm" ref="copyFormRef" :rules="copyFormRule">
          <el-form-item label="选择场景：" prop="sceneId">
            <!-- 复用 -->
            <el-select v-if="copyType === 'copyUse'" v-model="copyForm.sceneId" clearable filterable>
              <el-option
                v-for="item in sceneListFilterSelect"
                :key="item.id"
                :label="item.sceneName"
                :value="item.id">
              </el-option>
            </el-select>
            <!-- 复制 -->
            <el-select v-else v-model="copyForm.sceneId" clearable filterable>
              <el-option
                v-for="item in sceneList"
                :key="item.id"
                :label="item.sceneName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="copyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmCopy">确 定</el-button>
        </span>
      </el-dialog>

   </div>
  </div>
</template>

<script>
import LaunchToBusiness from '../launch/StrategyPutIn'
import drag from './drag.vue'
import servicerDetail from './servicerDetail.vue'

export default {
  components: {
    LaunchToBusiness,
    drag,
    servicerDetail
  },
  data () {
    return {
      copyFormRule: {
        sceneId: [
          { required: true, message: '请选择场景', trigger: 'change' }
        ]
      },
      tipMsg: '请完善当前接待员服务终止条件中的处理操作',
      isCopiedServicer: false,
      copyType: '',
      copyForm: {
        id: '',
        sceneId: ''
      },
      copyDialogVisible: false,
      noGroupService: [],
      styleType: true,
      groupData: [{
        list: [],
        groupName: '组1'
      }],
      showDragVisible: false,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      editClientRow: {},
      selectedScene: {}, // 选择的场景
      selectedServicer: {}, // 选择的服务员
      searchScene: '',
      searchServicer: '',
      renameVisible: false,
      formScene: {
        name: ''
      },
      formServicer: {
        name: ''
      },
      dialogVisible: false,
      dialogVisible2: false,
      activeIndex: 0, // 当前所选场景
      activeIndex2Id: '', // 当前所选接待员
      sceneList: [],
      servicer: [],
      skillList: [],
      entryList: [],
      exportList: [],
      rename: '',
      rename2: '',
      launchPlatformData: []
    }
  },

  computed: {
    // 接待员分组数据
    groupServicer () {
      const arr = this.mergeSameAttribute(this.servicer)
      return arr
    },
    // 过滤掉除了自己的其他接待员 （同一场景）
    servicerListFilterSelect () {
      const data = this.servicer.filter(item => item.id !== this.activeIndex2Id)
      return data
    },
    // 过滤掉当前选择接待员，获得其他接待员
    sceneListFilterSelect () {
      return this.sceneList.filter(item => item.id !== this.activeIndex)
    }
  },
  watch: {
    '$route.params': {
      handler (val) {
        // if (val.sceneId) {
        this.getSceneList()
        // }
      },
      immediate: true
    }
  },
  created () {
    // this.getSceneList()

    this.getPolicyList()
  },
  mounted () {
    window.addEventListener('visibilitychange', this.handleVisiable)
    // window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // window.addEventListener('beforeunload', this.aaaa)
    // window.addEventListener('unload', this.updateHandler)
    console.log('window-->', window)
    console.log('docment-->', document)
    console.log('docment-->', document === window.document)
  },
  destroyed () {
    window.removeEventListener('visibilitychange', this.handleVisiable)
    // window.removeEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // window.removeEventListener('beforeunload', this.aaaa)
    // window.removeEventListener('unload', this.updateHandler)
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // if (to.name === 'detail') { // 若要跳到详情页，则将分页和筛选信息存在Storage
    //   window.sessionStorage.setItem('pageInfo', JSON.stringify(this.pageInfo))
    // } else { // 若不是详情页，则清楚分页信息
    //   window.sessionStorage.removeItem('pageInfo')
    // }
    const bool = this.getIsAllSetNextId()
    if (bool) {
      // 执行路由跳转
      next()
    } else {
      alert(this.tipMsg)
    }
  },
  methods: {
    // aaaa () {
    //   alert('aaaa')
    // },
    // beforeunloadHandler (e) {
    //   alert('123')
    //   // console.log('e-->', e)
    //   e = e || window.event
    //   if (e) {
    //     e.returnValue = '关闭提示123'
    //   }
    //   return true
    // },
    // updateHandler () {
    //   alert('updateHandler')
    //   // fetch('url', {
    //   //     method: 'POST',
    //   //     body:'参数'
    //   //     headers: {'Content-Type': 'application/json'},
    //   //     keepalive: true
    //   // });
    // },

    // 判断是否已经设置了出口条件的下一步
    getIsAllSetNextId () {
      console.log('exportList--->', this.exportList)
      const length = this.exportList.length
      const isAllSet = length > 0 && this.exportList.every(item => (!!item.stopType && item.stopType !== 1) || (item.stopType === 1 && item.nextId))
      if (isAllSet || (length === 0)) { // 全部已经设置了出口-下一步
        return true
      } else {
        return false
      }
    },
    handleVisiable (e) {
      switch (e.target.visibilityState) {
        case 'prerender':
          console.log('网页预渲染，内容不可见')
          break
        case 'hidden': {
          console.log('内容不可见，处理后台、最小化、锁屏状态')
          // alert('当前接待员出口下一步不可为空')
          const bool = this.getIsAllSetNextId()
          if (!bool) {
            alert(this.tipMsg)
          }
          break
        }
        case 'visible':
          console.log('处于正常打开')
          break
      }
    },
    mergeSameAttribute  (arr) {
      const dataInfo = {}
      arr.forEach((item, index) => {
        const { groupId } = item
        if (!dataInfo[groupId]) {
          dataInfo[groupId] = {
            groupId: item.groupId,
            child: []
          }
        }
        dataInfo[groupId].child.push(item)
      })
      const list = Object.values(dataInfo) // list 转换成功的数据
      return list
    },
    getListGroupBySceneId () {
      return new Promise((resolve, reject) => {
        const params = {
          sceneId: this.selectedScene.id
        }
        this.noGroupService = JSON.parse(JSON.stringify(this.servicer))
        this.$service.getListGroup(params).then(res => {
          if (res && res.length > 0) {
            this.groupData = res.map(item => {
              const list = item.list.map(obj => {
                const ser = this.servicer.find(s => obj.receptionistId === s.id)
                const receptionist = ser ? ser.receptionist : ''

                this.noGroupService = this.noGroupService.filter(s => obj.receptionistId !== s.id) // 过滤没有分组的接待员
                // if (aIndex > -1) this.noGroupService.splice(aIndex, 1)

                return {
                  ...obj,
                  receptionist
                }
              })
              return {
                id: item.id,
                sceneId: item.sceneId,
                groupName: item.groupName,
                list
              }
            })
          } else {
            // 初始化
            this.groupData = [{
              list: [],
              groupName: '组1'
            }]
          }
        })
        resolve(this.groupData)
      })
    },

    changeStyle () {
      this.styleType = !this.styleType
    },
    getPolicyList () {
      this.$service.launchPolicyIndex().then(data => {
        this.launchPlatformData = data.biLists
      })
    },
    // 添加接待员分组
    addServicerGroup () {
      const parmas = []
      this.groupData.forEach(group => {
        if (group.list.length > 0) {
          parmas.push(
            {
              ...group,
              sceneId: this.selectedScene.id
            }
          )
        }
      })

      this.$service.addGroup(parmas).then(res => {
        // 刷新列表
        this.getServiceList()
        this.showDragVisible = false
      }, '成功')
    },
    // 添加分组
    async addGroup () {
      // 接待员分组
      await this.getListGroupBySceneId()
      this.showDragVisible = true
    },
    handleCloseDialog () {
      this.showLaunchToBusiness = false
    },

    handelRename2 (item) {
      if (!this.rename2) {
        return this.$message.error('请输入名称')
      }
      this.editReceptionist({
        id: item.id,
        // ...item,
        receptionist: this.rename2
      })
      this.handelClosePop()
    },
    deleteService (item) {
      this.$confirm('此操作将永久删除该接待员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editReceptionist({
          id: item.id,
          delFlag: 2
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    offSetService (item) {
      // putway  1 上架 2 下架
      this.editReceptionist({
        id: item.id,
        putway: item.putway === 1 ? 2 : 1
      })
    },
    handleServiceCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'rename') {
        this.showRename2(row)
      } else if (type === 'offSet') {
        this.offSetService(row)
      } else if (type === 'deleteService') {
        this.deleteService(row)
      } else if (type === 'copy') {
        this.copyService(row)
      } else if (type === 'copyUse') {
        this.copyService(row, 'copyUse')
      }
    },
    copyService (item, type = 'copy') {
      this.copyType = type
      this.copyForm.id = item.id
      this.copyDialogVisible = true
      // 初始化数据
      this.$nextTick(res => {
        this.$refs.copyFormRef.resetFields()
      })
    },
    comfirmCopy () {
      if (this.copyType === 'copyUse') {
        console.log('提交保存复用')
        this.$refs.copyFormRef.validate((valid) => {
          if (valid) {
            this.$service.reuseReceptionist(this.copyForm, '复用成功').then(res => {
              // 刷新列表
              this.getServiceList()
              this.copyDialogVisible = false
            })
          }
        })
      } else {
        this.$refs.copyFormRef.validate((valid) => {
          if (valid) {
            this.$service.copyServicer(this.copyForm, '复制成功').then(res => {
              // 刷新列表
              this.getServiceList()
              this.copyDialogVisible = false
            })
          }
        })
      }
    },
    handleSceneCommand (scope) {
      const type = scope[0]
      const row = scope[1]
      if (type === 'rename') {
        this.showRename(row)
      } else if (type === 'putIn') {
        this.putInScene(row)
      } else if (type === 'offSet') {
        this.offSetScene(row)
      } else if (type === 'deleteScene') {
        this.deleteScene(row)
      }
    },
    returnCrowd () {
      this.$router.push({ name: 'strategyList' })
    },
    showRename (item) {
      this.rename = item.sceneName
    },
    showRename2 (item) {
      this.rename2 = item.receptionist
    },
    // 投放
    putInScene (item) {
      this.tempPolicyAndCrowd = {
        ...item,
        policyName: item.sceneName,
        smart: true
      }
      this.showLaunchToBusiness = true
      // this.editScene({
      //   ...item,
      //   putway: 1
      // })
    },
    // 下架
    offSetScene (item) {
      // putway  1 上架 2 下架
      this.editScene({
        ...item,
        putway: item.putway === 1 ? 2 : 1
      })
    },
    deleteScene (item) {
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editScene({
          ...item,
          delFlag: 2
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 根据接待员ID获取入口列表
    getEntryListByReceptionistId () {
      const parmas = {
        receptionistId: this.selectedServicer.id
      }
      this.$service.getEntryList(parmas).then(res => {
        this.entryList = res || []
      })
    },
    // 根据接待员ID获取出口列表
    getExportListByReceptionistId () {
      const parmas = {
        receptionistId: this.selectedServicer.id
      }
      this.$service.getExportList(parmas).then(res => {
        this.exportList = res || []
      })
    },

    // 选择场景
    selectScene (id, selectServicerId) {
      const bool = this.getIsAllSetNextId()
      if (bool) {
        this.activeIndex = id

        // this.selectedScene = this.sceneList[index] || {}
        const obj = this.sceneList.find(item => item.id === id)
        this.selectedScene = obj || {}

        this.searchServicer = '' // 接待员的搜索条件置空
        this.getServiceList('list', selectServicerId)
      } else {
        alert(this.tipMsg)
      }
    },
    // 选择服务员
    selectServicer (id) {
      const bool = this.getIsAllSetNextId()
      if (bool) {
        // 跳转
        this.activeIndex2Id = id
        const obj = this.servicer.find(item => item.id === id)
        this.selectedServicer = obj || {}

        // 入口列表
        this.getEntryListByReceptionistId()
        // 出口列表
        this.getExportListByReceptionistId()
      } else {
        alert(this.tipMsg)
      }
    },

    // 服务员列表
    getServiceList (type = 'list', selectServicerId) {
      const parmas = {
        sceneId: this.selectedScene.id,
        keywords: this.searchServicer,
        pageNum: 1,
        pageSize: 1000
      }
      this.servicer = []
      // 再次点击详情时中断之前的详情请求，防止数据被之前接口数据所覆盖·
      this.clearHttpRequestingList()
      this.$service.getReceptionistList(parmas).then(res => {
        this.servicer = res.data || []
        this.selectedServicer = {}
        this.entryList = []
        this.exportList = []
        if (this.servicer.length > 0) {
          if (selectServicerId) this.activeIndex2Id = selectServicerId
          const obj = this.servicer.find(item => item.id === this.activeIndex2Id)

          this.activeIndex2Id = obj ? obj.id : this.servicer[0].id

          if (type === 'add') { // 添加接待员，焦点落在新增的上面
            this.activeIndex2Id = this.servicer[0].id
          }

          this.selectServicer(this.activeIndex2Id)
        }
        // this.activeIndex2 = 0
        // this.selectedServicer = this.servicer[0] || {}
      })
    },
    // 场景列表
    getSceneList (type = 'list') {
      const parmas = {
        keywords: this.searchScene,
        pageNum: 1,
        pageSize: 1000
      }
      this.sceneList = []
      this.$service.getSceneList(parmas).then(res => {
        this.sceneList = res.data || []
        if (this.sceneList.length > 0) {
          // 获取从动态人群跳转过来的场景ID，并选中
          const id = this.$route.params.sceneId || this.activeIndex
          const obj = this.sceneList.find(item => item.id === id)

          this.activeIndex = obj ? obj.id : this.sceneList[0].id
          // const redirctIndex = this.sceneList.findIndex(item => Number(id) === Number(item.id))
          // if (redirctIndex > 0) {
          //   this.activeIndex = redirctIndex
          // } else if (this.sceneList.length <= this.activeIndex) {
          //   this.activeIndex = 0
          // }
          // this.activeIndex = redirctIndex > 0 ? redirctIndex : this.activeIndex

          if (type === 'add') { // 添加接待员，焦点落在新增的上面
            this.activeIndex = this.sceneList[0].id
          }
          this.selectScene(this.activeIndex)
        }
        // this.activeIndex = 0
        // this.selectedScene = this.sceneList[0] || {}
        // this.getServiceList()
      })
    },

    handelRename (item) {
      if (!this.rename) {
        return this.$message.error('请输入名称')
      }
      this.editScene({
        // id: item.id,
        ...item,
        sceneName: this.rename
      })
      this.handelClosePop()
    },
    editScene (parmas) {
      // const list = this.sceneList

      this.$service.editScene(parmas).then(res => {
        // const index = list.findIndex(item => item.id === parmas.id)
        // list.splice(index, 1, parmas)
        this.getSceneList()
      })
    },
    // 编辑接待员
    editReceptionist (params, type) {
      // const list = this.servicer
      this.$service.editReceptionist(params).then(res => {
        // const index = list.findIndex(item => item.id === params.id)
        // list.splice(index, 1, params)
        if (type === 'no-refresh-list') return
        this.getServiceList()
      })
    },
    handelClosePop () {
      const pops = this.$refs.pop
      pops.forEach(item => {
        item.doClose()
      })
    },
    addScene () {
      this.dialogVisible = true
    },
    addServicer () {
      this.formServicer.name = ''
      this.dialogVisible2 = true
    },
    confirmAddScene () {
      // console.log('this.formScene.length--------', this.sceneList.length)
      const parmas = {
        sceneName: this.formScene.name
        // id: this.sceneList.length + 1
      }

      this.$service.addScene(parmas).then(res => {
        // this.sceneList.push(item)
        // const _this = this
        this.getSceneList('add')
        this.dialogVisible = false
      })
    },
    // 确定添加服务员
    confirmAddServicer () {
      const parmas = {
        sceneId: this.selectedScene.id,
        policyId: this.selectedScene.policyId,
        receptionist: this.formServicer.name
        // id: this.sceneList.length + 1
      }

      this.$service.addReceptionist(parmas).then(res => {
        // this.sceneList.push(item)
        this.getServiceList('add')
        this.dialogVisible2 = false
      })
    }

  }
}
</script>

<style lang="stylus" scoped>
@import './sty/common.styl'
@import './sty/dark.styl'
@import './sty/light.styl'

#octagon {
  width: 100px;
  height: 100px;
  background: red;
  position: relative;
}
#octagon:before {
  content: "";
  width: 100px;
  position: absolute;
  top: 0; left: 0;
  border-bottom: 29px solid red;
  border-left: 29px solid #fff;
  border-right: 29px solid #fff;
  box-sizing: border-box;
}
#octagon:after {
  content: "";
  width: 100px;
  position: absolute;
  bottom: 0; left: 0;
  border-top: 29px solid red;
  border-left: 29px solid #fff;
  border-right: 29px solid #fff;
  box-sizing: border-box;
}
</style>
