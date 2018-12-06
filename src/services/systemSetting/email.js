import qs from "qs";
import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function emailTypeList(data) {
    return Promise.resolve({code:0,data:
        [{"label":"超级管理员邮件列表","value":1},{"label":"机型机芯通知邮件","value":2},{"label":"提交审核","value":3},{"label":"审核结果通知邮件","value":4},{"label":"未报备设备通知邮件","value":5},{"label":"闭还版本更新通知","value":6}]
    });
}
export function typeList(data) {
    return Promise.resolve({code:0,data:
        [{"comment":null,"createBy":null,"createDate":"2017-12-05T11:27:01.000+08:00","delFlag":1,"id":6,"pageNum":1,"pageSize":10,"remarks":null,"status":1,"typeFlag":6,"typeName":"闭还版本更新通知","updateBy":null,"updateDate":null},{"comment":null,"createBy":null,"createDate":"2017-12-05T11:27:01.000+08:00","delFlag":1,"id":5,"pageNum":1,"pageSize":10,"remarks":null,"status":1,"typeFlag":5,"typeName":"未报备设备通知邮件","updateBy":null,"updateDate":null},{"comment":null,"createBy":null,"createDate":"2017-12-28T10:30:50.000+08:00","delFlag":1,"id":4,"pageNum":1,"pageSize":10,"remarks":null,"status":1,"typeFlag":4,"typeName":"审核结果通知邮件","updateBy":null,"updateDate":null},{"comment":null,"createBy":null,"createDate":"2017-12-28T10:30:50.000+08:00","delFlag":1,"id":3,"pageNum":1,"pageSize":10,"remarks":null,"status":1,"typeFlag":3,"typeName":"提交审核","updateBy":null,"updateDate":null},{"comment":null,"createBy":null,"createDate":"2017-12-28T10:30:50.000+08:00","delFlag":1,"id":2,"pageNum":1,"pageSize":10,"remarks":null,"status":1,"typeFlag":2,"typeName":"机型机芯通知邮件","updateBy":null,"updateDate":null},{"comment":null,"createBy":null,"createDate":"2017-12-28T10:30:50.000+08:00","delFlag":1,"id":1,"pageNum":1,"pageSize":10,"remarks":null,"status":1,"typeFlag":1,"typeName":"超级管理员邮件列表","updateBy":null,"updateDate":null}]
    });
}
export function get_emails_json(params){
    return fetch({
        method: 'get',
        url: '/api/manage/email/get_emails_json',
        params 
      })
}
export function addEmail(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/email/add',
        data 
      })
}
export function updateEmail(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/email/update',
        data 
      })
}
export function batchDelEmail(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/email/batchDel',
        data 
      })
}
export function delEmail(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/email/del',
        data 
      })
}
/** 修改状态*/
export function changeEmailStatus(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/email/changeStatus',
        data 
      })
}
function fetch({ method = "get", url, data, params, isJSON = false }) {
    NProgress.start()
    return axios({
      method,
      url,
      data: isJSON ? data : qs.stringify(data),
      params,
      // headers: {
      //   Authorization: this.state.token
      // }
    }).then(function({ data }) {
      NProgress.done()
      //if (data.code === 0) {
        return data;
    //   } else {
    //     throw {
    //       code: data.code,
    //       message: data.msg
    //     };
    //   }
    }).catch((e) => {
      NProgress.done()
      throw e
    })
}