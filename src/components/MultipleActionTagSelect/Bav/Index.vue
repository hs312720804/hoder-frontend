<template>
  <div class="bav-attr-warp">
    <el-tag class="oc-item" :type="dataSourceColorEnum[childItem.dataSource]">
      {{ childItem.tagName }} - {{ childItem.tagCode }}
    </el-tag>

    <!-- {{childItem.categoryCode}} -->
    <!-- {{childItem}} -->
    <!-- 会员状态 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0001'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem)"
      >
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
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
          <span class="flex-row">
            <!-- 第二级 -->
            <!-- {{ item.childCheckedVal }} -->
            <el-select
              v-model="item.childCheckedVal"
              style="width: 150px"
              name="asdq"
              class="input-inline"
              @change="handelChildBehavirSelectChange(item, true, childItem, 2, {extra: item.childCheckedVal}, 'selectKey')"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2, {extra: item.childCheckedVal} )">
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
            <!-- 第三级 -->
            <!-- {{item.childCheckedVal}}
            {{item.child}} -->
            <span v-if="item.childCheckedVal === 'effective' || item.childCheckedVal === 'no_effective'">
            
              <span
                v-for="(item2, index2) in item.child"
                :key="'typeInputValue' + index2"
                class="flex-row"
              >
              <!-- {{item2}} -->
                <el-select
                  multiple
                  v-model="item2.childCheckedVal"
                  style="width: 200px"
                  name="asdq"
                  class="input-inline"
                  @change="handelChildBehavirSelectChange(item2, false, childItem, 3, {extra: item.childCheckedVal})"
                >
                  <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3, {extra: item.childCheckedVal})">
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

            <span v-else-if="item.childCheckedVal === 'paid_single'">
              <span
                v-for="(item2, index2) in item.child"
                :key="'typeInputValue' + index2"
                class="flex-row"
              >   
              <!-- {{item2}} -->
                <!-- 次数、天数 -->
                <Type :item3="item2.child[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
              </span>
            </span>
          </span>
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
        @change="handelBehavirSelectChange(childItem)"
      >
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
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
          <span class="flex-column">
            <!-- 第二级 -->
            <!-- {{ item.childCheckedVal }} -->
            <el-select
              multiple
              v-model="item.childCheckedVal"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              @change="handelChildBehavirSelectChange(item, true, childItem, 2)"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2)">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                >
                </el-option>
              </template>
            </el-select>
            <div class="flex-column">
              <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
              <span
                v-for="(item2, index) in item.child"
                :key="index"
                class="flex-row child"
              >
                <span class="w100">{{ item2.name }}</span>
                <!-- 第三级 -->
                <span
                  v-for="(item3, index2) in item2.child"
                  :key="'typeInputValue' + index2"
                  class="flex-row"
                >
                  <!-- 次数、天数 -->
                  <Type :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>
                </span>
              </span>
            </div>
          </span>
        </div>
      </div>
    </span>

    <!-- 购买行为 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0003'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem, false, 1, [], 'field')"
      >
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
          <el-option
            :value="item.field"
            :label="item.name"
            :key="item.field"
          ></el-option>
        </template>
      </el-select>
      <div class="flex-column" >
        <ConditionLine :isShow="childItem.bav.behaviorValue.length > 1"></ConditionLine>
        <div
          v-for="item in childItem.bav.behaviorValue"
          :key="item.value"
          class="flex-row child-attr-wrap"
        >
          <span class="w100">{{ item.name }}</span>
          <span class="flex-column">
            <!-- 第二级 -->
            <!-- {{ item }} -->
            <el-select
              multiple
              v-model="item.childCheckedVal"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              @change="handelChildBehavirSelectChange(item, true, childItem, 2)"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2)">
                <el-option
                  :value="attrChildItem.value"
                  :label="attrChildItem.name"
                  :key="attrChildItem.value"
                >
                </el-option>
              </template>
            </el-select>
            <!-- {{ item.childCheckedVal }} -->
            <div class="flex-column" >
              <ConditionLine :isShow="item.child.length > 1"></ConditionLine>
              <span
                v-for="(item2, index) in item.child"
                :key="index"
                class="flex-row"
              >
              <!-- {{item2}} -->
                <span class="flex-row">
                  <span class="w100">{{ item2.name }}</span>
                  <span v-if="item.field === 'purchase_recent_two_years'" class="flex-column" >
                    <!-- 历史购买 -->
                    <!-- 第三级 -->
                    <el-select
                      multiple
                      v-model="item2.childCheckedVal"
                      style="width: 110px"
                      name="asdq"
                      class="input-inline"
                      @change="handelChildBehavirSelectChange(item2, true, childItem, 3)"
                    >
                      <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3)">
                        <el-option
                          :value="attrChildItem.value"
                          :label="attrChildItem.name"
                          :key="attrChildItem.value"
                        >
                        </el-option>
                      </template>
                    </el-select>
                    <div class="flex-column" >
                      <ConditionLine :isShow="item2.child.length > 1"></ConditionLine>
                      <span
                        v-for="(item3, index2) in item2.child"
                        :key="'typeInputValue' + index2"
                        class="flex-column"
                      >
                        <!-- 第四级 -->
                        <span class="flex-row">
                          <span class="w100">{{ item3.name }}</span>
                          <span
                            v-for="(item4, index) in item3.child"
                            :key="index"
                            class="flex-row"
                          >
                            <!-- 次数、天数 -->
                            <!-- <Type :item3="item4"></Type> -->
                            <Type :item3="item4" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []" :childItem="childItem"></Type>
                          </span>
                        </span>
                      </span>
                    </div>
                  </span>
                  <span v-else class="flex-column" >
                    <!-- 首次购买  -->
                    <!-- 第三级 -->
                    <el-select
                      v-model="item2.childCheckedVal"
                      style="width: 110px"
                      name="asdq"
                      class="input-inline"
                      @change="handelChildBehavirSelectChange(item2, true, childItem, 3)"
                    >
                      <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3)">
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
    </span>

    <!-- 板块活跃 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0004'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 100px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem, false, 1, moDefaultChild, 'selectKey', true)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.selectKey"
            :label="item.name"
            :key="item.selectKey"
          ></el-option>
        </template>
      </el-select>
      <div class="flex-column" >
        <ConditionLine :isShow="childItem.bav.behaviorValue.length > 1"></ConditionLine>
        <div
          v-for="(item, index) in childItem.bav.behaviorValue"
          :key="'mo' + index"
          class="flex-row child-attr-wrap"
        >
          <span class="w100">{{ item.name }}</span>
          <!-- {{item}} -->
          <span class="flex-row">
            <!-- 第二级 -->
              <!-- <el-input
                placeholder="请输入板块ID"
                v-model="item.value"
                clearable
                style="max-width: 180px; min-width: 180px;"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchModuleMatch(item.value)"></el-button>
              </el-input> -->
              <!-- {{item.value}} -->
              <!-- <el-autocomplete
                v-model="item.value"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入板块ID"
                value-key="albumName"
                label="albumId"
                clearable
                style="max-width: 180px; min-width: 180px;"
              ></el-autocomplete> -->
              <!-- {{item}} -->
              <el-select
                style="width: 150px"
                v-model="item.value"
                filterable
                remote
                placeholder="请输入板块ID"
                clearable
                :remote-method="(query) => { remoteMethod(query, item.field) }"
                :loading="loading">
                <el-option
                  v-for="item in moOptions[item.field]"
                  :key="item.forumId"
                  :label="item.albumName"
                  :value="item.forumId">
                </el-option>
              </el-select>
              <!-- 推荐位 -->
              <span v-if="item.selectKey === 'album_id1'">
                <span
                  v-for="(item2, index) in item.child"
                  :key="index"
                  class="flex-row child"
                >
                  <!-- 次数、天数 -->
                  <!-- <Type :item3="item3"></Type> -->
                  <el-select
                    v-model="item2.value"
                    style="width: 100px"
                    name="oxve"
                    class="input-inline"
                  >
                    <template v-for="item in 15">
                      <el-option
                        :value="item"
                        :label="item"
                        :key="item"
                      ></el-option>
                    </template>
                  </el-select>
                  <span
                    v-for="(item3, index) in item2.child"
                    :key="index"
                    class="flex-row child"
                  >
                    <Type :item3="item3" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                  </span>
                </span>
              </span>
              <span v-else>
                <span
                  v-for="(item2, index) in item.child"
                  :key="index"
                  class="flex-row child"
                >
                  <Type :item3="item2" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
                </span>
              </span>
          </span>
        </div>
      </div>
    </span>

    <!-- 页面活跃 && 功能使用 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0005' || childItem.tagCode === 'BAV0006'">
      <!-- 第一级 -->
      <el-select
        multiple
        v-model="childItem.bav.value"
        style="width: 120px"
        name="oxve"
        class="input-inline"
        @change="handelBehavirSelectChange(childItem, true)"
      >
        <template v-for="item in getBehaviorAttrList(childItem)">
          <el-option
            :value="item.value"
            :label="item.name"
            :key="item.value"
          ></el-option>
        </template>
      </el-select>
      <div class="flex-column" >
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
              <Type :item3="item2"  :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
            </span>
          </span>
        </div>
      </div>
    </span>

    <!-- 设备活跃 -->
    <span class="flex-column" v-if="childItem.tagCode === 'BAV0007'">
      <!-- 次数、天数 -->
      <Type :item3="childItem.bav.behaviorValue[0]" :options="bavAttrList && bavAttrList.dict ? bavAttrList.dict.attrType : []"  :childItem="childItem"></Type>
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
        @change="handelBehavirSelectChange(childItem, false, 1, childItem.bav.behaviorValue[0].child)"
      >
        <template v-for="item in getBehaviorAttrList(childItem, 1)">
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
        <!-- <span class="w100">{{ item.name }}</span> -->
          <!-- {{ item.childCheckedVal }} -->
        <!-- handelChildBehavirSelectChange(childItem, isLast = false, item, level=2, extra, selectPropKeyValue = 'value', isValueClear = false, defaultChild = []) { -->
        <!-- {{ item.childCheckedVal}} -->
        <!-- 第二级 -->
        <el-select
          v-model="item.childCheckedVal[0]"
          placeholder="请选择一级分类"
          style="width: 110px"
          name="asdq"
          class="input-inline"
          clearable
          @change="handelQiBoChildBehavirSelectChange(item, false, childItem, 2, {}, 'value', true, item.child[0].child)"
        >
          <template v-for="attrChildItem in getBehaviorAttrList(childItem, 2)">
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
          <!-- <span class="w100">{{ item2.name }}</span> -->
          <!-- {{ item2.child }} -->
          <!-- 第三级 -->
          <el-select
            v-model="item2.childCheckedVal[0]"
            placeholder="请选择二级分类"
            style="width: 110px"
            name="asdq"
            class="input-inline"
            clearable
            @change="handelQiBoChildBehavirSelectChange(item2, false, childItem, 3, {type: item.childCheckedVal[0]}, 'value', false, item2.child[0].child)"
          >
            <template v-for="attrChildItem in getBehaviorAttrList(childItem, 3, {type: item.childCheckedVal[0]})">
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
            <!-- {{ item3.name }} -->
            <!-- <span class="w100">{{ item3.name }}</span> -->
            <!-- 第四级 -->
            <el-select
              v-model="item3.childCheckedVal[0]"
              style="width: 110px"
              name="asdq"
              class="input-inline"
              placeholder="请选择内容源"
              clearable
              @change="handelQiBoChildBehavirSelectChange(item3, false, childItem, 4, {}, 'value', true, item3.child[0].child)"
            >
              <template v-for="attrChildItem in getBehaviorAttrList(childItem, 4)">

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
              <!-- <span class="w100">{{ item4.name }}</span> -->
              <!-- {{ item4.childCheckedVal }} -->
              —
              <!-- 第五级 -->
              <el-select
                v-model="item4.childCheckedVal[0]"
                style="width: 150px;"
                filterable
                remote
                placeholder="请输入片名或ID"
                clearable
                :remote-method="(query) => { qiBoRemoteMethod(query, item3.childCheckedVal[0]) }"
                :loading="loading2"
                @change="handelQiBoChildBehavirSelectChange(item4, false, childItem, 5, {}, 'value', true)"
              >
                <el-option
                  
                  v-for="tv in qiBoOptions"
                  :key="tv.value"
                  :label="tv.name"
                  :value="tv.value">
                </el-option>
                <!-- 编辑回显 选项-->
                <el-option
                  v-if="qiBoOptions.length === 0 && item4.child[0].value !== ''"
                  :label="item4.child[0].name"
                  :value="item4.childCheckedVal[0]">
                </el-option>
              </el-select>
              <!-- {{ item4 }} -->
              <span
                v-for="(item5, index) in item4.child"
                :key="index"
                class="flex-row child"
              >
                <!-- {{ item5 }} -->
                <!-- 选择了视频源下的视频 -->
                <span v-if="!!item5.value" class="flex-column">
                  <!-- // 是电影的 -->
                  <span v-if="item5.videoType === '电影'" class="flex-row"> 
                    <el-select
                        v-model="item5.childCheckedVal[0]"
                        style="width: 150px;"
                        placeholder="请选择"
                        clearable
                        @change="handelQiBoChildBehavirSelectChange(item5, true, childItem, 7, {}, 'value', false)"
                      >
                        
                        <el-option
                          v-for="attrChildItem in getBehaviorAttrList(childItem, 7)"
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
                          <el-select
                            v-model="item6.childCheckedVal[0]"
                            style="width: 150px;"
                            placeholder="请选择"
                            clearable
                            @change="handelQiBoChildBehavirSelectChange(item6, false, childItem, 8, {}, 'type', true)"
                          >
                            <el-option
                              v-for="attrChildItem in getBehaviorAttrList(childItem, 8)"
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
                  <span v-else>
                    <el-select
                      multiple
                      v-model="item5.childCheckedVal"
                      style="width: 100px;"
                      placeholder="请选择集数"
                      @change="handelQiBoChildBehavirSelectChange(item5, false, childItem, 6, {}, 'value', false)"
                    >
                      <el-option
                        v-for="tv in qiBoCollectionOptions"
                        :key="tv.value"
                        :label="tv.name"
                        :value="tv.value">
                      </el-option>
                    </el-select>
                    <div class="flex-column">
                      <ConditionLine :isShow="item5.child.length > 1"></ConditionLine>
                      <span
                        v-for="(item6, index) in item5.child"
                        :key="index"
                        class="flex-row child"
                      >
                        <span class="w100">{{ item6.name }}</span>
                        <el-select
                          v-model="item6.childCheckedVal[0]"
                          style="width: 150px;"
                          placeholder="请选择"
                          clearable
                          @change="handelQiBoChildBehavirSelectChange(item6, true, childItem, 7, {}, 'value', false)"
                        > 
                          
                          <el-option
                            v-for="attrChildItem in getBehaviorAttrList(childItem, 7)"
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
                            <el-select
                              v-model="item7.childCheckedVal[0]"
                              style="width: 150px;"
                              placeholder="请选择123"
                              clearable
                              @change="handelQiBoChildBehavirSelectChange(item7, false, childItem, 8, {}, 'type', true)"
                            >
                              <el-option
                                v-for="attrChildItem in getBehaviorAttrList(childItem, 8)"
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
                              <!-- <el-input v-model="item3.value" placeholder="请输入" style="max-width: 100px; min-width: 100px;"></el-input> -->
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
                    <el-select
                      v-model="item5.childCheckedVal[0]"
                      style="width: 150px;"
                      placeholder="请选择"
                      clearable
                      @change="handelQiBoChildBehavirSelectChange(item5, false, childItem, 8, {}, 'type', true)"
                    >
                      <el-option
                        v-for="attrChildItem in getBehaviorAttrList(childItem, 8)"
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


  </div>
</template>

<script>
import Type from '../Type.vue'
import ConditionLine from '../ConditionLine.vue'

export default {
  name: 'bavList',
  components: {
    Type,
    ConditionLine
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
      handler(val) {
        console.log('11111111111===', val)
        // 起播行为标签需要查询影片集数
        if (val && val.tagCode === 'BAV0008') {
          this.getQiboTvEpisodes(val.bav.behaviorValue)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
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
      qiBoCollectionOptions: []
      // jiList: [{
      //   name: '',
      //   value: 1,
      //   filed: '',
      // }]
    }
  },
  created() {},
  methods: {
    // 起播行为编辑，获取影片集数
    getQiboTvEpisodes(bavVal) {
      bavVal.forEach(obj => {
        if (obj.videoType && obj.videoType !== '电影' && obj.source && obj.value) {
          this.getTvEpisodes(obj.source, obj.value)
        } else {
          this.getQiboTvEpisodes(obj.child)
        }
      })
    },

    qiBoRemoteMethod(query, source) {
      if (query !== '') {
        this.loading2 = true;
        let params = {
          source, // 'album_id', 'forum_id'
          keywords: query,
          page: 1,
          pageSize: 10
        }
        // eslint-disable-next-line no-debugger
        debugger
        this.$service.tvContentMatch(params).then(res => {
          console.log('res==>', res)
          // eslint-disable-next-line no-debugger
          debugger
          this.loading2 = false;
          this.qiBoOptions = res.rows || []

          this.qiBoOptions = this.qiBoOptions.map(obj => {
            return {
              name: obj.title,
              value: obj.coocaaVId,
              field: obj.tableField,
              type: 'string',
              videoType: obj.videoType,
              source: obj.source
            }
          })
          console.log('qiBoOptions==>', this.qiBoOptions)
        })
      } else {
        this.qiBoOptions = [];
      }
    },
    remoteMethod(query, field) {
      if (query !== '') {
        this.loading = true;
        let params = {
          type: field === 'forum_id' ? 'forum' : 'album', // 'album_id', 'forum_id'
          keywords: query,
          page: 1,
          pageSize: 10
        }
        this.$service.moduleMatch(params).then(res => {
          console.log('res==>', res)
          this.loading = false;
          this.moOptions[field] = res.data || []
        })
      } else {
        this.moOptions[field] = [];
      }
    },

    getDefaultChildObj() {
      return JSON.parse(JSON.stringify(this.defaultChildObj))
    },

    // childItem -- 当前选项的obj
    // isLast -- 最后一级
    // level -- 层级 为获取下拉框list
    // defaultChild -- 下一级child对象的默认赋值，默认为[]
    // selectPropKeyValue -- 下拉框的 value和key 字段的 key值
    handelBehavirSelectChange(childItem, isLast = false, level=1, defaultChild = [], selectPropKeyValue = 'value', isValueClear = false) {
      // eslint-disable-next-line no-debugger
      debugger
      console.log('childItem==>', childItem)
      // const vals = childItem.bav.value 
      const vals = (typeof(childItem.bav.value) === 'string' ? childItem.bav.value.split(',') : childItem.bav.value)
      const checkedList = childItem.bav.behaviorValue
      const behaviorAttrList = this.getBehaviorAttrList(childItem, level)
      
      childItem.bav.behaviorValue = this.getValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast,
        defaultChild,
        selectPropKeyValue,
        isValueClear
      )
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, checkedList -- 已经组装好的集合, attrList -- 下拉框列表
    getValListByVals(vals, checkedList, attrList, isLast = false, defaultChild=[], selectPropKeyValue = 'value', isValueClear = false) {
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      
      let list = []
      vals.forEach(val => {
        const aa = [
          { name: '', value: '', filed: '', operator: '=', type: 'count' }
        ]
        // eslint-disable-next-line no-debugger
        debugger
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj = []
          // checkedList.find(item => item[selectPropKeyValue] === val) ||
          // attrList.find(item => item[selectPropKeyValue] === val)
        const matchObj = checkedList.find(item => item[selectPropKeyValue] === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val)

        if (matchObj) {
          obj = matchObj
        } else if (matchObj2) {
          obj = matchObj2
          // 清空对象中的 value （模块活跃特殊 value不等于下拉选项的value，而是后面查询出来的结果）
          if (isValueClear) obj.value = ''
        }
        
        // eslint-disable-next-line no-debugger
        debugger
        console.log('obj.childCheckedVal==>', obj.childCheckedVal)
        // obj.child = obj.child || aa
        // eslint-disable-next-line no-debugger
        debugger
        // console.log('obj.child=>>', obj.child)
        // 模块活跃，默认 child 值特殊处理
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))
        if (selectPropKeyValue === 'selectKey' && obj[selectPropKeyValue] === 'album_id1') { // 推荐位
          defaultchild = [{ name: '', value: '', filed: '', operator: '=', type: 'string' , child: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }]}]
        }
        // eslint-disable-next-line no-debugger
        debugger

        obj.child = obj.child || (isLast ? aa : defaultchild)

        obj.childCheckedVal = obj.childCheckedVal || (typeof(obj.childCheckedVal) === 'string' ? '' : [])
        
        if (defaultchild.length > 0) {
          obj.childCheckedVal = typeof(obj.childCheckedVal) === 'string' ? defaultchild.map(item => item.value).join(',') : defaultchild.map(item => item.value)
        }
        

        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })
      // console.log('list===>', list)
      return list
    },
    
    // childItem -- 当前选项的obj
    // isLast -- 最后一级
    // item -- 所有选项的obj 主要为获取 tagCode, 为获取下拉框list
    // level -- 层级 为获取下拉框list
    // extra -- 附加信息，根据选项判断，为获取不同下拉框list
    // selectPropKeyValue -- 下拉框的 value和key 字段的 key值
    handelChildBehavirSelectChange(childItem, isLast = false, item, level=2, extra, selectPropKeyValue = 'value', isValueClear = false, defaultChild = []) {
      console.log(childItem)
      // eslint-disable-next-line no-debugger
      debugger
      const vals = typeof(childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const checkedList = childItem.child || []
      // const behaviorAttrList = this.getChildBehaviorAttrList()
      const behaviorAttrList = this.getBehaviorAttrList(item, level, extra)
      childItem.child = this.getValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast,
        defaultChild,
        selectPropKeyValue,
        isValueClear
      )
    },

    // 通过 vals 获取完整的 valList
    // vals -- value 集合, checkedList -- 已经组装好的集合, attrList -- 下拉框列表
    getQiBoValListByVals(vals, checkedList, attrList, isLast = false, defaultChild=[], selectPropKeyValue = 'value', isValueClear = false, level) {
      // console.log('rulesJson.rules===>', this.rulesJson.rules)
      // eslint-disable-next-line no-debugger
      debugger
      let list = []
      vals.forEach(val => {
        const aa = [
          { name: '', value: '', filed: '', operator: '=', type: 'count' }
        ]
        
        // 先从已选列表里面进行查找，找不到再从所有列表里面查找，获取原值
        let obj = []
        // eslint-disable-next-line no-debugger
        debugger
          // checkedList.find(item => item[selectPropKeyValue] === val) ||
          // attrList.find(item => item[selectPropKeyValue] === val)
        const matchObj = checkedList.find(item => item[selectPropKeyValue] === val)
        const matchObj2 = attrList.find(item => item[selectPropKeyValue] === val)

        if (matchObj) {
          obj = matchObj
        } else if (matchObj2) {
          obj = matchObj2
        }
        
        // eslint-disable-next-line no-debugger
        debugger
        console.log('obj.childCheckedVal==>', obj.childCheckedVal)
        // obj.child = obj.child || aa
        // eslint-disable-next-line no-debugger
        debugger
        // console.log('obj.child=>>', obj.child)
        // 模块活跃，默认 child 值特殊处理
        let defaultchild = JSON.parse(JSON.stringify(defaultChild))
        if (selectPropKeyValue === 'selectKey' && obj[selectPropKeyValue] === 'album_id1') { // 推荐位
          defaultchild = [{ name: '', value: '', filed: '', operator: '=', type: 'string' , child: [{ name: '', value: '', filed: '', operator: '=', type: 'count' }]}]
        }
        // eslint-disable-next-line no-debugger
        debugger

        obj.child = obj.child || (isLast ? aa : defaultchild)

        obj.childCheckedVal = obj.childCheckedVal || (typeof(obj.childCheckedVal) === 'string' ? '' : [])
        
        if (defaultchild.length > 0) {
          obj.childCheckedVal = typeof(obj.childCheckedVal) === 'string' ? defaultchild.map(item => item.value).join(',') : defaultchild.map(item => item.value)
        }
        // eslint-disable-next-line no-debugger
        if (isValueClear) { // 清空当前对象的child里面的值 (一二级联动时的交互)
          obj.childCheckedVal = []
          if (obj.child.length > 0 ) {
            obj.child[0].value = ''
            obj.child[0].name = ''
            obj.child[0].field = ''
            if (level !== 2 && level !== 4 && obj.child[0].child && obj.child[0].child.length > 0 ) {
              obj.child[0].childCheckedVal = []
              obj.child[0].child[0].value = ''
              obj.child[0].child[0].name = ''
              obj.child[0].child[0].field = ''
              obj.child[0].child[0].childCheckedVal = []
            }
          }
          // obj.child = [{
          //   value: '',
          //   name: '',
          //   field: ''
          // }]
        }
        if (level === 5) { // 输入了影片名称之后，需要查询集数/期数
          // console.log('123124childItem==>', matchObj)
          // console.log('12345obj==>', obj)
          if (obj.videoType !== '电影' && obj.source && obj.value) {
           this.getTvEpisodes(obj.source, obj.value)
          }
          
        }

        let obj2 = Object.assign({}, this.getDefaultChildObj(), obj)
        list.push(obj2)
      })
      // console.log('list===>', list)
      return list
    },
    
    // childItem -- 当前选项的obj
    // isLast -- 最后一级
    // item -- 所有选项的obj 主要为获取 tagCode, 为获取下拉框list
    // level -- 层级 为获取下拉框list
    // extra -- 附加信息，根据选项判断，为获取不同下拉框list
    // selectPropKeyValue -- 下拉框的 value和key 字段的 key值
    handelQiBoChildBehavirSelectChange(childItem, isLast = false, item, level=2, extra, selectPropKeyValue = 'value', isValueClear = false, defaultChild = []) {
      console.log('123childItem==>', childItem)
      console.log('123item==>', item)
      const vals = typeof(childItem.childCheckedVal) === 'string' ? childItem.childCheckedVal.split(',') : childItem.childCheckedVal
      const checkedList = childItem.child || []
      // eslint-disable-next-line no-debugger
      debugger
      const behaviorAttrList = this.getBehaviorAttrList(item, level, extra)
      // const behaviorAttrList = selectPropKeyValue === 'value' ? this.getBehaviorAttrList(item, level, extra) : this.qiBoOptions
      if (level === 4) this.qiBoOptions = [] // 切换视频源时，清空下拉选项
      childItem.child = this.getQiBoValListByVals(
        vals,
        checkedList,
        behaviorAttrList,
        isLast,
        defaultChild,
        selectPropKeyValue,
        isValueClear,
        level
      )
    },

    // 获取影片集数
    getTvEpisodes(source, id) {
      const params = {
        source,
        id,
        page: 1,
        pageSize: 10
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

    getBehaviorAttrList(childItem, level=1, extra={}) {
      // eslint-disable-next-line no-debugger
      debugger
      if (this.bavAttrList) {
        let attrlist = []
  
        const dict = this.bavAttrList.dict
        if (childItem.tagCode === 'BAV0001') {
          // eslint-disable-next-line no-debugger
          if (level === 1) {
            attrlist = dict.vip_package
          } else if (level === 2) {
            attrlist = dict.use_status
          } else if (level === 3 && extra.extra === 'effective') {
            attrlist = dict.vip_expire_use
          } else if (level === 3 && extra.extra === 'no_effective') {
            attrlist = dict.vip_expire
          } 
        } else if (childItem.tagCode === 'BAV0002') {
          if (level === 1) {
            attrlist = dict.app_operation
          } else if (level === 2) {
            attrlist = dict.app_name
          } 
        } else if (childItem.tagCode === 'BAV0003') {
          if (level === 1) {
            attrlist = dict.buy_operation
          } else if (level === 2) {
            attrlist = dict.vip_package
          } else if (level === 3) {
            attrlist = dict.buy_type
          } 
        } else if (childItem.tagCode === 'BAV0004') {
          if (level === 1) {
            attrlist = dict.block_location
          }
        } else if (childItem.tagCode === 'BAV0005') {
          if (level === 1) {
            attrlist = dict.page_active
          }
        } else if (childItem.tagCode === 'BAV0006') {
          if (level === 1) {
            attrlist = dict.func_click
          }
        } else if (childItem.tagCode === 'BAV0008') {
          // eslint-disable-next-line no-debugger
          debugger
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
          } else if (level === 8 ) {
            attrlist = dict.watch_time
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
        // console.log('attrlist==>', attrlist)
        attrlist = attrlist.map(item => {
          let list = {
            name: item.dictLabel,
            value: item.dictValue,
            field: item.tableField,
            type: item.filedType,
            selectKey: item.tableField + item.dictValue
          }
          if (childItem.tagCode === 'BAV0001') {
            let operator = '='
            if ( level === 2 && item.filedType === 'effective') { operator = '>=' } // 有效
            if (
              (level === 2 && item.filedType === 'no_effective') 
            || item.dictValue === 'date_sub(current_date,30)') { operator = '<' } // 无效 || 过期时间>30
            if ( item.dictValue === 'date_sub(current_date,-30)') { operator = '>' } // 会员过期时间>30天
            if (
               item.dictValue === 'date_sub(current_date,-7) and date_sub(current_dat' 
            || item.dictValue === 'current_date and date_sub(current_date,-7)'
            || item.dictValue === 'current_date and date_sub(current_date,-7)'
            || item.dictValue === 'date_sub(current_date,29) and date_sub(current_dat'
            || item.dictValue === 'date_sub(current_date,7) and current_date') { operator = 'between' } // 7<会员到期时间<=30 || 会员到期时间<=7 || 7<过期时间<=30 || 过期时间<=7
            list = {
              name: item.dictLabel,
              value: item.dictValue,
              field: item.tableField,
              type: 'string',
              selectKey: item.filedType,
              operator
            }
          }
          return list
        })
        // console.log('attrlist==>', attrlist)
        return attrlist
      }
    },
    getChildBehaviorAttrList() {
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

</style>
