<template>
  <div>
    <!-- {{data}}
    <br/>
    tableData: {{tableData}} -->
    <div class="title">基础人群 - 动态实验报告</div>
    <div class="table-wrap">
      <div class="titleLayout">
        <div class="per-index-title">实验分组概览</div>

      </div>
      <c-table
        :props="table1.props"
        :header="table1.header"
        :data="table1.data"
      ></c-table>
    </div>
    <dynamic-table
      :table-data="tableData"
      :table-header="tableConfig"
    ></dynamic-table>
  </div>
</template>

<script>
import DynamicTable from './dynamicTable/Index.vue'

export default {
  components: {
    DynamicTable
  },
  created () {
    this.initData()
  },
  data () {
    return {
      table1: {
        props: {

        },
        header: [{
          label: '流转ID',
          prop: 'id'
        }, {
          label: '流转分组名',
          prop: 'name'
        }, {
          label: '流转方式',
          prop: 'way'
        }, {
          label: '命中流量占比',
          prop: 'id'
        }, {
          label: '命中设备量',
          prop: 'id'
        }, {
          label: '包含人群-ID',
          prop: 'id'
        }],
        data: [{
          id: 1,
          name: '实验组1',
          way: '顺序'
        }, {
          id: 1,
          name: '实验组1',
          way: '顺序'
        }]
      },
      tableConfig: [],
      // 表数据
      tableData: [],
      // 模拟接口数据
      data: [
        {
          date: '2021-09-06',
          dongA: {
            name: '动态人群A',
            show: 1, // 产品包曝光率 - 动态人群_A
            payRate: 2, // 支付率 - 动态人群_A
            price: 3 // 客单价 - 动态人群_A
          },
          dongB: {
            name: '动态人群B',
            show: 10, // 产品包曝光率 - 动态人群_B
            payRate: 11, // 支付率 - 动态人群_B
            price: 12 // 客单价 - 动态人群_B
          },
          dongC: {
            name: '动态人群C',
            show: 100, // 产品包曝光率 - 动态人群_C
            payRate: 101, // 支付率 - 动态人群_C
            price: 102 // 客单价 - 动态人群_C
          },
          dongD: {
            name: '动态人群D',
            show: 500, // 产品包曝光率 - 动态人群_C
            payRate: 501, // 支付率 - 动态人群_C
            price: 502 // 客单价 - 动态人群_C
          }
        },
        {
          date: '2021-09-07',
          dongA: {
            name: '动态人群A',
            show: 2, // 产品包曝光率 - 动态人群_A
            payRate: 2, // 支付率 - 动态人群_A
            price: 2 // 客单价 - 动态人群_A
          },
          dongB: {
            name: '动态人群B',
            show: 20, // 产品包曝光率 - 动态人群_B
            payRate: 21, // 支付率 - 动态人群_B
            price: 22 // 客单价 - 动态人群_B
          },
          dongC: {
            name: '动态人群C',
            show: 200, // 产品包曝光率 - 动态人群_C
            payRate: 201, // 支付率 - 动态人群_C
            price: 202 // 客单价 - 动态人群_C
          }
        }
      ]
    }
  },
  methods: {
    initData () {
      // 表头数据
      this.tableConfig = [
        {
          id: 100,
          label: '日期',
          prop: 'date'
        },
        {
          id: 210,
          label: '产品包曝光量',
          prop: 'show',
          children: [

          ]
        },
        {
          id: 220,
          label: '支付率',
          prop: 'payRate',
          children: [

          ]
        },
        {
          id: 225,
          label: '客单价',
          prop: 'price',
          children: [
          // {
          //     id:303,
          //     label:"动态人群_A",
          //     prop:"priceDongA"
          // },
          // {
          //     id:304,
          //     label:"动态人群_B",
          //     prop:"priceDongB"
          // },
          // {
          //     id:305,
          //     label:"动态人群_C",
          //     prop:"priceDongC"
          // },
          ]
        }
      ]
      // 表头配置项
      this.tableData = this.data.map((item, index) => {
      // const keys = Object.keys(item)
        const reObj = {
          date: item.date
        }
        for (const itemKey in item) { // itemKey: dongA、dongB、dongC
          const crowdObj = item[itemKey]
          if (typeof crowdObj === 'object') { // 动态人群
            for (const itemKey2 in crowdObj) { // itemKey2: name、 show、payRate、price
              reObj[`${itemKey}${itemKey2}`] = crowdObj[itemKey2]

              if (index === 0) { // 通过第一条数据，构建header
                this.tableConfig = this.tableConfig.map(header => {
                  if (header.prop === itemKey2) {
                    header.children.push({
                      label: crowdObj.name,
                      prop: `${itemKey}${itemKey2}`
                    })
                  }
                  return header
                })
              }
            }
          }
        }
        return reObj
      })
      console.log('reObj====', this.tableData)
      console.log('tableConfig====', this.tableConfig)
    }
  }
}
</script>

<style scoped lang="stylus">
  .title{
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    color: #1f2d3d;
    margin-bottom: 16px;
    text-align: center;
  }
  .table-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2d3d;
    line-height: 28px;
    margin: 0;
    margin: 24px 0 16px;
  }
</style>
