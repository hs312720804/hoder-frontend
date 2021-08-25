<template>
  <div class="bav-attr-warp">
    <el-tag class="oc-item" :type="dataSourceColorEnum[childItem.dataSource]">
      {{ childItem.tagName }} - {{ childItem.tagCode }}
    </el-tag>

    <!-- 会员状态 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0001'">
      <div class="flex-row">
        <!-- 新增一级 -->
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

        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-column"
        >
          <!-- {{ item }} -->
          <!-- 第二级 -->
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
            <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})">
              <el-option
                :value="attrChildItem.value"
                :label="attrChildItem.name"
                :key="attrChildItem.value"
              ></el-option>
            </template>
          </el-select>

          <div class="flex-column">

            <ConditionLine :isShow="item.child.length > 1"></ConditionLine>

            <div
              v-for="item2 in item.child"
              :key="item2.value"
              class="flex-row child-attr-wrap"
            >

              <span class="w100">{{ item2.name }}</span>
              <span class="flex-row">
                <!-- 第三级 -->
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
                        <el-input-number :value="item4.value1" @input="handelInputBetween($event, item4, 'value1')" controls-position="right"></el-input-number>
                        <!-- <el-input :value="item4.value1" @input="handelInputBetween($event, item4, 'value1')" type="number"></el-input> -->
                        <div style="padding: 0 10px"><=到期时间<=</div>
                        <el-input-number :value="item4.value2" @input="handelInputBetween($event, item4, 'value2')" controls-position="right"></el-input-number>
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
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0002'">
      <!-- 第一级 -->

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
      <div class="flex-column">
        <ConditionLine :isShow="childItem.bav.behaviorValue.length > 1"></ConditionLine>
        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-row child-attr-wrap"
        >
          <span class="w100">{{ item.name }}</span>
          <!-- 二期新增字段：第二级 -->
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
            <template v-for="item in getBehaviorAttrList(2)">
              <el-option
                :value="item.value"
                :label="item.name"
                :key="item.value"
              ></el-option>
            </template>
          </el-select>
          <span
            v-for="(item2, index2) in item.child"
            :key="'typeInputValue' + index2"
            class="flex-row"
          >
            <!-- {{item.childCheckedVal}} -->
            <span class="flex-column">
              <!-- 第三级 -->
              <el-select
                multiple
                v-model="item2.childCheckedVal"
                style="width: 110px"
                name="asdq"
                class="input-inline"
                @change="handelChildBehavirSelectChange({
                  childItem: item2,
                  hasChild: true,
                  level: 3,
                  extra: {type: item.childCheckedVal}
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
                    :key="'typeInputValue' + index2"
                    class="flex-row"
                  >
                    <!-- 次数、天数 -->
                    <!-- 选择【激活】时，不展示次数天数 -->
                    <Type v-if="item.value !== '激活'" ref="typeRef" :item3="item4" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>
                  </span>
                </span>
              </div>
            </span>
          </span>

        </div>
      </div>
    </span>

    <!-- 购买行为 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0003'">
      <div class="flex-row">
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
        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-column"
        >
          <!-- 第二级 -->
            <!-- @change="handelBehavirSelectChange(false, 2, [], 'field')" -->
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

          <div class="flex-column">
            <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
            <div
              v-for="item2 in item.child"
              :key="item2.value + item2.name"
              class="flex-row child-attr-wrap"
            >
              <span class="w100">{{ item2.name }}</span>
              <span class="flex-column">
                <!-- 第二级 -->
                <!-- {{ item }} -->
                <!-- @change="handelChildBehavirSelectChange(item, true, childItem, 2)" -->
                <div>
                  <el-select
                    multiple
                    v-model="item2.childCheckedVal"
                    style="width: 110px"
                    name="asdq"
                    class="input-inline"
                    @change="handelChildBehavirSelectChange({
                      childItem: item2,
                      hasChild: true,
                      level: 3,
                      extra: {type: childItem.bav.value}
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

                  <!-- 历史购买才有反选 -->
                  <el-checkbox
                    v-if="item2.field === 'purchase_recent_two_years'"
                    class="reverse-check"
                    v-model="childItem.bav.reverseSelect"
                    @change="changeAAA($event, childItem.bav.behaviorValue)"
                  >
                    圈出未购买
                  </el-checkbox>
                </div>

                <!-- {{ item.childCheckedVal }} -->
                <div class="flex-column">
                  <ConditionLine :isShow="item2.child.length > 1"></ConditionLine>
                  <span
                    v-for="(item3, index) in item2.child"
                    :key="index"
                    class="flex-row"
                  >
                  <!-- {{item2}} -->
                    <span class="flex-row">
                      <span class="w100">{{ item3.name }}</span>
                      <span v-if="item2.field === 'purchase_recent_two_years'" class="flex-column" >
                        <!-- 历史购买 -->
                        <!-- 第三级 -->
                        <el-select
                          multiple
                          v-model="item3.childCheckedVal"
                          style="width: 110px"
                          name="asdq"
                          class="input-inline"
                          @change="handelChildBehavirSelectChange({
                            childItem: item3,
                            hasChild: true,
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
                        <div class="flex-column">
                          <ConditionLine :isShow="item3.child.length > 1"></ConditionLine>
                          <span
                            v-for="(item4, index2) in item3.child"
                            :key="'typeInputValue' + index2"
                            class="flex-column"
                          >
                            <!-- 第四级 -->
                            <span class="flex-row">
                              <span class="w100">{{ item4.name }}</span>
                              <span
                                v-for="(item5, index) in item4.child"
                                :key="index"
                                class="flex-row"
                              >
                                <!-- 次数、天数 -->
                                <!-- <Type ref="typeRef" :item3="item4"></Type> -->
                                <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item5" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>
                              </span>
                            </span>
                          </span>
                        </div>
                      </span>
                      <span v-else class="flex-column">
                        <!-- 首次购买  -->
                        <!-- 第三级 -->
                        <!-- {{ item3 }} -->
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
                      </span>
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
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0004'">
      <div class="flex-row">
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

        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-column"
        >
            <!-- @change="handelBehavirSelectChange(false, 1, moDefaultChild, 'selectKey', true)" -->
          <div>
          <!-- 第二级 -->
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
                isValueClear: true
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
            <el-checkbox
              class="reverse-check"
              v-model="childItem.bav.reverseSelect"
              @change="changeAAA($event, childItem.bav.behaviorValue)"
            >
              圈出未活跃
            </el-checkbox>
          </div>
          <div class="flex-column">
            <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
            <div
              v-for="(item2, index) in item.child"
              :key="'mo' + index"
              class="flex-row child-attr-wrap"
            >
              <!-- {{ item2 }} -->
              <span class="w100">{{ item2.name }}</span>
              <!-- {{item}} -->
              <span class="flex-row">
                  <!-- 推荐位、板块位 -->
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
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0005'">
      <!-- 第一级 -->
      <div>
        <el-select
          multiple
          v-model="childItem.bav.value"
          style="width: 120px"
          name="oxve"
          class="input-inline"
          @change="handelBehavirSelectChange(true)"
        >
          <template v-for="item in getBehaviorAttrList()">
            <el-option
              :value="item.value"
              :label="item.name"
              :key="item.value"
            ></el-option>
          </template>
        </el-select>
        <el-checkbox
          class="reverse-check"
          v-model="childItem.bav.reverseSelect"
          @change="changeAAA($event, childItem.bav.behaviorValue)"
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
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0006'">
      <div class="flex-row">
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
        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-column"
        >
          <!-- 第二级 -->
              <!-- @change="handelBehavirSelectChange(true)" -->
          <div>
            <el-select
              multiple
              v-model="item.childCheckedVal"
              style="width: 120px"
              name="oxve"
              class="input-inline"
              @change="handelChildBehavirSelectChange({
                childItem: item,
                hasChild: true,
                level: 2,
                extra: {type: childItem.bav.value}
              })"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                ></el-option>
              </template>
            </el-select>
            <el-checkbox
              class="reverse-check"
              v-model="childItem.bav.reverseSelect"
              @change="changeAAA($event, childItem.bav.behaviorValue)"
            >
              圈出未使用
            </el-checkbox>
          </div>
          <div class="flex-column">
            <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
            <div
              v-for="item2 in item.child"
              :key="item2.value"
              class="flex-row child-attr-wrap"
            >
              <span class="w100">{{ item2.name }}</span>
              <span class="flex-column">
                <!-- 第二级 -->
                <span
                  v-for="(item3, index) in item2.child"
                  :key="index"
                  class="flex-row child"
                >
                  <!-- 次数、天数 -->
                  <Type v-if="!childItem.bav.reverseSelect" ref="typeRef" :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </span>

    <!-- 设备活跃 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0007'">
      <!-- 次数、天数 -->
      <Type ref="typeRef" :item3="childItem.bav.behaviorValue[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
    </span>

    <!-- 起播行为 -->
    <span class="flex-row" v-if="childItem.tagCode === 'BAV0008'">
       <!-- 第一级 -->
      <el-select
        v-model="childItem.bav.value"
        placeholder="请选择业务分类"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(false, 1, childItem.bav.behaviorValue[0].child)"
      >
        <template v-for="item in getBehaviorAttrList(1)">
          <el-option
            :value="item.value"
            :label="item.name"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
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
              placeholder="请选择内容源"
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
                  isValueClear: true
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
                  v-if="qiBoOptions.length === 0 && item4.child[0].value !== ''"
                  :label="item4.child[0].name"
                  :value="item4.childCheckedVal[0]">
                </el-option>
              </el-select>
              <span
                v-for="(item5, index) in item4.child"
                :key="index"
                class="flex-row child"
              >
                <!-- 选择了视频源下的视频 -->
                <span v-if="!!item5.value" class="flex-column">
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
                      <span>
                        <span
                          v-for="(item6, index) in item5.child"
                          :key="index"
                          class="flex-row child"
                        >
                          <!-- @change="handelQiBoChildBehavi666rSelectChange(item6, false, childItem, 8, {}, 'type', true)" -->
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
                              :value="attrChildItem.type">
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
                            <!-- <el-input v-model="item3.value" placeholder="请输入" style="max-width: 100px; min-width: 100px;"></el-input> -->
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
                    <div class="flex-column">
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
                        <span>
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
                                :value="attrChildItem.type">
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
                                :label="attrChildItem.name"
                                :value="attrChildItem.type">
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

                <!-- 没有选择视频 -->
                <span v-else>
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
                        :value="attrChildItem.type">
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
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0009'">
      <div class="flex-row">
        <!-- 新增一级 -->
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

        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-row"
        >
          <!-- {{ item }} -->
          <!-- 第二级 -->
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
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0010'">
      <div class="flex-row">
        <!-- 新增一级 -->
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

        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-row"
        >
          <!-- {{ item }} -->
          <!-- 第二级 -->
          <el-select
            multiple
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

        </div>
      </div>
    </span>

    <!-- 起播活跃 -->
    <span class="flex-row" v-if="childItem.tagCode === 'BAV0011'">
       <!-- 第一级 -->
       <!-- {{childItem.bav.value}} -->
       <!-- {{childItem.bav}} -->
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
      <div
        v-for="item in childItem.bav.behaviorValue"
        :key="item.value"
        class="flex-row"
      >
        <!-- {{item.childCheckedVal}} -->
        <!-- 第二级 -->
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
          <template v-for="attrChildItem in getBehaviorAttrList(2, {type: childItem.bav.value})">
            <el-option
              :value="attrChildItem.value"
              :label="attrChildItem.name"
              :key="attrChildItem.value"
            >
            </el-option>
          </template>
        </el-select>
        <!-- {{item.child}} -->
        <span
          v-for="(item2, index) in item.child"
          :key="index"
          class="flex-row child"
        >
        <!-- {{ item.childCheckedVal[0] }} -->
          <!-- 第三级 搜索关注博主-->
          <div v-if="item.childCheckedVal[0] === '关注'" class="flex-row">

            <el-select
              v-model="item2.childCheckedVal[0]"
              style="width: 150px;"
              filterable
              remote
              placeholder="请输入博主"
              no-data-text='暂无数据'
              clearable
              :remote-method="(query) => { GetShortVideoAuthor(query) }"
              :loading="loading2"
              @change="handelChildBehavirSelectChange({
                childItem: item2,
                level: 3,
                extra: {type: '关注'},
                hasChild: true
              })"
            >
              <el-option
                v-for="follow in followOptions"
                :key="follow.value"
                :label="follow.name"
                :value="follow.value">
              </el-option>
              <!-- 编辑回显 选项-->
              <!-- <el-option
                v-if="qiBoOptions.length === 0"
                :label="item3.child[0].name"
                :value="item3.childCheckedVal[0]">
              </el-option> -->
            </el-select>
            <!-- {{item2.child}} -->

            <span
              v-for="(item3, index2) in item2.child"
              :key="'typeInputValue' + index2"
              class="flex-row"
            >
              <!-- 次数、天数 -->
              <Type ref="typeRef" :item3="item3.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
            </span>
          </div>

          <!-- 第三级 分类或者影片-->
          <div v-else class="flex-row">
            <el-select
              v-model="item2.childCheckedVal[0]"
              placeholder="请选择"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              clearable
              @change="handelChildBehavirSelectChange({
                childItem: item2,
                isValueClear: false,
                level: 3,
                extra: {type: item.childCheckedVal[0], list: getBehaviorAttrList(2, {type: childItem.bav.value})},
                selectPropKeyValue: 'name'
              })"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(3, {type: item.childCheckedVal[0], list: getBehaviorAttrList(2, {type: childItem.bav.value})})">
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
                  v-model="item3.childCheckedVal[0]"
                  placeholder="请选择"
                  style="width: 110px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange({
                    childItem: item3,
                    isValueClear: false,
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
                  <Type ref="typeRef" :item3="item4.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
              {{item2}}
                </span>
              </div>

              <!-- 第四级 影片  -->
              <div v-else class="flex-row">
              <!-- {{item3.childCheckedVal[0]}} -->
              <!-- {{item3.child}} -->
                <div v-if="childItem.bav.value === '影视'" class="flex-row">    <!-- 影视 -->
                  <el-select
                    v-model="item3.childCheckedVal[0]"
                    style="width: 110px"
                    name="asdq"
                    class="input-inline"
                    placeholder="请选择内容源"
                    clearable
                    @change="handelChildBehavirSelectChange({
                      childItem: item3,
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
                    v-for="(item4, index) in item3.child"
                    :key="index"
                    class="flex-row child"
                  >

                    <!-- qiBoRemoteMethod 参数(keyWords, 视频源) -->
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
                      @change="handelChildBehavirSelectChange({
                        childItem: item4,
                        level: 5,
                        extra: {type: '影片', source: childItem.bav.value}
                      })"
                    >
                      <el-option
                        v-for="tv in qiBoOptions"
                        :key="tv.value"
                        :label="tv.name +'('+ tv.value+')'"
                        :value="tv.value">
                      </el-option>
                      <!-- 编辑回显 选项-->
                      <!-- <el-option
                        v-if="qiBoOptions.length === 0"
                        :label="item3.child[0].name"
                        :value="item3.childCheckedVal[0]">
                      </el-option> -->
                    </el-select>
                    <span
                      v-for="(item5, index) in item4.child"
                      :key="index"
                      class="flex-row child"
                    >
                      <el-select
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
                      </el-select>
                    </span>
                    <!-- {{item4.child}} -->
                  </span>
                </div>

                <div v-else class="flex-row">   <!-- 短视频、电竞 -->  <!-- GetVideo 参数 ：(keyWords, 业务类型) -->
                  <el-select
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
                      extra: {type: '影片'}
                    })"
                  >
                    <el-option
                      v-for="video in videoOptions"
                      :key="video.value"
                      :label="video.name"
                      :value="video.value">
                    </el-option>
                    <!-- 编辑回显 选项-->
                    <!-- <el-option
                      v-if="qiBoOptions.length === 0"
                      :label="item3.child[0].name"
                      :value="item3.childCheckedVal[0]">
                    </el-option> -->
                  </el-select>
                </div>

              </div>

            </span>
          </div>
        </span>
      </div>
    </span>

    <!-- <div>{{childItem.bav}}</div> -->
  </div>
