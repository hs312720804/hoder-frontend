<template>
  <!-- <div>
    <div class="level_1_box" v-for="(item,index) in tableData" :key="index">
      <div class="level_parent_title">{{item.name?item.name:item.firstLevelIndex}}</div>
      <div class="level_children_box">
        <div class="level_2_item" v-for="(item1,index1) in item.children" :key="index1">
          <div class="level_2_title" :class="index1%2==0?'light2':'dark2'">{{item1.name?item1.name:item1.firstLevelIndex}}</div>
          <div class="level_3_box">
            <div class="level_3_item" v-for="(item2,index2) in item1.children" :key="index2">
              <div class="level_3_title" :class="index1%2==0?'light3':'dark3'">{{item2.name?item2.name:item2.firstLevelIndex}}</div>
              <div class="input_box">
                <el-tooltip class="item icon-tips" effect="light" :content='item2.secondDescription' placement="bottom">
                  <i class="el-icon-warning-outline" style=" margin:0 5px 0 0;"></i>
                </el-tooltip>
               
                <div style="width: 40%; margin: 0 5px 0 0;">{{ item2.indexUnit }}</div>
                
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <div class="wrap">
    <div class="level_parent_box" v-for="(item1, index1) in treeData" :key="index1"
      :style="{ height: item1.ratio + '%' }">
      <!-- 父级 -->
      <div class="level_parent_title" :class="'bg' + index1">{{ item1.name }} -- {{ item1.ratio }}</div>
      <!-- 子级 -->
      <div class="level_children_box" v-if="item1.children">
        <tree :treeData="item1.children"></tree>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'tree',
  components: {},
  data() {
    return {

    }
  },
  props: ['treeData'],
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang='stylus' scoped>
.wrap{
  flex-shrink: 0; 
  height: 100%
}
.level_parent_box{
  display: flex;
  // flex-wrap: wrap;
  // width: 100%;
  // justify-content: space-between;
}
.level_parent_title{
  width: 200px;
  // min-height 70px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background: #a6def5;
  border-bottom: 1px solid rgb(255, 255, 255);
  border-right: 5px solid rgb(255, 255, 255); 
  flex-shrink: 0;
}
.level_children_box{
  
}
.level_2_item{
  width: 100%;
  // display: flex!important;;
  // align-items: stretch;
  // border-bottom: 1px solid rgb(255, 255, 255); 
}
.level_2_title{
  width: 150px
  border-right: 5px solid rgb(255, 255, 255);  
  // padding: 5px 20px;
  // display: flex;
  // justify-content: flex-end;
  // align-items: center;
  // background: #fdedcc;
}
.bg0 {
  background: rgba(198, 206, 226, 1)
}
.bg1 {
  background: rgba(241,218,219, 1)
}
.bg2 {
  background: rgba(175,118,128, 1)
}
.bg3 {
  background: rgba(197,189,183, 1)
}
.bg4 {
  background: rgba(150,150,152, 1)
}
.bg5 {
  background: rgba(154,161,147, 1)
}
.bg6 {
  background: rgba(202,218,189, 1)
}
</style>
