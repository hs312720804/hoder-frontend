export function peoplePositonList(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/findAllCrowdDataPos',
        params
    })
}
export function peoplePositonAdd(data){
    return this.fetch({
        method: 'post',
        url: '/api/crowdDataPos/add',
        data
    })
}
export function peoplePositonEdit(data){
    return this.fetch({
        method: 'post',
        url: '/api/crowdDataPos/edit',
        data
    })
}
export function peoplePositonDel(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/del',
        params
    })
}
export function getPositonDetail(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/findCrowdDataPosById',
        params
    })
}
export function protocolList(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/getProtocol',
        params
    })
}
export function crowdIdList(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/getLaunchCrowdId',
        params
    })
}
