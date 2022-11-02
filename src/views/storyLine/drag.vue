<template>
  <div>
    <!--使用draggable组件-->
    <div class="itxst">
      <!-- <div>{{ totallArr }}</div>
      <div>{{ groupList }}</div> -->
      <div class="col">
        <div class="title">接待员</div>
        <draggable v-model="totallArr" :group="groupA" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" class="drag-wrap">
          <transition-group :style="style">
            <div class="item" v-for="item in totallArr" :key="item.receptionistId">
              {{ item.receptionist }}
              <el-select v-model="item.businessId" placeholder="请选择业务类型">
                <el-option
                  v-for="obj in launchPlatformData"
                  :key="obj.biId"
                  :label="obj.biName"
                  :value="obj.biId">
                </el-option>
              </el-select>
            </div>
          </transition-group>
        </draggable>
      </div>
      <!-- {{arr2}} -->
      <div>

      <div class="col" v-for="(g, index) in groupList" :key="index">
        <div class="title">组{{index+1}}</div>
        <draggable v-model="g.list" :group="groupB" animation="300" dragClass="dragClass" ghostClass="ghostClass"
          chosenClass="chosenClass">
          <transition-group :style="style">
            <div class="item" v-for="item in g.list" :key="item.receptionistId">
              {{ item.receptionist }}
              <el-select v-model="item.businessId" placeholder="请选择业务类型" clearable>
                <el-option
                  v-for="obj in launchPlatformData"
                  :key="obj.biId"
                  :label="obj.biName"
                  :value="obj.biId">
                </el-option>
              </el-select>
            </div>
          </transition-group>
        </draggable>
        <i v-if="groupList.length > 1" class="el-icon-delete"  @click="cutGroup(index)"></i>
      </div>
      <el-button type="primary" plain style="width: 100%; margin-top: 10px;" size="mini" icon="el-icon-plus" @click="addGroup"></el-button>

      </div>
    </div>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    list: { // 所有接待员
      type: Array,
      default: () => []
    },
    groupData: { // 接待员分组信息
      type: Array,
      default: () => []
    },
    launchPlatformData: { // 业务平台
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

      drag: false,
      message: '',
      groupA: {
        name: 'itxst',
        put: true, // 可以拖入
        pull: () => {
          // if (this.totallArr.length <= 3) {
          //   this.message = '元素小于等于3不允许再拖拽了'
          // }
          // return this.totallArr.length > 3
          return true
        }
      },
      groupB: {
        name: 'itxst',
        pull: () => {
          return true
        }, // B组拖拽时克隆到A组
        put: true
      },
      // 定义要被拖拽对象的数组
      totallArr: [

      ],
      groupList: [],
      // 空数组之在的样式，设置了这个样式才能拖入
      style: 'min-height:150px; display: block; height: 100%'
    }
  },
  watch: {
    list: {
      handler (val) {
        this.totallArr = val.map(item => {
          return {
            receptionistId: item.id,
            receptionist: item.receptionist,
            businessId: ''
          }
        })
        console.log('this.totallArr==', this.totallArr)
        // this.$emit('update:list', this.totallArr)
      },
      immediate: true
    },
    groupData: {
      handler (val) {
        this.groupList = val
        this.$emit('update:groupData', val)
      },
      immediate: true
    }
  },
  methods: {
    // 删除分组
    cutGroup (index) {
      const currentGroup = this.groupList[index]
      if (currentGroup.list.length > 0) {
        this.totallArr = this.totallArr.concat(currentGroup.list)
      }

      if (currentGroup.id) {
        const params = {
          groupId: currentGroup.id
        }
        this.$service.delGroup(params).then(res => {
          this.groupList.splice(index, 1)
        })
      } else {
        this.groupList.splice(index, 1)
      }

      console.log('this.totallArr========', this.totallArr)
      console.log('this.totallArr========', this.groupList)
    },
    addGroup () {
      this.groupList.push({
        list: []
      })
    },
    // 开始拖拽事件
    onStart () {
      this.drag = true
      return true
    },
    // 拖拽结束事件
    onEnd () {
      this.drag = false
    }
  }
}
</script>

<style lang='stylus' scoped>
/*定义要拖拽元素的样式*/
.ghostClass {
  background-color: blue !important;
}

.chosenClass {
  background-color: #edefff !important;
  opacity: 1 !important;
}

.dragClass {
  background-color: blueviolet !important;
  opacity: 1 !important;
  box-shadow: none !important;
  outline: none !important;
  background-image: none !important;
}

.itxst {
  margin: 10px;
  min-height: 200px;
  display: grid;
  grid-template-columns: 230px 230px
  grid-gap 10px
}

.title {
  padding: 6px 12px 0 12px;
  font-size: 14px;
  color: #6c6c6c
}

.col {
  // width: 40%;/
  // flex: 1;
  // padding: 10px;
  // border: solid 1px #eee;
  // border-radius: 5px;
  border: solid 1px #e3e3e3
  border-radius: 5px;
  position relative
}
.col + .col {
  margin-top 10px
}
.item {
  padding: 6px 12px;
  margin: 10px;
  border: solid 1px #eee;
  background-color: #edefff;
  border-radius: 10px;
}

.item:hover {
  background-color: #ced2f1;
  cursor: move;
}

.item+.item {
  border-top: none;
  margin-top: 6px;
}
.drag-wrap {
  height: 100%;
}
.el-icon-delete {
  position: absolute;
  right: -22px;
  top: 47%;
  cursor pointer
}
</style>
