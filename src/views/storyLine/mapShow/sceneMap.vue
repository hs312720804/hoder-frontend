<template>
  <div id="wrap">
    <div class="top-wrap">
      <span class="scene-name">{{ selectedScene.sceneName }}</span>
      创建人：{{ selectedScene.userName }}
      &nbsp;&nbsp;&nbsp;&nbsp;创建时间：{{ selectedScene.createTime }}
    </div>
    <div class="legend-wrap">
      <div class="legend-wrap-title">图例</div>
      <div class="legend-wrap-item">
        <div class="arrow">
          <i class="el-icon-caret-right"></i>
        </div>
        <div class="legend-title">流向</div>
      </div>
      <div class="legend-wrap-item">
        <div class="circle enter"></div>
        <div class="legend-title">进入条件</div>
      </div>
      <div class="legend-wrap-item" v-for="item in options" :key="item.value">
        <div class="circle" :class="item.color"></div>
        <div class="legend-title">{{ item.legendTitle }}</div>
      </div>
      <!-- <div class="legend-wrap-item">
        <div class="circle red"></div>
        <div class="legend-title">不喜欢，切换</div>
      </div>
      <div class="legend-wrap-item">
        <div class="circle green"></div>
        <div class="legend-title">直接转化</div>
      </div>
      <div class="legend-wrap-item">
        <div class="circle yellow"></div>
        <div class="legend-title">继续种草</div>
      </div>
      <div class="legend-wrap-item">
        <div class="circle purple"></div>
        <div class="legend-title">继续观察</div>
      </div> -->
      <div class="legend-wrap-item">
        <div class="dashed-box"></div>
        <div class="legend-title">分组</div>
      </div>
    </div>
    <!-- {{ groupServicer }} -->
    <JsplumbCom
      v-if="groupServicer && groupServicer.length > 0"
      :groupServicer="groupServicer"
      :relations="relations"
      @selectServicer="id => $emit('selectServicer', id)"
      @showRuleDetail="item => $emit('showRuleDetail', item)"
    >
    </JsplumbCom>
    <el-empty v-else description="暂无数据，请先创建接待员"></el-empty>
    <div class="operate-wrap">
      <i class="el-icon-plus" @click="zoomDom('add')"></i>
      <i class="el-icon-minus" @click="zoomDom('cut')"></i>
    </div>
  </div>
</template>
<script>
import { jsPlumb } from 'jsplumb'

import JsplumbCom from './jsplumbCom/Index.vue'
import { zoom } from './jsplumbCom/setMoveAndDrag'
import { options } from '@/views/storyLine/utils'

export default {
  name: 'crowdCirculationTrack',
  components: { JsplumbCom },
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    selectedScene: {
      type: Object,
      default: () => {}
    }

  },
  data () {
    return {
      groupServicer: [],
      relations: [
        ['0_out_2uuu', '1_i1231n'],
        ['1_in1231313', '0_45in_4'],
        ['0_in_2', '5_in_8'],
        ['0_in_3111', '5_in_8']
        // ['0_in_31', '0_34in_4']
      ],
      options: options
    }
  },
  watch: {
    chartData: {
      handler (val) {
        let AA = []
        if (val.groupServicer) {
          AA = val.groupServicer.map(item => {
            return {
              ...item,
              id: String(item.id)
            }
          })
        }
        this.groupServicer = AA || []
        this.relations = val.relations || []

        // this.relations = [
        //   [
        //     '366',
        //     '245'
        //   ],
        //   [
        //     '405',
        //     '517'
        //   ]

        // ]

        console.log('this.groupServicer--->', this.groupServicer)
        console.log('this.relations--->', this.relations)
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {
    jsPlumb.ready(() => {
      // 创建实例
      const j = (window.j = jsPlumb.getInstance({
        Container: 'wrap'
      }))

      // 可拖动
      j.draggable(jsPlumb.getSelector('.legend-wrap'))
    })
  },
  methods: {
    zoomDom (type) {
      // 设置画布可拖拽，滚动放大缩小
      zoom('#wrap', '#canvas', type)
    }
  }

}
</script>
<style lang="stylus" scoped>
@import './jsplumbCom/style.styl'

</style>
