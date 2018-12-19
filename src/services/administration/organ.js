
export function get_offices_json(params){
    return this.fetch({
        method: 'get',
        url: '/api/manage/office/get_offices_json',
        params 
      })
}
export function addOrgan(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/office/add',
        data 
      })
}
export function updateOrgan(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/office/update',
        data 
      })
}
export function delOrgan(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/office/del',
        data 
      })
}
/** 修改人员状态*/
export function changeOrganStatus(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/office/changeStatus',
        data 
      })
}