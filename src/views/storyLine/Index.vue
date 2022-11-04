<template>
  <div :class="styleType ? 'dark' : 'light'">
    <!-- {{groupServicer}} -->
    <div class='row-wrap' >
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
                <div class="lists-item" v-for="(item,index) in sceneList" :key="item.id" @click="selectScene(index)" :class="{active: activeIndex === index}">
                  <i class="icon el-icon-video-camera-solid"></i>
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
                              maxlength="20"
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
                      <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['putIn', item]">
                        投放
                      </el-dropdown-item>
                      <el-dropdown-item v-if="!item.planId" class="clearfix" :command="['offSet', item]">
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
                <div v-for="(group) in groupServicer" :key="group.groupId" :class="{'group-sty': group.groupId !== 0}">
                  <!-- {{group.groupId}} -->
                  <div class="lists-item" v-for="item in group.child" :key="item.id"  @click="selectServicer(item.id)" :class="{active: activeIndex2Id === item.id}">
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
                        <el-dropdown-item class="clearfix" :command="['rename', item]">

                          <el-popover placement="top" trigger="click" ref="pop">
                            <div slot="reference">重命名</div>
                            <div style="display: flex">
                              <el-input

                                type="text"
                                placeholder="请输入内容"
                                v-model="rename2"
                                maxlength="20"
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
          :skillOptions="skillOptions"
          :entryList="entryList"
          :exportList="exportList"
          :activeIndex2Id="activeIndex2Id"
          @updataEntryList="getEntryListByReceptionistId"
          @updataExportList="getExportListByReceptionistId"
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
      noGroupService: [],
      styleType: true,
      groupData: [{
        list: []
      }],
      showDragVisible: false,
      tempPolicyAndCrowd: {},
      showLaunchToBusiness: false,
      editClientRow: {},
      skillOptions: [],
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
      activeIndex: 0,
      activeIndex2Id: '',
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
    }
  },
  created () {
    this.getSceneList()

    this.getPolicyList()
  },
  methods: {

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
          console.log('res--------->', res)

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
                list
              }
            })
          } else {
            // 初始化
            this.groupData = [{
              list: []
            }]
          }
        })
        console.log('this.groupData--->', this.groupData)
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
        console.log('group---->', group)
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
      this.editReceptionist({
        id: item.id,
        // ...item,
        receptionist: this.rename2
      })
      this.handelClosePop()
    },
    deleteService (item) {
      this.editReceptionist({
        id: item.id,
        delFlag: 2
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
      this.editScene({
        ...item,
        delFlag: 2
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

    // 根据场景ID获取技能列表
    getSkillListBySceneId () {
      const parmas = {
        sceneId: this.selectedScene.id
      }
      return this.$service.getSceneSkillList(parmas).then(res => {
        console.log('rs-->', res)
        this.skillOptions = res || []
        return res
      })
    },
    // 选择场景
    selectScene (index) {
      this.activeIndex = index
      this.selectedScene = this.sceneList[index] || {}
      this.getServiceList()
      this.getSkillListBySceneId()
    },
    // 选择服务员
    selectServicer (id) {
      this.activeIndex2Id = id
      const obj = this.servicer.find(item => item.id === id)
      this.selectedServicer = obj || {}

      // 入口列表
      this.getEntryListByReceptionistId()
      // 出口列表
      this.getExportListByReceptionistId()
    },

    // 服务员列表
    getServiceList () {
      const parmas = {
        sceneId: this.selectedScene.id,
        keywords: this.searchServicer,
        pageNum: 1,
        pageSize: 100
      }
      this.servicer = []
      this.$service.getReceptionistList(parmas).then(res => {
        this.servicer = res.data || []
        this.selectedServicer = {}
        this.entryList = []
        this.exportList = []
        if (this.servicer.length > 0) {
          const obj = this.servicer.find(item => item.id === this.activeIndex2Id)

          this.activeIndex2Id = obj ? obj.id : this.servicer[0].id
          this.selectServicer(this.activeIndex2Id)
        }
        // this.activeIndex2 = 0
        // this.selectedServicer = this.servicer[0] || {}
      })
    },
    // 场景列表
    getSceneList (callBack) {
      const parmas = {
        keywords: this.searchScene,
        pageNum: 1,
        pageSize: 100
      }
      this.sceneList = []
      this.$service.getSceneList(parmas).then(res => {
        this.sceneList = res.data || []
        callBack && callBack()
        console.log('this.activeIndex---》', this.activeIndex)
        if (this.sceneList.length > 0) {
          // 获取从动态人群跳转过来的场景ID，并选中
          const id = this.$route.params.sceneId || ''
          const redirctIndex = this.sceneList.findIndex(item => Number(id) === Number(item.id))
          if (redirctIndex > 0) {
            this.activeIndex = redirctIndex
          } else if (this.sceneList.length <= this.activeIndex) {
            this.activeIndex = 0
          }
          // this.activeIndex = redirctIndex > 0 ? redirctIndex : this.activeIndex
          this.selectScene(this.activeIndex)
        }
        // this.activeIndex = 0
        // this.selectedScene = this.sceneList[0] || {}
        // this.getServiceList()
        // this.getSkillListBySceneId()
      })
    },

    handelRename (item) {
      this.editScene({
        // id: item.id,
        ...item,
        sceneName: this.rename
      })
      this.handelClosePop()
    },
    editScene (parmas) {
      const list = this.sceneList

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
        console.log('item-----', item)
        item.doClose()
      })
    },
    addScene () {
      this.dialogVisible = true
    },
    addServicer () {
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
        const _this = this
        this.getSceneList(function () {
          _this.activeIndex = Number(_this.sceneList.length - 1)
        })
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
        this.getServiceList()
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
