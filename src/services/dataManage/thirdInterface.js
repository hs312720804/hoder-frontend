export function getthirdInterfaceList(params){
    return this.fetch({
        method: 'get',
        url: '/api/thirdInterfaceConf/findAllByPage',
        params
    })
}
export function getthirdInterfaceAdd(data){
    return this.fetch({
        method: 'post',
        url: '/api/thirdInterfaceConf/add',
        data
    })
}
export function getthirdInterfaceEdit(data){
    return this.fetch({
        method: 'post',
        url: '/api/thirdInterfaceConf/edit',
        data
    })
}
export function thirdInterfaceDel(params){
    return this.fetch({
        method: 'get',
        url: '/api/thirdInterfaceConf/del',
        params
    })
}
export function getThirdInterfaceDetail(params){
    return this.fetch({
        method: 'get',
        url: '/api/thirdInterfaceConf/findThirdInterfaceConfById',
        params
    })
}
export function getthirdInterfaceSelectList(params){
    return this.fetch({
        method: 'get',
        url: '/api/thirdInterfaceConf/findAll',
        params
    })
}
