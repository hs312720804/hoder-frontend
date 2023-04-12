<template>
  <div class="label-container multipleSelect">
    <!-- rulesJson: {{ rulesJson }} -->
    <div>
      <!-- tag: {{tags}} -->
    </div>
    <el-form :model="rulesJson" ref="ruleForm">
    <!-- 设置标签 -->
    <div v-if="tags && tags.length > 0">
      <div
        v-show="rulesJson.rules.length > 1"
        class="label-or-space"
        :key="i + 'or'"
      >
        <el-button
          type="success"
          round
          :key="'button2' + '_' + i"
          @click="handleRulesConditionChange(rulesJson)"
        >
          {{ rulesJson.condition === 'AND' ? '且' : '或' }}
        </el-button>
      </div>
      <template v-for="(item, index) in rulesJson.rules">
      <div class="label-ground" :key="index">
        <div class="tag-condition--parent">
          <div class="tag-condition" v-show="item.rules.length > 1">
            <el-button
              type="warning"
              @click="handleRulesConditionChange(item)"
              round
              size="small"
              :key="'button' + index + '_' + i"
            >
              {{ item.condition === 'AND' ? '且' : '或' }}
            </el-button>
          </div>
          <div
            v-for="(childItem, n) in item.rules"
            :key="index + 'tagId' + n"
            :class="{ 'label-item': true, paddingTop: n > 0 }"
          >
          <!-- childItem --- {{ childItem }} -->
            <!-- 构建规则 json -->

            <!-- 流转指标规则  只有动态人群、故事线才会出现 -->
            <template v-if="(childItem.dataSource === 20)">
              <span class="txt">{{ childItem.tagName }}</span>

              <RuleCom class="rule-wrap" :childItem="childItem" :index="index" :n="n"></RuleCom>
              <span class="i" @click="handleRemoveRule(item, childItem)">
                <i class="icon iconfont el-icon-cc-delete"></i>
              </span>
            </template>

            <!-- 其他的普通标签（不是故事线的）-->
            <template v-else>
              <span class="txt">{{ childItem.categoryName }}</span>

              <!-- 实时标签[大数据] 标签  需要特地增加一个下拉框选择二级标签-->
              <!-- v-if="childItem.tagCode === 'vip_status' || childItem.tagCode === 'vip_last_buy' " -->
              <span v-if="childItem.dataSource === 13">
                <el-select
                  style="width: 130px"
                  class="time-dot-select-new"
                  :key="n + 'realTime'"
                  v-model="childItem.subTag"
                  filterable
                  clearable
                  placeholder="请选择权益"
                >
                  <el-option
                    v-for="item in getTagAttrChild[childItem.tagId]"
                    :key="item.attrId"
                    :value="item.attrValue"
                    :label="item.attrName">
                  </el-option>
                </el-select>
              </span>
              <span class="sel">

                <!-- 是时间（time）类型的下拉框 -->
                <template v-if="childItem.tagType === 'time'">

                  <!-- 二期之后的版本 -->
                  <template v-if="childItem.version > 0">
                    <el-select
                      style="width: 130px"
                      class="time-dot-select-new"
                      :key="n + 'timeKey'"
                      v-model="childItem.dateAreaType"
                      @change="handelTimeTagTypeSelectChange(childItem)"
                    >
                      <el-option :value="0" label="未发生该行为"></el-option>
                      <el-option :value="1" label="动态时间"></el-option>
                      <el-option :value="2" label="固定时间"></el-option>
                    </el-select>
                  </template>

                  <!-- 一期 -->
                  <template v-else>
                    <!-- 新方案 -->
                    <el-select v-show="childItem.isDynamicTime === 3"
                      class="time-dot-select-new"
                      :key="n + 'timeKey'"
                      v-model="childItem.dateAreaType"
                      @change="handelTimeTagTypeSelectChange(childItem)"
                    >
                      <el-option :value="0" label="空"></el-option>
                      <el-option :value="1" label="已过期"></el-option>
                      <el-option :value="2" label="未过期"></el-option>
                    </el-select>

                    <!-- 旧方案 -->
                    <el-select v-show="childItem.isDynamicTime !== 3"
                      style="width: 80px"
                      name="oxve"
                      v-model="childItem.operator"
                      class="input-inline"
                      @change="handleOperatorChange(childItem)"
                    >
                      <el-option value="="></el-option>
                      <el-option value=">="></el-option>
                      <el-option value="<="></el-option>
                      <el-option value=">"></el-option>
                      <el-option value="<"></el-option>
                    </el-select>

                  </template>

                </template>

                <!-- 不是时间（time）类型的下拉框 -->
                <el-select v-else
                  style="width: 100px"
                  name="oxve"
                  v-model="childItem.operator"
                  class="input-inline"
                  @change="handleOperatorChange(childItem)"
                >
                  <!-- number 类型 -->
                  <template v-if="childItem.tagType === 'number'">
                    <el-option value="="></el-option>
                    <el-option value=">="></el-option>
                    <el-option value="<="></el-option>
                    <el-option value=">"></el-option>
                    <el-option value="<"></el-option>
                  </template>

                  <!-- string 或者 mix 类型 -->
                  <template
                    v-if="
                      childItem.tagType === 'string' ||
                      childItem.tagType === 'mix'
                    "
                  >
                    <el-option value="=" label="是"></el-option>
                    <el-option value="!=" label="不是"></el-option>
                    <!-- <el-option value="like" label="包含"></el-option> -->
                    <el-option value="null" label="为空"></el-option>
                  </template>

                  <!-- boolean 类型 -->
                  <template v-if="childItem.tagType === 'boolean'">
                    <el-option value="=" label="="></el-option>
                  </template>

                  <!-- collect 类型 -->
                  <template v-if="childItem.tagType === 'collect' || childItem.tagType === 'crowd'">
                    <el-option value="=" label="是"></el-option>
                    <el-option value="!=" label="不是"></el-option>
                  </template>
                </el-select>
              </span>

              <span class="in" v-if="childItem.tagType !== 'crowd'">
                <!-- time 类型 -->

                <span v-if="childItem.tagType === 'time'">
                  <template v-if="childItem.dateAreaType !== 0">
                    <!-- 二期之后的版本 -->
                    <template v-if="childItem.version > 0">
                      <!-- {{childItem}} -->
                      <span v-if="childItem.dateAreaType === 2" style="display: flex">   <!-- 固定时间 -->
                        <el-date-picker
                          v-model="childItem.startDay"
                          type="date"
                          style="width: 135px"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          :key="index + 'startTimeKey'"
                        ></el-date-picker>
                        ~
                        <el-date-picker
                          v-model="childItem.endDay"
                          type="date"
                          style="width: 135px"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          :key="index + 'endTimeKey'"
                        ></el-date-picker>
                      </span>

                      <span v-else>   <!-- 动态时间 -->
                        <el-input
                          class="time-dot-input"
                          style="width: 60px"
                          v-model="childItem.startDay"
                          @blur="checkNumMostFour(childItem.startDay)"
                        ></el-input>天~
                        <el-input
                          class="time-dot-input"
                          style="width: 60px"
                          v-model="childItem.endDay"
                          @blur="bigNum(childItem)
                          "
                        ></el-input>天
                      </span>
                    </template>

                    <!-- 圈人群一期 -->
                    <template v-else>
                      <!-- 模式1 -->
                      <template v-if="childItem.isDynamicTime === 1">
                        <el-date-picker
                          v-model="childItem.value"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          :key="index + 'key'"
                        ></el-date-picker>
                      </template>
                      <!-- 模式2 -->
                      <template v-if="childItem.isDynamicTime === 2">
                        <el-select
                          class="time-dot-select"
                          :key="n + 'timeKey'"
                          v-model="childItem.dynamicTimeType"
                        >
                          <el-option :value="1" label="在当日之前"></el-option>
                          <el-option :value="2" label="在当日之后"></el-option>
                        </el-select>
                        <span>
                          <el-input
                            class="time-dot-input"
                            v-model="childItem.value"
                            @blur="checkNum(childItem.value)"
                          ></el-input>天
                        </span>
                      </template>
                      <!-- 模式3 -->
                      <template v-if="childItem.isDynamicTime === 3">
                        <el-input
                          class="time-dot-input"
                          style="width: 60px"
                          v-model="childItem.startDay"
                          @blur="checkNumMostFour(childItem.startDay)"
                        ></el-input>天~
                        <el-input
                          class="time-dot-input"
                          style="width: 60px"
                          v-model="childItem.endDay"
                          @blur="bigNum(childItem)"
                        ></el-input>天
                      </template>
                    </template>
                  </template>
                </span>

                <!-- string 、 collect 、 mix 类型 -->
                <template v-else-if="
                    (childItem.tagType === 'string' ||
                    childItem.tagType === 'collect' ||
                    childItem.tagType === 'mix')
                  "
                >

                  <template v-if="cache[childItem.tagId]">
                    <el-select
                      v-if="
                        childItem.tagType === 'string' &&
                        childItem.operator === 'null'
                      "
                      v-model="childItem.value"
                      :key="'null'"
                      disabled
                    >
                      <el-option label="空" value="nil"></el-option>
                    </el-select>
                    <template v-else>
                      <!-- 官方-地域标签 -->
                      <!-- v-model="provinceValueList[(n+1)*(index+1)]" -->
                      <div
                        v-if="childItem.tagCode === 'mix_area'"
                        class="mix-area-select"
                      >
                        <!-- 省 -->
                        <el-select
                          v-model="childItem.provinceValue"
                          class="inline-input"
                          filterable
                          :key="index + 'mix_area_select'"
                          default-first-option
                          placeholder="请输入或选择"
                          :disabled="cache[childItem.tagId].select"
                          @change="
                            areaSelectChange($event, childItem.tagCode, childItem)
                          "
                        >
                          <el-option
                            v-for="item in cache[childItem.tagId].list"
                            :key="index + item.attrValue + item.attrId"
                            :label="item.attrName"
                            :value="item.attrValue"
                          ></el-option>
                        </el-select>
                        <!-- 市 -->
                        <el-select
                          v-model="childItem.value"
                          class="inline-input"
                          filterable
                          :key="index + 'mix_area2_select'"
                          default-first-option
                          placeholder="请输入或选择"
                          :disabled="cache[childItem.tagId].select"
                          @change="
                            citySelectChange(
                              $event,
                              childItem,
                              cityData[childItem.provinceValue]
                            )
                          "
                        >
                          <el-option
                            v-for="item in cityData[childItem.provinceValue]"
                            :key="index + item.attrValue + item.attrId"
                            :label="item.attrName"
                            :value="item.attrValue"
                          ></el-option>
                        </el-select>
                      </div>
                      <!-- 官方-地域标签 end-->

                      <!--
                        多选下拉框
                        当 tagType 为 string 的时候可多选 222
                      -->
                      <el-select
                        v-else
                        v-model="childItem.value"
                        :multiple="childItem.tagType === 'string' && childItem.operator !== 'null'"
                        class="inline-input"
                        filterable
                        :key="index + 'select'"
                        placeholder="请输入或选择"
                        :disabled="cache[childItem.tagId].select"
                        @change="
                          citySelectChange(
                            $event,
                            childItem,
                            cache[childItem.tagId].list
                          )
                        "
                      >
                        <el-option
                          v-for="item in cache[childItem.tagId].list"
                          :key="index + item.attrValue + item.attrId"
                          :label="item.attrName"
                          :value="item.attrValue"
                        ></el-option>
                      </el-select>

                      <div class="errorMsg">
                        {{ childItem.errorMsg ? childItem.errorMsg : '' }}
                      </div>
                    </template>
                  </template>

                </template>

                <!-- number 类型 -->
                <template v-else-if="childItem.tagType === 'number'">
                  <el-input-number
                    :key="index + 'input'"
                    v-model="childItem.value"
                    placeholder="请输入内容"
                  ></el-input-number>
                  <!-- 给【主页版本】标签增加提示 -->
                  <span v-if="childItem.tagName.includes('主页版本')" style="color: gray; font-size: 12px;">
                    例如：7470000
                  </span>
                </template>

                <!-- 其他 -->
                <el-select v-else
                  v-model="childItem.value"
                  :disabled="
                    childItem.tagType === 'string' &&
                    childItem.operator === 'null'
                  "
                >
                  <template
                    v-if="
                      childItem.tagType === 'string' &&
                      childItem.operator === 'null'
                    "
                  >
                    <el-option label="空" value="nil"></el-option>
                  </template>
                  <template v-else>
                    <el-option value="true" label="是"></el-option>
                    <el-option value="false" label="否"></el-option>
                  </template>
                </el-select>
              </span>

              <!-- 一期 -->
              <span v-if="childItem.tagType === 'time' && childItem.version === 0">
                  <template v-if="childItem.dateAreaType !== 0">
                  <el-button
                    :key="childItem.tagId + n"
                    @click="changeTimeWays(childItem)"
                    v-if="childItem.isDynamicTime !== 3"
                  >
                    <span v-if="childItem.isDynamicTime === 2"
                      >切换到具体时间点</span
                    >
                    <span v-if="childItem.isDynamicTime === 1"
                      >切换至时间天数</span
                    >
                  </el-button>
                  <el-button
                    v-if="childItem.isDynamicTime !== 3"
                    @click="
                      childItem.isDynamicTime = 3
                      childItem.dateAreaType = 0
                      childItem.operator = 'between'
                      childItem.value = childItem.startDay + '-' + childItem.endDay
                    "
                    >切换至新方案
                  </el-button>
                  <el-button
                    v-if="childItem.isDynamicTime === 3"
                    @click="
                      childItem.isDynamicTime = 2
                      childItem.dynamicTimeType = 1
                      childItem.operator = '='
                      childItem.value = ''
                    "
                    >切换至旧方案</el-button
                  >
                </template>
              </span>

              <template v-if="cache[childItem.tagId]">
                <span
                  v-if="
                    cache[childItem.tagId].select &&
                    (childItem.tagType === 'string' ||
                      childItem.tagType === 'collect')
                  "
                >
                  <el-button
                    :key="childItem.tagId + n"
                    @click="handleSelectMore(childItem)"
                    >点击选择更多
                  </el-button>
                </span>
              </template>

              <span>
                <el-button type="text" @click="handelCopyRule(item, childItem, n)">复制</el-button>
              </span>

              <span class="i" @click="handleRemoveRule(item, childItem)">
                <i class="icon iconfont el-icon-cc-delete"></i>
              </span>
              <span
                v-if="
                  childItem.tagType === 'time' && childItem.isDynamicTime === 3
                "
              >
                <!-- 选择动态时间提示 -->
                <!-- 二期之后的版本 -->
                <div v-if="childItem.version > 0 && childItem.dateAreaType === 1" style="color: gray; font-size: 12px;">
                  提示：负数表示过去的日期，例如过去一周到未来3天，可以表示成-7天到3天
                </div>
                <!-- <el-tooltip v-if="childItem.version > 0 && childItem.dateAreaType === 1" class="item" effect="dark" placement="top-start" >
                  <div slot="content">提示：负数表示过去的日期，比如-1表示昨天，0表示今天，1表示明天</div>
                  <el-button type="text">提示</el-button>
                </el-tooltip> -->

                <!-- 圈人群二期之前版本提示 -->
                <el-tooltip v-else-if="childItem.version === 0" class="item" effect="dark" placement="top-start" >
                  <div slot="content">
                    状态：到期时间请选择“已过期”或“未过期”，其他请选“空”
                    <br />时间设置：30天以内：输入0～30天；30天以外：请输入30天～9999天
                  </div>
                  <el-button type="text">提示</el-button>
                </el-tooltip>
              </span>
            </template>
          </div>
          <div class="label-add">
            <div class="optional-condition">
              <el-tag
                class="oc-item"
                v-for="tagItem in tags"
                :key="tagItem.tagItem"
                @click.native="handleAddChildRule(item, tagItem)"
                :type="dataSourceColorEnum[tagItem.dataSource]"
                >{{ tagItem.tagName }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      </template>
      <div class="label-or">
        <div
          class="optional-condition"
          v-if="tags.length"
          :style="{
            'padding-top': rulesJson.rules.length > 0 ? '10px' : 0,
          }"
        >
          <el-tag
            class="oc-item"
            v-for="item in tags"
            :key="item.tagName"
            @click.native="handleAddRule(item)"
            :type="dataSourceColorEnum[item.dataSource]"
            >{{ item.tagName }}
          </el-tag>

          <!-- <i class="el-icon-top" style="font-size: 28px;"></i> -->
          <div v-if="showHitTip" class="introjs-hint" style="font-size: 28px; position: absolute; bottom: -28px; left: 20px; color: #999">
            <i class="el-icon-thumb" style="font-size: 28px;"></i>
            <span style="font-size: 12px;">点击标签来编辑人群条件</span>
          </div>

          <!-- <span class="animated shake" style="font-size: 28px; vertical-align: middle;">
            <i class="el-icon-back" style="font-size: 28px;"></i>
            <span style="font-size: 14px;">点击标签来编辑人群条件</span>
          </span> -->

          <!-- 新手指引 - 点击提示 -->
          <!-- <el-popover
            v-if="showHitTip"
            placement="bottom"
            width="230"
            v-model="tipVisible"
            style="position: absolute; top: 10px; left: 20px;">
            <p>Hello! 👋 点击标签来编辑人群条件</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="showHitTip = false">知道了</el-button>
            </div>
            <a class="introjs-hint" slot="reference">
              <div class="introjs-hint-dot"></div>
              <div class="introjs-hint-pulse"></div>
            </a>
          </el-popover> -->

        </div>
      </div>
    </div>
    </el-form>

    <!-- 动态因子 -->
    <div v-if="specialTags && specialTags.length > 0">
      <div
        v-show="dynamicPolicyJson.rules.length > 1"
        class="label-or-space"
        :key="i + '_or'"
      >
        <el-button
          type="success"
          round
          :key="'button3' + '_' + i"
          @click="handleRulesConditionChange(dynamicPolicyJson)"
        >
          {{ dynamicPolicyJson.condition === 'AND' ? '且' : '或' }}
        </el-button>
      </div>
      <template v-for="(item, index) in dynamicPolicyJson.rules">
        <div class="label-ground" :key="index">
          <div class="tag-condition--parent">
            <div class="tag-condition" v-show="item.rules.length > 1">
              <el-button
                type="warning"
                @click="handleRulesConditionChange(item)"
                round
                size="small"
                :key="'button' + index + '_' + i"
              >
                {{ item.condition === 'AND' ? '且' : '或' }}
              </el-button>
            </div>
            <div
              v-for="(childItem, n) in item.rules"
              :key="index + 'tagId' + n"
              :class="{ 'label-item': true, paddingTop: n > 0 }"
            >
              <template v-if="childItem.tagType === 'number'">
                <div class="flex-item">
                  <div>位置类型</div>
                  <div>
                    <el-select
                      v-model="childItem.dynamic.type"
                      style="width: 80px"
                    >
                      <el-option label="版面" :value="1"></el-option>
                      <el-option label="版块" :value="2"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="flex-item">
                  <div>位置ID</div>
                  <el-input
                    v-model="childItem.dynamic.version"
                    style="width: 150px"
                  ></el-input>
                </div>
              </template>
              <span :class="childItem.tagType === 'number' ? '' : 'txt'">{{
                childItem.categoryName
              }}</span>
              <span :class="childItem.tagType === 'number' ? '' : 'sel'">
                <el-select
                  style="width: 80px"
                  name="oxve"
                  v-model="childItem.operator"
                  class="input-inline"
                  @change="handleOperatorChange(childItem)"
                  v-show="
                    !(
                      childItem.tagType === 'time' &&
                      childItem.isDynamicTime === 3
                    )
                  "
                >
                  <template v-if="childItem.tagType === 'number'">
                    <el-option value="="></el-option>
                    <el-option value=">="></el-option>
                    <el-option value="<="></el-option>
                    <el-option value=">"></el-option>
                    <el-option value="<"></el-option>
                  </template>
                </el-select>
              </span>
              <span class="in">
                <span v-if="childItem.tagType === 'time'">
                  <template v-if="childItem.isDynamicTime === 2">
                    <el-select
                      class="time-dot-select"
                      :key="n + 'timeKey'"
                      v-model="childItem.dynamicTimeType"
                    >
                      <el-option :value="1" label="在当日之前"></el-option>
                      <el-option :value="2" label="在当日之后"></el-option>
                    </el-select>
                    <span
                      ><el-input
                        class="time-dot-input"
                        v-model="childItem.value"
                        @blur="checkNum(childItem.value)"
                      ></el-input
                      >天</span
                    >
                  </template>
                  <template v-if="childItem.isDynamicTime === 1">
                    <el-date-picker
                      v-model="childItem.value"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :key="index + 'key'"
                    ></el-date-picker>
                  </template>
                  <template v-if="childItem.isDynamicTime === 3">
                    <span
                      ><el-input
                        class="time-dot-input"
                        style="width: 60px"
                        v-model="childItem.startDay"
                        @blur="checkNumMostFour(childItem.startDay)"
                      ></el-input
                      >天~</span
                    >
                    <span
                      ><el-input
                        class="time-dot-input"
                        style="width: 106px"
                        v-model="childItem.endDay"
                        @blur="bigNum(childItem)"
                      ></el-input
                      >天</span
                    >
                  </template>
                </span>
                <template
                  v-else-if="
                    (childItem.tagType === 'string' ||
                      childItem.tagType === 'collect') &&
                    cache[childItem.tagId]
                  "
                >
                  <el-select
                    v-if="
                      childItem.tagType === 'string' &&
                      childItem.operator === 'null'
                    "
                    v-model="childItem.value"
                    disabled
                  >
                    <el-option label="空" value="nil"></el-option>
                  </el-select>
                  <el-select
                    v-else
                    v-model="childItem.value"
                    class="inline-input"
                    filterable
                    :key="index + 'select'"
                    default-first-option
                    placeholder="请输入或选择"
                    :disabled="cache[childItem.tagId].select"
                  >
                    <el-option
                      v-for="item in cache[childItem.tagId].list"
                      :key="index + item.attrValue + item.attrId"
                      :label="item.attrName"
                      :value="item.attrValue"
                    ></el-option>
                  </el-select>
                </template>
                <el-input-number
                  v-if="childItem.tagType === 'number'"
                  :key="index + 'input'"
                  v-model="childItem.value"
                  placeholder="请输入内容"
                ></el-input-number>
                <el-select v-else v-model="childItem.value">
                  <el-option value="true" label="是"></el-option>
                  <el-option value="false" label="否"></el-option>
                </el-select>
              </span>

              <span>
                <el-button type="text" @click="handelCopyRule(item, childItem, n)">复制</el-button>
              </span>

              <span class="i" @click="handleRemoveSpecialRule(item, childItem)">
                <i class="icon iconfont el-icon-cc-delete"></i>
              </span>
            </div>
            <div class="label-add">
              <div class="optional-condition">
                <el-tag
                  class="oc-item"
                  v-for="tagItem in specialTags"
                  :key="tagItem.tagId + '_' + tagItem.tagName"
                  @click.native="handleAddSpecialChildRule(item, tagItem)"
                  :type="dataSourceColorEnum[tagItem.dataSource]"
                  >{{ tagItem.tagName }}</el-tag
                >
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="label-or">
        <div
          class="optional-condition"
          v-if="specialTags.length"
          :style="{
            'padding-top': dynamicPolicyJson.rules.length > 0 ? '10px' : 0,
          }"
        >
          <el-tag
            class="oc-item"
            v-for="item in specialTags"
            :key="item.tagId + '_' + item.tagName"
            @click.native="handleAddSpecialRule(item)"
            :type="dataSourceColorEnum[item.dataSource]"
            >{{ item.tagName }}</el-tag
          >
        </div>
      </div>
    </div>

    <el-dialog
      title="显示更多标签"
      :visible.sync="showMoreTags"
      :append-to-body="true"
      class="showMoreTags"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="标签名称">
          <el-input
            v-model="formInline.attrName"
            placeholder="标签名称"
            @keydown.enter.native="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <!-- 类型为 string 的 可以多选 -->
        <el-checkbox-group v-if="currentChildItem.tagType === 'string' && currentChildItem.operator !== 'null'" v-model="checkboxValue">
          <el-checkbox
            v-for="(tag, index) in tagList"
            :label="tag.attrValue"
            :key="tag.attrId + index"
            >{{ tag.attrName }}
          </el-checkbox>
        </el-checkbox-group>

        <el-radio-group v-else v-model="checkboxValue">
          <el-radio
            v-for="(tag, index) in tagList"
            :label="tag.attrValue"
            :key="tag.attrId + index"
            >{{ tag.attrName }}
          </el-radio>
        </el-radio-group>

      </div>
      <el-pagination
        small
        class="pagination"
        layout="prev,pager,next"
        :total="tagsListTotal"
        :page-size="initPageSize"
        :current-page="initCurrentPage"
        @current-change="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMoreTags = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckboxOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import RuleCom from '@/components/dynamicPeople/ruleComs/RuleCom.vue'
