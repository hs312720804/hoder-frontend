export function getLaunchList(params){
    return this.fetch({
        method: 'get',
        url: '/api/manager/biList/getBiListPage',
        params
    })
}
export function editLaunchMenu(data){
    return this.fetch({
        method: 'get',
        url: '/api/manager/biList/getByBiId',
        data
    })
}
export function addLaunchMenu(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manager/biList/add',
        data
    })
}
export function updateLaunchMenu(data){
    return this.fetch({
        method: 'put',
        url: '/api/manager/biList/updateBiList',
        data
    })
}
export function getLaunchMenuList(params){
    return this.fetch({
        method: 'GET',
        url: '/api/manager/biList/getBiList',
        params
    })
}
