
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { dataSourceColorEnum } from '@/utils/tags.js'
export default {
  name: 'bavList',
  provide () {
    return {
      _this: this
    }
  },
  watch: {
    'childItem.bav': {
      handler (val) {
        const weekRang = val.weekRang.value
        const timeRange = val.timeRange.value
        // 当选择了星期范围或者时间区间时，禁用【天数】选项
        if (weekRang.length === 0 && timeRange.length === 0) {
          this.isDisableDaySelect = false
        } else {
          this.isDisableDaySelect = true
        }
      },
      deep: true,
      immediate: true
    },
    childItem: {
      handler (val) {
        // console.log('childItem=====>>>', val)
        // 编辑回显
        if (val && val.tagCode === 'BAV0004') { // 【模块活跃】需要查询版面、板块ID
          this.getModuleId(val.bav.behaviorValue)
        } else if (val && val.tagCode === 'BAV0008') { // 【起播行为】标签需要查询影片集数
          this.getQiboTvEpisodes(val.bav.behaviorValue)
        } else if (val && val.tagCode === 'BAV0012') { // 【综合起播】标签需要查询影片集数
          this.getZongheVideoEpisodes(val.bav.showBehaviorValue)
        }
      },
      // deep: true,
      immediate: true
    }
    // 'childItem.bav.showBehaviorValue': {
    //   handler (val) {
    // if (this.childItem.tagCode === 'BAV0012') { // 【综合起播】数据需要重组
    //   console.log('123141==>', this.childItem.bav.behaviorValue)
    //   alert(23)
    //   let ccc = []
    //   const showBehaviorValue = this.childItem.bav.showBehaviorValue
    //   showBehaviorValue.forEach(item => {
    //     const itemCopy = JSON.parse(JSON.stringify(item))
    //     const aaa = itemCopy.child
    //     const bbb = JSON.parse(JSON.stringify(this.childItem.bav.countValue))
    //     bbb.child = aaa
    //     // itemCopy.child[0] = bbb
    //     itemCopy.child = [bbb]
    //     ccc.push(itemCopy)
    //   })
    //   this.childItem.bav.behaviorValue = ccc
    //   console.log('123141==>', this.childItem.bav.behaviorValue)
    // }
    //   },
    //   deep: true
    // }
  },
  data () {
    return {
      isDisableDaySelect: false,
      bavFormRules: {
        'bav.value': [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      value1: [],
      checkedVal: [],
      periodRangeVal: '',
      defaultChildObj: {
        name: '',
        value: '',
        field: '',
        operator: '=',
        type: 'string',
        perCountValue: {
          name: '',
          field: 'mac',
          type: 'count',
          operator: '=',
          value: ''
        },
        child: [
          {
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string',
            multipleSelect: false
          }
        ],
        multipleSelect: false
      },
      // dataSourceColorEnum: {
      //   1: 'success',
      //   2: 'danger',
      //   3: '',
      //   5: 'warning',
      //   6: 'warningOrange',
      //   7: 'warningOrange2',
      //   8: 'warningCyan'
      // },
      moDefaultChild: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
      // BAV0006DefaultChild: [{
      //   name: '',
      //   value: '',
      //   field: '',
      //   operator: '=',
      //   type: 'string',
      //   child: [{
      //     name: '',
      //     value: '',
      //     field: 'mac',
      //     operator: '=',
      //     type: 'count'
      //   }]
      // }],
      moOptions: {},
      gouMaiPackageIdOptions: [],
      loading: false,
      qiBoOptions: [],
      loading2: false,
      qiBoCollectionOptions: [],
      qiboQuery: '',
      qiboSource: '',
      qiboParams: {
        source: '',
        keywords: '',
        page: 1,
        pageSize: 200
      },
      followOptions: [],
      topicOptions: [],
      videoOptions: [],
      appointmentInfo: [],
      musicList: [], // K歌
      singerList: [], // K歌
      albumOptions1: [], // 音乐 搜歌曲
      albumOptions2: [], // 音乐 搜歌手
      albumOptions4: [] // 音乐 搜专辑
    }
  },
  computed: {
    dataSourceColorEnum () {
      return dataSourceColorEnum
    }
  },
  created () {},
  methods: {
    handleOperatorChange (item) {
      item.value = ''
      item.value1 = ''
      item.value2 = ''
    },
    // 判断是否选了集数
    isCheckEpisodes (item) {
      let flag = false
      const videoId = item.childCheckedVal[1]
      const arr = item.child || []
      const videoObj = arr.find(obj => obj.value === videoId)
      if (videoObj && videoObj.childCheckedVal.length > 0) { // 选了集数
        flag = true
      }

      return flag

      // return item.childCheckedVal[1] && item.child[1] && item.child[1].childCheckedVal && item.child[1].childCheckedVal.length > 0
    },
    getMatchName (val, list) {
      return list.find(item => item.value === val).name
    },

    handelInputBlur (item) {
      this.isFoucs = false

      if (!this.isFoucs && item.value1 && item.value2 && item.value2 < item.value1) { // 自定义时间仅支持正数，过期时间的大数在前面，小数在后面
        const num = item.value1
        item.value1 = item.value2
        item.value2 = num
      }
    },
    handelInputBetween (val, item, key) {
      console.log('val===', val)
      console.log('item===', item)
      console.log('key===', key)

      this.$set(item, key, val)
      item[key] = val
      if (!item.value1 || item.value1 < 0) {
        this.$set(item, 'value1', 0)
      }
      if (!item.value2 || item.value2 < 0) {
        this.$set(item, 'value2', 0)
      }

      item.value = `${item.value1}-${item.value2}`
    },

    // 反选
    ReverseSelect (val, behaviorValue, seclectVal = 'default', { clearVal, bavChildItem } = {}) {
      // seclectVal 当是【综合起播】时，需要根据选中的值特殊处理
      console.log('val===>', val)
      console.log('a===>', behaviorValue)
      this.childItem.bav.reverseSelect = val

      if (
        this.childItem.tagCode === 'BAV0002' ||
        this.childItem.tagCode === 'BAV0003' ||
        this.childItem.tagCode === 'BAV0008' ||
        this.childItem.tagCode === 'BAV0006' ||
        this.childItem.tagCode === 'BAV0005'
      ) {
        // 遍历整个标签的结构， 拿到每一层最后一项
        let isCurrentNodeId = false
        let list
        if (this.childItem.tagCode === 'BAV0008') {
          list = behaviorValue
          isCurrentNodeId = true
        } else {
          list = this.getNodesLastItem(this.childItem.bav.behaviorValue)
        }
        // 递归获取父级有值的对象
        this.iteratorNodes({
          nodes: this.childItem.bav.behaviorValue,
          currentNodes: list,
          val,
          seclectVal,
          clearVal,
          isCurrentNodeId
        })
      } else if (
        this.childItem.tagCode === 'BAV0016' ||
        this.childItem.tagCode === 'BAV0012' ||
        this.childItem.tagCode === 'BAV0011'
      ) {
        if (val) {
          this.childItem.bav.showBehaviorValue.forEach(showBehaviorValue => {
            // const showBehaviorValue = this.childItem.bav.showBehaviorValue[0]

            if (showBehaviorValue.child && showBehaviorValue.child.length > 0) {
            // 一维数组循环找到存在值得项
              const firstChild = showBehaviorValue.child
              for (let i = firstChild.length; i--; i > 0) {
                const curChild = firstChild[i]
                // 没有子集且存在值
                if (curChild.value && (curChild.child && curChild.child.length <= 0)) {
                  curChild.operator = '!='
                  break
                } else if (curChild.value && (curChild.child && curChild.child.length > 0)) { // 存在子集
                  const list = [this.getNodesLastItem([curChild]).pop()] // 【起播活跃】【综合起播】比较特殊，只取最后一个对象反选
                  // 递归去设置
                  this.iteratorNodes({
                    nodes: this.childItem.bav.showBehaviorValue,
                    currentNodes: list,
                    val,
                    seclectVal,
                    clearVal,
                    isCurrentNodeId: false
                  })
                  break
                }
              }
            } else {
              showBehaviorValue.operator = '!='
            }
          })
          // 针对【综合起播】 进行处理, 默认选择次数
          // if (val && seclectVal !== '' && item.value !== '' && (seclectVal === 'default' || seclectVal === item.value)) {
          //   this.childItem.bav.countValue = {
          //     name: '',
          //     field: 'mac',
          //     type: 'count',
          //     operator: '=',
          //     value: ''
          //   }
          // }
        } else {
          this.setRecoveryItem(this.childItem.bav.showBehaviorValue)
        }
      } else {
        // 【模块活跃 - BAV0004】
        behaviorValue.forEach((item) => {
          item.operator = val ? '!=' : '='
          if (clearVal && clearVal === item.value) { // 需要清空的 value 值
            item.value = ''
            const index = bavChildItem.childCheckedVal.findIndex(val => clearVal === val)
            bavChildItem.childCheckedVal[index] = null
          }
        })
      }
      console.log('整个数据', this.childItem.bav)
      console.log('反选后的结果behaviorValue =>', this.childItem.bav.behaviorValue)
      console.log('反选后的结果showBehaviorValue =>', this.childItem.bav.showBehaviorValue)
    },

    // 遍历整个标签的结构， 拿到每一层最后一项
    getNodesLastItem (nodes, list = []) {
      nodes.forEach(item => {
        if (item.child && item.child.length > 0) {
          this.getNodesLastItem(item.child, list)
        } else {
          list.push(item)
        }
      })
      return list
    },

    // 循环递归查找最近有数据的项
    iteratorNodes ({ nodes, currentNodes, val, seclectVal, clearVal, isCurrentNodeId } = params) {
      currentNodes.forEach(nodeItem => {
        // 递归去查找父级是否存在值
        const operator = val ? '!=' : '='
        const currentId = !isCurrentNodeId && nodeItem.child && nodeItem.child.length > 0 ? nodeItem.parentId : nodeItem.id
        this.getParentVal(nodes, currentId, operator)

        if (clearVal && clearVal === nodeItem.value) { // 需要清空的 value 值
          nodeItem.value = ''
          const index = bavChildItem.childCheckedVal.findIndex(val => clearVal === val)
          bavChildItem.childCheckedVal[index] = null
        }
      })
    },

    // 获取指定id值
    getParentVal (nodes, id, operator) {
      const nodeTree = this.childItem.tagCode === 'BAV0016' || this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011' ? this.childItem.bav.showBehaviorValue : this.childItem.bav.behaviorValue
      if (!nodes || !id) {
        return
      }

      // 指标属性（次数、天数、起播时长、个数）不作为反选，【购买行为】的价格区间，产品包id不作为反选
      const countArray = ['mac', 'dt', 'day_play_time', 'play_nums', 'day_movie_play_time', 'product_price', 'product_id']
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]
        console.log(item.id === id)
        console.log('item===', item)
        if (item.id === id) {
          if (item.value && item.field && !countArray.includes(item.field)) { // 不是指标的属性
            // 起播行为第三级特殊处理
            if (this.childItem.tagCode === 'BAV0008' && item.field === 'tag') {
              item.operator = operator === '=' ? 'like' : 'not like'
            } else {
              item.operator = operator
            }
          } else {
            this.getParentVal(nodeTree, item.parentId, operator)
          }
        } else {
          if (item.child && item.child.length > 0) {
            this.getParentVal(item.child, id, operator)
          }
        }
      }
    },

    // 起播行为影片搜索更多
    handelQiboLoadmore () {
      this.qiboParams.page++ // 滚动加载翻页
      this.qiBoRemoteMethod(this.qiboQuery, this.qiboSource)
    },

    // 模块活跃编辑，获取版面/板块ID
    getModuleId (bavVal) {
      bavVal && bavVal.forEach(obj => {
        if (obj.value !== '' && (obj.field === 'album_id' || obj.field === 'forum_id')) {
          this.remoteMethod(obj.value, obj.field, this.childItem.bav.value)
        } else {
          this.getModuleId(obj.child) // 递归
        }
      })
    },

    // 起播行为编辑，获取影片集数、预约时间 回显
    getQiboTvEpisodes (bavVal) {
      bavVal.forEach(obj => {
        if (obj.videoType && obj.videoType !== '电影' && obj.source && obj.value) {
          this.getTvEpisodes(obj.source, obj.value) // 获取影片集数
          this.getAppointmentInfo(obj.source, obj.value) // 获取影片预约时间
        } else if (obj.child) {
          this.getQiboTvEpisodes(obj.child) // 递归
        }
      })
    },

    // 综合起播编辑，获取影片集数 回显
    getZongheVideoEpisodes (bavVal) {
      bavVal.forEach(obj => {
        // if (obj.childCheckedVal && obj.childCheckedVal[1] && obj.child && obj.child[1] && obj.child[1].child.length > 0) { // 有选择集数
        const businessType = bavVal[0].value

        if (obj.childCheckedVal) { // 有选择影片
          const tvId = businessType === '影视' ? obj.childCheckedVal[4] : obj.childCheckedVal[1]

          const videoObj = obj.child.find(item => item.value === tvId)
          if (videoObj) {
            this.getVideoEpisode({ tvId, businessType, source: videoObj.source })
            // this.getVideoEpisode({ tvId: obj.childCheckedVal[1], businessType: bavVal[0].value, source: videoObj.source })
          }
        }
      })
    },

    GetVideo (keywords, businessType = '', source = '') {
      const params = {
        keywords,
        businessType,
        page: 1,
        pageSize: 200,
        source
      }

      if (businessType.indexOf('影视') > -1) {
        if (source) {
          params.source = source
        } else {
          return this.$message.error('请先选择内容源')
        }
      }
      if (keywords !== '') {
        this.loading2 = true

        this.$service.getVideo(params).then(res => {
          this.loading2 = false
          let list = res.rows || []

          list = list.map(obj => {
            if (businessType.indexOf('视频') > -1) {
              return {
                name: `${obj.title}(${obj.coocaaBVId})`,
                value: obj.coocaaBVId,
                field: obj.tableField,
                type: 'string',
                source: obj.source || ''
              }
            } else {
              return {
                name: `${obj.title}(${obj.coocaaVId})`,
                value: obj.coocaaVId,
                field: obj.tableField,
                type: 'string',
                source: obj.source || ''
              }
            }
          })
          this.videoOptions = list
          console.log('this.followOptions===>', this.videoOptions)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this.videoOptions = []
      }
    },
    // 搜索音乐
    GetMusic (keywords, categoryId = '') {
      // categoryId : 1  歌曲  2 歌手 4 专辑
      const params = {
        keywords,
        page: 1,
        pageSize: 200,
        categoryId
      }

      if (keywords !== '') {
        this.loading2 = true

        this.$service.getMusicInfo(params).then(res => {
          this.loading2 = false
          let list = res.rows || []

          list = list.map(obj => {
            return {
              name: categoryId === 2 ? `${obj.name}` : `${obj.name}(${obj.id})`,
              value: obj.id,
              field: obj.tableField,
              type: 'string'
            }
          })
          this[`albumOptions${categoryId}`] = list
          // console.log('this.followOptions===>', this.albumOptions)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this[`albumOptions${categoryId}`] = []
      }
    },

    // 搜歌手
    getMusicByAuthor (query) {
      if (query !== '') {
        this.loading2 = true

        const params = {
          keywords: query,
          page: 1,
          pageSize: 200
        }

        this.$service.getMusicByAuthor(params).then(res => {
          this.loading2 = false
          let list = res.rows || []
          list = list.map(obj => {
            return {
              name: obj.name,
              value: obj.name,
              field: obj.tableField,
              type: 'string'
            }
          })
          this.singerList = list
          console.log('this.singerList===>', this.singerList)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this.singerList = []
      }
    },

    // 搜歌曲
    getMusicByName (query) {
      if (query !== '') {
        this.loading2 = true

        const params = {
          keywords: query,
          page: 1,
          pageSize: 200
        }

        this.$service.getMusicByName(params).then(res => {
          this.loading2 = false
          let list = res.rows || []

          list = list.map(obj => {
            return {
              name: `${obj.title}（${obj.singerName}）`,
              value: obj.id,
              field: obj.tableField,
              type: 'string'
            }
          })
          this.musicList = list
          console.log('this.musicList===>', this.musicList)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this.musicList = []
      }
    },

    // 【起播活跃】 短视频 - 订阅 - 搜专题
    GetTopic (query) {
      if (query !== '') {
        const params = {
          keywords: query,
          page: 1,
          pageSize: 200
        }

        this.$service.getTopic(params).then(res => {
          let list = res.rows || []

          list = list.map(obj => {
            return {
              name: obj.title,
              value: obj.coocaaVId,
              field: obj.tableField,
              type: 'string'
            }
          })

          this.topicOptions = list
        })
      } else {
        this.topicOptions = []
      }
    },

    GetShortVideoAuthor (query) {
      if (query !== '') {
        this.loading2 = true

        const params = {
          keywords: query,
          page: 1,
          pageSize: 200,
          tagCode: this.childItem.tagCode
        }

        this.$service.getShortVideoAuthor(params).then(res => {
          this.loading2 = false
          let list = res.rows || []

          list = list.map(obj => {
            return {
              name: obj.userName + '(' + obj.mcn + ')',
              value: obj.authorId,
              field: obj.tableField,
              type: 'string',
              mcn: obj.mcn
            }
          })
          this.followOptions = list
          console.log('this.followOptions===>', this.followOptions)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this.followOptions = []
      }
    },

    qiBoRemoteMethod (query, source) {
      // 重新查询，不是滚动加载
      if (this.qiboQuery !== query) {
        this.qiBoOptions = []
        this.qiboParams.page = 1 // 页码归1 s
      }

      if (source === '') return this.$message.error('请先选择内容源')
      if (query !== '') {
        this.loading2 = true

        this.qiboParams.source = source
        this.qiboParams.keywords = query

        this.$service.tvContentMatch(this.qiboParams).then(res => {
          this.loading2 = false
          this.qiboQuery = query // 记录查询关键字，滚动加载时要用到
          this.qiboSource = source
          let list = res.rows

          list = list.map(obj => {
            return {
              name: obj.title,
              value: obj.coocaaVId,
              field: obj.tableField,
              type: 'string',
              videoType: obj.videoType,
              source: obj.source
            }
          })
          this.qiBoOptions.push(...list)
        }).catch(() => {
          this.loading2 = false
        })
      } else {
        this.qiBoOptions = []
      }
    },

    GouMaiRemoteMethod (query, businessType) {
      if (query !== '') {
        const params = {
          keywords: query,
          page: 1,
          pageSize: 200,
          businessType
        }
        this.$service.getMenberIds(params).then(res => {
          this.gouMaiPackageIdOptions = res.data || []
        })
      } else {
        this.gouMaiPackageIdOptions = []
      }
    },

    remoteMethod (query, field, businessType) {
      if (query !== '') {
        this.loading = true
        const params = {
          type: field === 'forum_id' ? 'forum' : 'album', // 'album_id', 'forum_id'
          keywords: query,
          page: 1,
          pageSize: 200,
          businessType
        }
        this.$service.moduleMatch(params).then(res => {
          this.loading = false
          this.$set(this.moOptions, field, res.data)
        })
      } else {
        this.moOptions[field] = []
        this.$set(this.moOptions, field, [])
      }
    },

    getDefaultChildObj () {
      return JSON.parse(JSON.stringify(this.defaultChildObj))
    },

    /**
       * 行为标签下拉框切换绑定事件
       * @param {Object} childItem 当前选项的 obj
       * @param {Boolean} hasChild = false  是否有 child (如果下一级是下拉框，则应选为false)
       * @param {Number} level = 1 第几级（为获取下拉框 list ）
       * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
       * @param {String} selectPropKeyValue = 'value' 下拉框的 value 和 key 字段的 key 值
       * @param {Boolean} isValueClear = 'false' 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
       */
    handelBehavirSelectChange (params = {}) {
      // 改变数据时将所有的checkbox归位false
      this.$set(this.childItem.bav, 'reverseSelect', false)
      const { hasChild = false, level = 1, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, reverseSelectAttr } = params
      const childItem = this.childItem

      const vals = (typeof (childItem.bav.value) === 'string' ? childItem.bav.value.split(',') : childItem.bav.value)
      const behaviorAttrList = this.getBehaviorAttrList(level)

      if (childItem.tagCode === 'BAV0016' || childItem.tagCode === 'BAV0012' || childItem.tagCode === 'BAV0011') { // 【综合起播】 【起播活跃】 的数据放在 showBehaviorValue 字段中， 需要特殊处理
        this.videoOptions = [] // 【综合起播】 切换了业务类型 影片列表需要清除掉
        this.childItem.bav.countValue = { // 针对【综合起播】 进行处理
          name: '',
          field: 'mac',
          type: 'count',
          operator: '=',
          value: ''
        }
        const behaviorValue = this.setRecoveryItem(childItem.bav.showBehaviorValue)

        childItem.bav.showBehaviorValue = this.getValListByVals({ // 组装数据
          vals,
          behaviorValue,
          attrList: behaviorAttrList,
          hasChild,
          defaultChild,
          selectPropKeyValue,
          isValueClear,
          reverseSelectAttr
        })
      } else {
        const behaviorValue = this.setRecoveryItem(childItem.bav.behaviorValue)

        childItem.bav.behaviorValue = this.getValListByVals({ // 组装数据
          vals,
          behaviorValue,
          attrList: behaviorAttrList,
          hasChild,
          defaultChild,
          selectPropKeyValue,
          isValueClear,
          reverseSelectAttr
        })
      }
    },

    /**
       * 行为标签下拉框切换绑定事件
       * @param {Object} childItem 当前选项的obj
       * @param {Boolean} hasChild = false  是否有 child (如果下一级是下拉框，则应选为false)
       * @param {Number} level = 2 第几级（为获取下拉框 list ）
       * @param {Object} extra 附加信息（根据选项判断，为获取不同下拉框list）
       * @param {String} selectPropKeyValue = 'value' 下拉框的 value 和 key 字段的 key 值
       * @param {Boolean} isValueClear = 'false' 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
       * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
       */
    handelChildBehavirSelectChange (params = {}) {
      // 改变数据时将所有的checkbox归位false
      this.$set(this.childItem.bav, 'reverseSelect', false)
      if (this.childItem.tagCode === 'BAV0016' || this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011') {
        this.childItem.bav.showBehaviorValue = this.setRecoveryItem(this.childItem.bav.showBehaviorValue)
      } else if (
        this.childItem.tagCode === 'BAV0002' ||
          this.childItem.tagCode === 'BAV0003' ||
          this.childItem.tagCode === 'BAV0008'
      ) {
        this.childItem.bav.behaviorValue = this.setRecoveryItem(this.childItem.bav.behaviorValue)
      }

      // 每次切换重置数据
      const { childItem, hasChild = false, level = 2, extra = {}, selectPropKeyValue = 'value', isValueClear = false, defaultChild, reverseSelectAttr } = params
      const vals = typeof (childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const behaviorValue = childItem.child || []
      // const behaviorAttrList = this.getChildBehaviorAttrList()

      if (this.childItem.tagCode === 'BAV0012' && level === 3) { // 【综合起播】 选择了影视后需要搜集数
        console.log('childItem==', childItem)
        this.qiBoCollectionOptions = []
        this.childItem.bav.countValue = { // 针对【综合起播】 进行处理, 切换影视时，默认选择次数
          name: '',
          field: 'mac',
          type: 'count',
          operator: '=',
          value: '',
          multipleSelect: false
        }

        const businessType = this.childItem.bav.value
        const tvId = businessType === '影视' ? childItem.childCheckedVal[4] : childItem.childCheckedVal[1]
        this.getVideoEpisode({ tvId, businessType })
      }
      if (this.childItem.tagCode === 'BAV0012' && level === 4) {
        this.childItem.bav.countValue = { // 针对【综合起播】 进行处理, 切换集数时，默认选择空
          name: '',
          field: '',
          type: '',
          operator: '=',
          value: ''
        }
      }

      if (extra.type === '视频源') { // 【起播活跃】 切换视频源时，清空影视列表
        this.qiBoOptions = []
      }
      const behaviorAttrList = this.getBehaviorAttrList(level, extra)
      childItem.child = this.getValListByVals({ // 组装数据
        vals,
        behaviorValue,
        attrList: behaviorAttrList,
        hasChild,
        defaultChild,
        selectPropKeyValue,
        isValueClear,
        level,
        reverseSelectAttr,
        parentId: childItem.id,
        extra
      })
    },

    /**
       * 每次切换选择的时候归位当前item
       */
    setRecoveryItem (nodes) {
      nodes.forEach(item => {
        // 起播行为第三层级特殊处理
        if (this.childItem.tagCode === 'BAV0008' && item.field === 'tag') {
          item.operator = 'like'
        } else {
          // item.operator = '='
          item.operator = item.operator === '!=' ? '=' : item.operator
        }
        if (item.child && item.child.length > 0) {
          this.setRecoveryItem(item.child)
        } else {
          // item.operator = '='
          item.operator = item.operator === '!=' ? '=' : item.operator
        }
      })
      return nodes
    },

    /**
       * 组装数据格式
       * @param {Array} vals 选中值的集合
       * @param {Array} behaviorValue 完整的组装好的集合
       * @param {Array} attrList 下拉框列表
       * @param {Boolean} hasChild = false  是否有 child (如果下一级是下拉框，则应选为false)
       * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
       * @param {String} selectPropKeyValue = 'value' 下拉框的 value和key 字段的 key值
       * @param {Boolean} isValueClear = false 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
       * @param {Number} level 第几级（为获取下拉框list）
       */
    getValListByVals (params) {
      const { vals, behaviorValue, attrList, hasChild = false, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, level = 1, reverseSelectAttr, parentId, extra = {} } = params
      console.log('params==>', params)
      let list = []

      if (this.childItem.tagCode === 'BAV0002' && level === 3 && vals.length === 0) {
        // if (level === 3) {  // 【应用活跃】, 第三级清空时，【次数/天数】选项依然存在
        if (extra.levelOneValue === '安装') { // 第一级的选项值, 添加【应用版本号】输入框
          list = [{
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string',
            child: [{
              name: '',
              value: '',
              field: 'app_version',
              operator: '=',
              type: 'string',
              child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
              multipleSelect: false
            }],
            multipleSelect: false
          }]
        } else {
          list = [{
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string',
            child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
            multipleSelect: false
          }]
        }
      }

      const reverseSelect = reverseSelectAttr ? this.childItem.bav.reverseSelect : false // 反选

      vals.forEach(val => {
        if (!val) return
        let obj = {}
        let lastNumberObj = {}
        if (this.childItem.tagCode === 'BAV0013' || this.childItem.tagCode === 'BAV0014') {
          // 【续费包签约状态 - BAV0013】、【连续包签约-续费-解约次数 - BAV0014】 最后一级不给默认 value
          lastNumberObj = [
            {
              name: '',
              value: '',
              field: '',
              operator: '=',
              type: '',
              multipleSelect: false
            }
          ]
        } else {
          lastNumberObj = [
            {
              name: '',
              value: '',
              field: 'mac',
              operator: '=',
              type: 'count',
              multipleSelect: false
            }
          ]
        }
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        const matchObj = behaviorValue.find(item => item[selectPropKeyValue] === val || item.value === val || item.name === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val || item.value === val || item.name === val)
        obj = matchObj || matchObj2
        if (!obj) return

        // 清空对象中的 value（【模块活跃 004】特殊 value 不等于下拉选项的 value，而是后面查询出来的结果）
        if (isValueClear) obj.value = ''

        if (reverseSelect) { // 反选
          if (this.childItem.tagCode === 'BAV0012') {
            if ((level === 7 && vals[5] === obj.value) || (level === 3 && vals[1] === obj.value) || (level === 3 && vals[4] === obj.value)) { // 切换歌曲 或者 切换影片
              obj.operator = '!='
            } else {
              obj.operator = '='
            }
          } else { // 其他属性切换正常操作
            obj.operator = '!='
          }
        }

        // 模块活跃，默认 child 值特殊处理
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))

        /* ------------------------------------------------------------ */
        if (this.childItem.tagCode === 'BAV0002') { // 【应用活跃】, 切换数据时，下一级清空，下下级保持存在
          if (extra.levelOneValue === '安装') { // 仅当选择【安装应用】后可输入应用版本号，为可选项
            switch (level) {
              case 2:
                defaultchild = [{
                  name: '',
                  value: '',
                  field: '',
                  operator: '=',
                  type: 'string',
                  child: [{
                    name: '',
                    value: '',
                    field: 'app_version',
                    operator: '=',
                    type: 'string',
                    child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }]
                  }],
                  multipleSelect: false
                }]
                break
              case 3:
                defaultchild = [{
                  name: '',
                  value: '',
                  field: 'app_version',
                  operator: '=',
                  type: 'string',
                  child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
                  multipleSelect: false
                }]
                break
            }
          } else {
            switch (level) {
              case 2:
                defaultchild = [{
                  name: '',
                  value: '',
                  field: '',
                  operator: '=',
                  type: 'string',
                  child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
                  multipleSelect: false
                }]
                break
              case 3:
                defaultchild = [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }]
                break
            }
          }
        }

        if (this.childItem.tagCode === 'BAV0006' && this.childItem.bav.value === '电竞') { // 只有电竞业务需要添加 【权益包】、【内容分类】下拉框
          switch (level) {
            case 2:
              defaultchild = [{
                name: '',
                value: '',
                field: '',
                operator: '=',
                type: 'string',
                child: [{
                  name: '',
                  value: '',
                  field: '',
                  operator: '=',
                  type: 'string',
                  child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }]
                }],
                multipleSelect: false
              }]
              break
            case 3:
              defaultchild = [{
                name: '',
                value: '',
                field: '',
                operator: '=',
                type: 'string',
                child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
                multipleSelect: false
              }]
              break
          }
        }

        if (this.childItem.tagCode === 'BAV0003' && level === 5) { // 【购买行为】
          defaultchild = [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }]
        }

        if (selectPropKeyValue === 'selectKey' && obj[selectPropKeyValue] === 'album_id1') { // BAV0004 【模块活跃】 选择推荐位 下一级是序号+【次数/天数】
          defaultchild = [{
            name: '1',
            value: '0',
            field: 'block_pid',
            operator: '=',
            type: 'string',
            child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }],
            multipleSelect: false
          }]

          obj.childCheckedVal = '0' // 序号默认值为 0
        }

        if (this.childItem.tagCode === 'BAV0009' && level === 2) { // 【应用状态】 选择了第 2 级的时候添加属性: "multipleSelect":"true"
          obj.multipleSelect = true
        } else if (this.childItem.tagCode === 'BAV0010' && level === 1) { // 【用户活跃】 选择了第 1 级的时候添加属性: "multipleSelect":"true"
          obj.multipleSelect = true
        }

        /* ------------------------------------------------------------ */
        obj.child = obj.child || (hasChild ? lastNumberObj : defaultchild) // 根据是否最后一级，添加不同的 child

        obj.childCheckedVal = obj.childCheckedVal || (typeof (obj.childCheckedVal) === 'string' ? '' : [])

        if (!obj.child && defaultchild.length > 0) {
          obj.childCheckedVal = typeof (obj.childCheckedVal) === 'string' ? defaultchild.map(item => item.value).join(',') : defaultchild.map(item => item.value)
        }

        if (this.childItem.tagCode === 'BAV0002' && level === 2) { // 应用活跃
          obj.childCheckedVal = []
        }

        const obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })

      // 动态设置子集的id与parentId
      list = this.setChildId(list, parentId)

      // console.log('list===>', list)
      // console.log('nodes===>', this.childItem.bav)
      return list
    },

    /**
       * 动态设置子集的id与parentId
       */
    setChildId (list, parentId) {
      list.forEach(item => {
        item.id = uuidv4()
        item.parentId = parentId
        if (item.child && item.child.length > 0) {
          this.setChildId(item.child, item.id)
        }
      })
      return list
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, behaviorValue -- 已经组装好的集合, attrList -- 下拉框列表
    /**
       * 组装数据格式
       * @param {Array} vals 选中值的集合
       * @param {Array} behaviorValue 已经组装好的集合
       * @param {Array} attrList 下拉框列表
       * @param {Boolean} hasChild = false 是否有 child (如果下一级是下拉框，则应选为false)
       * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
       * @param {String} selectPropKeyValue = 'value' 下拉框的 value和key 字段的 key值
       * @param {Boolean} isValueClear = false 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
       * @param {Number} level 第几级（为获取下拉框list）
       */
    getQiBoValListByVals (params = {}) {
      let { vals, behaviorValue, attrList, hasChild = false, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, level, reverseSelectAttr, parentId } = params
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      let list = []
      const reverseSelect = reverseSelectAttr ? this.childItem.bav.reverseSelect : false

      if (vals.length === 0 && level === 6) { // 清空集数
        const obj = behaviorValue[0] // 不改变子级的数据
        obj.name = ''
        obj.value = ''
        obj.field = ''
        list.push(obj)
      }
      if (level === 4) { // 当切换视频源时，后面的数据清空
        defaultChild = [{
          name: '',
          value: '',
          field: '',
          operator: '=',
          type: 'string',
          child: [{
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string',
            child: [],
            childCheckedVal: [],
            multipleSelect: false
          }],
          videoType: '',
          source: '',
          childCheckedVal: [''],
          multipleSelect: false
        }]
      }
      vals.forEach(val => {
        const lastNumberObj = [
          { name: '', value: '', field: 'mac', operator: '=', type: 'count', multipleSelect: false }
        ]
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj = []

        // behaviorValue.find(item => item[selectPropKeyValue] === val) ||
        // attrList.find(item => item[selectPropKeyValue] === val)
        const matchObj = behaviorValue.find(item => item[selectPropKeyValue] === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val)

        if (matchObj) {
          obj = matchObj
        } else if (matchObj2) {
          obj = matchObj2
        }
        // console.log('obj.child=>>', obj.child)
        if (reverseSelect) { // 反选
          obj.operator = '!='
        }

        // 模块活跃，默认 child 值特殊处理
        const defaultchild = JSON.parse(JSON.stringify(defaultChild))

        obj.child = obj.child || (hasChild ? lastNumberObj : defaultchild)

        obj.childCheckedVal = obj.childCheckedVal || (typeof (obj.childCheckedVal) === 'string' ? '' : [])

        if (defaultchild.length > 0) {
          obj.childCheckedVal = typeof (obj.childCheckedVal) === 'string' ? defaultchild.map(item => item.value).join(',') : defaultchild.map(item => item.value)
        }
        if (isValueClear) { // 清空当前对象的child里面的值 (一二级联动时的交互)
          obj.childCheckedVal = []
          if (obj.child.length > 0) {
            obj.child[0].value = ''
            obj.child[0].name = ''
            obj.child[0].field = ''
            if (level !== 2 && level !== 4 && obj.child[0].child && obj.child[0].child.length > 0) {
              obj.child[0].childCheckedVal = []
              obj.child[0].child[0].value = ''
              obj.child[0].child[0].name = ''
              obj.child[0].child[0].field = ''
              obj.child[0].child[0].childCheckedVal = []
              // 递归清空子级的值
              this.clearChildVal(obj.child[0].child[0])
              // 根据第五级判断第六级的值
              // let levelChild5 = obj.child[0].child[0]
              // if (levelChild5.child && levelChild5.child.length > 0) {
              //   levelChild5.childCheckedVal = []
              //   levelChild5.child[0].value = ''
              //   levelChild5.child[0].name = ''
              //   levelChild5.child[0].field = ''
              //   // 根据第六级判断第七级的值
              //   let levelChild6 = levelChild5.child[0]
              //   if (levelChild6.child && levelChild6.child.length > 0) {
              //     levelChild6.childCheckedVal = []
              //     levelChild6.child[0].value = ''
              //     levelChild6.child[0].name = ''
              //     levelChild6.child[0].field = ''
              //     // 第9级
              //     let levelChild8 = levelChild6.child[0].child[0]
              //     if (levelChild8.child && levelChild8.child.length > 0) {
              //       levelChild8.childCheckedVal = []
              //       levelChild8.child[0].value = ''
              //       levelChild8.child[0].name = ''
              //       levelChild8.child[0].field = ''
              //     }
              //   }
              // }
            }
          }
        }
        if (level === 3) { // 选择二级分类时，operator: 'like',  value: '%抗日%'
          obj.operator = 'like'
          if (obj.value !== '') { obj.value = '%' + obj.value + '%' }
        }
        if (level === 4) { // 视频源, value 和 name 都是中文
          obj.value = obj.name
        }
        if (level === 5 || level === 6) { // 输入了影片名称之后，需要查询集数/期数 需要查询预约信息
          if (obj.videoType !== '电影' && obj.source && obj.value) {
            this.getTvEpisodes(obj.source, obj.value)
            this.getAppointmentInfo(obj.source, obj.value)
          }
          if (level === 5) {
            obj.child = [{
              name: '',
              value: '',
              field: '',
              operator: '=',
              type: 'string',
              childCheckedVal: [],
              child: [
                {
                  name: '',
                  value: '',
                  field: '',
                  operator: '=',
                  type: 'string',
                  childCheckedVal: [''],
                  child: [
                    {
                      name: '',
                      value: '',
                      field: '',
                      operator: '=',
                      type: 'string',
                      multipleSelect: false
                    }
                  ],
                  multipleSelect: false
                }
              ],
              multipleSelect: false
            }]
          }
        }

        const obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })

      // 动态设置子集的id与parentId
      list = this.setChildId(list, parentId)
      console.log('起播list===>', list)
      console.log('nodes===>', this.childItem.bav.behaviorValue)
      return list
    },

    // 起播行为递归清空子集的值
    clearChildVal (obj) {
      if (!obj.child || !obj.child.length) {
        return
      }
      obj.childCheckedVal = []
      obj.child && obj.child.forEach(item => {
        item.value = ''
        item.name = ''
        item.field = ''
        item.childCheckedVal = []
        if (item.child && item.child.length > 0) {
          this.clearChildVal(item)
        }
      })
    },

    /**
       * 【起播行为】绑定事件
       * @param {Object} childItem 当前选项的obj
       * @param {Boolean} hasChild 最后一级
       * @param {Number} level 第几级（为获取下拉框list）
       * @param {Object} extra 附加信息（根据选项判断，为获取不同下拉框list）
       * @param {String} selectPropKeyValue 所下拉框的 value和key 字段的 key值
       * @param {Boolean} isValueClear 一二级联动时，一级下拉切换，将二级下拉框清空
       * @param {Object} defaultChild 所清空下一级 child 时的默认赋值
       */
    // handelQiBoChildBehavir666SelectChange(childItem, hasChild = false, item, level=2, extra, selectPropKeyValue = 'value', isValueClear = false, defaultChild = []) {
    handelQiBoChildBehavirSelectChange (params = {}) {
      const { childItem, hasChild = false, level = 2, extra = {}, selectPropKeyValue = 'value', isValueClear = false, defaultChild = [], reverseSelectAttr } = params

      // 改变数据时将所有的checkbox归位false
      this.$set(this.childItem.bav, 'reverseSelect', false)
      this.childItem.bav.behaviorValue = this.setRecoveryItem(this.childItem.bav.behaviorValue)

      const vals = typeof (childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const behaviorValue = childItem.child || []

      const behaviorAttrList = this.getBehaviorAttrList(level, extra)
      // const behaviorAttrList = selectPropKeyValue === 'value' ? this.getBehaviorAttrList(item, level, extra) : this.qiBoOptions
      if (level === 4) { // 切换视频源时，清空下拉选项
        this.qiBoOptions = []
        this.qiboParams.page = 1 // 页码归1
      }
      childItem.child = this.getQiBoValListByVals({
        vals,
        behaviorValue,
        attrList: behaviorAttrList,
        hasChild,
        defaultChild,
        selectPropKeyValue,
        isValueClear,
        level,
        reverseSelectAttr,
        parentId: childItem.id
      })
    },

    // 【综合起播】的集数
    getVideoEpisode ({ tvId, businessType, source }) {
      if (!tvId) return // 没有tvId，直接返回

      const matchingVideo = this.videoOptions.find(item => item.value === tvId) || {} // 切换影片时，根据影片列表获取内容源

      const params = {
        tvId,
        businessType,
        source: source || matchingVideo.source,
        page: 1,
        pageSize: 200
      }
      if (!params.source) {
        return
      }
      this.$service.getVideoEpisode(params).then(res => {
        this.qiBoCollectionOptions = res.rows || []
        this.qiBoCollectionOptions = this.qiBoCollectionOptions.map(obj => {
          return {
            name: `第${obj.urlCollection}集 - ${obj.urlTitle}`,
            value: obj.urlCollection,
            field: obj.tableField,
            type: 'string'
          }
        })
      })
    },

    // 获取影片集数
    getTvEpisodes (source, id) {
      const params = {
        source,
        id,
        page: 1,
        pageSize: 200
      }

      this.$service.getTvEpisodes(params).then(res => {
        this.qiBoCollectionOptions = res.rows || []
        this.qiBoCollectionOptions = this.qiBoCollectionOptions.map(obj => {
          return {
            name: '第' + obj.urlCollection + '集',
            value: obj.urlCollection,
            field: obj.tableField,
            type: 'string'
          }
        })
      })
    },

    // 影片预约时间
    getAppointmentInfo (source, id) {
      const params = {
        source,
        id
      }
      this.$service.getAppointmentInfo(params).then(res => {
        const data = res
        this.appointmentInfo = data.map(item => {
          return {
            start: item.appointmentStart,
            end: item.appointmentEnd
          }
        })
        console.log('this.appointmentInfo==>', this.appointmentInfo)
      })
    },

    // 获取下拉框选项
    getBehaviorAttrList (level = 1, extra = {}) {
      const childItem = this.childItem // 组件参数：该个行为标签规则
      if (this.bavAttrList) {
        let attrlist = []
        const dict = this.bavAttrList.dict
        // console.log('dict===', dict)
        if (childItem.tagCode === 'BAV0001') {
          // eslint-disable-next-line no-debugger
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || dict.vip_package_all
            // attrlist = dict.vip_package
          } else if (level === 3) {
            attrlist = dict.use_status
          } else if (level === 4 && extra.extra === 'effective') {
            attrlist = dict.vip_expire_use
          } else if (level === 4 && extra.extra === 'no_effective') {
            attrlist = dict.vip_expire
          }
        } else if (childItem.tagCode === 'BAV0002') {
          if (level === 1) {
            attrlist = dict.app_operation
          } else if (level === 2) {
            attrlist = dict.app_type || []
          } else if (level === 3) {
            const obj = dict.app_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || dict.app_type_all
          }
        } else if (childItem.tagCode === 'BAV0003') {
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            attrlist = dict.buy_operation
          } else if (level === 3) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || dict.vip_package_all
            // attrlist = dict.vip_package
          } else if (level === 4) {
            attrlist = dict.buy_type
          } else if (level === 5) {
            attrlist = dict.price_product_id
          }
        } else if (childItem.tagCode === 'BAV0004') {
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            attrlist = dict.block_location
          } else if (level === 4) {
            attrlist = dict.blockPid
          }
        } else if (childItem.tagCode === 'BAV0005') {
          if (extra.listMapName) {
            attrlist = dict[extra.listMapName]
          } else if (level === 1) {
            attrlist = dict.page_active
          }
        } else if (childItem.tagCode === 'BAV0006') {
          if (extra.listMapName) {
            attrlist = dict[extra.listMapName]
          } else if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || dict.func_click
          } else if (level === 3) {
            attrlist = dict.package_vip
          } else if (level === 4) {
            attrlist = dict.category_name
          }
        } else if (childItem.tagCode === 'BAV0008') {
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            attrlist = dict.play_category
          } else if (level === 3 && extra.type === '电影') {
            attrlist = dict.movie_category
          } else if (level === 3 && extra.type === '综艺') {
            attrlist = dict.show_category
          } else if (level === 3 && extra.type === '记录片') {
            attrlist = dict.documentary_category
          } else if (level === 3 && extra.type === '电视剧') {
            attrlist = dict.tv_category
          } else if (level === 3 && extra.type === '动漫') {
            attrlist = dict.anime_category
          } else if (level === 4) {
            attrlist = dict.source
          } else if (level === 5) {
            return this.qiBoOptions
          } else if (level === 6) {
            return this.qiBoCollectionOptions
          } else if (level === 7) {
            attrlist = dict.pay_type
          } else if (level === 8) {
            attrlist = dict.watch_time
          } else if (level === 9) {
            attrlist = dict.single_episode
          }
        } else if (childItem.tagCode === 'BAV0009') {
          if (level === 1) {
            attrlist = dict.app_status
          } else if (level === 2) {
            attrlist = dict.app_type
          } else if (level === 3) {
            const obj = dict.app_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || []
          }
        } else if (childItem.tagCode === 'BAV0010') {
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            attrlist = dict.user_type
          }
        } else if (childItem.tagCode === 'BAV0011') { // 起播活跃
          if (extra.listMapName) {
            attrlist = dict[extra.listMapName]
          } else if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || []
          } else if (level === 3) {
            if (extra.type === '关注') {
              return this.followOptions
            } else if (extra.type === '订阅') {
              return this.topicOptions
            }
            attrlist = dict[extra.listMapName] || []
          } else if (level === 4) {
            if (extra.type === '影片' && extra.source) {
              return this.qiBoOptions
            } else if (extra.type === '影片') {
              return this.videoOptions
            } else if (extra.type === '视频源') {
              attrlist = dict.video_source
            } else {
              attrlist = dict[extra.listMapName]
            }
          } else if (level === 5) {
            attrlist = dict.game_vip
          } else if (level === 6) {
            if (extra.type === '电竞') {
              return this.videoOptions
            }
          } else if (level === 7) {
            attrlist = dict.is_vip
          } else if (level === 8) {
            attrlist = dict.video_category
          }
        } else if (childItem.tagCode === 'BAV0012') { // 综合起播
          if (extra.listMapName) {
            attrlist = dict[extra.listMapName]
          } else if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            return this.albumOptions4 // 音乐 搜专辑
          } else if (level === 3) {
            if (childItem.bav.value === '音乐') {
              return this.albumOptions2 // 音乐 搜歌手
            } else {
              return this.videoOptions // 视频
            }
          } else if (level === 4) {
            if (childItem.bav.value === '音乐') {
              return this.albumOptions1 // 音乐 搜歌曲
            } else {
              return this.qiBoCollectionOptions // 集数
            }
          } else if (level === 5) {
            if (childItem.bav.value === '影视') {
              attrlist = dict.mv_is_vip
            } else {
              attrlist = dict.is_vip
            }
          } else if (level === 6) { // 博主
            return this.followOptions
          } else if (level === 7) { // 歌曲
            return this.musicList
          } else if (level === 8) { // 歌手
            return this.singerList
          } else if (level === 9) { // 教育 VIP
            attrlist = dict.education_vip
          } else if (level === 11) { // 亲子 VIP
            attrlist = dict.vip_package_parent_children_vip
          }
          if (level === 10) { // 视频源
            attrlist = dict.source
          }
        } else if (childItem.tagCode === 'BAV0013') {
          if (level === 1) {
            attrlist = dict.source_name
          } else if (level === 2) {
            attrlist = dict.product_type || []
          } else if (level === 3) {
            attrlist = dict.keep_days || []
            // const obj = dict.app_type.find(item => item.dictValue === extra.type) || {}
            // attrlist = dict[obj.mapName] || dict.app_type_all
          }
        } else if (childItem.tagCode === 'BAV0014') {
          if (level === 1) {
            attrlist = dict.source_name
          } else if (level === 2) {
            attrlist = dict.product_type || []
          } else if (level === 3) {
            attrlist = dict.keep_type || []
            // const obj = dict.app_type.find(item => item.dictValue === extra.type) || {}
            // attrlist = dict[obj.mapName] || dict.app_type_all
          }
        } else if (childItem.tagCode === 'BAV0015') {
          if (level === 1) {
            attrlist = dict.source_name
          } else if (level === 2) {
            attrlist = dict.product_type || []
          } else if (level === 3) {
            attrlist = dict.attrType || []
            // const obj = dict.app_type.find(item => item.dictValue === extra.type) || {}
            // attrlist = dict[obj.mapName] || dict.app_type_all
          }
        } else if (childItem.tagCode === 'BAV0016') {
          if (extra.listMapName) {
            attrlist = dict[extra.listMapName]
          } else if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || []
          } else if (level === 3) { // 卡种
            // attrlist = dict.business_type || []
            attrlist = dict.buy_type || []
          } else if (level === 4) { // 用券行为
            attrlist = dict.coupon_action || []
          } else if (level === 5) { // 券方式
            attrlist = dict.coupon_type || []
          }
        } else {
          attrlist = [
            {
              value: 'xiazai',
              label: '下载应用'
            },
            {
              value: 'qidong',
              label: '启动应用'
            },
            {
              value: 'xiezai',
              label: '卸载应用'
            }
          ]
        }
        attrlist = attrlist.map(item => {
          let list = {
            name: item.dictLabel,
            value: item.dictValue,
            field: item.tableField,
            type: item.filedType,
            selectKey: item.tableField + item.dictValue,
            mapName: item.mapName || ''
          }
          if (childItem.tagCode === 'BAV0001') { // 会员状态
            let operator = '='
            if (level === 3 && item.filedType === 'effective') { operator = '>=' } // 有效
            if (
              (level === 3 && item.filedType === 'no_effective') ||
                item.filedType === 'vip_expire30') { operator = '<' } // 无效 || 过期时间>30
            if (item.filedType === 'vip_expire_use30') { operator = '>' } // 会员过期时间>30天
            if (
              item.filedType === '7vip_expire_use30' ||
                item.filedType === '7vip_expire_use' ||
                item.filedType === '7vip_expire30' ||
                item.filedType === '7vip_expire') { operator = 'between' } // 7<会员到期时间<=30 || 会员到期时间<=7 || 7<过期时间<=30 || 过期时间<=7

            list = {
              name: item.dictLabel,
              value: item.dictValue,
              field: item.tableField,
              type: 'string',
              selectKey: item.filedType,
              operator,
              mapName: item.mapName || ''
            }
          }
          return list
        })
        // console.log('attrlist==>', attrlist)
        return attrlist
      }
    },

    getChildBehaviorAttrList () {
      return [
        {
          value: 'mg',
          label: '芒果TV'
        },
        {
          value: 'tx',
          label: '腾讯视频'
        },
        {
          value: 'bl',
          label: 'bilibili'
        }
      ]
    }
  }
}