import { dataSourceColorEnum } from '@/utils/tags.js'

export default {
  components: {
    RuleCom
  },
  data () {
    return {
      showHitTip: true,
      tipVisible: false,
      cache: {},
      tagSelectMoreShow: false,
      showMoreTags: false,
      tagsListTotal: 0,
      formInline: {
        attrName: ''
      },
      tagList: [],
      checkboxValue: '',
      currentChildItem: '',
      suggestions: {},
      suggestionsNew: [],
      priority: '',
      initPageSize: 200,
      initCurrentPage: 1,
      activeName: 0,
      inputValue: [],
      rules: {
        noEmpty: [{ required: true, message: '不能为空', trigger: 'blur' }],
        crowdName: [
          { required: true, message: '请输入人群名称', trigger: 'blur' }
        ],
        limitLaunchCount: [
          {
            required: true,
            message: '请输入大于0小于1,000,000的限制数量',
            trigger: 'blur'
          }
        ]
      },
      // {1: "自定义", 2: "大数据", 3: "第三方接口数据", 5: "设备实时标签"}
      // dataSourceColorEnum: {
      //   1: 'success',
      //   2: 'danger',
      //   3: '',
      //   5: 'warning',
      //   6: 'warningOrange',
      //   7: 'warningOrange2',
      //   8: 'warningCyan',
      //   11: 'success',
      //   12: 'gray'
      // },
      cityData: [],
      provinceValueList: [],
      getTagAttrChild: {}
    }
  },
  // props: ['tags', 'crowd', 'specialTags', 'i'],
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    specialTags: {
      type: Array,
      default: () => []
    },
    i: {
      type: Number,
      default: 0
    },
    rulesJson: {
      type: Object,
      default: () => {}
    },
    dynamicPolicyJson: {
      type: Object,
      default: () => {}
    },
    crowd: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dataSourceColorEnum () {
      return dataSourceColorEnum
    }
  },
  watch: {
    tags: {
      handler (val) {
        this.getTagAttrChild = {}
        val.forEach(item => {
          const child = item.child
          if (child && child.length > 0) {
            this.$set(this.getTagAttrChild, item.tagId, item.child)
          }
        })
      },
      immediate: true
    },
    rulesJson: {
      handler () {
        this.fetchAllTagSuggestions()
      },
      immediate: true
    },
    dynamicPolicyJson: {
      handler () {
        this.fetchAllTagSuggestions()
      },
      immediate: true
    }
  },
  methods: {
    getChild (childItem) {
      const obj = this.tags.filter(item => item.tagId === childItem.tagId)
      return obj && obj.child ? obj.child : []
    },
    // 复制标签规则
    handelCopyRule (rule, childRule, index) {
      const childRuleCopy = JSON.parse(JSON.stringify(childRule))
      rule.rules.splice(index + 1, 0, childRuleCopy) // 复制到当前选中位置后面
    },
    handelTimeTagTypeSelectChange (childItem) {
      // 如果选择 【空】 则将 value 清空
      if (childItem.dateAreaType === 0) {
        childItem.value = '-'
      } else {
        childItem.value = ''
      }
      childItem.startDay = ''
      childItem.endDay = ''
    },
    handleCheckboxOk () {
      this.currentChildItem.value = this.checkboxValue
      this.showMoreTags = false
    },

    handleCurrentChange (index) {
      this.initCurrentPage = index
      this.$service
        .getTagAttr({
          tagId: this.currentChildItem.tagId,
          pageSize: this.initPageSize,
          pageNum: index
        })
        .then(data => {
          this.tagList = data.pageInfo.list
        })
    },
    citySelectChange (val, childRule, cityList) {
      if (childRule.tagType === 'mix') {
        const matchCity = cityList.find(item => {
          return val === item.attrName
        })
        childRule.specialTagId = matchCity.attrId
        childRule.specialCondition = matchCity.rulesJson
        childRule.errorMsg = matchCity.rulesJson
          ? ''
          : '标签未配置，请先配置再使用'
        // console.log('inputValue=====', this.inputValue)
      }
    },
    // 根据省id获取市列表
    areaSelectChange (val, tagCode, childItem) {
      if (childItem) childItem.value = ''
      if (tagCode === 'mix_area') {
        const params = {
          id: val
        }
        return this.$service.specialTagChild(params).then(data => {
          const cityData = data.slice().map(item => {
            return {
              attrValue: item.specialTagName,
              attrName: item.specialTagName,
              attrId: item.specialTagId,
              rulesJson: item.rulesJson
            }
          })
          this.$set(this.cityData, val, cityData)
        })
      }
    },
    changeTimeWays (childItem) {
      childItem.value = ''
      if (childItem.isDynamicTime) {
        childItem.isDynamicTime = childItem.isDynamicTime === 2 ? 1 : 2
      } else {
        this.$set(childItem, 'isDynamicTime', 2)
      }
    },
    getDefaultOperator () {
      return '='
    },
    onSubmit () {
      this.$service
        .getTagAttr({
          tagId: this.currentChildItem.tagId,
          pageSize: this.initPageSize,
          pageNum: 1,
          attrName: this.formInline.attrName
        })
        .then(data => {
          this.tagList = data.pageInfo.list
          this.tagsListTotal = data.pageInfo.total
        })
    },
    handleSelectMore (child) {
      // this.checkboxValue = ''
      this.formInline.attrName = ''
      this.currentChildItem = child
      this.checkboxValue = this.currentChildItem.tagType === 'string' && Array.isArray(this.currentChildItem.value) ? this.currentChildItem.value : ''
      this.$service
        .getTagAttr({
          tagId: child.tagId,
          pageSize: this.initPageSize,
          pageNum: this.initCurrentPage
        })
        .then(data => {
          this.showMoreTags = true
          this.tagList = data.pageInfo.list
          this.tagsListTotal = data.pageInfo.total
        })
    },
    // 获取组合标签列表
    fetchSpecialTagSuggestions (tagId, tagKey) {
      const filter = {
        tagId,
        pageSize: 200,
        isSelect: 1
      }
      this.$service.specialTagDetailList(filter).then(data => {
        const list = data.list.map(item => {
          return {
            attrId: item.specialTagId,
            attrName: item.specialTagName,
            attrValue:
              tagKey === 'mix_area' ? item.specialTagId : item.specialTagName,
            // attrValue: item.specialTagName,
            dataSource: 7,
            rulesJson: item.rulesJson
          }
        })
        this.$set(this.cache, tagId, {
          select: false,
          list
        })
      })
    },
    fetchTagSuggestions (tagId) {
      this.$service
        // .getTagAttr({ tagId: tagId, pageSize: this.tagInitSize, pageNum: 1 })
        .getTagAttr({ tagId: tagId, pageNum: 1 })
        .then(data => {
          let list = data.pageInfo.list
          if (data.info && data.info.length > 0) {
            list = data.info
          }
          this.$set(this.cache, tagId, {
            select: data.select,
            list: list
          })
        })
    },
    handleRemoveRule (rule, childRule) {
      const rulesJson = this.rulesJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)

      // 普通标签中的流转指标不做下面的处理
      // 保存所选标签的tagID
      if (childRule.dataSource !== 20) {
        const tagIds = []
        rulesJson.rules.forEach(e => {
          e.rules.forEach(n => {
            if (!tagIds.includes(n.tagId)) {
              tagIds.push(n.tagId)
            }
          })
        })
        if (this.crowd && this.crowd.rulesJson) this.crowd.tagIds = tagIds
      }

      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },
    handleRemoveSpecialRule (rule, childRule) {
      const rulesJson = this.dynamicPolicyJson
      rule.rules.splice(rule.rules.indexOf(childRule), 1)
      if (rule.rules.length === 0) {
        rulesJson.rules = rulesJson.rules.filter(function (item) {
          return item !== rule
        })
      }
    },
    handleAddCirRule (tag) {
      this.rulesJson.rules.push({
        condition: 'AND',
        rules: [{
          ...tag,
          operator: '>',
          sourceSign: '',
          value: '',
          tagCode: ''
        }]
      })
    },
    handleAddCirChildRule (rule, tag) {
      rule.rules.push({
        ...tag,
        operator: '>',
        sourceSign: '',
        value: '',
        tagCode: ''
      })
    },
    /* 添加一级标签 */
    /**
     * tag 为标签
     */
    handleAddRule (tag) {
      // 动态指标标签
      if (tag.dataSource === 20) {
        this.handleAddCirRule(tag)
        return
      }
      this.showHitTip = false // 关闭新手指引 - 点击提示

      if (this.rulesJson.rules.length > 50) {
        this.$message({
          type: 'error',
          message: '已达最大数量'
        })
        return
      }

      // 判断复合人群下人群标签不可超过 30 个
      const num = this.rulesJson.rules.reduce((num, item, index) => {
        item.rules.forEach((obj) => {
          if (obj.dataSource === 12) {
            num++
          }
        })
        return num
      }, 0)
      console.log('复合人群下使用人群标签數量-->', num)
      if (num >= 30) {
        this.$message({
          type: 'error',
          message: '复合人群下使用人群标签不可超过 30 个'
        })
        return
      }

      if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
        this.crowd.tagIds.push(tag.tagId)
      }
      if (tag.tagType === 'string' || tag.tagType === 'collect') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchTagSuggestions(tag.tagId)
        }
      } else if (tag.tagType === 'mix') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
        }
      }

      // eslint-disable-next-line vue/no-mutating-props
      this.rulesJson.rules.push({
        condition: 'AND',
        rules: [
          {
            version: 2,
            operator:
              tag.tagType === 'time' ? 'between' : this.getDefaultOperator('='),
            tagCode: tag.tagKey,
            tagName: tag.tagName,
            dataSource: tag.dataSource,
            value: tag.tagType === 'time' || tag.tagType === 'crowd' ? '-' : '',
            tagId: tag.tagId,
            tagType: tag.tagType,
            categoryName: tag.tagName,
            categoryCode: tag.tagKey,
            dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
            isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
            thirdPartyCode: tag.thirdPartyCode,
            thirdPartyField: tag.thirdPartyField,
            dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
            startDay:
              tag.tagType === 'time'
                ? tag.startDay
                  ? tag.startDay
                  : ''
                : undefined,
            endDay:
              tag.tagType === 'time'
                ? tag.endDay
                  ? tag.endDay
                  : ''
                : undefined,
            initValue: tag.initValue,
            specialCondition:
              tag.tagType === 'mix'
                ? tag.rulesJson
                  ? tag.rulesJson
                  : ''
                : undefined,
            subTag: tag.dataSource === 13 ? '' : undefined
          }
        ]
      })
    },
    handleAddChildRule (rule, tag) {
      // 动态指标标签
      if (tag.dataSource === 20) {
        this.handleAddCirChildRule(rule, tag)
        return
      }
      if (rule.rules.length >= 50) {
        this.$message({
          type: 'error',
          message: '已达最大数量'
        })
        return
      }

      // 判断复合人群下人群标签不可超过 30 个
      const num = this.rulesJson.rules.reduce((num, item, index) => {
        item.rules.forEach((obj) => {
          if (obj.dataSource === 12) {
            num++
          }
        })
        return num
      }, 0)
      console.log('复合人群下使用人群标签數量-->', num)
      if (num >= 30) {
        this.$message({
          type: 'error',
          message: '复合人群下使用人群标签不可超过 30 个'
        })
        return
      }

      if (tag.tagType === 'string' || tag.tagType === 'collect') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchTagSuggestions(tag.tagId)
        }
      } else if (tag.tagType === 'mix') {
        if (this.cache[tag.tagId] === undefined) {
          this.fetchSpecialTagSuggestions(tag.tagId, tag.tagKey)
        }
      }
      if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
        this.crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        version: 2,
        operator:
          tag.tagType === 'time' ? 'between' : this.getDefaultOperator('='),
        tagCode: tag.tagKey,
        tagName: tag.tagName,
        dataSource: tag.dataSource,
        value: tag.tagType === 'time' || tag.tagType === 'crowd' ? '-' : '',
        tagId: tag.tagId,
        tagType: tag.tagType,
        categoryName: tag.tagName,
        categoryCode: tag.tagKey,
        dynamicTimeType: tag.dynamicTimeType ? tag.dynamicTimeType : 1,
        isDynamicTime: tag.isDynamicTime ? tag.isDynamicTime : 3,
        thirdPartyCode: tag.thirdPartyCode,
        thirdPartyField: tag.thirdPartyField,
        dateAreaType: tag.dateAreaType ? tag.dateAreaType : 0,
        startDay:
          tag.tagType === 'time'
            ? tag.startDay
              ? tag.startDay
              : ''
            : undefined,
        endDay:
          tag.tagType === 'time' ? (tag.endDay ? tag.endDay : '') : undefined,
        initValue: tag.initValue,
        specialCondition: '',
        subTag: tag.dataSource === 13 ? '' : undefined
      })
    },
    handleAddSpecialRule (tag) {
      if (this.dynamicPolicyJson.rules.length >= 50) {
        this.$message.warning('已达最大数量')
        return
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.dynamicPolicyJson.rules.push({
        condition: 'AND',
        rules: [
          {
            operator: '=',
            tagCode: tag.tagKey,
            tagName: tag.tagName,
            dataSource: tag.dataSource,
            value: '',
            tagId: tag.tagId,
            tagType: tag.tagType,
            categoryName: tag.tagName,
            categoryCode: tag.tagKey,
            dynamic: {
              type: 1,
              version: ''
            },
            initValue: tag.initValue
          }
        ]
      })
    },
    handleAddSpecialChildRule (rule, tag) {
      if (rule.rules.length > 50) {
        this.$message.warning('已达最大数量')
        return
      }
      if (this.crowd && !this.crowd.tagIds.includes(tag.tagId)) {
        this.crowd.tagIds.push(tag.tagId)
      }
      rule.rules.push({
        operator: '=',
        tagCode: tag.tagKey,
        tagName: tag.tagName,
        dataSource: tag.dataSource,
        value: '',
        tagId: tag.tagId,
        tagType: tag.tagType,
        categoryName: tag.tagName,
        categoryCode: tag.tagKey,
        dynamic: {
          type: 1,
          version: ''
        },
        initValue: tag.initValue
      })
    },
    // 数组去重
    distinct (a, b) {
      const arr = a.concat(b)
      const result = []
      const obj = {}
      for (const i of arr) {
        if (!obj[i]) {
          result.push(i)
          obj[i] = 1
        }
      }
      return result
    },
    checkNum (num) {
      if (/(^\d+$)/.test(num)) {
        return true
      } else {
        this.$message.error('该值为必填项，且必须是大于等于0整数')
        return false
      }
    },
    checkNumMostFour (num) {
      // const numInt = parseInt(num)
      // if (/(^\d+$)/.test(num) && numInt <= 9999) {
      //   return true
      // } else {
      //   this.$message.error(
      //     '该值为必填项，且必须是大于等于0整数且不能超过4位数'
      //   )
      //   return false
      // }
      return true
    },
    bigNum (item) {
      const startDay = item.startDay ? item.startDay : '@'
      const endDay = item.endDay ? item.endDay : '@'
      if (this.checkNumMostFour(endDay)) {
        if (parseInt(startDay) > parseInt(endDay)) {
          this.$message.error('第二个值不能小于第一个值')
        } else if (item.version > 0) { // 二期之后的版本
          item.value = startDay + '~' + endDay
        } else {
          item.value = startDay + '-' + endDay
        }
      } else {
        item.value = ''
      }
    },
    handleOperatorChange (item) {
      if (item.tagType === 'string' && item.operator === 'null') {
        item.value = 'nil'
      } else if (item.tagType === 'string') { // string 类型的标签可多选 value值是数组
        item.value = []
      } else if (item.tagType === 'crowd') { // crowd value值固定为 '-'
        item.value = '-'
      } else {
        item.value = ''
      }
    },
    handleRulesConditionChange (item) {
      item.condition = item.condition === 'AND' ? 'OR' : 'AND'
    },
    fetchAllTagSuggestions () {
      const ruleJsonData = this.rulesJson || this.dynamicPolicyJson || []
      if (ruleJsonData.rules.length > 0) {
        // 编辑
        this.showHitTip = false // 关闭新手指引 - 点击提示

        let cacheIds = []
        const cacheSpecialIds = []
        ruleJsonData.rules.forEach(itemParent => {
          itemParent.rules.forEach(item => {
            if (item.tagType === 'string' || item.tagType === 'collect') {
              cacheIds.push(item.tagId)
            }
            if (item.tagType === 'mix') {
              cacheSpecialIds.push({
                tagId: item.tagId,
                tagCode: item.tagCode,
                provinceValue: item.provinceValue
              })
            }
            if (item.tagType === 'string' && item.value === 'nil') {
              item.operator = 'null'
            }
            if (item.version === 0) { // 一期
              if (item.tagType === 'time' && item.isDynamicTime === 3) {
                const value = item.value.split('-')
                this.$set(item, 'startDay', value[0])
                this.$set(item, 'endDay', value[1])
              } else if (item.tagType === 'time' && item.isDynamicTime !== 3) {
                this.$set(item, 'dateAreaType', '')
                this.$set(item, 'dynamicTimeType', parseInt(item.dynamicTimeType))
              }
            }
          })
          // return itemParent
        })
        // this.rulesJson = ruleJsonData
        // if (policyData.dynamicPolicyJson) {
        //   this.dynamicPolicyJson = JSON.parse(policyData.dynamicPolicyJson)
        // }
        cacheIds = this.distinct(cacheIds, [])
        if (cacheIds.length !== 0) {
          cacheIds.forEach(this.fetchTagSuggestions)
        }
        // 组合标签的 id 集合
        if (cacheSpecialIds.length !== 0) {
          cacheSpecialIds.forEach(item => {
            this.fetchSpecialTagSuggestions(item.tagId, item.tagCode)
            this.areaSelectChange(item.provinceValue, item.tagCode) // 根据省id获取市列表
          })
        }
      }
    }
  }
}
</script>
<style scoped  lang="stylus">
.el-collapse_item >>> .el-collapse-item__header {
  padding-left: 10px;
  background-color: rgba(249, 249, 249, 0.85);
}

