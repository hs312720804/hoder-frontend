<template>
 <div class='' id=''>
    <div id="chart" ref="chart" style="width: 1200px; height: 500px"></div>
 </div>
</template>

<script>
 export default {
   components: {},
   data () {
     return {

     }
   },
   mounted() {
    this.aaa()
   },
   methods: {
    getLevelOption() {
      return [
        {
          itemStyle: {
            borderColor: '#777',
            borderWidth: 0,
            gapWidth: 1
          },
          upperLabel: {
            show: false
          }
        },
        {
          itemStyle: {
            borderColor: '#555',
            borderWidth: 5,
            gapWidth: 1
          },
          emphasis: {
            itemStyle: {
              borderColor: '#ddd'
            }
          }
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            borderWidth: 5,
            gapWidth: 1,
            borderColorSaturation: 0.6
          }
        }
      ];
    },
    aaa () {
      // let option = {
      //   series: [
      //     {
      //       type: 'treemap',
      //       label: {
      //         show: true,
      //         formatter: '{b}'
      //       },
      //       upperLabel: {
      //         show: true,
      //         height: 30
      //       },
      //       itemStyle: {
      //         borderColor: '#fff'
      //       },
      //       levels: this.getLevelOption(),
      //       data: [
      //         {
      //           name: 'nodeA',
      //           value: 10,
      //           children: [
      //             {
      //               name: 'nodeAa',
      //               value: 4
      //             },
      //             {
      //               name: 'nodeAb',
      //               value: 6
      //             }
      //           ]
      //         },
      //         {
      //           name: 'nodeB',
      //           value: 20,
      //           children: [
      //             {
      //               name: 'nodeBa',
      //               value: 20,
      //               children: [
      //                 {
      //                   name: 'nodeBa1',
      //                   value: 20
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // };
      let option = {
        backgroundColor: '#fff',
        //整个图片的背景色设置为白色
        title: {
          text: '次数分布',
          left: 'center',
          top: 0,
          textStyle: {
            color: 'black',
            fontFamily: '黑体',
            fontSize: 28
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (a) {
            var str = '类别:';
            return str.concat(
              a.name + '\n\n' + '次数:',
              a.value + '\n\n' + '占比:',
              ((a.value / 2010) * 100).toFixed(2) + '%'
            );
          }
        },
        series: [
          {
            type: 'treemap',
            center: ['50%', '50%'],
            label: {
              show: true,
              formatter: function (a) {
                var str = '类别:';
                return str.concat(
                  a.name + '\n\n' + '次数:',
                  a.value + '\n\n' + '占比:',
                  ((a.value / 2010) * 100).toFixed(2) + '%'
                );
              },
              //这里的重点在于设置百分比
              position: 'inside',
              color: 'black',
              fontSize: 14
            },
            color: [
              '#FFC0CB',
              '#D8BFD8',
              '#B0C4DE',
              '#87CEEB',
              '#B0E0E6',
              '#AFEEEE',
              '#98FB98'
            ],
            data: [
              {
                name: '1分钟以上',
                value: 108
              },
              {
                name: '1分钟以内',
                value: 1902,
                children: [
                  {
                    name: '10秒以内',
                    value: 499
                  },
                  {
                    name: '11秒-20秒',
                    value: 445
                  },
                  {
                    name: '21秒-30秒',
                    value: 515
                  },
                  {
                    name: '31秒-40秒',
                    value: 236
                  },
                  {
                    name: '41秒-50秒',
                    value: 189
                  },
                  {
                    name: '51秒-60秒',
                    value: 16
                  }
                ]
              }
            ]
          }
        ]
      };
      let echarts = require('echarts')
      let myChart = echarts.init(this.$refs['chart'])

      myChart.setOption(option)
    }
   }
 }
</script>

<style lang='stylus' scoped>

 
</style>
