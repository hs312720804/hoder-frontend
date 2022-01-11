/* eslint-disable no-mixed-operators */
<template>

  <el-form :model="childItem" ref="bav" :rules="bavFormRules" :inline="true">
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
                <span class="flex-row">
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
                          <el-input-number :value="item4.value1" :min="1" @input="handelInputBetween($event, item4, 'value1')" controls-position="right"></el-input-number>
                          <!-- <el-input :value="item4.value1" @input="handelInputBetween($event, item4, 'value1')" type="number"></el-input> -->
                          <div style="padding: 0 10px"><= {{ item4.name.substr(-4, 4) }} <=</div>
                          <el-input-number :value="item4.value2" :min="1" @input="handelInputBetween($event, item4, 'value2')" controls-position="right"></el-input-number>天
                          <!-- <el-input :value="item4.value2" @input="handelInputBetween($event, item4, 'value2')" type="number"></el-input> -->
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
                              multiple
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
                                        <el-input-number :value="item5.value1" :min="1" :max="5000" @input="handelInputBetween($event, item5, 'value1')" controls-position="right"></el-input-number>
                                      —<el-input-number :value="item5.value2" :min="1" :max="5000" @input="handelInputBetween($event, item5, 'value2')" controls-position="right"></el-input-number>
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
                        <!-- 天数次数等 -->
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
                              >
                                <el-option value="="></el-option>
                                <el-option value=">="></el-option>
                                <el-option value="<="></el-option>
                                <el-option value=">"></el-option>
                                <el-option value="<"></el-option>
                              </el-select>
                              <el-input
                                placeholder="请输入"
                                v-model="item7.value"
                                clearable
                                style="max-width: 100px; min-width: 100px;"
                              >
                              </el-input>
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
                                >
                                  <el-option value="="></el-option>
                                  <el-option value=">="></el-option>
                                  <el-option value="<="></el-option>
                                  <el-option value=">"></el-option>
                                  <el-option value="<"></el-option>
                                </el-select>
                                <el-input
                                  placeholder="请输入"
                                  v-model="item8.value"
                                  clearable
                                  style="max-width: 100px; min-width: 100px;"
                                >
                                </el-input>
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
                        >
                          <el-option value="="></el-option>
                          <el-option value=">="></el-option>
                          <el-option value="<="></el-option>
                          <el-option value=">"></el-option>
                          <el-option value="<"></el-option>
                        </el-select>
                        <el-input
                          v-if="index === 0"
                          placeholder="请输入"
                          v-model="item6.value"
                          clearable
                          style="max-width: 100px; min-width: 100px;"
                        >
                        </el-input>
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
      <span class="flex-row" v-if="childItem.tagCode === 'BAV0012'">
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
                @change="ReverseSelect($event, item.child, item.childCheckedVal[1], {clearVal: item.childCheckedVal[2], bavChildItem: item})"
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

      <!-- 1111111111111 -->
      <!-- <div>{{ childItem }}</div> -->
    </div>
  </el-form>
</template>

