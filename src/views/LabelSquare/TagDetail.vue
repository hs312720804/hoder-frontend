<template>
    <div class="read-tag-category">
        <template v-if="tagCategory && !showEdit">
            <el-card shadow="never">
                <div slot="header">
                    <span>{{ tagCategory.tagName }}</span>
                    <el-button style="float:right; margin-top: -7px;" @click="$emit('read-cancel')" type="primary">返回</el-button>
                </div>

                <el-form label-position="left" label-width="80px">
                    <el-form-item label="ID">
                        {{ tagCategory.tagId }}
                    </el-form-item>
                    <el-form-item label="数据来源">
                        {{ dataSourceEnum[tagCategory.dataSource] }}
                    </el-form-item>
                    <el-form-item label="类型">
                        {{ typeEnum[tagCategory.tagType] }}
                    </el-form-item>
                    <el-form-item v-show="tagCategory.tagType === 'number'" label="单位">
                        {{ tagCategory.tagUnit }}
                    </el-form-item>
                    <el-form-item label="备注">
                        {{ tagCategory.remark }}
                    </el-form-item>
                </el-form>
            </el-card>
            <TagRegionTree v-if="tagCategory.tagKey === 'mix_area'" :tagId="tagId" @edit="handleEdit"></TagRegionTree>
            <tag-list :tag-category="tagCategory" v-else/>
        </template>
        <!-- <AddOrEditSpecialTag v-if="showEdit" :paramsData="paramsData"></AddOrEditSpecialTag> -->
    </div>
</template>

<script>
    import TagList from '../Tag/List.vue'
    import TagRegionTree from './TagRegionTree.vue'
    // import AddOrEditSpecialTag from '../SpecialTag/Index.vue'
    export default {
        components: {
            TagList,
            TagRegionTree,
            // AddOrEditSpecialTag
        },
        props: {
            tagId: {
                type: Number
            }
        },
        data() {
            return {
                tagCategory: null,
                dataSourceEnum: {},
                typeEnum: {},
                showEdit: false,
                paramsData: {}
            }
        },
        methods: {
            getFilter() {
                return {
                    id: this.tagId
                }
            },
            fetchData() {
                const filter = this.getFilter()
                this.$service.readTagCategory(filter).then((data) => {
                    this.dataSourceEnum = data.dataSourceEnum
                    this.typeEnum = data.typeEnum
                    this.tagCategory = data.tagCategory
                })
                // 特色标签详情
                // this.$service.specialTagDetail({specialTagId: 50}).then((data) => {
                    // this.dataSourceEnum = data.dataSourceEnum
                    // this.typeEnum = data.typeEnum
                    // this.tagCategory = data.tagCategory
                // })
            },
            handleEdit (parentId, specialTagId, specialTagName) {
                console.log('parentId===', parentId)
                this.paramsData = {
                    parentId,
                    belongTagId: this.tagId,
                    specialTagId,
                    specialTagName
                }
                this.$router.push({
                    name: 'specialTag',
                    params: this.paramsData
                })
                
                // this.showEdit = true
            }
        },
        created() {
            this.fetchData()
        }
    }

</script>
<style lang="stylus" scoped>
    .read-tag-category
        width 100%
</style>
