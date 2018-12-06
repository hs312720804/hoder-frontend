<template>
    <div>
         <!-- form search -->
        <el-form :inline="true" :model="searchForm" ref="searchForm"
                permission> 
                <!-- TODO: permission -->
            <el-form-item label="邮箱" prop="emailName">
                <el-input v-model="searchForm.emailName" style="width: 200px"
                          size="small" placeholder="请填写邮箱">
                </el-input>
            </el-form-item>
            <el-form-item label="邮件类型" prop="type">
                <el-select v-model="searchForm.type" clearable filterable placeholder="请选择类型">
                    <el-option v-for="item in typeList" :key="item.typeFlag" :label="item.typeName"
                               :value="item.typeFlag">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="search" @click="submitForm">查询</el-button>
                <el-button type="primary" size="small" @click="handleReset">
                <a class="fa fa-refresh" style="color: white;"></a> 重置
               </el-button>
            </el-form-item>
        </el-form>
        <!-- authority -->
        <el-button-group>
            <el-button type="primary" size="small" @click="handleAdd" permission>
                <a class="fa fa-plus" style="color: white;"></a>新增
            </el-button>
            <!-- <el-button type="primary" size="small" @click="handleRefresh">
                <a class="fa fa-refresh" style="color: white;"></a> 刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleReset">
                <a class="fa fa-refresh" style="color: white;"></a> 重置
            </el-button> -->
            <el-button type="primary" size="small" @click="handleBatchDel" permission>
                <a class="fa fa-trash" style="color: white;"></a> 批量删除
            </el-button>
        </el-button-group>
        <br>
        <br>
        <!-- talbe -->
        <el-table ref="myTable" :data="tableData" style="width: 100%;" stripe border
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="emailName" label="邮箱" width="230">
                <template scope="scope">
                    <el-icon name="message"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.emailName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="类型" width="200"></el-table-column>
            <el-table-column prop="createDate" label="创建时间" width="200">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.createDate }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template scope="scope">
                    <el-tag type="success" close-transition="false" v-if="scope.row.status === 1">
                        <a class="fa fa-unlock"></a> 启用
                    </el-tag>
                    <el-tag type="danger" close-transition="false" v-if="scope.row.status === 0">
                        <a class="fa fa-lock"></a> 禁用
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
                <template scope="scope">
                    <el-button-group>
                        <!--<el-button size="small" type="success" @click="handleDetail(scope.$index, scope.row)">
                            <a class="fa fa-search" style="color: white;"></a> 查看
                        </el-button>-->
                        <el-button size="small" type="warning" @click="handleChangetStatus(scope.$index, scope.row)"
                                   permission>
                            <a class="fa fa-edit" style="color: white;"></a> 修改状态
                        </el-button>
                        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)"
                                   permission>
                            <a class="fa fa-edit" style="color: white;"></a> 编辑
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
                                   permission>
                            <a class="fa fa-trash" style="color: white;"></a> 删除
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <div align="right">
            <pagination v-bind:currentpage="currentPage"
                        v-bind:pagesize="pageSize"
                        v-bind:totalcount="totalCount"
                        @handle-size-change="handleSizeChange"
                        @handle-current-change="handleCurrentChange">
            </pagination>
        </div>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" v-if="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="emailForm" :rules="emailFormRules" ref="emailForm" label-width="100px">
                <el-form-item label="邮箱" prop="emailName">
                    <el-input size="small" v-model="emailForm.emailName"
                              placeholder="请填写邮箱, 如:xxx@coocaa.com/xxx@skyworth.com"></el-input>
                </el-form-item>
                <el-form-item label="邮件类型" prop="typeFlags">
                    <el-checkbox-group v-model="emailForm.typeFlags">
                        <el-checkbox v-for="item in typeList" :label="item.typeFlag" name="typeNames" :key="item.typeFlag">
                            {{ item.typeName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input size="small" type="textarea" v-model="emailForm.remarks" placeholder="请填写备注"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="emailForm.status">
                        <el-radio class="radio" :label="1">正常</el-radio>
                        <el-radio class="radio" :label="0">锁定</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取消</el-button>
                <el-button type="primary" @click="addSubmit">保存</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑"  :visible.sync="editFormVisible" v-if="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="emailForm" :rules="emailFormRules" ref="emailForm" label-width="100px">
                <el-form-item label="邮箱" prop="emailName">
                    <el-input size="small" v-model="emailForm.emailName"
                              placeholder="请填写邮箱, 如:xxx@coocaa.com/xxx@skyworth.com"></el-input>
                </el-form-item>

                <el-form-item label="邮件类型" prop="typeFlags">
                    <el-checkbox-group v-model="emailForm.typeFlags">
                        <el-checkbox v-for="item in typeList" :label="item.typeFlag" name="typeNames" :key="item.typeFlag">
                            {{ item.typeName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="备注" prop="remarks">
                    <el-input size="small" type="textarea" v-model="emailForm.remarks" placeholder="请填写备注"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="emailForm.status">
                        <el-radio class="radio" :label="1">正常</el-radio>
                        <el-radio class="radio" :label="0">锁定</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="editSubmit">更新</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from "axios"
// import {pagination} from 'ele'
export default {
    data(){
            var validatePass = (rule, value, callback) => {
            var c = value.indexOf('@coocaa.com') ;
            var s = value.indexOf('@skyworth.com') ;

                if(c <= 0  &&  s <= 0){
                    callback(new Error("邮箱后缀必须是coocaa.com或者skyworth.com"));
                }else{
                    callback();
                }
            };

            return {

                // 表格当前页数据
                tableData: [],
                // 多选数组
                multipleSelection: [],
                //搜索条件
                criteria: {
                },

                // 列表页
                searchForm: {
                    emailName: '',
                    type: '',
                    typeList: ""
                },
               emailTypeList: null,
               typeList: null,
                // 新增页
                addFormVisible: false,// 新增界面是否显示
                // 新增界面数据
                emailForm: {
                    id: '',
                    emailName: '',
                    // type: '',
                    remarks: '',
                    status: 0,
                    typeFlags:[],
                    // 以上为表单提交的参数
                },
                emailFormRules: {
                    emailName: [
                        {required: true, message: '请填写邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱'},
                        { validator: validatePass, trigger: 'change' }
                    ],
                    // type: [
                    //     {type: 'number', required: true, message: '请选择邮件类型', trigger: 'change'}
                    // ],
                    typeFlags:[
                        {type: 'array', required: true, message: '请至少选择一个邮件类型', trigger: 'change'}
                    ],
                    remarks: [
                        {required: true, message: '请填写备注信息', trigger: 'blur'}
                    ]
                },
                // 编辑页
                editFormVisible: false,// 编辑界面是否显示
                // 默认每页数据量:pageSize
                pageSize: 10,
                // 当前页码:pageNum
                currentPage: 1,
                // 查询的页码
                start: 1,
                // 默认数据总数
                totalCount: 1,
            }
    },
     methods: {
            callback(data,successMsg){
                if(data.msg)
                {
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    });
                }else{
                    this.$message({
                        message: successMsg,
                        type: 'success'
                    });
                    this.loadData();
                }

            },
            // 从服务器读取数据
            loadData: function () {
                this.criteria['currentPage'] =this.currentPage;
                this.criteria['pageSize'] =this.pageSize;
                this.$service.get_emails_json(this.criteria).then((data)=>{
                  this.tableData = data.lists;
                  this.totalCount = data.count;
                })
            },
            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange: function (val) {
                this.pageSize = val;
                this.loadData();
            },
            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.loadData();
            },
            // 搜索,提交表单
            submitForm: function () {
                var _this = this;
                this.$refs.searchForm.validate(function (result) {
                    if (result) {
                        _this.criteria=_this.searchForm
                        _this.loadData()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // // 刷新
            // handleRefresh: function () {
            //     window.location.href = localStorage.getItem("adminPath") + "/manage/email/index";
            // },

            // 重置
            handleReset: function () {
                this.$refs.searchForm.resetFields();
            },

            // 修改状态
            handleChangetStatus: function (index, row) {
                var id = row.id;
                var status = row.status == 1 ? 0 : 1;
                this.$confirm('确定修改该条记录的状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.changeEmailStatus({id:id,status:status}).then((data)=>{
                        this.callback(data,"状态修改成功");
                    })
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消修改该条记录的状态'
                    });
                });
            },

            // 查看详情
            handleDetail: function (index, row) {
                var id = row.id;
                // todo: 以后再做
            },

            // 显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.emailForm.id = '';
                this.emailForm.emailName = '';
                // this.emailForm.type = '';
                this.emailForm.typeFlags = [];
                this.emailForm.remarks = '';
                this.emailForm.status = 0;
            },

            // 新增
            addSubmit: function () {
                var _this = this;
                this.$refs.emailForm.validate((valid) => {
                    if (valid) {
                        let emailForm=JSON.stringify(_this.emailForm)
                        emailForm=JSON.parse(emailForm)
                        emailForm.typeFlags=emailForm.typeFlags.join(",")
                        this.$service.addEmail(emailForm).then((data)=>{
                          this.callback(data,"添加成功");
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 显示编辑页面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.emailForm.id = row.id;
                this.emailForm.emailName = row.emailName;
                // this.emailForm.type = row.type;
                this.emailForm.typeFlags = row.typeIds;
                // row.type.split(",").forEach(function(data,index,arr){
                //     _this.emailForm.typeFlags.push(+data);
                // });
                console.log("edit",this.emailForm.typeFlags);
                this.emailForm.remarks = row.remarks;
                this.emailForm.status = row.status;
            },

            // editSubmit
            editSubmit: function () {
                var _this = this;
                this.$refs.emailForm.validate((valid) => {
                    if (valid) {
                        let emailForm=JSON.stringify(_this.emailForm)
                        emailForm=JSON.parse(emailForm)
                        emailForm.typeFlags=emailForm.typeFlags.join(",")
                        this.$service.updateEmail(emailForm).then((data)=>{
                          this.callback(data,"更新成功");
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 取消
            cancelAdd: function () {
                this.addFormVisible = false;
                // this.$message({
                //     showClose: true,
                //     message: '已取消新增'
                // });
            },
            cancelEdit: function () {
                this.editFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消编辑'
                });
            },

            // 单行删除
            handleDelete: function (index, row) {
                var id = row.id;
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$service.delEmail({id:id}).then((data)=>{
                      this.callback(data,"删除成功")  
                    })
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消删除操作'
                    });
                });
            },

            // 多选响应
            handleSelectionChange: function (val) {
                // 循环该数组,取出id放到(push)multipleSelection
                var ids = [];
                for (var i = 0; i < val.length; i++) {
                    ids.push(val[i].id);
                }
                this.multipleSelection = ids;
                // console.log(this.multipleSelection);
            },

            // 批量删除
            handleBatchDel: function () {
                var ids = this.multipleSelection;
                if (ids.length > 0) {
                    this.$confirm('确定要删除这批记录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                    this.$service.batchDelEmail(ids).then((data)=>{
                       this.callback(data,"删除成功");
                    })
                    }).catch(() => {
                        this.$message({
                            showClose: true,
                            message: '已取消删除操作'
                        });
                    });
                } else {
                    this.$alert('请至少勾选一条记录', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }
            }

        }
        ,
        created () {
            this.$service.emailTypeList().then((data)=>{
              this.emailTypeList=data.data;
            })
             this.$service.typeList().then((data)=>{
              this.typeList=data.data;
            })
            this.loadData()
        }
}
</script>
<style scoped>
    .el-checkbox-group label
       {
           width:160px
       }
    .el-checkbox+.el-checkbox {
      margin-left: 0px;
    }  
</style>

