<template>
  <div id="wrap">
    <div class="top-wrap">
      <span class="scene-name">场景xxx</span>
      创建人：黄志超   创建时间：2023.04.05 14:32:23
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
      <div class="legend-wrap-item">
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
      </div>
      <div class="legend-wrap-item">
        <div class="dashed-box"></div>
        <div class="legend-title">分组</div>
      </div>
    </div>
    <JsplumbCom
      :groupServicer="groupServicer"
      :relations="relations"
    >
    </JsplumbCom>
  </div>
</template>
<script>
import { jsPlumb } from 'jsplumb'

import JsplumbCom from './jsplumbCom/Index.vue'

export default {
  name: 'crowdCirculationTrack',
  components: { JsplumbCom },
  props: {
    chartData: {
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
      ]
    }
  },
  watch: {
    chartData: {
      handler (val) {
        debugger
        this.groupServicer = val.groupServicer || []
        this.relations = val.relations || []

        console.log('this.groupServicer--->', this.groupServicer)
        console.log('this.relations--->', this.relations)
      },
      immediate: true
    }
  },
  created () {
    // this.groupServicer = [
    //   {
    //     groupId: 194,
    //     child: [{
    //       id: 2226,
    //       receptionist: '1_学习能力',
    //       entryList: [{
    //         id: '0_in'
    //       }, {
    //         id: '0_i89n_2'
    //       }, {
    //         id: '0_in_322333'
    //       }, {
    //         id: '0_in99_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '0_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2225,
    //       receptionist: '学习能力',
    //       entryList: [{
    //         id: '1_in1231313'
    //       }, {
    //         id: '0_i56n_2'
    //       }, {
    //         id: '0_in_3444'
    //       }, {
    //         id: '0_in434_4'
    //       }, {
    //         id: '5_in_8'
    //       }, {
    //         id: '0_in45_2'
    //       }, {
    //         id: '0_in_3555'
    //       }, {
    //         id: '0_in1221_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2221235,
    //       receptionist: '搞笑',
    //       entryList: [{
    //         id: '1_in1231231314'
    //       }, {
    //         id: '0_56'
    //       }, {
    //         id: '0_123123'
    //       }, {
    //         id: '0_45in_4'
    //       }, {
    //         id: '1_i123n'
    //       }, {
    //         id: '0_in_8'
    //       }, {
    //         id: '7_in_9'
    //       }, {
    //         id: '0_in_01'
    //       }],
    //       exportList: [{
    //         type: 3,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_212313'
    //       }]
    //     }]
    //   },
    //   {
    //     id: 2017,
    //     receptionist: '搞笑',
    //     entryList: [{
    //       id: '0_in'
    //     }, {
    //       id: '0_in_2'
    //     }, {
    //       id: '0_in456_3'
    //     }, {
    //       id: '0_in_454'
    //     }, {
    //       id: '0_in_455'
    //     }],
    //     exportList: [{
    //       type: 0,
    //       id: '0_out'
    //     }, {
    //       type: 3,
    //       id: '0_out_2rrr'
    //     }]
    //   }, {
    //     id: 2016,
    //     receptionist: '亲子',
    //     entryList: [{
    //       id: '0_in'
    //     }, {
    //       id: '0_in_2'
    //     }, {
    //       id: '0_in_3111'
    //     }, {
    //       id: '0_34in_4'
    //     }],
    //     exportList: [{
    //       type: 0,
    //       id: '0_out'
    //     }, {
    //       type: 2,
    //       id: '0_out_2'
    //     }]
    //   }
    // ]
    // this.groupServicer = [
    //   {
    //     groupId: 19114,
    //     child: [{
    //       id: 2226,
    //       receptionist: '1_学习能力',
    //       entryList: [{
    //         id: '0_in'
    //       }, {
    //         id: '0_i89n_2'
    //       }, {
    //         id: '0_in_322333'
    //       }, {
    //         id: '0_in99_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '0_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2225,
    //       receptionist: '学习能力',
    //       entryList: [{
    //         id: '1_in1231313'
    //       }, {
    //         id: '0_i56n_2'
    //       }, {
    //         id: '0_in_3444'
    //       }, {
    //         id: '0_in434_4'
    //       }, {
    //         id: '5_in_8'
    //       }, {
    //         id: '0_in45_2'
    //       }, {
    //         id: '0_in_3555'
    //       }, {
    //         id: '0_in1221_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2221235,
    //       receptionist: '学习能力',
    //       entryList: [{
    //         id: '1_in1231231314'
    //       }, {
    //         id: '0_56'
    //       }, {
    //         id: '0_123123'
    //       }, {
    //         id: '0_45in_4'
    //       }, {
    //         id: '1_i123n'
    //       }, {
    //         id: '0_in_8'
    //       }, {
    //         id: '7_in_9'
    //       }, {
    //         id: '0_in_01'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_212313'
    //       }]
    //     }]
    //   },
    //   {
    //     groupId: 11274,
    //     child: [{
    //       id: 2226,
    //       receptionist: '1_学习能力',
    //       entryList: [{
    //         id: '0_in'
    //       }, {
    //         id: '0_in_2'
    //       }, {
    //         id: '0_in_3111'
    //       }, {
    //         id: '0_55in_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '0_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2uuu'
    //       }]
    //     }, {
    //       id: 27825,
    //       receptionist: '学习能力',
    //       entryList: [{
    //         id: '1_i1231n'
    //       }, {
    //         id: '0_12in_2'
    //       }, {
    //         id: '0_in_3222'
    //       }, {
    //         id: '0_456in_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2225,
    //       receptionist: '学习能力',
    //       entryList: [{
    //         id: '1_in435345'
    //       }, {
    //         id: '0_90in_2'
    //       }, {
    //         id: '0_in_3222'
    //       }, {
    //         id: '0_in77_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }]
    //   },
    //   {
    //     groupId: 194,
    //     child: [{
    //       id: 2226,
    //       receptionist: '1_学习能力',
    //       entryList: [{
    //         id: '0_in'
    //       }, {
    //         id: '0_i89n_2'
    //       }, {
    //         id: '0_in_322333'
    //       }, {
    //         id: '0_in99_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '0_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2225,
    //       receptionist: '学习能力',
    //       entryList: [{
    //         id: '1_in1231313'
    //       }, {
    //         id: '0_i56n_2'
    //       }, {
    //         id: '0_in_3444'
    //       }, {
    //         id: '0_in434_4'
    //       }, {
    //         id: '5_in_8'
    //       }, {
    //         id: '0_in45_2'
    //       }, {
    //         id: '0_in_3555'
    //       }, {
    //         id: '0_in1221_4'
    //       }],
    //       exportList: [{
    //         type: 0,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_2'
    //       }]
    //     }, {
    //       id: 2221235,
    //       receptionist: '搞笑',
    //       entryList: [{
    //         id: '1_in1231231314'
    //       }, {
    //         id: '0_56'
    //       }, {
    //         id: '0_123123'
    //       }, {
    //         id: '0_45in_4'
    //       }, {
    //         id: '1_i123n'
    //       }, {
    //         id: '0_in_8'
    //       }, {
    //         id: '7_in_9'
    //       }, {
    //         id: '0_in_01'
    //       }],
    //       exportList: [{
    //         type: 3,
    //         id: '2_out'
    //       }, {
    //         type: 1,
    //         id: '0_out_212313'
    //       }]
    //     }]
    //   },
    //   {
    //     id: 2017,
    //     receptionist: '搞笑',
    //     entryList: [{
    //       id: '0_in'
    //     }, {
    //       id: '0_in_2'
    //     }, {
    //       id: '0_in456_3'
    //     }, {
    //       id: '0_in_454'
    //     }, {
    //       id: '0_in_455'
    //     }],
    //     exportList: [{
    //       type: 0,
    //       id: '0_out'
    //     }, {
    //       type: 3,
    //       id: '0_out_2rrr'
    //     }]
    //   }, {
    //     id: 2016,
    //     receptionist: '亲子',
    //     entryList: [{
    //       id: '0_in'
    //     }, {
    //       id: '0_in_2'
    //     }, {
    //       id: '0_in_3111'
    //     }, {
    //       id: '0_34in_4'
    //     }],
    //     exportList: [{
    //       type: 0,
    //       id: '0_out'
    //     }, {
    //       type: 2,
    //       id: '0_out_2'
    //     }]
    //   },
    //   {
    //     id: 1854,
    //     receptionist: '123',
    //     entryList: [{
    //       id: '0_in'
    //     }, {
    //       id: '0_in_2'
    //     }, {
    //       id: '0_in_3123'
    //     }, {
    //       id: '0_i34n_4'
    //     }],
    //     exportList: [{
    //       type: 2,
    //       id: '0_out'
    //     }, {
    //       type: 1,
    //       id: '0_out_2yyy'
    //     }]
    //   }, {
    //     id: 1853,
    //     receptionist: '121312414',
    //     entryList: [{
    //       id: '0_in'
    //     }, {
    //       id: '0_in_2'
    //     }, {
    //       id: '0_in_31'
    //     }, {
    //       id: '0_11in_4'
    //     }],
    //     exportList: [{
    //       type: 0,
    //       id: '0_out'
    //     }, {
    //       type: 1,
    //       id: '0_out_2'
    //     }]
    //   }

    // ]

    // for (let i = 0; i < 8; i++) {
    //   console.log(i)
    //   const parmas = {
    //     entryList: [{
    //       id: `${i}_in`
    //     }, {
    //       id: `${i}_in_2`
    //     }, {
    //       id: `${i}_in_3`
    //     }, {
    //       id: `${i}_in_4`
    //     }],
    //     exportList: [{
    //       type: 0,
    //       id: `${i}_out`
    //     }, {
    //       type: 1,
    //       id: `${i}_out_2`
    //     }],
    //     name: '',
    //     id: ''
    //   }
    //   this.sceneList.push({
    //     ...parmas,
    //     name: `场景${i}`,
    //     id: `container${i}`
    //   })
    // }
    // console.log('sceneList--->', this.sceneList)
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
  }

}
</script>
<style lang="stylus" scoped>
@import './jsplumbCom/style.styl'

</style>