.el-collapse_item >>> .el-collapse-item {
  display: inline-block;
  width: 100%;
  margin-right: 10px;
}

.el-icon-remove-outline {
  width: 20px;
  height: 20px;
}

.el-collapse {
  border-top: none;
  border-bottom: none;
}

.multipleSelect {
  >>>.el-select {
    width: 100%;
  }
}

.mix-area-select {
  >>>.el-select {
    width: 50%;
  }
}

.label-ground {
  border: 1px dashed #ccc;
  padding: 10px;
  margin: 10px 0;
}

.label-item {
  display: flex;
  position: relative;
}

.paddingTop {
  padding-top: 50px;
}

.label-item .and {
  position: absolute;
  top: 5px;
  left: 260px;
  width: 40px;
  height: 40px;
}

.label-item .txt, .label-item .sel {
  width: 150px;
}

.label-item .txt {
  margin-right: 20px;
  text-align: right;
  flex-shrink: 0;
}

.label-item .in {
  min-width: 250px;
}

.label-item span, .oc-item {
  margin-right: 10px;
}

.label-add {
  margin-top: 10px;
}

.label-add >>> span {
  cursor: pointer;
}

.label-or >>> span {
  cursor: pointer;
}

i {
  cursor: pointer;
}

.label-item .time-dot-select {
  width: 120px;
}

.label-item .time-dot-input {
  display: inline-block;
  width: 80px;
  margin: 0 7px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}

.pagination {
  float: right;
}

.showMoreTags >>> .el-radio {
  margin: 5px;
}

.label-item .time-dot-select-new {
  width: 90px;
}

.outer-and {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: 0;
  width: 3px;
  height: auto;
  margin: auto 10px;
  border: 1px dashed red;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-item {
  display: flex;
  margin-right: 10px;

  div+div {
    margin-left: 10px;
  }
}

.tag-condition--parent {
  position: relative;
  z-index: 1;
}

.tag-condition {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 3px;
  left: -17px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #E6A23C;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-container {
  position: relative;
  z-index: 1;
}

.label-or-space {
  position: absolute;
  top: 10px;
  right: 0;
  bottom: 5px;
  left: -40px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #67C23A;
  border-right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.behavior-label {
  white-space: nowrap;
  overflow-x: auto;
  display: flex
}
.w100 {
  min-width: 100px;
}
.flexColumn {
  display: flex;
  flex-direction: column;
}
.flexRow {
  display: flex;
  flex-direction: row;
}

</style>
