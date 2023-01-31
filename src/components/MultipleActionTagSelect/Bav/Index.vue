/* eslint-disable no-mixed-operators */
<template>

  <el-form :model="childItem" ref="bav" :rules="bavFormRules" :inline="true" :disabled="isView">
    <!-- {{_this}} -->
    <div class="bav-attr-warp">

      <el-tag class="oc-item" :type="dataSourceColorEnum[childItem.dataSource]">
        {{ childItem.tagName }} - {{ childItem.tagCode }}
      </el-tag>

      <!-- 会员状态 -->
      <span class="flex-column" v-if="childItem.tagCode === 'BAV0001'">
        <div class="flex-row">
            <!-- 新增一级 -->
          <el-form-item prop="bav.value">
            <el-select
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange()"
            >
              <template v-for="item in getBehaviorAttrList(1)">
                <el-option
                  :value="item.value"
                  :label="item.name"
                  :key="item.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <template v-if="childItem.bav.value !== '有效会员' && childItem.bav.value !== '无效会员'">
          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-column"
          >
            <!-- {{ item }} -->
            <!-- 第二级 -->
            <el-form-item
              :prop="`bav.behaviorValue[${index}].childCheckedVal`"
              :rules="{ required: true, message: '请选择', trigger: 'change' }"
            >
              <el-select
                multiple
                v-model="item.childCheckedVal"
                style="width: 120px"
                name="oxve"
                class="input-inline"
                filterable
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                  isValueClear: false,
                  extra: {type: childItem.bav.value}
                })"
              >

                  <el-option
                    v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})"
                    :value="attrChildItem.value"
                    :label="attrChildItem.name"
                    :key="attrChildItem.value"
                  ></el-option>

              </el-select>
            </el-form-item>

            <div class="flex-column">

              <ConditionLine :isShow="item.child.length > 1"></ConditionLine>

              <div
                v-for="(item2, index2) in item.child"
                :key="item2.value"
                class="flex-row child-attr-wrap"
              >

                <span class="w100">{{ item2.name }}</span>
                <span class="flex-row" v-if="item2.name !== '有效会员' && item2.name !== '无效会员'">
                  <!-- 第三级 -->
                  <el-form-item
                    :prop="`bav.behaviorValue[${index}].child[${index2}].childCheckedVal`"
                    :rules="{required: true, message: '请选择', trigger: 'change' }"
                  >
                    <el-select
                      v-model="item2.childCheckedVal"
                      style="width: 150px"
                      name="asdq"
                      class="input-inline"
                      @change="handelChildBehavirSelectChange({
                        childItem: item2,
                        hasChild: true,
                        extra: {type: childItem.bav.value},
                        level: 3,
                        selectPropKeyValue: 'selectKey'
                      })"
                    >
                      <template v-for="attrChildItem in getBehaviorAttrList(3, {type: childItem.bav.value} )">
                        <el-option
                          :value="attrChildItem.selectKey"
                          :label="attrChildItem.name"
                          :key="attrChildItem.selectKey"
                        >
                        </el-option>
                      </template>
                    </el-select>
                  </el-form-item>

                  <!-- <span class="flex-row"> -->
                  <!-- <span class="w100">{{ item.label }}</span> -->
                  <!-- {{item.child}} -->
                  <!-- {{ item2.childCheckedVal }} -->
                  <!-- 第四级 -->
                  <!-- 有效 Vip 、无效 Vip -->
                  <span v-if="item2.childCheckedVal === 'effective' || item2.childCheckedVal === 'no_effective'">
                    <span
                      v-for="(item3, index2) in item2.child"
                      :key="'typeInputValue' + index2"
                      class="flex-column"
                    >
                      <el-select
                        multiple
                        v-model="item3.childCheckedVal"
                        style="width: 200px"
                        name="asdq"
                        class="input-inline"
                        @change="handelChildBehavirSelectChange({
                          childItem: item3,
                          hasChild: false,
                          level: 4,
                          extra: {extra: item2.childCheckedVal}
                        })"
                      >
                        <template v-for="attrChildItem in getBehaviorAttrList(4, {extra: item2.childCheckedVal})">
                          <el-option
                            :value="attrChildItem.value"
                            :label="attrChildItem.name"
                            :key="attrChildItem.value + attrChildItem.name"
                          >
                          </el-option>
                        </template>
                      </el-select>
                      <div
                        v-for="(item4, index2) in item3.child"
                        :key="'typeInputValue' + index2"
                        class="flex-row"
                      >
                        <div v-if="item4.name.indexOf('自定义') > -1" class="flex-row">
                          <span style="min-width: 200px;">{{ item4.name }}</span>
                          <el-input-number :value="item4.value1" :min="1" @input="handelInputBetween($event, item4, 'value1')" @blur="handelInputBlur(item4)" controls-position="right"></el-input-number>
                          <div style="padding: 0 10px"><= {{ item4.name.substr(-4, 4) }} <=</div>
                          <el-input-number :value="item4.value2" :min="1" @input="handelInputBetween($event, item4, 'value2')" @blur="handelInputBlur(item4)" controls-position="right"></el-input-number>天
                        </div>
                      </div>

                    <!-- {{item3.child}} -->
                    </span>
                  </span>
                  <!-- 买过单点 -->
                  <span v-else-if="item2.childCheckedVal === 'paid_single'">
                    <span
                      v-for="(item3, index2) in item2.child"
                      :key="'typeInputValue' + index2"
                      class="flex-row"
                    >
                    <!-- {{item2}} -->
                      <!-- 次数、天数 -->
                      <Type ref="typeRef" :item3="item3.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          </template>
        </div>
      </span>

      <!-- 应用活跃 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0002'">
        <!-- 第一级 -->
        <el-form-item prop="bav.value">
          <el-select
            multiple
            v-model="childItem.bav.value"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            @change="handelBehavirSelectChange()"
          >
            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <div class="flex-column">
          <ConditionLine :isShow="childItem.bav.behaviorValue.length > 1"></ConditionLine>
          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-row child-attr-wrap"
          >
            <span class="w100">{{ item.name }}</span>
            <!-- 二期新增字段：第二级 -->
            <el-form-item
              :prop="`bav.behaviorValue[${index}].childCheckedVal`"
              :rules="{ required: true, message: '请选择', trigger: 'change' }"
            >
              <el-select
                v-model="item.childCheckedVal"
                style="width: 120px"
                name="oxve"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                  extra: {levelOneValue: item.value}
                })"
              >
                <template v-for="item in getBehaviorAttrList(2)">
                  <el-option
                    :value="item.value"
                    :label="item.name"
                    :key="item.value"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <span
              v-for="(item2, index2) in item.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >

              <span class="flex-column">
                <div class="flex-row">
                  <!-- 第三级 -->
                  <el-select
                    multiple
                    v-model="item2.childCheckedVal"
                    style="width: 110px"
                    name="asdq"
                    class="input-inline"
                    @change="handelChildBehavirSelectChange({
                      childItem: item2,
                      level: 3,
                      extra: {type: item.childCheckedVal, levelOneValue: item.value },
                      reverseSelectAttr: true
                    })"
                  >
                    <template v-for="attrChildItem in getBehaviorAttrList(3, {type: item.childCheckedVal})">
                      <el-option
                        :value="attrChildItem.value"
                        :label="attrChildItem.name"
                        :key="attrChildItem.value"
                      >
                      </el-option>
                    </template>
                  </el-select>

                </div>
                <div class="flex-column">
                  <!-- {{ item2.child }}
                  {{ item2.childCheckedVal }} -->
                  <ConditionLine :isShow="item2.child && item2.child.length > 1"></ConditionLine>
                  <span
                    v-for="(item3, index) in item2.child"
                    :key="index"
                    class="flex-row child"
                  >
                    <span class="w100">{{ item3.name }}</span>
                    <!-- 第三级 -->
                    <span
                      v-for="(item4, index2) in item3.child"
                      :key="'appid' + index2"
                    >
                      <!-- 仅当选择【安装应用】后可输入应用版本号，为可选项 -->
                      <span v-if="item.value === '安装'" class="flex-row">
                        <el-input
                          placeholder="应用版本号（可选）"
                          v-model="item4.value"
                          clearable
                          style="max-width: 155px; min-width: 155px;"
                        >
                        </el-input>
                        <!-- 第四级 -->
                        <!-- {{item4}} -->
                        <span
                          v-for="(item5, index3) in item4.child"
                          :key="'typeInputValue' + index3"
                          class="flex-row"
                        >
                          <!-- {{item4}} -->
                          <!-- 次数、天数 -->
                          <!-- 选择【激活】时，不展示次数天数 -->
                          <!-- 应用活跃可以不填写次数天数 -->
                          <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item5" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem" :isRequired="false"></Type>
                        </span>
                      </span>

                      <span v-else class="flex-row">
                        <!-- 次数、天数 -->
                        <!-- 选择【激活】时，不展示次数天数 -->
                        <!-- 应用活跃可以不填写次数天数 -->
                        <Type v-if="item.value !== '激活' && !childItem.bav.reverseSelect" ref="typeRef" :item3="item4" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem" :isRequired="false"></Type>
                      </span>

                    </span>
                  </span>
                </div>
              </span>
              <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect($event, item2.child)"
              >
                圈出未活跃
              </el-checkbox>
            </span>

          </div>
        </div>
      </span>

      <!-- 购买行为 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0003'">
        <div class="flex-row">
          <!-- 新增一级 -->
          <el-form-item prop="bav.value">
            <el-select
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange()"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(1)">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-column"
          >
            <!-- 第二级 -->
              <!-- @change="handelBehavirSelectChange(false, 2, [], 'field')" -->
            <el-form-item
              :prop="`bav.behaviorValue[${index}].childCheckedVal`"
              :rules="{ required: true, message: '请选择', trigger: 'change' }"
            >
              <el-select
                multiple
                v-model="item.childCheckedVal"
                style="width: 120px"
                name="oxve"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                  selectPropKeyValue: 'field'
                })"
              >
                <template v-for="item in getBehaviorAttrList(2)">
                  <el-option
                    :value="item.field"
                    :label="item.name"
                    :key="item.field"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>

            <div class="flex-column">
              <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
              <div
                v-for="(item2, index2) in item.child"
                :key="item2.value + item2.name"
                class="flex-row child-attr-wrap"
              >
                <span class="w100">{{ item2.name }}</span>
                <span class="flex-column">
                  <!-- 第3级 -->
                  <!-- {{ item }} -->
                  <!-- @change="handelChildBehavirSelectChange(item, true, childItem, 2)" -->
                  <div>
                    <el-form-item
                      :prop="`bav.behaviorValue[${index}].child[${index2}].childCheckedVal`"
                      :rules="{required: true, message: '请选择', trigger: 'change' }"
                    >
                    <el-select
                      multiple
                      v-model="item2.childCheckedVal"
                      style="width: 110px"
                      name="asdq"
                      class="input-inline"
                      filterable
                      @change="handelChildBehavirSelectChange({
                        childItem: item2,
                        hasChild: false,
                        level: 3,
                        extra: {type: childItem.bav.value},
                        reverseSelectAttr: item2.field === 'purchase_recent_two_years' ? true : false
                      })"
                    >
                      <template v-for="attrChildItem in getBehaviorAttrList(3, {type: childItem.bav.value})">
                        <el-option
                          :value="attrChildItem.value"
                          :label="attrChildItem.name"
                          :key="attrChildItem.value"
                        >
                        </el-option>
                      </template>
                    </el-select>
                    </el-form-item>

                    <!-- 历史购买才有反选 -->
                    <!-- <el-checkbox
                      v-if="item2.field === 'purchase_recent_two_years'"
                      class="reverse-check"
                      v-model="childItem.bav.reverseSelect"
                      @change="ReverseSelect($event, item2.child)"
                    >
                      圈出未购买
                    </el-checkbox> -->
                  </div>

                  <!-- {{ item.childCheckedVal }} -->
                  <div class="flex-column">
                    <ConditionLine :isShow="item2.child.length > 1"></ConditionLine>
                    <span
                      v-for="(item3, index3) in item2.child"
                      :key="index3"
                      class="flex-row"
                    >
                    <!-- {{item2}} -->
                      <span class="flex-row">
                        <span class="w100">{{ item3.name }}</span>
                        <!-- v-if="item2.field === 'purchase_recent_two_years'" -->
                        <span  class="flex-column">
                          <!-- 第4级 -->
                          <el-form-item
                            :prop="`bav.behaviorValue[${index}].child[${index2}].child[${index3}].childCheckedVal`"
                            :rules="{ required: true, message: '请选择', trigger: 'change' }"
                          >
                            <el-select
                              :multiple="typeof(item3.childCheckedVal) === 'object'"
                              v-model="item3.childCheckedVal"
                              style="width: 110px"
                              name="asdq"
                              class="input-inline"
                              @change="handelChildBehavirSelectChange({
                                childItem: item3,
                                hasChild: false,
                                level: 4
                              })"
                            >
                              <template v-for="attrChildItem in getBehaviorAttrList(4)">
                                <el-option
                                  :value="attrChildItem.value"
                                  :label="attrChildItem.name"
                                  :key="attrChildItem.value"
                                >
                                </el-option>
                              </template>
                            </el-select>

                            <!-- 历史购买才有反选 -->
                            <el-checkbox
                              v-if="item2.field === 'purchase_recent_two_years'"
                              class="reverse-check"
                              v-model="childItem.bav.reverseSelect"
                              @change="ReverseSelect"
                            >
                              圈出未购买
                            </el-checkbox>

                          </el-form-item>
                          <div class="flex-column" v-if="!childItem.bav.reverseSelect">
                            <ConditionLine :isShow="item3.child.length > 1"></ConditionLine>
                            <span
                              v-for="(item4, index2) in item3.child"
                              :key="'typeInputValue' + index2"
                              class="flex-column"
                            >
                              <!-- 第5级 -->
                              <span class="flex-row">
                                <span class="w100">{{ item4.name }}</span>
                                <el-select
                                  v-model="item4.childCheckedVal"
                                  style="width: 150px"
                                  name="asdq"
                                  class="input-inline"
                                  @change="handelChildBehavirSelectChange({
                                    childItem: item4,
                                    hasChild: false,
                                    level: 5
                                  })"
                                >
                                  <template v-for="attrChildItem in getBehaviorAttrList(5)">
                                    <el-option
                                      :value="attrChildItem.value"
                                      :label="attrChildItem.name"
                                      :key="attrChildItem.value"
                                    >
                                    </el-option>
                                  </template>
                                </el-select>
                                <span >
                                  <span
                                    v-for="(item5, index) in item4.child"
                                    :key="index"
                                    class="flex-row"
                                  >
                                    <!-- 兼容二期之前的数据格式 -->
                                    <Type v-if="!childItem.bav.reverseSelect && item5.type === 'count'" ref="typeRef" :item3="item5" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>

                                    <!-- 三期最新的格式 -->
                                    <span class="flex-row" v-else>
                                      <!-- {{item5}} -->

                                      <!-- {{item2.field === 'purchase_recent_two_years'}} -->
                                      <!-- 价格区间 -->
                                      <span v-if="item4.childCheckedVal == 1" class="flex-row" style="width: 300px; height: 31px">
                                        <el-input-number :value="item5.value1" :min="1" :max="5000" @input="handelInputBetween($event, item5, 'value1')" @blur="handelInputBlur(item5)" controls-position="right"></el-input-number>
                                      ~ <el-input-number :value="item5.value2" :min="1" :max="5000" @input="handelInputBetween($event, item5, 'value2')" @blur="handelInputBlur(item5)" controls-position="right"></el-input-number>
                                      </span>

                                      <!-- 产品包ID -->
                                      <span v-if="item4.childCheckedVal == 2" class="flex-row" style="min-width: 150px">
                                        <el-select
                                          v-model="item5.value"
                                          style="width: 150px"
                                          filterable
                                          remote
                                          placeholder="请输入产品包ID"
                                          clearable
                                          :remote-method="(query) => {  GouMaiRemoteMethod(query, childItem.bav.value) }"
                                          :loading="loading">
                                          <el-option
                                            v-for="(op, index) in gouMaiPackageIdOptions"
                                            :key="'package' + op.vipId + index"
                                            :label="op.vipId"
                                            :value="op.vipId">
                                          </el-option>
                                        </el-select>
                                      </span>

                                      <span v-if="item2.field === 'purchase_recent_two_years'"> <!-- 历史购买才有选择次数 -->
                                        <!-- 次数、天数 -->
                                        <Type v-if="!childItem.bav.reverseSelect && item5.child" ref="typeRef" :item3="item5.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>
                                        <!-- <Type v-if="!childItem.bav.reverseSelect && item5.child" ref="typeRef" :item3="item5.child" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type> -->
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </div>
                        </span>

                        <!-- <span v-else-if="item2.field !== 'purchase_recent_two_years'" class="flex-column">
                          <el-select
                            v-model="item3.childCheckedVal"
                            style="width: 110px"
                            name="asdq"
                            class="input-inline"
                            @change="handelChildBehavirSelectChange({
                              childItem: item3,
                              hasChild: false,
                              level: 4
                            })"
                          >
                            <template v-for="attrChildItem in getBehaviorAttrList(4)">
                              <el-option
                                :value="attrChildItem.value"
                                :label="attrChildItem.name"
                                :key="attrChildItem.value"
                              >
                              </el-option>
                            </template>
                          </el-select>
                        </span> -->
                      </span>
                    </span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </span>

      <!-- 模块活跃 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0004'">
        <div class="flex-row">
          <!-- 新增一级 -->
          <el-form-item prop="bav.value">
            <el-select
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange()"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(1)">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>

          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-column"
          >
              <!-- @change="handelBehavirSelectChange(false, 1, moDefaultChild, 'selectKey', true)" -->
            <div>
            <!-- 第二级 -->
              <el-form-item
                :prop="`bav.behaviorValue[${index}].childCheckedVal`"
                :rules="{required: true, message: '请选择', trigger: 'change' }"
              >
              <el-select
                multiple
                v-model="item.childCheckedVal"
                style="width: 100px"
                name="oxve"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                  defaultChild: moDefaultChild,
                  selectPropKeyValue: 'selectKey',
                  isValueClear: true,
                  reverseSelectAttr: true
                })"
              >
                <template v-for="item in getBehaviorAttrList(2)">
                  <el-option
                    :value="item.selectKey"
                    :label="item.name"
                    :key="item.selectKey"
                  ></el-option>
                </template>
              </el-select>

              </el-form-item>
              <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect($event, item.child)"
              >
                圈出未活跃
              </el-checkbox>
            </div>
            <div class="flex-column">
              <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
              <div
                v-for="(item2, index2) in item.child"
                :key="'mo' + index2"
                class="flex-row child-attr-wrap"
              >
                <!-- {{ item2 }} -->
                <span class="w100">{{ item2.name }}</span>
                <!-- {{item}} -->
                <span class="flex-row">
                    <!-- 推荐位、板块位 -->
                    <el-form-item
                      :prop="`bav.behaviorValue[${index}].child[${index2}].value`"
                      :rules="{ required: true, message: '必填', trigger: 'change' }"
                    >
                    <el-select
                      v-if="item2.field === 'album_id'"
                      v-model="item2.value"
                      style="width: 150px"
                      filterable
                      remote
                      placeholder="请输入板块ID"
                      no-data-text="不支持该ID"
                      clearable
                      :remote-method="(query) => { remoteMethod(query, item2.field, childItem.bav.value) }"
                      :loading="loading">
                      <el-option
                        v-for="(item2, index) in moOptions['album_id']"
                        :key="'album_id' + item2.albumId + index"
                        :label="item2.albumName + '(' + item2.albumId + ')'"
                        :value="item2.albumId">
                      </el-option>
                    </el-select>

                    <!-- 版面 -->
                    <el-select
                      v-else
                      v-model="item2.value"
                      style="width: 150px"
                      filterable
                      remote
                      placeholder="请输入版面ID"
                      no-data-text="不支持该ID"
                      clearable
                      :remote-method="(query) => { remoteMethod(query, item2.field, childItem.bav.value) }"
                      :loading="loading">
                      <el-option
                        v-for="(item2, index) in moOptions['forum_id']"
                        :key="'forum_id' + item2.forumId + index"
                        :label="(item2.forumName ? item2.forumName : '') + '(' + item2.forumId + ')'"
                        :value="item2.forumId">
                      </el-option>

                    </el-select>
                    </el-form-item>

                    <!-- 推荐位 -->
                    <span v-if="item2.selectKey === 'album_id1'">
                      <span class="flex-row child">
                        <!-- 次数、天数 -->
                        <!-- {{ item2.selectKey }} -->
                        <el-select
                          v-model="item2.childCheckedVal"
                          style="width: 100px"
                          name="oxve"
                          class="input-inline"
                          @change="handelChildBehavirSelectChange({
                            childItem: item2,
                            hasChild: true,
                            level: 4
                          })"
                        >
                          <template v-for="attrChildItem in getBehaviorAttrList(4)">
                            <el-option
                              :value="attrChildItem.value"
                              :label="attrChildItem.name"
                              :key="attrChildItem.value"
                            ></el-option>
                          </template>
                        </el-select>
                        <span
                          v-for="(item3, index) in item2.child[0].child"
                          :key="index"
                          class="flex-row child"
                        >
                          <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      <span
                        v-for="(item3, index) in item2.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      </span>
                    </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </span>

      <!-- 页面活跃 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0005'">
        <!-- 第一级 -->
        <div>
          <el-form-item prop="bav.value">
            <el-select
              multiple
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange({
                hasChild: true,
                reverseSelectAttr: true
              })"
            >
              <template v-for="item in getBehaviorAttrList()">
                <el-option
                  :value="item.value"
                  :label="item.name"
                  :key="item.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>

          <el-checkbox
            class="reverse-check"
            v-model="childItem.bav.reverseSelect"
            @change="ReverseSelect($event, childItem.bav.behaviorValue)"
          >
            圈出未活跃
          </el-checkbox>
        </div>
        <div class="flex-column">
          <ConditionLine :isShow="childItem.bav.behaviorValue.length > 1"></ConditionLine>
          <div
            v-for="item in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-row child-attr-wrap"
          >
            <span class="w100">{{ item.name }}</span>
            <span class="flex-column">
              <!-- 第二级 -->
              <span
                v-for="(item2, index) in item.child"
                :key="index"
                class="flex-row child"
              >
                <!-- 次数、天数 -->
                <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item2" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
              </span>
            </span>
          </div>
        </div>
      </span>

      <!-- 功能使用 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0006'">
        <div class="flex-row">
          <el-form-item prop="bav.value">
            <!-- 新增一级 -->
            <el-select
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange()"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(1)">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>

          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-column"
          >
            <!-- 第二级 -->
                <!-- @change="handelBehavirSelectChange(true)" -->
            <div>
              <el-form-item
                :prop="`bav.behaviorValue[${index}].childCheckedVal`"
                :rules="{required: true, message: '请选择', trigger: 'change'}"
              >
                <el-select
                  multiple
                  v-model="item.childCheckedVal"
                  style="width: 120px"
                  name="oxve"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange({
                    childItem: item,
                    hasChild: childItem.bav.value === '电竞' ? false : true,
                    level: 2,
                    extra: {type: childItem.bav.value},
                    reverseSelectAttr: true,
                  })"
                >
                    <!-- defaultChild: BAV0006DefaultChild -->
                  <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})">
                    <el-option
                      :value="attrChildItem.value"
                      :label="attrChildItem.name"
                      :key="attrChildItem.value"
                    ></el-option>
                  </template>
                </el-select>
              </el-form-item>

            </div>
            <div class="flex-column">
              <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
              <div
                v-for="item2 in item.child"
                :key="item2.value"
                class="flex-row child-attr-wrap"
              >
                <span class="w100">{{ item2.name }}</span>
                <span class="flex-row" v-if="childItem.bav.value === '电竞'">
                    <!-- 第三级 -->
                    <el-select
                      v-model="item2.childCheckedVal"
                      style="width: 120px"
                      name="oxve"
                      class="input-inline"
                      @change="handelChildBehavirSelectChange({
                        childItem: item2,
                        hasChild: false,
                        level: 3,
                      })"
                    >
                      <template v-for="(attrChildItem, attrIndex) in getBehaviorAttrList(3)">
                        <el-option
                          :value="attrChildItem.value"
                          :label="attrChildItem.name"
                          :key="attrChildItem.value + 'level' + attrIndex"
                        ></el-option>
                      </template>
                    </el-select>

                    <span
                      v-for="(item3, index) in item2.child"
                      :key="index"
                      class="flex-row child"
                    >
                      <!-- 第四级 -->
                      <el-select
                        v-model="item3.childCheckedVal"
                        style="width: 120px"
                        name="oxve"
                        class="input-inline"
                        @change="handelChildBehavirSelectChange({
                          childItem: item3,
                          hasChild: true,
                          level: 4,
                        })"
                      >
                        <template v-for="attrChildItem in getBehaviorAttrList(4)">
                          <el-option
                            :value="attrChildItem.value"
                            :label="attrChildItem.name"
                            :key="attrChildItem.value"
                          ></el-option>
                        </template>
                      </el-select>

                      <!-- 次数、天数 -->
                      <span
                        v-for="(item4, index) in item3.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item4.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      </span>
                    </span>
                    <!-- 次数、天数 -->
                    <!-- <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type> -->

                </span>

                <span v-else class="flex-column">
                  <span
                    v-for="(item3, index) in item2.child"
                    :key="index"
                    class="flex-row child"
                  >
                    <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                  </span>
                </span>

              </div>
            </div>

          </div>
          <el-checkbox
            class="reverse-check"
            v-model="childItem.bav.reverseSelect"
            @change="ReverseSelect($event)"
          >
            圈出未使用
          </el-checkbox>
        </div>
      </span>

      <!-- 设备活跃 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0007'">
        <!-- 次数、天数 -->
        <Type ref="typeRef" :item3="childItem.bav.behaviorValue[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
      </span>

      <!-- 起播行为 -->
      <span class="flex-row" v-else-if="childItem.tagCode === 'BAV0008'">
        <!-- 第一级 -->
        <el-form-item prop="bav.value">
          <el-select
            v-model="childItem.bav.value"
            placeholder="请选择业务分类"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            @change="handelBehavirSelectChange({
              defaultChild: childItem.bav.behaviorValue[0].child
            })"
          >

            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-row"
        >
          <!-- 第二级 -->
          <el-select
            v-model="item.childCheckedVal[0]"
            placeholder="请选择一级分类"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            clearable
            @change="handelQiBoChildBehavirSelectChange({
              childItem: item,
              isValueClear: true,
              defaultChild: item.child[0].child
            })"
          >
            <template v-for="attrChildItem in getBehaviorAttrList(2)">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.name"
                :key="attrChildItem.value"
              >
              </el-option>
            </template>
          </el-select>
          —
          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row child"
          >
            <!-- 第三级 -->
            <el-select
              v-model="item2.childCheckedVal[0]"
              placeholder="请选择二级分类"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              clearable
              @change="handelQiBoChildBehavirSelectChange({
                childItem: item2,
                level: 3,
                extra: {type: item.childCheckedVal[0]},
                isValueClear: true,
                defaultChild: item2.child[0].child
              })"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(3, {type: item.childCheckedVal[0]})">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                >
                </el-option>
              </template>
            </el-select>
            <span
              v-for="(item3, index) in item2.child"
              :key="index"
              class="flex-row child"
            >
              <!-- @change="handelQiBoChildBehavirSelectChange(item3, false, childItem, 4, {}, 'value', true, item3.child[0].child)" -->
              <!-- 第四级 -->
              <el-select
                v-model="item3.childCheckedVal[0]"
                style="width: 110px"
                name="asdq"
                class="input-inline"
                placeholder="内容源"
                clearable
                @change="handelQiBoChildBehavirSelectChange({
                  childItem: item3,
                  level: 4,
                  isValueClear: true,
                  defaultChild: item3.child[0].child
                })"
              >
                <template v-for="attrChildItem in getBehaviorAttrList(4)">

                  <el-option
                    :value="attrChildItem.value"
                    :label="attrChildItem.name"
                    :key="attrChildItem.value"
                  >
                  </el-option>
                </template>
              </el-select>
              <span
                v-for="(item4, index) in item3.child"
                :key="index"
                class="flex-row child"
              >
                —
                <!-- @change="handelQiBoChildBehavirSelectChange(item4, false, childItem, 5, {}, 'value', true)" -->
                <span class="flex-column">
                  <div class="flex-row">
                    <!-- 第五级 -->
                    <el-select
                      v-model="item4.childCheckedVal[0]"
                      style="width: 150px;"
                      filterable
                      remote
                      placeholder="请输入片名或ID"
                      no-data-text='没有找到该片'
                      clearable
                      :remote-method="(query) => { qiBoRemoteMethod(query, item3.childCheckedVal[0]) }"
                      :loading="loading2"
                      v-loadmore="{'methord': handelQiboLoadmore}"
                      @change="handelQiBoChildBehavirSelectChange({
                        childItem: item4,
                        level: 5,
                        isValueClear: true,
                        reverseSelectAttr: true
                      })"
                    >
                      <el-option
                        v-for="tv in qiBoOptions"
                        :key="tv.value + tv.name"
                        :label="tv.name +'('+ tv.value+')'"
                        :value="tv.value">
                      </el-option>
                      <!-- 编辑回显 选项-->

                      <el-option
                        v-if="qiBoOptions.length === 0 && item4.childCheckedVal[0]"
                        :label="item4.child[0].name"
                        :value="item4.childCheckedVal[0]">
                      </el-option>
                    </el-select>
                    <!-- <el-checkbox
                      class="reverse-check"
                      v-model="childItem.bav.reverseSelect"
                      @change="ReverseSelect($event, item4.child)"
                    >
                      圈出未起1播
                    </el-checkbox> -->
                  </div>

                  <span class="appoint-text" v-if="!!item4.childCheckedVal[0] && appointmentInfo.length > 0">
                    <span style="">该片的统计时间为:</span>
                    <span v-for="item in appointmentInfo" :key="item.start + item.end" style="color: red">{{item.start}} - {{item.end}}</span>
                    <span> ，请选择合理的周期范围</span>
                  </span>
                </span>
                <span
                  v-for="(item5, index) in item4.child"
                  :key="index"
                  class="flex-row child"
                >
                  <!-- 选择了视频源下的视频 需要选择集数-->
                  <span class="flex-column" v-if="!!item5.value">
                    <!-- // 是电影的 -->
                    <span v-if="item5.videoType === '电影'" class="flex-row">
                      <el-select
                          v-model="item5.childCheckedVal[0]"
                          style="width: 150px;"
                          placeholder="请选择"
                          clearable
                          @change="handelQiBoChildBehavirSelectChange({
                            childItem: item5,
                            hasChild: true,
                            level: 7
                          })"
                        >
                          <el-option
                            v-for="attrChildItem in getBehaviorAttrList(7)"
                            :key="attrChildItem.value"
                            :label="attrChildItem.name"
                            :value="attrChildItem.value">
                          </el-option>
                        </el-select>
                        <!-- 天数次数等 11111111111111111111111111111 -->
                        <span v-if="!childItem.bav.reverseSelect">
                          <span
                            v-for="(item6, index) in item5.child"
                            :key="index"
                            class="flex-row child"
                          >
                            <!-- <Type ref="typeRef" :item3="item6.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type> -->
                            <el-select
                              v-model="item6.childCheckedVal[0]"
                              style="width: 150px;"
                              placeholder="请选择"
                              clearable
                              @change="handelQiBoChildBehavirSelectChange({
                                childItem: item6,
                                hasChild: false,
                                level: 8,
                                selectPropKeyValue: 'type',
                                isValueClear: true
                              })"
                            >
                              <el-option
                                v-for="attrChildItem in getBehaviorAttrList(8)"
                                :key="attrChildItem.type"
                                :label="attrChildItem.name"
                                :value="attrChildItem.type"
                                :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                              </el-option>
                            </el-select>
                            <span
                              v-for="(item7, index) in item6.child"
                              :key="index"
                              class="flex-row child"
                            >
                              <el-select
                                v-model="item7.operator"
                                style="max-width: 100px; min-width: 100px;"
                                name="oxve"
                                class="input-inline"
                                @change="handleOperatorChange(item7)"
                              >
                                <el-option value="="></el-option>
                                <el-option value=">="></el-option>
                                <el-option value="<="></el-option>
                                <el-option value=">"></el-option>
                                <el-option value="<"></el-option>
                                <el-option value="between" label="位于区间"></el-option>

                              </el-select>

                              <template>
                                <span v-if="item7.operator == 'between'" class="flex-row" style="width: 300px; height: 31px">
                                  <el-input-number :value="item7.value1" @input="handelInputBetween($event, item7, 'value1')" @blur="handelInputBlur(item7)" controls-position="right"></el-input-number>
                                ~ <el-input-number :value="item7.value2" @input="handelInputBetween($event, item7, 'value2')" @blur="handelInputBlur(item7)" controls-position="right"></el-input-number>
                                </span>

                                <el-input
                                  v-else
                                  placeholder="请输入"
                                  v-model="item7.value"
                                  clearable
                                  style="max-width: 100px; min-width: 100px;"
                                >
                                </el-input>
                              </template>
                            </span>
                          </span>
                        </span>
                    </span>

                    <!-- // 不是电影的 -->
                      <!-- @change="handelQiBoChildBehavi666rSelectChange(item5, false, childItem, 6, {}, 'value', false)" -->
                    <span v-else>
                      <el-select
                        multiple
                        v-model="item5.childCheckedVal"
                        style="width: 100px;"
                        placeholder="请选择集数"
                        @change="handelQiBoChildBehavirSelectChange({
                          childItem: item5,
                          hasChild: false,
                          level: 6
                        })"
                      >

                        <el-option
                          v-for="(tv, index) in qiBoCollectionOptions"
                          :key="tv.value + index"
                          :label="tv.name"
                          :value="tv.value">
                        </el-option>
                      </el-select>
                      <div class="flex-column" v-if="!childItem.bav.reverseSelect">
                        <ConditionLine :isShow="item5.child.length > 1"></ConditionLine>
                        <!-- {{ item5.child }} -->
                        <span
                          v-for="(item6, index) in item5.child"
                          :key="index"
                          class="flex-row child"
                        >
                          <span class="w100">{{ item6.name }}</span>
                            <!-- @change="handelQiBoChildBehavi666rSelectChange(item6, true, childItem, 7, {}, 'value', false)" -->
                          <el-select
                            v-model="item6.childCheckedVal[0]"
                            style="width: 150px;"
                            placeholder="请选择"
                            clearable
                            @change="handelQiBoChildBehavirSelectChange({
                              childItem: item6,
                              hasChild: true,
                              level: 7
                            })"
                          >
                            <el-option
                              v-for="attrChildItem in getBehaviorAttrList(7)"
                              :key="attrChildItem.value"
                              :label="attrChildItem.name"
                              :value="attrChildItem.value">
                            </el-option>
                          </el-select>
                          <!-- 天数次数等 -->
                          <span v-if="!childItem.bav.reverseSelect">
                            <span
                              v-for="(item7, index) in item6.child"
                              :key="index"
                              class="flex-row child"
                            >
                              <!-- 没有选择集 -->
                                <!-- @change="handelQiBoChildB666ehavirSelectChange(item7, false, childItem, 8, {}, 'type', true)" -->
                              <el-select
                                v-if="item6.name === ''"
                                v-model="item7.childCheckedVal[0]"
                                style="width: 150px;"
                                placeholder="请选择"
                                clearable
                                @change="handelQiBoChildBehavirSelectChange({
                                  childItem: item7,
                                  level: 8,
                                  selectPropKeyValue: 'type',
                                  isValueClear: true
                                })"
                              >
                                <el-option
                                  v-for="attrChildItem in getBehaviorAttrList(8)"
                                  :key="attrChildItem.type"
                                  :label="attrChildItem.name"
                                  :value="attrChildItem.type"
                                  :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                                </el-option>
                              </el-select>
                              <!-- 选择了集数，下拉选项只有【单集观看时长】 -->
                                <!-- @change="handelQiBoChil666dBehavirSelectChange(item7, false, childItem, 9, {}, 'type', true)" -->
                              <el-select
                                v-else
                                v-model="item7.childCheckedVal[0]"
                                style="width: 150px;"
                                placeholder="请选择"
                                clearable
                                @change="handelQiBoChildBehavirSelectChange({
                                  childItem: item7,
                                  level: 9,
                                  selectPropKeyValue: 'type',
                                  isValueClear: true
                                })"
                              >
                                <el-option
                                  v-for="attrChildItem in getBehaviorAttrList(9)"
                                  :key="attrChildItem.type"
                                  :value="attrChildItem.type"
                                  :label="attrChildItem.name"
                                  :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                                </el-option>
                              </el-select>
                              <span
                                v-for="(item8, index) in item7.child"
                                :key="index"
                                class="flex-row child"
                              >
                                <el-select
                                  v-model="item8.operator"
                                  style="max-width: 100px; min-width: 100px;"
                                  name="oxve"
                                  class="input-inline"
                                  @change="handleOperatorChange(item8)"
                                >
                                  <el-option value="="></el-option>
                                  <el-option value=">="></el-option>
                                  <el-option value="<="></el-option>
                                  <el-option value=">"></el-option>
                                  <el-option value="<"></el-option>
                                  <el-option value="between" label="位于区间"></el-option>
                                </el-select>

                                <template>
                                  <span v-if="item8.operator == 'between'" class="flex-row" style="width: 300px; height: 31px">
                                    <el-input-number :value="item8.value1" @input="handelInputBetween($event, item8, 'value1')" @blur="handelInputBlur(item8)" controls-position="right"></el-input-number>
                                  ~ <el-input-number :value="item8.value2" @input="handelInputBetween($event, item8, 'value2')" @blur="handelInputBlur(item8)" controls-position="right"></el-input-number>
                                  </span>

                                  <el-input
                                    v-else
                                    placeholder="请输入"
                                    v-model="item8.value"
                                    clearable
                                    style="max-width: 100px; min-width: 100px;"
                                  >
                                  </el-input>
                                </template>

                              </span>
                            </span>
                          </span>
                        </span>
                      </div>
                    </span>
                  </span>
                  <el-checkbox
                    class="reverse-check"
                    v-model="childItem.bav.reverseSelect"
                    @change="item5.videoType === '电影' ? ReverseSelect($event, item4.child) : ReverseSelect($event, item5.child)"
                  >
                    圈出未起播
                  </el-checkbox>

                  <!-- 没有选择视频 -->
                  <span v-if="!item5.value && !childItem.bav.reverseSelect" >
                    <!-- {{ item5 }} -->
                    <span class="flex-row"
                    >
                        <!-- @change="handelQiBoCh666ildBehavirSelectChange(item5, false, childItem, 8, {}, 'type', true)" -->
                      <el-select
                        v-model="item5.childCheckedVal[0]"
                        style="width: 150px;"
                        placeholder="请选择"
                        clearable
                        @change="handelQiBoChildBehavirSelectChange({
                          childItem: item5,
                          level: 8,
                          selectPropKeyValue: 'type',
                          isValueClear: true
                        })"
                      >
                        <el-option
                          v-for="attrChildItem in getBehaviorAttrList(8)"
                          :key="attrChildItem.type"
                          :label="attrChildItem.name"
                          :value="attrChildItem.type"
                          :disabled="attrChildItem.type === 'day' && isDisableDaySelect">
                        </el-option>
                      </el-select>
                      <span
                        v-for="(item6, index) in item5.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <el-select
                          v-if="index === 0"
                          v-model="item6.operator"
                          style="max-width: 100px; min-width: 100px;"
                          name="oxve"
                          class="input-inline"
                          @change="handleOperatorChange(item6)"
                        >
                          <el-option value="="></el-option>
                          <el-option value=">="></el-option>
                          <el-option value="<="></el-option>
                          <el-option value=">"></el-option>
                          <el-option value="<"></el-option>
                          <el-option value="between" label="位于区间"></el-option>
                        </el-select>

                        <template>

                          <span v-if="item6.operator == 'between'" class="flex-row" style="width: 300px; height: 31px">
                            <el-input-number :value="item6.value1" @input="handelInputBetween($event, item6, 'value1')" @blur="handelInputBlur(item6)" controls-position="right"></el-input-number>
                          ~ <el-input-number :value="item6.value2" @input="handelInputBetween($event, item6, 'value2')" @blur="handelInputBlur(item6)" controls-position="right"></el-input-number>
                          </span>

                          <el-input
                            v-else-if="index === 0"
                            placeholder="请输入"
                            v-model="item6.value"
                            clearable
                            style="max-width: 100px; min-width: 100px;"
                          >
                          </el-input>
                        </template>

                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>

          </span>
        </div>
      </span>

      <!-- 应用状态 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0009'">
        <div class="flex-row">
          <!-- 新增一级 -->
          <el-form-item prop="bav.value">
            <el-select
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange()"
            >
              <template v-for="item in getBehaviorAttrList(1)">
                <el-option
                  :value="item.value"
                  :label="item.name"
                  :key="item.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>

          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-row"
          >
            <!-- {{ item }} -->
            <!-- 第二级 -->
            <el-form-item
              :prop="`bav.behaviorValue[${index}].childCheckedVal`"
              :rules="{ required: true, message: '请选择', trigger: 'change' }"
            >
              <el-select
                v-model="item.childCheckedVal"
                style="width: 120px"
                name="oxve"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                  isValueClear: false
                })"
              >
                <template v-for="attrChildItem in getBehaviorAttrList(2)">
                  <el-option
                    :value="attrChildItem.value"
                    :label="attrChildItem.name"
                    :key="attrChildItem.value"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <div
              v-for="item2 in item.child"
              :key="item2.value"
              class="flex-row"
            >

              <span class="flex-row">
                <!-- 第三级 -->
                  <el-select
                    multiple
                    v-model="item2.childCheckedVal"
                    style="width: 150px"
                    name="asdq"
                    class="input-inline"
                    @change="handelChildBehavirSelectChange({
                      childItem: item2,
                      hasChild: true,
                      extra: {type: item.childCheckedVal},
                      level: 3,
                    })"
                  >
                    <template v-for="attrChildItem in getBehaviorAttrList(3, {type: item.childCheckedVal} )">
                      <el-option
                        :value="attrChildItem.value"
                        :label="attrChildItem.name"
                        :key="attrChildItem.value"
                      >
                      </el-option>
                    </template>
                  </el-select>
              </span>
            </div>
          </div>
        </div>
      </span>

      <!-- 用户活跃 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0010'">
        <div class="flex-row">
          <!-- 新增一级 -->
          <el-form-item prop="bav.value">
            <el-select
              v-model="childItem.bav.value"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelBehavirSelectChange()"
            >
              <template v-for="item in getBehaviorAttrList(1)">
                <el-option
                  :value="item.value"
                  :label="item.name"
                  :key="item.value"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>

          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-row"
          >
            <!-- {{ item }} -->
            <!-- 第二级 -->
            <el-form-item
              :prop="`bav.behaviorValue[${index}].childCheckedVal`"
              :rules="{ required: true, message: '请选择', trigger: 'change' }"
            >
              <el-select
                multiple
                v-model="item.childCheckedVal"
                style="width: 120px"
                name="oxve"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                })"
              >
                <template v-for="attrChildItem in getBehaviorAttrList(2)">
                  <el-option
                    :value="attrChildItem.value"
                    :label="attrChildItem.name"
                    :key="attrChildItem.value"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>

          </div>
        </div>
      </span>

      <!-- 起播活跃  一期二期交互-->
      <span class="flex-row" v-else-if="childItem.tagCode === 'BAV0011' && childItem.isOldversion">

        <!-- 第一级 -->
        <el-form-item prop="bav.value" >
          <el-select
            disabled
            v-model="childItem.bav.value"
            placeholder="请选择业务分类"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            @change="handelBehavirSelectChange()"
          >
            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <div
          v-for="(item, index) in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-row"
        >
          <!-- 第二级 -->
          <el-form-item
            :prop="`bav.behaviorValue[${index}].childCheckedVal[0]`"
            :rules="{ required: true, message: '请选择', trigger: 'change' }"
          >
            <el-select
              disabled
              v-model="item.childCheckedVal[0]"
              placeholder="请选择"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                extra: {type: childItem.bav.value},
              })"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <span
            v-for="(item2, index) in item.child"
            :key="index"
            class="flex-row child"
          >
            <div v-if="childItem.bav.value === '影视'" class="flex-row">

              <el-select
                disabled
                v-model="item2.childCheckedVal[0]"
                style="width: 110px"
                name="asdq"
                class="input-inline"
                placeholder="内容源"
                clearable
                @change="handelChildBehavirSelectChange({
                  childItem: item2,
                  level: 4,
                  extra: {type: '视频源'}
                })"
              >
                <template v-for="attrChildItem in getBehaviorAttrList(4, {type: '视频源'})">

                  <el-option
                    :value="attrChildItem.value"
                    :label="attrChildItem.name"
                    :key="attrChildItem.value"
                  >
                  </el-option>
                </template>
              </el-select>
              <span
                v-for="(item4, index) in item2.child"
                :key="index"
                class="flex-row child"
              >
                <!-- qiBoRemoteMethod 参数(keyWords, 视频源) -->
                <div class="flex-row">
                  <el-select
                    disabled
                    v-model="item4.childCheckedVal[0]"
                    style="width: 150px;"
                    filterable
                    remote
                    placeholder="请输入片名或ID"
                    no-data-text='没有找到该片'
                    clearable
                    :remote-method="(query) => { qiBoRemoteMethod(query, item2.childCheckedVal[0]) }"
                    :loading="loading2"
                    v-loadmore="{'methord': handelQiboLoadmore}"
                    @change="handelChildBehavirSelectChange({
                      childItem: item4,
                      level: 4,
                      extra: {type: '影片', source: childItem.bav.value},
                      hasChild: true,
                      reverseSelectAttr: true
                    })"
                  >
                    <el-option
                      v-for="tv in qiBoOptions"
                      :key="tv.value"
                      :label="tv.name +'('+ tv.value+')'"
                      :value="tv.value">
                    </el-option>
                    <!-- 编辑回显 选项-->
                    <el-option
                      v-if="qiBoOptions.length === 0 && item4.child[0] && item4.childCheckedVal[0]"
                      :label="item4.child[0].name"
                      :value="item4.childCheckedVal[0]">
                    </el-option>
                  </el-select>
                  <el-checkbox
                    disabled
                    class="reverse-check"
                    v-model="childItem.bav.reverseSelect"
                    @change="ReverseSelect($event, item4.child)"
                  >
                    圈出未活跃
                  </el-checkbox>
                </div>

                <span
                  v-for="(item5, index) in item4.child"
                  :key="index"
                  class="flex-row child"
                >

                  <!-- <el-select
                    multiple
                    v-model="item5.childCheckedVal[0]"
                    style="width: 100px;"
                    placeholder="请选择集数"
                    @change="handelQiBoChildBehavirSelectChange({
                      childItem: item5,
                      hasChild: false,
                      level: 6
                    })"
                  >
                    <el-option
                      v-for="(tv, index) in getVideoEpisode({tvId:item4.childCheckedVal[0], businessType: childItem.bav.value, source: item4.childCheckedVal[0]})"
                      :key="tv.value + index"
                      :label="tv.name"
                      :value="tv.value">
                    </el-option>
                  </el-select> -->
                  <!-- 次数、天数 -->
                  <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item5.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                </span>
                <!-- {{item4.child}} -->
              </span>
            </div>

            <div v-else-if="childItem.bav.value === '短视频'" >
              <!-- 第三级 搜索关注博主-->
              <div v-if="item.childCheckedVal[0] === '关注'" class="flex-row">
                <el-select
                  disabled
                  v-model="item2.childCheckedVal[0]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="搜博主"
                  no-data-text='暂无数据'
                  clearable
                  :remote-method="(query) => { GetShortVideoAuthor(query) }"
                  :loading="loading2"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: {type: '关注'},
                    hasChild: true,
                    reverseSelectAttr: true
                  })"
                >
                  <el-option
                    v-for="follow in followOptions"
                    :key="follow.value"
                    :label="follow.name"
                    :value="follow.value">
                  </el-option>
                  <!-- 编辑回显 选项-->
                  <el-option
                    v-if="followOptions.length === 0 && item2.childCheckedVal[0]"
                    :label="item2.child[0].name"
                    :value="item2.childCheckedVal[0]">
                  </el-option>
                </el-select>
                <el-checkbox
                  class="reverse-check"
                  v-model="childItem.bav.reverseSelect"
                  @change="ReverseSelect($event, item2.child)"
                >
                  圈出未活跃
                </el-checkbox>
                <!-- {{item2.child}} -->

                <span
                  v-for="(item3, index2) in item2.child"
                  :key="'typeInputValue' + index2"
                  class="flex-row"
                >
                  <!-- 次数、天数 -->
                  <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                </span>
              </div>
              <!-- 第三级 搜索影片-->
              <div v-else class="flex-row">
                <!-- {{item2}} -->
                <el-select
                  disabled
                  v-model="item2.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  clearable
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: {listMapName: item2.mapName },
                    selectPropKeyValue: 'name'
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(3, {listMapName: item2.mapName })">
                    <el-option
                      :value="attrChildItem.name"
                      :label="attrChildItem.name"
                      :key="attrChildItem.name"
                    >
                    </el-option>
                  </template>
                </el-select>
                <span
                  v-for="(item3, index) in item2.child"
                  :key="index"
                  class="flex-row child"
                >
                  <!-- 第四级 分类 -->
                  <div v-if="item2.childCheckedVal[0] === '分类'" class="flex-row">
                    <el-select
                      disabled
                      v-model="item3.childCheckedVal[0]"
                      placeholder="请选择"
                      style="width: 110px"
                      name="asdq"
                      class="input-inline"
                      @change="handelChildBehavirSelectChange({
                        childItem: item3,
                        hasChild: true,
                        level: 4,
                        extra: {type: item2.childCheckedVal[0]},
                        selectPropKeyValue: 'name'
                      })"
                    >
                      <template v-for="attrChildItem in getBehaviorAttrList(4, {type: item2.childCheckedVal[0]})">
                        <el-option
                          :value="attrChildItem.name"
                          :label="attrChildItem.name"
                          :key="attrChildItem.name"
                        >
                        </el-option>
                      </template>
                    </el-select>
                    <span
                      v-for="(item4, index2) in item3.child"
                      :key="'typeInputValue' + index2"
                      class="flex-row"
                    >
                      <!-- 次数、天数 -->
                      <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item4.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      <!-- {{item2}} -->
                    </span>
                  </div>

                  <!-- 第四级 影片  -->
                  <div v-else class="flex-row">
                  <!-- {{item3.childCheckedVal[0]}} -->
                  <!-- {{item3.child}} -->
                    <div class="flex-row">   <!-- 短视频、电竞 -->  <!-- GetVideo 参数 ：(keyWords, 业务类型) -->
                      <el-select
                        disabled
                        v-model="item3.childCheckedVal[0]"
                        style="width: 150px;"
                        filterable
                        remote
                        placeholder="请输入片名或ID"
                        no-data-text='没有找到该片'
                        clearable
                        :remote-method="(query) => { GetVideo(query, childItem.bav.value) }"
                        :loading="loading2"
                        @change="handelChildBehavirSelectChange({
                          childItem: item3,
                          level: 4,
                          extra: {type: '影片'},
                          hasChild: true,
                          reverseSelectAttr: true
                        })"
                      >
                        <el-option
                          v-for="video in videoOptions"
                          :key="video.name"
                          :label="video.name"
                          :value="video.value">
                        </el-option>
                        <!-- 编辑回显 选项-->
                        <el-option
                          v-if="videoOptions.length === 0 && item3.child[0]"
                          :label="item3.child[0].name"
                          :value="item3.childCheckedVal[0]">
                        </el-option>
                      </el-select>
                      <el-checkbox
                        disabled
                        class="reverse-check"
                        v-model="childItem.bav.reverseSelect"
                        @change="ReverseSelect($event, item3.child)"
                      >
                        圈出未活跃
                      </el-checkbox>

                      <span
                        v-for="(item4, index) in item3.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item4.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      </span>
                    </div>

                </div>

                </span>
              </div>
            </div>

            <div v-else-if="childItem.bav.value === '电竞'" class="flex-row">
              <!-- 第三级 -->
              <el-select
                  disabled
                  v-model="item2.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  clearable
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: {listMapName: item2.mapName},
                    selectPropKeyValue: 'name'
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(3, {listMapName: item2.mapName })">
                    <el-option
                      :value="attrChildItem.name"
                      :label="attrChildItem.name"
                      :key="attrChildItem.name"
                    >
                    </el-option>
                  </template>
              </el-select>
              <span
                v-for="(item3, index) in item2.child"
                :key="index"
                class="flex-row"
              >
                <!-- 第四级 -->
                <el-select
                  disabled
                  v-model="item3.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange({
                    childItem: item3,
                    level: 4,
                    extra: {listMapName: item3.mapName},
                    selectPropKeyValue: 'name',
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(4, { listMapName: item3.mapName })">
                    <el-option
                      :value="attrChildItem.name"
                      :label="attrChildItem.name"
                      :key="attrChildItem.name"
                    >
                    </el-option>
                  </template>
                </el-select>
                <span
                  v-for="(item4, index) in item3.child"
                  :key="index"
                  class="flex-row"
                >
                  <!-- 第五级 -->
                  <el-select
                    disabled
                    v-model="item4.childCheckedVal[0]"
                    placeholder="请选择"
                    style="width: 110px"
                    name="asdq"
                    class="input-inline"
                    @change="handelChildBehavirSelectChange({
                      childItem: item4,
                      level: 5,
                    })"
                  >
                    <template v-for="attrChildItem in getBehaviorAttrList(5)">
                      <el-option
                        :value="attrChildItem.value"
                        :label="attrChildItem.name"
                        :key="attrChildItem.value"
                      >
                      </el-option>
                    </template>
                  </el-select>
                  <!-- {{item}} -->
                  <span
                    v-for="(item5, index) in item4.child"
                    :key="index"
                    class="flex-row"
                  >
                    <el-select
                      disabled
                      v-model="item5.childCheckedVal[0]"
                      style="width: 150px;"
                      filterable
                      remote
                      placeholder="请输入片名或ID"
                      no-data-text='没有找到该片'
                      clearable
                      :remote-method="(query) => { GetVideo(query, childItem.bav.value) }"
                      :loading="loading2"
                      @change="handelChildBehavirSelectChange({
                        childItem: item5,
                        level: 6,
                        extra: {type: '电竞'},
                        reverseSelectAttr: true
                      })"
                    >
                      <el-option
                        v-for="video in videoOptions"
                        :key="video.value"
                        :label="video.name"
                        :value="video.value">
                      </el-option>
                      <!-- 编辑回显 选项 -->
                      <el-option
                        v-if="videoOptions.length === 0 && item5.child[0]"
                        :label="item5.child[0].name"
                        :value="item5.childCheckedVal[0]">
                      </el-option>
                    </el-select>

                    <!-- 反选时不展示 -->
                    <span
                      v-for="(item6, index) in item5.child"
                      :key="index"
                      class="flex-row"
                    >
                      <el-select
                        disabled
                        v-model="item6.childCheckedVal[0]"
                        placeholder="请选择"
                        style="width: 110px"
                        name="asdq"
                        class="input-inline"
                        @change="handelChildBehavirSelectChange({
                          childItem: item6,
                          hasChild: true,
                          level: 7,
                        })"
                      >
                        <template v-for="attrChildItem in getBehaviorAttrList(7)">
                          <el-option
                            :value="attrChildItem.value"
                            :label="attrChildItem.name"
                            :key="attrChildItem.value"
                          >
                          </el-option>
                        </template>
                      </el-select>
                      <span
                        v-for="(item7, index) in item6.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item7.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <el-checkbox
                disabled
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect"
              >
                圈出未活跃
              </el-checkbox>
            </div>

          </span>
        </div>

      </span>

      <!-- 起播活跃 三期-->
      <!-- 起播活跃的数据特殊处理 使用 showBehaviorValue 而不是 behaviorValue-->
      <span class="flex-row" v-else-if="childItem.tagCode === 'BAV0011'">
        <!-- 第一级 -->
        <el-form-item prop="bav.value">
          <el-select
            v-model="childItem.bav.value"
            placeholder="请选择业务分类"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            @change="handelBehavirSelectChange()"
          >
            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <div
          v-for="(item, index) in childItem.bav.showBehaviorValue"
          :key="item.value"
          class="flex-row"
        >
          <!-- 第二级 -->
          <el-form-item
            :prop="`bav.showBehaviorValue[${index}].childCheckedVal[0]`"
            :rules="{required: true, message: '请选择', trigger: 'change'}"
          >
            <el-select
              v-model="item.childCheckedVal[0]"
              placeholder="请选择"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                extra: {type: childItem.bav.value},
                selectPropKeyValue: 'name'
              })"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})" >
                <el-option
                  :value="attrChildItem.name"
                  :label="attrChildItem.name"
                  :key="attrChildItem.name"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <span
            v-for="(item2, index2) in item.child"
            :key="index2"
            class="flex-row child"
          >
            <div v-if="childItem.bav.value === '影视'" class="flex-row">

               <span class="flex-row">
                <el-select
                  v-model="item2.childCheckedVal[0]"
                  style="width: 100px"
                  name="oxve"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 8,
                    selectPropKeyValue: 'name',
                  })"
                >
                  <template v-for="item in getBehaviorAttrList(8)">
                    <el-option
                      :value="item.name"
                      :label="item.name"
                      :key="item.name"
                    ></el-option>
                  </template>
                </el-select>
                <Bav0012 v-if="!!item2.mapName" :aaa="item2"></Bav0012>
              </span>

              <!-- 视频源 + 搜视频 -->
              <span class="flex-row">
                <el-select
                  v-model="item2.childCheckedVal[1]"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  placeholder="内容源"
                  clearable
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 4,
                    extra: {type: '视频源'}
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(4, {type: '视频源'})">

                    <el-option
                      :value="attrChildItem.value"
                      :label="attrChildItem.name"
                      :key="attrChildItem.value"
                    >
                    </el-option>
                  </template>
                </el-select>
                <span
                  v-for="(item4, index4) in item2.child"
                  :key="index4"
                  class="flex-row child"
                >
                <!-- item4={{item4}} -->
                  <!-- qiBoRemoteMethod 参数(keyWords, 视频源) -->

                  <div class="flex-row" v-if="item4.value === item2.childCheckedVal[1]">
                    <el-select
                      v-model="item4.childCheckedVal[0]"
                      style="width: 150px;"
                      filterable
                      remote
                      placeholder="请输入片名或ID"
                      no-data-text='没有找到该片'
                      clearable
                      :remote-method="(query) => { qiBoRemoteMethod(query, item2.childCheckedVal[1]) }"
                      :loading="loading2"
                      v-loadmore="{'methord': handelQiboLoadmore}"
                      @change="handelChildBehavirSelectChange({
                        childItem: item4,
                        level: 4,
                        extra: {type: '影片', source: childItem.bav.value},
                        hasChild: false,
                        reverseSelectAttr: true
                      })"
                    >
                      <el-option
                        v-for="tv in qiBoOptions"
                        :key="tv.value"
                        :label="tv.name +'('+ tv.value+')'"
                        :value="tv.value">
                      </el-option>
                      <!-- 编辑回显 选项-->
                      <el-option
                        v-if="qiBoOptions.length === 0 && item4.child[0] && item4.childCheckedVal[0]"
                        :label="item4.child[0].name"
                        :value="item4.childCheckedVal[0]">
                      </el-option>
                    </el-select>
                  </div>

                    <!-- <el-select
                      multiple
                      v-model="item5.childCheckedVal[0]"
                      style="width: 100px;"
                      placeholder="请选择集数"
                      @change="handelQiBoChildBehavirSelectChange({
                        childItem: item5,
                        hasChild: false,
                        level: 6
                      })"
                    >
                      <el-option
                        v-for="(tv, index) in getVideoEpisode({tvId:item4.childCheckedVal[0], businessType: childItem.bav.value, source: item4.childCheckedVal[0]})"
                        :key="tv.value + index"
                        :label="tv.name"
                        :value="tv.value">
                      </el-option>
                    </el-select> -->

                  <!-- <span
                    v-for="(item5, index) in item4.child"
                    :key="index"
                    class="flex-row child"
                  >
                    <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item5.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                  </span> -->
                  <!-- {{item4.child}} -->
                </span>

              </span>
              <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect($event)"
              >
                圈出未活跃
              </el-checkbox>
            </div>

            <div v-else-if="childItem.bav.value === '短视频' && index === 0" >
              <!-- 第三级 关注-->
              <div v-if="item.childCheckedVal[0] === '关注'" class="flex-row">
                <el-select
                  v-model="item2.childCheckedVal[0]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="搜博主"
                  no-data-text='暂无数据'
                  clearable
                  :remote-method="(query) => { GetShortVideoAuthor(query) }"
                  :loading="loading2"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: { type: '关注' },
                    hasChild: true,
                    reverseSelectAttr: true
                  })"
                >
                  <el-option
                    v-for="follow in followOptions"
                    :key="follow.value"
                    :label="follow.name"
                    :value="follow.value">
                  </el-option>
                  <!-- 编辑回显 选项-->
                  <el-option
                    v-if="followOptions.length === 0 && item2.childCheckedVal[0]"
                    :label="item2.child[0].name"
                    :value="item2.childCheckedVal[0]">
                  </el-option>
                </el-select>
                <!-- <el-select
                  v-model="item2.childCheckedVal[0]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="搜博主"
                  no-data-text='暂无数据'
                  clearable
                  :remote-method="(query) => { GetShortVideoAuthor(query) }"
                  :loading="loading2"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: { type: '关注' },
                    hasChild: true,
                    reverseSelectAttr: true
                  })"
                >
                  <el-option
                    v-for="follow in followOptions"
                    :key="follow.value"
                    :label="follow.name"
                    :value="follow.value">
                  </el-option>
                  <el-option
                    v-if="followOptions.length === 0 && item2.childCheckedVal[0]"
                    :label="item2.child[0].name"
                    :value="item2.childCheckedVal[0]">
                  </el-option>
                </el-select> -->
                <el-checkbox
                  class="reverse-check"
                  v-model="childItem.bav.reverseSelect"
                  @change="ReverseSelect($event, item2.child)"
                >
                  圈出未活跃
                </el-checkbox>
                <!-- {{item2.child}} -->

                <!-- <span
                  v-for="(item3, index2) in item2.child"
                  :key="'typeInputValue' + index2"
                  class="flex-row"
                >

                  <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                </span> -->
              </div>

              <!-- 第三级 订阅-->
              <div v-else-if="item.childCheckedVal[0] === '订阅专题'" class="flex-row">
                <el-select
                  v-model="item2.childCheckedVal[0]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="搜专题"
                  no-data-text='暂无数据'
                  clearable
                  :remote-method="(query) => { GetTopic(query) }"
                  :loading="loading2"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: { type: '订阅' },
                    hasChild: true,
                    reverseSelectAttr: true
                  })"
                >
                  <el-option
                    v-for="follow in topicOptions"
                    :key="follow.value"
                    :label="follow.name"
                    :value="follow.value">
                  </el-option>
                  <!-- 编辑回显 选项-->
                  <el-option
                    v-if="topicOptions.length === 0 && item2.childCheckedVal[0]"
                    :label="item2.child[0].name"
                    :value="item2.childCheckedVal[0]">
                  </el-option>
                </el-select>

                <el-checkbox
                  class="reverse-check"
                  v-model="childItem.bav.reverseSelect"
                  @change="ReverseSelect($event, item2.child)"
                >
                  圈出未活跃
                </el-checkbox>
              </div>

              <!-- 第三级 收藏 搜索影片-->
              <div v-else class="flex-row">
                <!-- {{item2}} -->
                <el-select
                  v-if="index2 === 0"
                  v-model="item2.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  clearable
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: {listMapName: item2.mapName },
                    selectPropKeyValue: 'name'
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(3, {listMapName: item2.mapName })">
                    <el-option
                      :value="attrChildItem.name"
                      :label="attrChildItem.name"
                      :key="attrChildItem.name"
                    >
                    </el-option>
                  </template>
                </el-select>

                <el-select
                  v-if="index2 === 0"
                  v-model="item2.childCheckedVal[1]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="请输入片名或ID"
                  no-data-text='没有找到该片'
                  clearable
                  :remote-method="(query) => { GetVideo(query, childItem.bav.value) }"
                  :loading="loading2"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 4,
                    extra: {type: '影片'},
                    hasChild: false,
                    reverseSelectAttr: true,
                  })"
                >
                  <el-option
                    v-for="video in videoOptions"
                    :key="video.name"
                    :label="video.name"
                    :value="video.value">
                  </el-option>
                  <!-- 编辑回显 选项-->
                  <el-option
                    v-if="videoOptions.length === 0 && item2.child[1]"
                    :label="getMatchName(item2.childCheckedVal[1], item2.child)"
                    :value="item2.childCheckedVal[1]">
                  </el-option>
                </el-select>

                <el-select
                  v-if="index2 === 0"
                  v-model="item2.childCheckedVal[2]"
                  style="width: 150px;"
                  filterable
                  remote
                  placeholder="搜博主"
                  no-data-text='暂无数据'
                  clearable
                  :remote-method="(query) => { GetShortVideoAuthor(query) }"
                  :loading="loading2"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: {type: '关注'},
                    hasChild: false,
                    reverseSelectAttr: true
                  })"
                >
                  <el-option
                    v-for="follow in followOptions"
                    :key="follow.value"
                    :label="follow.name"
                    :value="follow.value">
                  </el-option>
                  <!-- 编辑回显 选项-->
                  <el-option
                    v-if="followOptions.length === 0 && item2.childCheckedVal[2]"
                    :label="getMatchName(item2.childCheckedVal[2], item2.child)"
                    :value="item2.childCheckedVal[2]">
                  </el-option>
                </el-select>

                <el-checkbox
                  v-if="index2 === 0"
                  class="reverse-check"
                  v-model="childItem.bav.reverseSelect"
                  @change="ReverseSelect($event)"
                >
                  圈出未活跃
                </el-checkbox>
                <!-- 1111: {{item2}} -->
                <span
                  v-for="(item3, index) in item2.child"
                  :key="index"
                  class="flex-row child"
                >
                  <!-- 第四级 分类 -->
                  <div v-if="item2.childCheckedVal[0] === '分类'" class="flex-row">
                    <el-select
                      v-model="item3.childCheckedVal[0]"
                      placeholder="请选择"
                      style="width: 110px"
                      name="asdq"
                      class="input-inline"
                      @change="handelChildBehavirSelectChange({
                        childItem: item3,
                        hasChild: true,
                        level: 4,
                        extra: {type: item2.childCheckedVal[0]},
                        selectPropKeyValue: 'name'
                      })"
                    >
                      <template v-for="attrChildItem in getBehaviorAttrList(4, {type: item2.childCheckedVal[0]})">
                        <el-option
                          :value="attrChildItem.name"
                          :label="attrChildItem.name"
                          :key="attrChildItem.name"
                        >
                        </el-option>
                      </template>
                    </el-select>
                    <span
                      v-for="(item4, index2) in item3.child"
                      :key="'typeInputValue' + index2"
                      class="flex-row"
                    >
                      <!-- 次数、天数 -->
                      <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item4.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      <!-- {{item2}} -->
                    </span>
                  </div>

                  <!-- 第四级 影片  -->
                  <div v-else class="flex-row">

                  </div>

                </span>
                      <!-- <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item4.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type> -->

              </div>
            </div>

            <div v-else-if="childItem.bav.value === '电竞'" class="flex-row">
              <!-- 第三级 -->
              <el-select
                  v-model="item2.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  clearable
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    level: 3,
                    extra: { listMapName: item2.mapName },
                    selectPropKeyValue: 'name'
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(3, {listMapName: item2.mapName })">
                    <el-option
                      :value="attrChildItem.name"
                      :label="attrChildItem.name"
                      :key="attrChildItem.name"
                    >
                    </el-option>
                  </template>
              </el-select>
              <span
                v-for="(item3, index) in item2.child"
                :key="index"
                class="flex-row"
              >
                <!-- 第四级 -->
                <el-select
                  v-model="item3.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange({
                    childItem: item3,
                    level: 4,
                    extra: { listMapName: item3.mapName },
                    selectPropKeyValue: 'name',
                  })"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(4, { listMapName: item3.mapName })">
                    <el-option
                      :value="attrChildItem.name"
                      :label="attrChildItem.name"
                      :key="attrChildItem.name"
                    >
                    </el-option>
                  </template>
                </el-select>
                <span
                  v-for="(item4, index) in item3.child"
                  :key="index"
                  class="flex-row"
                >
                  <!-- 第五级 -->
                  <el-select
                    v-model="item4.childCheckedVal[0]"
                    placeholder="请选择"
                    style="width: 110px"
                    name="asdq"
                    class="input-inline"
                    @change="handelChildBehavirSelectChange({
                      childItem: item4,
                      level: 5,
                    })"
                  >
                    <template v-for="attrChildItem in getBehaviorAttrList(5)">
                      <el-option
                        :value="attrChildItem.value"
                        :label="attrChildItem.name"
                        :key="attrChildItem.value"
                      >
                      </el-option>
                    </template>
                  </el-select>
                  <!-- {{item}} -->
                  <span
                    v-for="(item5, index) in item4.child"
                    :key="index"
                    class="flex-row"
                  >
                    <el-select
                      v-model="item5.childCheckedVal[0]"
                      style="width: 150px;"
                      filterable
                      remote
                      placeholder="请输入片名或ID"
                      no-data-text='没有找到该片'
                      clearable
                      :remote-method="(query) => { GetVideo(query, childItem.bav.value) }"
                      :loading="loading2"
                      @change="handelChildBehavirSelectChange({
                        childItem: item5,
                        level: 6,
                        extra: {type: '电竞'},
                        reverseSelectAttr: true
                      })"
                    >
                      <el-option
                        v-for="video in videoOptions"
                        :key="video.value"
                        :label="video.name"
                        :value="video.value">
                      </el-option>
                      <!-- 编辑回显 选项 -->
                      <el-option
                        v-if="videoOptions.length === 0 && item5.child[0]"
                        :label="item5.child[0].name"
                        :value="item5.childCheckedVal[0]">
                      </el-option>
                    </el-select>

                    <!-- 反选时不展示 -->
                    <span
                      v-for="(item6, index) in item5.child"
                      :key="index"
                      class="flex-row"
                    >
                      <el-select
                        v-model="item6.childCheckedVal[0]"
                        placeholder="请选择"
                        style="width: 110px"
                        name="asdq"
                        class="input-inline"
                        @change="handelChildBehavirSelectChange({
                          childItem: item6,
                          hasChild: true,
                          level: 7,
                        })"
                      >
                        <template v-for="attrChildItem in getBehaviorAttrList(7)">
                          <el-option
                            :value="attrChildItem.value"
                            :label="attrChildItem.name"
                            :key="attrChildItem.value"
                          >
                          </el-option>
                        </template>
                      </el-select>
                      <!-- <span
                        v-for="(item7, index) in item6.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item7.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                      </span> -->
                    </span>
                  </span>
                </span>
              </span>
              <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect"
              >
                圈出未活跃
              </el-checkbox>

            </div>

          </span>
          <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="childItem.bav.countValue" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
        </div>
      </span>

      <!-- 综合起播行为 -->
      <span class="flex-row" v-else-if="childItem.tagCode === 'BAV0012'">
        <!-- 第一级 -->
        <el-form-item prop="bav.value">
          <el-select
            v-model="childItem.bav.value"
            placeholder="请选择业务分类"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            @change="handelBehavirSelectChange()"
          >
            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <!-- 综合起播的数据特殊处理 使用 showBehaviorValue 而不是 behaviorValue-->
        <span
          v-for="item in childItem.bav.showBehaviorValue"
          :key="item.value"
          class="flex-row child"
        >
          <!-- 第二级  item.childCheckedVal[0]-->
          <span class="flex-row">
            <el-select
              v-model="item.childCheckedVal[0]"
              style="width: 100px"
              name="oxve"
              class="input-inline"
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 2,
                extra: {listMapName: item.mapName},
                selectPropKeyValue: 'name',
              })"
            >
              <template v-for="item in getBehaviorAttrList(2, {listMapName: item.mapName})">
                <el-option
                  :value="item.name"
                  :label="item.name"
                  :key="item.name"
                ></el-option>
              </template>
            </el-select>
            <!-- {{ item.mapName }} -->
            <Bav0012 v-if="!!item.mapName" :aaa="item"></Bav0012>
          </span>

          <!-- 搜博主  item.childCheckedVal[3] -->
          <span v-if="childItem.bav.value === '短视频'" class="flex-row">
            <el-select
              v-model="item.childCheckedVal[3]"
              style="width: 150px;"
              filterable
              remote
              placeholder="搜博主"
              no-data-text='暂无数据'
              clearable
              :remote-method="(query) => { GetShortVideoAuthor(query) }"
              :loading="loading2"
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 6,
                selectPropKeyValue: 'name'
              })"
            >
              <el-option
                v-for="follow in followOptions"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
              <!-- 编辑回显 选项-->
              <el-option
                v-if="followOptions.length === 0 && item.childCheckedVal[3]"
                :label="getMatchName(item.childCheckedVal[3], item.child)"
                :value="item.childCheckedVal[3]">
              </el-option>
            </el-select>
          </span>

          <!-- 教育VIP 选项  item.childCheckedVal[3] -->
          <span v-if="childItem.bav.value === '教育'" class="flex-row">
            <el-select
              v-model="item.childCheckedVal[3]"
              placeholder="请选择 VIP"
              style="width: 100px"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 9,
                selectPropKeyValue: 'name'
              })"
            >
              <el-option
                v-for="follow in getBehaviorAttrList(9)"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
            </el-select>
          </span>

          <!-- 教育VIP 选项  item.childCheckedVal[3] -->
          <span v-if="childItem.bav.value === '亲子'" class="flex-row">
            <el-select
              v-model="item.childCheckedVal[3]"
              placeholder="请选择 VIP"
              style="width: 100px"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 11,
                selectPropKeyValue: 'name'
              })"
            >
              <el-option
                v-for="follow in getBehaviorAttrList(11)"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
            </el-select>
          </span>

          <!-- 搜歌手  item.childCheckedVal[4]   搜歌曲  item.childCheckedVal[5] -->
          <span v-if="childItem.bav.value === 'K歌'" class="flex-row">
            <el-select
              v-model="item.childCheckedVal[4]"
              style="width: 150px;"
              filterable
              remote
              placeholder="搜歌手"
              no-data-text='暂无数据'
              clearable
              :remote-method="(query) => { getMusicByAuthor(query) }"
              :loading="loading2"
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 8,
                selectPropKeyValue: 'name'
              })"
            >
              <el-option
                v-for="item in singerList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
              <!-- 编辑回显 选项-->
              <el-option
                v-if="singerList.length === 0 && item.childCheckedVal[4]"
                :label="getMatchName(item.childCheckedVal[4], item.child)"
                :value="item.childCheckedVal[4]">
              </el-option>
            </el-select>

            <el-select
              v-model="item.childCheckedVal[5]"
              style="width: 150px;"
              filterable
              remote
              placeholder="搜歌曲"
              no-data-text='暂无数据'
              clearable
              :remote-method="(query) => { getMusicByName(query) }"
              :loading="loading2"
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 7,
                selectPropKeyValue: 'name',
                reverseSelectAttr: true
              })"
            >
              <el-option
                v-for="follow in musicList"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
              <!-- 编辑回显 选项-->
              <el-option
                v-if="musicList.length === 0 && item.childCheckedVal[5]"
                :label="getMatchName(item.childCheckedVal[5], item.child)"
                :value="item.childCheckedVal[5]">
              </el-option>
            </el-select>

            <!-- <el-checkbox
              class="reverse-check"
              v-model="childItem.bav.reverseSelect"
              @change="ReverseSelect($event, item.child, item.childCheckedVal[5], {clearVal: item.childCheckedVal[2], bavChildItem: item})"
            >
              圈出未起1播
            </el-checkbox> -->

          </span>

          <!-- 【影视】- 视频源 选项  item.childCheckedVal[3] -->
          <span v-if="childItem.bav.value === '影视'" class="flex-row">
            <el-select
              v-model="item.childCheckedVal[3]"
              placeholder="内容源"
              style="width: 100px"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 10,
                selectPropKeyValue: 'name'
              })"
            >
              <el-option
                v-for="follow in getBehaviorAttrList(10)"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
            </el-select>
          </span>

          <!------ 查询影片+搜索集数  item.childCheckedVal[1] ------->
          <span v-if="childItem.bav.value !== 'K歌'" class="flex-row">
            <!-- 第 3 级  搜索片子 -->
            <!-- 【短视频】业务的查询影片要放在【选择博主】 后面 -->
            <!-- 【教育】业务的查询影片要放在 【选择 VIP】 后面 -->
            <!-- 【影视】业务的查询影片要放在 【视频源】 后面 -->
            <span v-if="childItem.bav.value === '短视频' || childItem.bav.value === '教育' || childItem.bav.value === '影视'">
              <el-select
                v-model="item.childCheckedVal[4]"
                style="width: 150px;"
                filterable
                remote
                placeholder="请输入片名或ID"
                no-data-text='没有找到该片'
                clearable
                :remote-method="(query) => { GetVideo(query, childItem.bav.value, item.childCheckedVal[3]) }"
                :loading="loading2"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 3,
                  selectPropKeyValue: 'name',
                  reverseSelectAttr: true
                })"
              >
                <el-option
                  v-for="video in videoOptions"
                  :key="video.name"
                  :label="video.name"
                  :value="video.value">
                </el-option>
                <!-- 编辑回显 选项 -->
                <el-option
                  v-if="videoOptions.length === 0 && item.childCheckedVal[4]"
                  :label="getMatchName(item.childCheckedVal[4], item.child)"
                  :value="item.childCheckedVal[4]">
                </el-option>
              </el-select>
            </span>

            <span v-else>
              <el-select
                v-model="item.childCheckedVal[1]"
                style="width: 150px;"
                filterable
                remote
                placeholder="请输入片名或ID"
                no-data-text='没有找到该片'
                clearable
                :remote-method="(query) => { GetVideo(query, childItem.bav.value, item.childCheckedVal[3]) }"
                :loading="loading2"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 3,
                  selectPropKeyValue: 'name',
                  reverseSelectAttr: true
                })"
              >
                <el-option
                  v-for="video in videoOptions"
                  :key="video.name"
                  :label="video.name"
                  :value="video.value">
                </el-option>
                <!-- 编辑回显 选项 -->
                <el-option
                  v-if="videoOptions.length === 0 && item.childCheckedVal[1]"
                  :label="getMatchName(item.childCheckedVal[1], item.child)"
                  :value="item.childCheckedVal[1]">
                </el-option>
              </el-select>

              <!-- <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect($event, item.child, item.childCheckedVal[1] ? item.childCheckedVal[1] : '', {clearVal: item.childCheckedVal[2], bavChildItem: item})"
              >
                圈出未起1播
              </el-checkbox> -->
            </span>
            <div
              v-for="(item2) in item.child"
              :key="item2.value"
              class="flex-row child"
            >
              <!-- {{ item2 }} -->
              <!-- 选择集数 -->
              <!--
                  反选时不展示
                  只有【影视】或者【电竞】业务可以选择集数
                  -->
              <span v-if="qiBoCollectionOptions.length > 0 && ( (item2.value === item.childCheckedVal[1] && childItem.bav.value === '电竞' ) || (item2.value === item.childCheckedVal[4] && childItem.bav.value === '影视') )">
                <el-select
                  v-model="item2.childCheckedVal[0]"
                  style="width: 100px;"
                  placeholder="请选择集数"
                  @change="handelChildBehavirSelectChange({
                    childItem: item2,
                    hasChild: false,
                    level: 4
                  })"
                >
                  <el-option
                    v-for="(tv, index) in qiBoCollectionOptions"
                    :key="tv.value + index"
                    :label="tv.name"
                    :value="tv.value">
                  </el-option>
                </el-select>
              </span>
            </div>
          </span>

          <!-- 选择【免费、会员..】   item.childCheckedVal[2]-->
          <!-- 反选时不展示 -->
          <span v-if="childItem.bav.value !== '短视频'" class="flex-row" >
            <!-- 第 5 级 -->
            <el-select
              v-model="item.childCheckedVal[7]"
              style="width: 100px"
              name="oxve"
              class="input-inline"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 5,
                selectPropKeyValue: 'name'
              })"
            >
              <template v-for="item in getBehaviorAttrList(5)">
                <el-option
                  :value="item.name"
                  :label="item.name"
                  :key="item.name"
                ></el-option>
              </template>
            </el-select>
          </span>
          <el-checkbox
            class="reverse-check"
            v-model="childItem.bav.reverseSelect"
            @change="ReverseSelect($event, item.child, item.childCheckedVal[4] ? item.childCheckedVal[4] : '', {clearVal: item.childCheckedVal[2], bavChildItem: item})"
          >
            圈出未起播
          </el-checkbox>
          <!-- {{ item.childCheckedVal[1] }} ---  -->
          <!-- {{ item.child }} ---  -->
          <!-- {{ item.child[1] }} --- -->
          <!-- 选了集数 -->
          <!-- <Type v-if="item.childCheckedVal[1] && item.child[1] && item.child[1].childCheckedVal && item.child[1].childCheckedVal.length > 0 && !childItem.bav.reverseSelect" ref="typeRef" :item3="childItem.bav.countValue" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.single_episode : []"  :childItem="childItem"></Type> -->
          <Type v-if="isCheckEpisodes(item) && !childItem.bav.reverseSelect" ref="typeRef" :item3="childItem.bav.countValue" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.single_episode : []"  :childItem="childItem"></Type>
          <!-- 没有选集数 -->
          <Type v-else-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="childItem.bav.countValue" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>

        </span>
      </span>

      <!-- 应用活跃 -->
      <span class="flex-column" v-else-if="childItem.tagCode === 'BAV0013' || childItem.tagCode === 'BAV0014' || childItem.tagCode === 'BAV0015'">
        <!-- 第一级 -->
        <el-form-item prop="bav.value">
          <el-select
            multiple
            v-model="childItem.bav.value"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            filterable
            @change="handelBehavirSelectChange()"
          >
            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <div class="flex-column">
          <ConditionLine :isShow="childItem.bav.behaviorValue.length > 1"></ConditionLine>
          <div
            v-for="(item, index) in childItem.bav.behaviorValue"
            :key="item.value"
            class="flex-row child-attr-wrap"
          >
            <span class="w100">{{ item.name }}</span>
            <!-- 二期新增字段：第二级 -->
            <el-form-item
              :prop="`bav.behaviorValue[${index}].childCheckedVal`"
              :rules="{ required: true, message: '请选择', trigger: 'change' }"
            >
              <el-select
                v-model="item.childCheckedVal"
                style="width: 120px"
                name="oxve"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item,
                  level: 2,
                  hasChild: true,
                  extra: {levelOneValue: item.value}
                })"
              >
                <template v-for="item in getBehaviorAttrList(2)">
                  <el-option
                    :value="item.value"
                    :label="item.name"
                    :key="item.value"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <span
              v-for="(item2, index2) in item.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >
              <span class="flex-column">
                <div class="flex-row">
                  <!-- 第三级 -->
                  <!-- <el-select
                    v-model="item2.childCheckedVal"
                    style="width: 110px"
                    name="asdq"
                    class="input-inline"
                    @change="handelChildBehavirSelectChange({
                      childItem: item2,
                      level: 3,
                      extra: {type: item.childCheckedVal, levelOneValue: item.value },
                      reverseSelectAttr: true
                    })"
                  >
                    <template v-for="attrChildItem in getBehaviorAttrList(3, {type: item.childCheckedVal})">
                      <el-option
                        :value="attrChildItem.value"
                        :label="attrChildItem.name"
                        :key="attrChildItem.value"
                      >
                      </el-option>
                    </template>
                  </el-select>
                  -->
                  <!-- {{ item2 }} -->
                  <template v-if="childItem.tagCode === 'BAV0013'">
                    <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item2.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.keep_days : []" :childItem="childItem"></Type>
                  </template>
                  <template v-else-if="childItem.tagCode === 'BAV0014'">
                    <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item2.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.keep_type : []" :childItem="childItem"></Type>
                  </template>
                  <template v-else-if="childItem.tagCode === 'BAV0015'">
                    <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item2.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>
                  </template>

                </div>

              </span>
              <!-- <el-checkbox
                class="reverse-check"
                v-model="childItem.bav.reverseSelect"
                @change="ReverseSelect($event, item2.child)"
              >
                圈出未活跃
              </el-checkbox> -->
            </span>

          </div>
        </div>
      </span>

      <!-- 优惠券行为 -->
      <span class="flex-row" v-else-if="childItem.tagCode === 'BAV0016'">
        <!-- 第一级 -->
        <el-form-item prop="bav.value">
          <el-select
            v-model="childItem.bav.value"
            style="width: 120px"
            name="oxve"
            class="input-inline"
            filterable
            @change="handelBehavirSelectChange()"
          >
            <template v-for="item in getBehaviorAttrList(1)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>

        <!-- {{ childItem.bav.showBehaviorValue }} -->

        <span
          v-for="(item, index) in childItem.bav.showBehaviorValue"
          :key="item.value"
          class="flex-row"
        >
          <!-- <el-form-item
            :prop="`bav.behaviorValue[${index}].childCheckedVal[0]`"
            :rules="{ required: true, message: '请选择', trigger: 'change' }"
          > -->
          <span class="flex-row">
            <el-select
              v-model="item.childCheckedVal[0]"
              placeholder="请选择"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                extra: {type: childItem.bav.value},
              })"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})" >
                <el-option
                  :value="attrChildItem.name"
                  :label="attrChildItem.name"
                  :key="attrChildItem.name"
                >
                </el-option>
              </template>
            </el-select>

            <span
              v-for="(item2, index2) in item.child"
              :key="index2"
              style="margin-right: 0;"
            >
              <Bav0012 v-if="item.childCheckedVal[0] === item2.value && !!item2.mapName" :aaa="item"></Bav0012>
            </span>
          </span>

          <!-- </el-form-item> -->

          <span class="flex-row">
            <el-select
              v-model="item.childCheckedVal[1]"
              placeholder="卡种"
              style="width: 100px"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 3,
              })"
            >
              <el-option
                v-for="follow in getBehaviorAttrList(3)"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
            </el-select>
          </span>

          <!-- 用券行为  有子级 -->
          <span class="flex-row">
            <el-select
              v-model="item.childCheckedVal[2]"
              placeholder="用券行为"
              style="width: 100px"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 4,
              })"
            >
              <el-option
                v-for="follow in getBehaviorAttrList(4)"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
            </el-select>
            <span
              v-for="(item2, index2) in item.child"
              :key="index2"
              style="margin-right: 0;"
            >
              <Bav0012 v-if="item.childCheckedVal[2] === item2.value && !!item2.mapName" :aaa="item"></Bav0012>
            </span>
          </span>

          <!-- 券方式 -->
          <span class="flex-row">
            <el-select
              v-model="item.childCheckedVal[3]"
              placeholder="券方式"
              style="width: 120px"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item,
                level: 5,
                selectPropKeyValue: 'name'
              })"
            >
              <el-option
                v-for="follow in getBehaviorAttrList(5)"
                :key="follow.name"
                :label="follow.name"
                :value="follow.name">
              </el-option>
            </el-select>

            <span class="flex-row" >
              <span
                v-for="(item2, index2) in item.child"
                :key="index2"
                style="margin-right: 0;"
              >
              <!-- 【{{ item2.name }}】 -->
                <template v-if="item.childCheckedVal[3] === item2.name">
                  <!-- 券金额 -->
                  <span v-if="item.childCheckedVal[3] == '劵金额'" class="flex-row" style="width: 300px; height: 31px">
                    <el-input-number :value="item2.value1" :min="1" :max="5000" @input="handelInputBetween($event, item2, 'value1')" @blur="handelInputBlur(item2)" controls-position="right"></el-input-number>
                  ~ <el-input-number :value="item2.value2" :min="1" :max="5000" @input="handelInputBetween($event, item2, 'value2')" @blur="handelInputBlur(item2)" controls-position="right"></el-input-number>
                  </span>

                  <!-- 产品包 ID -->
                  <span v-if="item.childCheckedVal[3] == '优惠券ID'" class="flex-row" style="min-width: 150px">
                    <el-input
                      placeholder="请输入产品包 ID"
                      v-model="item2.value"
                      clearable
                    >
                    </el-input>

                  </span>
                </template>

              </span>
            </span>
          </span>

          <Type ref="typeRef" :item3="childItem.bav.countValue" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>

        </span>

      </span>

      <!-- 111111111111111111111111111 -->
      <!-- <div>{{ childItem }}</div> -->
    </div>
  </el-form>
</template>

<script>

import Type from '../Type.vue'
import ConditionLine from '../ConditionLine.vue'
import Bav0012 from './Bav0012.vue'
import myMinix from './minix'
export default {
  inject: ['_this'],
  mixins: [myMinix], // todo.vue 中声明minix 进行混合
  components: {
    Type,
    ConditionLine,
    Bav0012
  },
  props: {
    childItem: {
      default: () => {},
      type: Object
    },
    bavAttrList: {
      default: () => {},
      type: Object
    }
    // isView: { // 查看模式
    //   type: Boolean,
    //   default: false
    // }
  },
  computed: {
    isView () {
      return this._this && this._this.isView ? this._this.isView : false
    }
  }
}

</script>
<style lang='stylus' scoped>
@import './index'
</style>