<script>
import Type from '../Type.vue'
import ConditionLine from '../ConditionLine.vue'
import LabelZone from '../../../views/LabelSquare/LabelZone.vue'
import Bav0012 from './Bav0012.vue'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'bavList',
  provide () {
    return {
      _this: this
    }
  },
  components: {
    Type,
    ConditionLine,
    LabelZone,
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
  },
  watch: {
    'childItem.bav': {
      handler (val) {
        // console.log('1111111111====', val)
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
        console.log('childItem=====>>>', val)
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
    // debugger
    // if (this.childItem.tagCode === 'BAV0012') { // 【综合起播】数据需要重组
    //   console.log('123141==>', this.childItem.bav.behaviorValue)
    //   debugger
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
        child: [
          {
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string'
          }
        ]
      },
      dataSourceColorEnum: {
        1: 'success',
        2: 'danger',
        3: '',
        5: 'warning',
        6: 'warningOrange',
        7: 'warningOrange2',
        8: 'warningCyan'
      },
      moDefaultChild: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }],
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
      musicList: [],
      singerList: []
    }
  },
  created () {},
  methods: {
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

    handelInputBetween (val, item, key) {
      this.$set(item, key, val)
      if (!item.value1 || item.value1 < 0) {
        this.$set(item, 'value1', 0)
      }
      if (!item.value2 || item.value2 < 0) { this.$set(item, 'value2', 0) }
      if (item.value1 && item.value2 && item.value2 < item.value1) { // 自定义时间仅支持正数，过期时间的大数在前面，小数在后面
        const num = item.value1
        item.value1 = item.value2
        item.value2 = num
      }
      item.value = `${item.value1}-${item.value2}`
    },

    // 反选
    ReverseSelect (val, behaviorValue, seclectVal = 'default', { clearVal, bavChildItem } = {}) {
      // seclectVal 当是【综合起播】时，需要根据选中的值特殊处理
      console.log('val===>', val)
      console.log('a===>', behaviorValue)
      this.childItem.bav.reverseSelect = val

      // 应用活跃 起波活跃
      if (
        this.childItem.tagCode === 'BAV0002' ||
        this.childItem.tagCode === 'BAV0003' ||
        this.childItem.tagCode === 'BAV0008' ||
        this.childItem.tagCode === 'BAV0006'
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
        this.childItem.tagCode === 'BAV0012' ||
        this.childItem.tagCode === 'BAV0011'
      ) {
        if (val) {
          let showBehaviorValue = this.childItem.bav.showBehaviorValue[0]
          if (showBehaviorValue.child && showBehaviorValue.child.length > 0) {
            // 一维数组循环找到存在值得项
            let firstChild = showBehaviorValue.child
            for (let i = firstChild.length; i--; i > 0) {
              let curChild = firstChild[i]
              // 没有子集且存在值
              if (curChild.value && (curChild.child && curChild.child.length <= 0)) {
                curChild.operator = '!='
                break
              } else if (curChild.value && (curChild.child && curChild.child.length > 0)) { // 存在子集
                let list = [this.getNodesLastItem([curChild]).pop()] // 【起播活跃】【综合起播】比较特殊，只取最后一个对象反选
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
        let operator = val ? '!=' : '='
        let currentId = !isCurrentNodeId && nodeItem.child && nodeItem.child.length > 0 ? nodeItem.parentId : nodeItem.id
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
      const nodeTree = this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011' ? this.childItem.bav.showBehaviorValue : this.childItem.bav.behaviorValue
      if (!nodes || !id) {
        return
      }

      // 指标属性不作为反选，【购买行为】的价格区间，产品包id不作为反选
      const countArray = ['mac', 'day_play_time', 'dt', 'product_price', 'product_id']
      for (let i = 0; i < nodes.length; i++) {
        let item = nodes[i]
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
      let params = {
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
        let params = {
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
        let params = {
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
      let { hasChild = false, level = 1, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, reverseSelectAttr } = params
      const childItem = this.childItem

      const vals = (typeof (childItem.bav.value) === 'string' ? childItem.bav.value.split(',') : childItem.bav.value)
      const behaviorAttrList = this.getBehaviorAttrList(level)

      if (childItem.tagCode === 'BAV0012' || childItem.tagCode === 'BAV0011') { // 【综合起播】 的数据放在 showBehaviorValue 字段中， 需要特殊处理
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
      debugger
      // 改变数据时将所有的checkbox归位false
      this.$set(this.childItem.bav, 'reverseSelect', false)
      if (this.childItem.tagCode === 'BAV0012' || this.childItem.tagCode === 'BAV0011') {
        this.childItem.bav.showBehaviorValue = this.setRecoveryItem(this.childItem.bav.showBehaviorValue)
      } else if (
        this.childItem.tagCode === 'BAV0002' ||
        this.childItem.tagCode === 'BAV0003' ||
        this.childItem.tagCode === 'BAV0008' ||
        this.childItem.tagCode === 'BAV0011') {
        this.childItem.bav.behaviorValue = this.setRecoveryItem(this.childItem.bav.behaviorValue)
      }
      // 每次切换重置数据
      let { childItem, hasChild = false, level = 2, extra = {}, selectPropKeyValue = 'value', isValueClear = false, defaultChild, reverseSelectAttr } = params
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
          value: ''
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
          item.operator = '='
        }
        if (item.child && item.child.length > 0) {
          this.setRecoveryItem(item.child)
        } else {
          item.operator = '='
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
      const { vals, behaviorValue, attrList, hasChild = false, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, level, reverseSelectAttr, parentId, extra = {} } = params
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
              child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
            }]
          }]
        } else {
          list = [{
            name: '',
            value: '',
            field: '',
            operator: '=',
            type: 'string',
            child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
          }]
        }
      }

      const reverseSelect = reverseSelectAttr ? this.childItem.bav.reverseSelect : false // 反选

      vals.forEach(val => {
        if (!val) return
        let obj = {}
        const lastNumberObj = [
          {
            name: '',
            value: '',
            field: 'mac',
            operator: '=',
            type: 'count'
          }
        ]
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        const matchObj = behaviorValue.find(item => item[selectPropKeyValue] === val || item.value === val || item.name === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val || item.value === val)
        obj = matchObj || matchObj2

        // 清空对象中的 value（【模块活跃 004】特殊 value 不等于下拉选项的 value，而是后面查询出来的结果）
        if (isValueClear) obj.value = ''

        if (reverseSelect) { // 反选
          if (this.childItem.tagCode === 'BAV0012') {
            if ((level === 7 && vals[5] === obj.value) || (level === 3 && vals[1] === obj.value)) { // 切换歌曲 或者 切换影片
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
                    child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
                  }]
                }]
                break
              case 3:
                defaultchild = [{
                  name: '',
                  value: '',
                  field: 'app_version',
                  operator: '=',
                  type: 'string',
                  child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
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
                  child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
                }]
                break
              case 3:
                defaultchild = [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
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
                  child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
                }]
              }]
              break
            case 3:
              defaultchild = [{
                name: '',
                value: '',
                field: '',
                operator: '=',
                type: 'string',
                child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
              }]
              break
          }
        }

        if (this.childItem.tagCode === 'BAV0003' && level === 5) { // 【购买行为】
          defaultchild = [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
        }

        if (selectPropKeyValue === 'selectKey' && obj[selectPropKeyValue] === 'album_id1') { // BAV0004 模块活跃 选择推荐位 下一级是序号+【次数/天数】
          defaultchild = [{
            name: '1',
            value: '0',
            field: 'block_pid',
            operator: '=',
            type: 'string',
            child: [{ name: '', value: '', field: 'mac', operator: '=', type: 'count' }]
          }]

          obj.childCheckedVal = '0' // 序号默认值为 0
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

        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })

      // 动态设置子集的id与parentId
      list = this.setChildId(list, parentId)

      console.log('list===>', list)
      console.log('nodes===>', this.childItem.bav)
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
        let obj = behaviorValue[0] // 不改变子级的数据
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
            childCheckedVal: []
          }],
          videoType: '',
          source: '',
          childCheckedVal: ['']
        }]
      }
      vals.forEach(val => {
        const lastNumberObj = [
          { name: '', value: '', field: 'mac', operator: '=', type: 'count' }
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
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))

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
                    type: 'string'
                  }
                ]
              }
            ]
          }]
        }

        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
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
      let { childItem, hasChild = false, level = 2, extra = {}, selectPropKeyValue = 'value', isValueClear = false, defaultChild = [], reverseSelectAttr } = params

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
          if (level === 1) {
            attrlist = dict.page_active
          }
        } else if (childItem.tagCode === 'BAV0006') {
          if (level === 1) {
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
          } else if (level === 3) {
            return this.videoOptions // 视频
          } else if (level === 4) {
            return this.qiBoCollectionOptions // 集数
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
          } if (level === 10) { // 视频源
            attrlist = dict.source
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
</script>
<style lang='stylus' scoped>
@import './index'
</style>
