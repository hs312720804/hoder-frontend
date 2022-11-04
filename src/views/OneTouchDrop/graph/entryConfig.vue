<template>
    <div class="entryConfig-wrap">
        <el-dialog
            title="总入口配置"
            :visible.sync="show.is"
            width="45%"
        >
            <el-form label-position="left" label-width="100px" :model="entryConfigForm">
                <el-form-item label="规则设置：">
                    <template v-for="(crowd, i) in inputValue">
                        <multiple-select :tags="tags" :rulesJson="crowd.rulesJson" :crowd="crowd" :i="i"></multiple-select>
                    </template>
                </el-form-item>
                <el-form-item label="分流比例：">
                    <el-row>
                        <el-input placeholder="请输入" v-model="entryConfigForm.splitRadio">
                            <template slot="append">%</template>
                        </el-input>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show.is = false">取 消</el-button>
                <el-button type="primary" @click="saveEntryData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import multipleSelect from '@/components/MultipleSelect'
export default {
  props: {
    show: {
      type: Object,
      default () {
        return {
          is: false
        }
      }
    },
    recordId: {
      type: [Number, String],
      default: 1
    },
    entryData: {
      type: [Array, Object, String]
    },
    policyId: {
      type: [String, Number]
    },
    splitRadio: {
      type: [String, Number]
    }
  },
  name: 'entryConfig',
  data () {
    return {
      tags: [],
      entryConfigForm: {
        splitRadio: null
      },
      inputValue: []
    }
  },
  methods: {
    saveEntryData () {
      this.$emit('saveEntryData', this.inputValue, this.entryConfigForm.splitRadio)
    },
    getRecordId () {
      return this.recordId
    },
    setInputValue (val) {
      if (val !== this.inputValue) {
        if (val.length > 0) {
          this.inputValue = val
          this.setSeq()
        } else {
          if (this.inputValue.length > 0) {
            return
          }
          this.inputValue.push(
            {
              'recordId': this.getRecordId(),
              'tempCrowdId': undefined,
              'crowdName': undefined,
              'tagIds': [],
              'purpose': undefined,
              'remark': undefined,
              'crowdOrder': length + 1,
              'rulesJson': {
                condition: 'OR',
                rules: []
              },
              'dynamicPolicyJson': {
                link: 'AND',
                condition: 'AND',
                rules: []
              },
              'limitLaunch': false,
              'limitLaunchCount': undefined,
              total0: undefined
            }
          )
          this.setSeq()
        }
      }
    },
    setSeq () {
      let inputValue = JSON.parse(JSON.stringify(this.inputValue))
      this.inputValue = inputValue.map((e, index) => {
        e.crowdOrder = index + 1
        return e
      })
    }
    // emitInputValue () {
    //     this.$emit('input', this.inputValue)
    // }
  },
  components: {
    multipleSelect
  },
  watch: {
    show: {
      handler (val) {
        if (val.is) {
          // 新增
          if (!this.policyId) {
            this.$service.tagInfoNew(this.recordId).then(data => {
              this.tags = data.filter(item => {
                return item.dataSource !== 6
              })
              this.entryConfigForm.splitRadio = this.splitRadio ? this.splitRadio : ''
              this.setInputValue(this.entryData)
            })
          } else {
            // 编辑
            this.$service.getTagsByPoliceId({ policyId: this.policyId }).then(data => {
              this.tags = data.filter(item => {
                return item.dataSource !== 6
              })
              this.entryConfigForm.splitRadio = this.splitRadio
              this.setInputValue(this.entryData)
            })
          }
        }
      },
      deep: true
    },
    entryData: 'setInputValue'
    // inputValue: {
    //     handler () {
    //         this.emitInputValue();
    //     }
    // },
    // deep: true
  }
}
</script>

<style scoped>

</style>
