export function policyList(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/index',
        params 
      })
}
export function policyAdd(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/add',
        params 
      })
}
export function policyTagSeach(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/tagSeach',
        params 
      })
}
/*新建策略*/
export function policyAddSave(data){
    return this.fetch({
        method: 'POST',
        url: '/api/policy/save',
        data 
      })
}
/** 策略编辑*/
export function policyUpate(data){
    return this.fetch({
        method: 'POST',
        url: '/api/policy/update',
        data 
      })
}
export function policyDel(data){
    return this.fetch({
        method: 'POST',
        url: '/api/policy/del',
        data 
      })
}
export function viewCrowd(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/viewpolicy',
        params 
      })
}
export function getTagsByPoliceId(params){
    return this.fetch({
        method: 'get',
        url: '/api/policy/getTagsByPolicyId',
        params 
      })
}
export function getTagAttr(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowd/getTagAttr',
        params 
      })
}
export function crowdSave(data){
    return this.fetch({
        method: 'POST',
        url: '/api/crowd/save',
        data 
      })
}
//人群编辑
export function crowdEdit(params){
    return this.fetch({
        method: 'get',
        url: '/api/crowd/edit',
        params 
      })
}
//人群编辑保存
export function crowdUpdate(data){
    return this.fetch({
        method: 'POST',
        url: '/api/crowd/update',
        data 
      })
}
//人群删除
export function strategyCrowdDel(data){
    return this.fetch({
        method: 'POST',
        url: '/api/crowd/del',
        data 
      })
}
export function freshService(params){
    return this.fetch({
        method: 'get',
        url: '/api/api/webServers/reload',
        params 
      })
}
export function freshCache(params){
    return this.fetch({
        method: 'get',
        url: '/api/api/policyGen/lua',
        params 
      })
}

