<template>
    <div class="label-list">
        <el-container style="height: 700px; border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <div class="ground-list">
                    <header>分组<el-button type="text" size="mini" @click="createGround">新建</el-button></header>
                    <div class="filter">
                        <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText">
                        </el-input>
                        
                    </div>
                   <el-tree class="filter-tree" 
                        :data="groundList" 
                        :props="defaultProps" 
                        default-expand-all 
                        :filter-node-method="filterNode" 
                        ref="tree2"
                        @node-click="changeGround"
                        >
                    </el-tree>
                </div>
            </el-aside>
            
            <el-container v-if="viewShow">
                    <el-header style="height:45px">
                        <el-row>
                            <el-col :span="12"><div class="grid-content bg-purple">标签种类</div></el-col>
                            <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
                        </el-row>
                        <!-- <el-dropdown>
                            <i class="el-icon-setting" style="margin-right: 15px"></i>
                            <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>查看</el-dropdown-item>
                            <el-dropdown-item>新增</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span>王小虎</span> -->
                    </el-header>
                    
                    <el-main>
                        <el-table border :data="tableData" >
                            <el-table-column prop="tagId" label="ID" width="140">
                            </el-table-column>
                            <el-table-column prop="tagName" label="名称" width="140">
                            </el-table-column>
                            <el-table-column prop="lableDataSourceEnum" label="数据来源" >
                            </el-table-column>
                            <el-table-column prop="tagsType" label="类型" width="140">
                            </el-table-column>
                            <el-table-column prop="remark" label="备注">
                            </el-table-column>
                            <el-table-column prop="operation" label="操作" width="120">
                                <template scope="operation">
                                    <el-button
                                        size="small"
                                        type="primary"
                                        @click="viewDetail(operation.row)"
                                        shiro:hasPermission="sysAdministrative:user:changeStatus"
                                    >
                                    查看详情
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- pagination -->
                        <div align="right" v-if="pageVisible" >
                            <pagination v-bind:currentpage="currentPage"
                                        v-bind:pagesize="pageSize"
                                        v-bind:totalcount="totalCount"
                                        @handle-size-change="handleSizeChange"
                                        @handle-current-change="handleCurrentChange">
                            </pagination>
                        </div>
                    </el-main>
                
            </el-container>
            <el-container v-if="!viewShow">
                <el-header style="height:45px">
                    <el-row>
                        <el-col :span="12"><div class="grid-content bg-purple">标签种类：用户构成</div></el-col>
                        <el-col :span="12"><el-button style="float:right; margin-top:9px" type="success" size="mini" @click="backCateList">返回</el-button></el-col>
                    </el-row>
                    
                </el-header>
                <el-row>
                     <el-col :span="24" class="label-cate-info-col">
                        <div style="border-bottom:1px solid #ececec; padding-bottom:10px">
                        <table class="label-cate-info" width="100%">
                            <tr>
                                <td width="100">ID</td>
                                <td>1449</td>
                            </tr>
                            <tr>
                                <td>数据来源</td>
                                <td>数据平台</td>
                            </tr>
                            <tr>
                                <td>类型</td>
                                <td>布尔型</td>
                            </tr>
                            <tr>
                                <td>备注</td>
                                <td>系统同步</td>
                            </tr>   
                        </table>
                        </div>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="padding:20px;">
                        <el-table border :data="tableData2" >
                            <el-table-column prop="attrId" label="ID">
                            </el-table-column>
                            <el-table-column prop="attrName" label="名称" >
                            </el-table-column>

                            <el-table-column prop="attrValue" label="值">
                            </el-table-column>
                            
                            <el-table-column prop="operation" label="操作" width="120">
                                <template scope="operation">
                                    <el-button
                                        size="small"
                                        type="primary"
                                        @click="viewDetail(operation.row)"
                                        shiro:hasPermission="sysAdministrative:user:changeStatus"
                                    >
                                    查看详情
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
        const item = {
            tagId:"11",
            tagName:"用户构成",
            lableDataSourceEnum:"数据来源",
            tagsType:"类型",
            remark: '系统同步',
            operation: [{id:"2",row:"dd"}]
        };
        const item2 = {
            attrId:"12",
            attrValue:"11",
            attrName:"用户构成",
            attrValue:"数据来源",
            operation: [{id:"2",row:"dd"}]
        };
        return {
            filterText: '',
            tableData: Array(10).fill(item),
            tableData2: Array(5).fill(item2),
            groundList:[
                {"tid":"1","name":"xie1"},
                {"tid":"2","name":"xie2"},
                {"tid":"3","name":"xie3"},
                {"tid":"4","name":"xie4"} 
            ],
            defaultProps: {
                label: 'name'
            },
            viewShow:true,
            pageVisible:true
        }
    },
    methods:{
        changeGround(data){
            //console.log(data.tid);
            this.$message(data.tid);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        createGround() {
            this.$prompt('请输入标签分组名称', '新建分组', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',  
                
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '您输入的标签分组名称: ' + value
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
        },
        viewDetail(row){
            this.viewShow = false;
            //this.$message(row.tagId);
        },
        backCateList(){
            this.viewShow = true
        }
    }
  };
</script>
<style lang="stylus">
.label-list .el-header 
    color #333
    line-height 50px
    border-bottom 1px solid #eee
.el-aside 
    color #333
.el-tree
    background none
.ground-list header
    line-height 44px
    text-indent 15px
    font-size 14px
    border-bottom 1px solid #e2e2e2
.ground-list header .el-button
    float right
    margin-top 8px
    margin-right 15px
.filter
    padding 10px 15px
.ground-list .el-tree-node__content
    height 35px
.ground-list .el-tree-node__label
    list-style none
    line-height 35px
.ground-list li span
    text-decoration none
    cursor pointer
    color #333
.label-cate-info-col
    padding 10px 20px 0
.label-cate-info td
    font-size 14px
    line-height 32px
</style>