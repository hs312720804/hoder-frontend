export function peoplePositonList(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/findAllCrowdDataPos',
        params
    })
}
export function peoplePositonAdd(params){
    return this.fetch({
        method: 'post',
        url: '/api/crowdDataPos/add',
        params
    })
}
export function peoplePositonEdit(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/edit',
        params
    })
}
export function peoplePositonDel(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowdDataPos/del',
        params
    })
}
