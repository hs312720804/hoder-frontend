export function get_menus_json(params){
    return this.fetch({
        method: 'get',
        url: '/api/manage/menu/get_menus_json',
        params 
      })
}
export function changeMenuStatus(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/menu/changeStatus',
        data 
      })
}
export function delMenu(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/menu/del',
        data 
      })
}
export function MenuAdd(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/menu/add',
        data 
      })
}
export function MenuUpdate(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/menu/update',
        data 
      })
}
export function get_menu_tree_json(params){
    return this.fetch({
        method: 'GET',
        url: '/api/manage/menu/get_menu_tree_json',
        params 
      })
}