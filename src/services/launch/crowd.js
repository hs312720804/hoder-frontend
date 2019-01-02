
export function crowdList(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/index',
        params 
      })
}
//修改新增人群策略
export function addLaunchCrowd(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/saveLaunchCrowd/',
        params 
      })
}
export function updateLaunchCrowd(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/update/',
        params 
      })
}
//投放平台绑定策略 策略投放页面接口
export function modifyLaunchPolicy(data){
    return this.fetch({
        method: 'POST',
        url: '/api/launchPolicy/modifyLaunchPolicy/',
        data 
      })
}
//根据选择的策略得到人群 /crowd/getPolicyCrowds?policyIds=109
export function getStrategyCrowds(params){
    return this.fetch({
        method: 'GET',
        url: '/api/crowd/getPolicyCrowds/',
        params 
      })
}
export function batchDelCrowd(data){
    return this.fetch({
        method: 'POST',
        url: '/api/manage/crowd/batchDel',
        data 
      })
}
export function delCrowd(data){
    return this.fetch({
        method: 'POST',
        url: '/api/launchCrowd/del',
        data 
      })
}
/** 投放*/
export function launchCrowd(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/launch',
        params 
      })
}
/** 取消投放*/
export function cancelLaunchCrowd(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/cancelLaunch',
        params 
      })
}
/** 取消投放*/
export function launchCrowdDel(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/del',
        params 
      })
}
export function ruleDetail(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/ruleDetail',
        params 
      })
}
/*打开人群策略新增页面*/
export function addCrowdLanuch(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/add',
        params 
      })
}
/** 打开人群策略编辑页面*/
export function modifyCrowdLanuch(params){
    return this.fetch({
        method: 'get',
        url: '/api/launchCrowd/modify',
        params 
      })
}
/*人群策略增加*/
export function CrowdLanuchAddBtn(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/saveLaunchCrowd',
        params 
      })
}
/*人群策略编辑*/
export function CrowdLanuchEditBtn(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchCrowd/update',
        params 
      })
}
/** 
 * 获取策略投放里面的接口
*/
export function launchPolicyIndex(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchPolicy/index',
        params 
      })
}
