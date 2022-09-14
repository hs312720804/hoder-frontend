<template>
  <div>
    <!-- {{data}}
    <br/>
    tableData: {{tableData}} -->
    <div class="title">基础人群 - 动态实验报告</div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          实验分组概览
          <span>共 0 个</span>
        </div>
      </div>
      <c-table
        :props="table1.props"
        :header="table1.header"
        :data="table1.data"
      ></c-table>
    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          实验效果汇总
          <span>目的：①了解各组动态人群整体汇总情况</span>
          <span>②通过总营收、付费率、客单价等目标指标差异对比，概括性分析本次实验效果情况</span>
        </div>
      </div>
      <c-table
        :props="table2.props"
        :header="table2.header"
        :data="table2.data"
      ></c-table>
    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          每日收益趋势

        </div>
      </div>

    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          每日收益明细
          <span>共 0 个</span>
        </div>
      </div>
      <dynamic-table
        :table-data="tableData"
        :table-header="tableConfig"
      ></dynamic-table>
    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          累计收益明细
          <span>目的：针对累计数据情况，查看各组动态人群转化效果 </span>
        </div>
      </div>
      <dynamic-table
        :table-data="tableData"
        :table-header="tableConfig"
      ></dynamic-table>
    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          分组内各子人群收益明细

        </div>
      </div>

    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          分组内各流转链路收益
          <span>目的：①以各动态人群链路情况分析，了解各组动态人群链路方案情况，拆分下钻各组动态人群效果差异原因。</span>
          <span>②确定各组动态人群链路信息，寻找该人群下最优链路，以应用在该人群后续的动态流转链路中。</span>
        </div>
      </div>
      <c-table
        :props="table3.props"
        :header="table3.header"
        :data="table3.data"
      ></c-table>
    </div>

    <div class="table-wrap">
      <div class="title-layout">
        <div class="per-index-title">
          各权益收益情况
        </div>
      </div>

    </div>

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
      table2: {
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
          label: '产品页页面曝光设备量',
          prop: 'id'
        }, {
          label: '付费设备量',
          prop: 'id'
        }, {
          label: '总营收(元)',
          prop: 'id'
        }, {
          label: '总营收（按比例转化后）',
          prop: 'id'
        }, {
          label: '差异对比',
          prop: 'id'
        }, {
          label: '付费率',
          prop: 'id'
        }, {
          label: '差异对比',
          prop: 'id'
        }, {
          label: '客单价(元)',
          prop: 'id'
        }, {
          label: '差异对比',
          prop: 'id'
        }, {
          label: '上架天数',
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
      table3: {
        props: {

        },
        header: [{
          label: '路径',
          prop: 'id'
        }, {
          label: '流入设备量（命中设备量）',
          prop: 'name'
        }, {
          label: '曝光用户量',
          prop: 'way'
        }, {
          label: '下单用户量',
          prop: 'id'
        }, {
          label: '付费用户量',
          prop: 'id'
        }, {
          label: '付费总金额',
          prop: 'id'
        }, {
          label: '付费率',
          prop: 'id'
        }, {
          label: '客单价',
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
        },
        {
          id: 225,
          label: '总营收(元)',
          prop: 'price',
          children: [
          ]
        },
        {
          id: 225,
          label: '总营收(元)【按命中流量比例换算】',
          prop: 'price',
          children: [
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
  .per-index-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2d3d;
    line-height: 28px;
    margin: 0;
  }
  .table-wrap {
    padding: 10px;
    border: 1px dashed #ebe9e9;
    margin-bottom: 10px;
  }
  .title-layout {
    margin: 24px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin-left: 8px;
      font-size: 12px;
      font-weight: 400;
      color: #778ca2;
      line-height: 17px;
    }
  }
</style>