</template>

<script>
import Type from '../Type.vue'
import ConditionLine from '../ConditionLine.vue'
import LabelZone from '../../../views/LabelSquare/LabelZone.vue'

export default {
  name: 'bavList',
  components: {
    Type,
    ConditionLine,
    LabelZone
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
    childItem: {
      handler (val) {
        console.log('childItem=====>>>', val.bav)
        // 编辑回显
        if (val && val.tagCode === 'BAV0004') { // 模块活跃需要查询版面、板块ID
          this.getModuleId(val.bav.behaviorValue)
        } else if (val && val.tagCode === 'BAV0008') { // 起播行为标签需要查询影片集数
          this.getQiboTvEpisodes(val.bav.behaviorValue)
        }
      },
      // deep: true,
      immediate: true
    }
  },
  data () {
    return {
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
            filed: '',
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
      moDefaultChild: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }],
      moOptions: {},
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
        pageSize: 10
      },
      followOptions: [],
      videoOptions: []

    }
  },
  created () {},
  methods: {
    handelInputBetween (val, item, key) {
      this.$set(item, key, val)
      if (!item.value1) { this.$set(item, 'value1', 0) }
      if (!item.value2) { this.$set(item, 'value2', 0) }
      item.value = `${item.value1}-${item.value2}`
    },

    // 反选
    changeAAA (val, behaviorValue) {
      console.log('val===>', val)
      console.log('a===>', behaviorValue)
      behaviorValue.forEach(item => {
        if (val) {
          item.operator = '!='
          this.childItem.bav.reverseSelect = true
        } else {
          item.operator = '='
          this.childItem.bav.reverseSelect = false
        }
      })
    },

    // 起播行为影片搜索更多
    handelQiboLoadmore () {
      this.qiboParams.page++ // 滚动加载翻页
      this.qiBoRemoteMethod(this.qiboQuery, this.qiboSource)
    },

    // 模块活跃编辑，获取版面/板块ID
    getModuleId (bavVal) {
      console.log('bavVal====', bavVal)
      bavVal && bavVal.forEach(obj => {
        console.log('obj===', obj)
        if (obj.value !== '' && (obj.field === 'album_id' || obj.field === 'forum_id')) {
          this.remoteMethod(obj.value, obj.field, this.childItem.bav.value)
        } else {
          this.getModuleId(obj.child) // 递归
        }
      })
    },

    // 起播行为编辑，获取影片集数
    getQiboTvEpisodes (bavVal) {
      // eslint-disable-next-line no-debugger
      debugger
      bavVal.forEach(obj => {
        if (obj.videoType && obj.videoType !== '电影' && obj.source && obj.value) {
          this.getTvEpisodes(obj.source, obj.value)
        } else if (obj.child) {
          this.getQiboTvEpisodes(obj.child)
        }
      })
    },

    GetVideo (keywords, businessType = '') {
      if (keywords !== '') {
        this.loading2 = true

        const params = {
          keywords,
          businessType,
          page: 1,
          pageSize: 20
        }

        this.$service.getVideo(params).then(res => {
          this.loading2 = false
          let list = res.rows || []

          list = list.map(obj => {
            return {
              name: `${obj.title}+(${obj.coocaaBVId})`,
              value: obj.coocaaBVId,
              field: obj.tableField,
              type: 'string'
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

    GetShortVideoAuthor (query) {
      if (query !== '') {
        this.loading2 = true

        const params = {
          keywords: query,
          page: 1,
          pageSize: 20
        }

        this.$service.getShortVideoAuthor(params).then(res => {
          this.loading2 = false
          let list = res.rows

          list = list.map(obj => {
            return {
              name: obj.userName + '(' + obj.mcn + ')',
              value: obj.authorId,
              field: obj.tableField,
              type: 'string',
              mcn: obj.mcn
            }
          })
          this.followOptions.push(...list)
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

    remoteMethod (query, field, businessType) {
      if (query !== '') {
        this.loading = true
        let params = {
          type: field === 'forum_id' ? 'forum' : 'album', // 'album_id', 'forum_id'
          keywords: query,
          page: 1,
          pageSize: 10,
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
     * 组装数据格式
     * @param {Array} vals 选中值的集合
     * @param {Array} behaviorValue 完整的组装好的集合
     * @param {Array} attrList 下拉框列表
     * @param {Boolean} hasChild = false 是否有 child
     * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
     * @param {String} selectPropKeyValue = 'value' 下拉框的 value和key 字段的 key值
     * @param {Boolean} isValueClear = false 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
     * @param {Number} level 第几级（为获取下拉框list）
     */
    getValListByVals (vals, behaviorValue, attrList, hasChild = false, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, level) {
      let list = []
      vals.forEach(val => {
        const lastNumberObj = [
          { name: '', value: '', filed: '', operator: '=', type: 'count' }
        ]

        let obj = []

        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        const matchObj = behaviorValue.find(item => item[selectPropKeyValue] === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val)

        if (matchObj) {
          obj = matchObj
        } else if (matchObj2) {
          obj = matchObj2
          // 清空对象中的 value（模块活跃特殊 value 不等于下拉选项的 value，而是后面查询出来的结果）
          if (isValueClear) obj.value = ''
        }

        // 模块活跃，默认 child 值特殊处理
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))
        if (selectPropKeyValue === 'selectKey' && obj[selectPropKeyValue] === 'album_id1') { // BAV0004 模块活跃 推荐位
          defaultchild = [{
            name: '',
            value: '',
            filed: '',
            operator: '=',
            type: 'string',
            child: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }]
          }]
        }
        if (this.childItem.tagCode === 'BAV0002' && level === 2) { // 应用活跃, 切换数据时，下一级清空，下下级保持存在
          defaultchild = [{
            name: '',
            value: '',
            filed: '',
            operator: '=',
            type: 'string',
            child: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }]
          }]
        }

        obj.child = obj.child || (hasChild ? lastNumberObj : defaultchild) // 根据是否最后一级，添加不同的 child

        obj.childCheckedVal = obj.childCheckedVal || (typeof (obj.childCheckedVal) === 'string' ? '' : [])

        if (defaultchild.length > 0) {
          obj.childCheckedVal = typeof (obj.childCheckedVal) === 'string' ? defaultchild.map(item => item.value).join(',') : defaultchild.map(item => item.value)
        }

        if (this.childItem.tagCode === 'BAV0002' && level === 2) { // 应用活跃
          obj.childCheckedVal = []
        }

        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })
      // console.log('list===>', list)
      return list
    },

    /**
     * 行为标签下拉框切换绑定事件
     * @param {Object} childItem 当前选项的 obj
     * @param {Boolean} hasChild = false 是否有 child
     * @param {Number} level = 1 第几级（为获取下拉框 list ）
     * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
     * @param {String} selectPropKeyValue = 'value' 下拉框的 value 和 key 字段的 key 值
     * @param {Boolean} isValueClear = 'false' 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
     */
    handelBehavirSelectChange (hasChild = false, level = 1, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false) {
      const childItem = this.childItem
      console.log('childItem==>', childItem)
      // const vals = childItem.bav.value
      const vals = (typeof (childItem.bav.value) === 'string' ? childItem.bav.value.split(',') : childItem.bav.value)
      const behaviorValue = childItem.bav.behaviorValue
      const behaviorAttrList = this.getBehaviorAttrList(level)

      childItem.bav.behaviorValue = this.getValListByVals(
        vals,
        behaviorValue,
        behaviorAttrList,
        hasChild,
        defaultChild,
        selectPropKeyValue,
        isValueClear
      )
    },

    /**
     * 行为标签下拉框切换绑定事件
     * @param {Object} childItem 当前选项的obj
     * @param {Boolean} hasChild = false 是否有 child
     * @param {Number} level = 2 第几级（为获取下拉框 list ）
     * @param {Object} extra 附加信息（根据选项判断，为获取不同下拉框list）
     * @param {String} selectPropKeyValue = 'value' 下拉框的 value 和 key 字段的 key 值
     * @param {Boolean} isValueClear = 'false' 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
     * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
     */
    handelChildBehavirSelectChange (params) {
      let { childItem, hasChild = false, level = 2, extra, selectPropKeyValue = 'value', isValueClear = false, defaultChild } = params

      const vals = typeof (childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const behaviorValue = childItem.child || []
      // const behaviorAttrList = this.getChildBehaviorAttrList()
      if (extra.type === '影片') {
        this.getVideoEpisode()
        // this.getTvEpisodes(obj.source, obj.value)
      }
      const behaviorAttrList = this.getBehaviorAttrList(level, extra)
      childItem.child = this.getValListByVals( // 组装数据
        vals,
        behaviorValue,
        behaviorAttrList,
        hasChild,
        defaultChild,
        selectPropKeyValue,
        isValueClear,
        level
      )
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, behaviorValue -- 已经组装好的集合, attrList -- 下拉框列表
    /**
     * 组装数据格式
     * @param {Array} vals 选中值的集合
     * @param {Array} behaviorValue 已经组装好的集合
     * @param {Array} attrList 下拉框列表
     * @param {Boolean} hasChild = false 是否有 child
     * @param {Object} defaultChild = [] 所清空下一级 child 时的默认赋值
     * @param {String} selectPropKeyValue = 'value' 下拉框的 value和key 字段的 key值
     * @param {Boolean} isValueClear = false 是否清空下一级（一二级联动时，一级下拉切换，将二级下拉框清空）
     * @param {Number} level 第几级（为获取下拉框list）
     */
    getQiBoValListByVals (vals, behaviorValue, attrList, hasChild = false, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false, level) {
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      debugger
      let list = []
      if (vals.length === 0 && level === 6) { // 清空集数
        let obj = behaviorValue[0] // 不改变子级的数据
        obj.name = ''
        obj.value = ''
        obj.field = ''
        list.push(obj)
      }

      vals.forEach(val => {
        const lastNumberObj = [
          { name: '', value: '', filed: '', operator: '=', type: 'count' }
        ]
        debugger
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
        if (level === 5 || level === 6) { // 输入了影片名称之后，需要查询集数/期数
          if (obj.videoType !== '电影' && obj.source && obj.value) {
            this.getTvEpisodes(obj.source, obj.value)
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
                filed: '',
                operator: '=',
                type: 'string',
                childCheckedVal: [''],
                child: [
                  {
                    name: '',
                    value: '',
                    filed: '',
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
      // console.log('list===>', list)
      return list
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
    handelQiBoChildBehavirSelectChange (params) {
      let { childItem, hasChild = false, level = 2, extra = {}, selectPropKeyValue = 'value', isValueClear = false, defaultChild = [] } = params

      const vals = typeof (childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const behaviorValue = childItem.child || []
      // eslint-disable-next-line no-debugger
      debugger
      const behaviorAttrList = this.getBehaviorAttrList(level, extra)
      // const behaviorAttrList = selectPropKeyValue === 'value' ? this.getBehaviorAttrList(item, level, extra) : this.qiBoOptions
      if (level === 4) { // 切换视频源时，清空下拉选项
        this.qiBoOptions = []
        this.qiboParams.page = 1 // 页码归1
      }
      childItem.child = this.getQiBoValListByVals(
        vals,
        behaviorValue,
        behaviorAttrList,
        hasChild,
        defaultChild,
        selectPropKeyValue,
        isValueClear,
        level
      )
    },

    getVideoEpisode (tvId, businessType, source) {
      const params = {
        tvId,
        businessType,
        source,
        page: 1,
        pageSize: 200
      }

      this.$service.getVideoEpisode(params).then(res => {
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

    // 获取下拉框选项
    getBehaviorAttrList (level = 1, extra = {}) {
      const childItem = this.childItem // 组件参数：该个行为标签规则
      if (this.bavAttrList) {
        let attrlist = []
        const dict = this.bavAttrList.dict
        if (childItem.tagCode === 'BAV0001') {
          // eslint-disable-next-line no-debugger
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type)
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
          } else {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || dict.func_click
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
          if (level === 1) {
            attrlist = dict.business_type
          } else if (level === 2) {
            const obj = dict.business_type.find(item => item.dictValue === extra.type) || {}
            attrlist = dict[obj.mapName] || []
          } else if (level === 3) {
            if (extra.type === '关注') {
              return this.followOptions
            }
            const list = extra.list
            const obj = list.find(item => item.value === extra.type) || {}
            attrlist = dict[obj.mapName] || []
            console.log('list===>', list)
            console.log('obj===>', obj)
          } else if (level === 4) {
            if (extra.type === '影片') {
              return this.videoOptions
            } else if (extra.type === '视频源') {
              attrlist = dict.video_source
            } else {
              const obj = dict.business_video_category.find(item => item.dictLabel === extra.type) || {}
              attrlist = dict[obj.mapName] || []
            }
          } else if (level === 5) {
            if (extra.type === '影片' && extra.source && extra.source === '影视') {
              return this.qiBoOptions
            }
          }
          // } else if (level === 3 && extra.type === '电影') {
          //   attrlist = dict.movie_category
          // } else if (level === 3 && extra.type === '综艺') {
          //   attrlist = dict.show_category
          // } else if (level === 3 && extra.type === '记录片') {
          //   attrlist = dict.documentary_category
          // } else if (level === 3 && extra.type === '电视剧') {
          //   attrlist = dict.tv_category
          // } else if (level === 3 && extra.type === '动漫') {
          //   attrlist = dict.anime_category
          // } else if (level === 4) {
          //   attrlist = dict.source
          // } else if (level === 5) {
          //   return this.qiBoOptions
          // } else if (level === 6) {
          //   return this.qiBoCollectionOptions
          // } else if (level === 7) {
          //   attrlist = dict.pay_type
          // } else if (level === 8) {
          //   attrlist = dict.watch_time
          // } else if (level === 9) {
          //   attrlist = dict.single_episode
          // }
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
        // console.log('attrlist==>', attrlist)
        attrlist = attrlist.map(item => {
          let list = {
            name: item.dictLabel,
            value: item.dictValue,
            field: item.tableField,
            type: item.filedType,
            selectKey: item.tableField + item.dictValue,
            mapName: item.mapName || ''
          }
          if (childItem.tagCode === 'BAV0001') {
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
.label-item span, .oc-item {
  margin-right: 10px;
}

.oc-item {
  margin-top: 5px;
}

.w100 {
  min-width: 100px;
  margin-bottom: 5px
}

.flex-column {
  display: flex;
  flex-direction: column;
  position: relative;
}

.flex-row {
  display: flex;
  flex-direction: row;
  // margin: 3px 2px;
}

.child-attr-wrap {
  border: 1px dashed #fff;
  padding: 0 5px;
  margin: 10px 0;

  // &:hover {
  //   // text-decoration: underline;
  //   border-color: rgb(0, 188, 212);
  //   border-radius: 7px;
  // }
}

.bav-attr-warp {
  // align-items: baseline;
  display: flex;
  border: 1px dashed #fff;
  margin-bottom: 10px;

  // &:hover {
  //   // text-decoration: underline;
  //   border-color: rgb(0, 188, 212);
  //   border-radius: 7px;
  // }
}
@media(device-width: 768px) and (device-height: 1024px) {
  ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
  }
  ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
  }
}
.reverse-check
  margin-left 20px
</style>
