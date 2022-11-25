<template>
  <div class="user-info">
    <!-- <el-button type="text" @click="handelGo('http://192.168.2.127:8888/index')">数据部应用平台</el-button> -->
    <i class="el-icon-question" style="color: #409EFF; font-size: 18px; margin-right: 5px;"></i>
    <el-button
      type="text"
      @click="handelGo('http://wiki.cc0808.com/pages/viewpage.action?pageId=49470290')"
      style="font-size: 16px;font-weight: 600;margin-right: 30px"
    >
      使用文档
    </el-button>

    <el-dropdown trigger="hover">
      <el-badge :value="unReadMessage" class="item">
        <i class="el-icon-bell"></i>
      </el-badge>
      <el-dropdown-menu slot="dropdown" class="notice-dropdown">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="升级通知" name="first">
            <div v-for="updateItem in updateMessage" :key="updateItem.noticeId" class="tab-content">
              <div
                :class="['notice-title', updateItem.noticeStatus === 0 ? 'red-dot-title': '']"
                @click="handleReadMessage(updateItem.noticeId)"
              >{{updateItem.noticeTitle}}</div>
              <div class="notice-time">{{updateItem.pushTime}}</div>
            </div>
            <div class="see-more" v-if="showMoreUpdate" @click="handleSeeAllMessage">查看全部</div>
          </el-tab-pane>
          <el-tab-pane label="系统通知" name="second">
            <div v-for="systemItem in systemMessage" :key="systemItem.noticeId" class="tab-content">
              <div
                :class="['notice-title',systemItem.noticeStatus === 0 ? 'red-dot-title': '']"
                @click="handleReadMessage(systemItem.noticeId)"
              >{{systemItem.noticeTitle}}</div>
              <div class="notice-time">{{systemItem.pushTime}}</div>
            </div>
            <div class="see-more" v-if="showMoreSystem" @click="handleSeeAllMessage">查看全部</div>
          </el-tab-pane>
        </el-tabs>

      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
export default {
  name: 'userinfo',
  components: {},
  data () {
    return {
      activeName: 'first',
      updateMessage: [],
      systemMessage: [],
      messageTypeEnum: {
        first: 1,
        second: 2
      },
      unReadMessage: undefined,
      showMoreUpdate: false,
      showMoreSystem: false
    }
  },
  created () {
    this.getNoticeMessages(this.messageTypeEnum[this.activeName])
  },
  methods: {
    handleSeeAllMessage () {
      this.$router.push({ name: 'notice' })
    },

    handleDropdownCommand (command) {
      if (command === 'logout') {
        this.$logout().then(() => {
          this.$router.push({ name: 'login' })
        })
      }
    },
    handelGo (url) {
      // const url = 'http://wiki.skyoss.com/pages/viewpage.action?pageId=49470290'
      window.open(url, '_blank')
    },
    handleClick (tab) {
      this.getNoticeMessages(this.messageTypeEnum[tab.name])
    },
    getNoticeMessages (type) {
      const noticeType = type
      this.$service.getNoticeHeaderList({ noticeType }).then((data) => {
        const interfaceData = data['消息列表']
        const statusData = data['消息状态']
        this.unReadMessage = data['未读数量'] > 0 ? data['未读数量'] : undefined
        interfaceData.forEach((item, index) => {
          item.noticeStatus = statusData[index]
        })
        const dataList = interfaceData
        if (type === 1) {
          if (dataList.length > 5) {
            this.showMoreUpdate = true
            // 只取前五条
            this.updateMessage = dataList.slice(0, 5)
          } else {
            this.updateMessage = dataList
          }
        } else {
          if (dataList.length > 5) {
            this.showMoreSystem = true
            this.systemMessage = dataList.slice(0, 5)
          } else {
            this.systemMessage = dataList
          }
        }
      })
    },
    handleReadMessage (noticeId) {
      this.$router.push({
        name: 'notice',
        query: { noticeId: noticeId, mode: 'read' }
      })
    }
  }
}
</script>

<style lang='stylus' scoped>
.notice-title
  width 300px
  margin 5px 10px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  cursor pointer
.notice-time
  color #999
  font-size 14px
  margin 0 10px
.notice-dropdown >>> .el-tabs__item
  width 160px
  text-align center
.notice-dropdown >>> .red-dot-title
  position relative
  padding-left 12px
  &:before
    position absolute
    width 8px
    height 8px
    border-radius 10px
    content ""
    background-color red
    left 0
    top 7px
.see-more
  text-align center
  color #999
  font-size 14px
  margin 15px 0
  cursor pointer
.no-child-menu
  color #fff
.no-child-menu.is-active
  color: #409EFF
.user-info
  margin-right 30px
</style>
