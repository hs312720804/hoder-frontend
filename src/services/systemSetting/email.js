
export function emailTypeList(data) {
    return Promise.resolve({code:0,data:
        [{"label":"超级管理员邮件列表","value":1},{"label":"机型机芯通知邮件","value":2},{"label":"提交审核","value":3},{"label":"审核结果通知邮件","value":4},{"label":"未报备设备通知邮件","value":5},{"label":"闭还版本更新通知","value":6}]
    });
}
export function get_emails_json(params){
    return this.fetch({
        method: 'get',
        url: '/api/manage/email/get_emails_json',
        params 
      })
}
export function addEmail(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/email/add',
        data 
      })
}
export function updateEmail(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/email/update',
        data 
      })
}
export function batchDelEmail(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/email/batchDel',
        data 
      })
}
export function delEmail(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/email/del',
        data 
      })
}
/** 修改状态*/
export function changeEmailStatus(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/email/changeStatus',
        data 
      })
}
