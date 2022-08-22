<template>
  <div class="wrap">
    <div 
      class="level_parent_box" 
      v-for="(item1, index1) in treeData" :key="index1" 
      :style="{ height: item1.ratio + '%' }"
    >
      <!--  -->
      <!-- 父级 -->
      <!-- <div class="level_parent_title" :class="'bg' + index1">{{ item1[linkProps['name']] }} -- {{ item1[linkProps['name']] }}</div> -->
      <!-- <div class="level_parent_title" :class="'bg' + index1">{{ item1.payUv }}</div> -->
      <div  class="level_parent_title" :class="item1.level === 0 || item1.level === 1 ? 'bgzIndex'+ item1.level +'-'+ index1 :'bg-' + index1">
        
        <el-tooltip placement="top" effect="light">
          <!-- 提示框 -->
          <div slot="content">
            <div>
              <div>{{ item1.name }} </div>
              <div v-for="(value, key) in item1">
                <span v-if="(typeof value === 'string' || typeof value === 'number') && linkPropsName[key]" >
                  {{ linkPropsName[key] }} : {{ value }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div>{{ item1.name }} </div>
            <div v-for="(value, key) in item1">
              <span v-if="(typeof value === 'string' || typeof value === 'number') && linkPropsName[key]" >
                {{ linkPropsName[key] }} : {{ value }}
              </span>
            </div>
          </div>

        </el-tooltip>
        
      </div>


      <!-- 111==={{item1[linkProps['children']]}} -->
      <!-- 子级 -->
      <div class="level_children_box" v-if="item1[linkProps['children']]">
      <!-- 1231414 -->
        <tree :treeData="item1[linkProps['children']]" :linkProps="linkProps" :linkPropsName="linkPropsName"></tree>
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
  props: ['treeData', 'linkProps', 'linkPropsName'],
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
  display: flex;
  justify-content: center;
  flex-direction: column;
  // align-items: center;
  text-align: center;
  font-size 14px
  div {
    margin-bottom 8px
  }
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
colors = rgba(202,218,189, 1), rgba(154,161,147, 1), rgba(241,223,222, 1), rgba(197,189,183, 1), rgba(150,150,152, 1), rgba(154,161,147, 1), rgba(202,218,189, 1)

for color,i in colors
  .bg-{i}
    background: color
    &:hover
      background: mix(color,white,60%)

zindex0colors = rgba(198,206,226, 1)
for color,i in zindex0colors
  .bgzIndex0-{i}
    background: color
    &:hover
      background: mix(color,white,60%)

zindex1colors = rgba(197,189,183, 1), rgba(255,251,232, 1), rgba(232,232,220, 1), rgba(197,189,183, 1), rgba(150,150,152, 1), rgba(154,161,147, 1), rgba(202,218,189, 1)
for color,i in zindex1colors
  .bgzIndex1-{i}
    background: color
    &:hover
      background: mix(color, white, 60%)
// .bgzIndex1-0 {
//   background: rgba(197,189,183, 1)
// }
// .bgzIndex1-1 {
//   background: rgba(255,251,232, 1)
// }
// .bgzIndex1-2 {
//   background: rgba(232,232,220, 1)
// }
</style>
