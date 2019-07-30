
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
// 根据策略id获取人群Id
export function getCrowdsByPolicyId(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/launchPolicy/getCrowdsByPolicyId',
        params
    })
}
/**
 * 多版本人群圈定接口
 */
// 列表页
export function getMultiVersionCrowd(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/multiVersionCrowd/index',
        params
    })
}
// 新增自定义人群或者普通人群
export function addMultiVersionCrowd(params) {
    return this.fetch({
        method: 'GET',
        url: '/api/multiVersionCrowd/add/'+params
    })
}
// 新增保存接口
export function saveAddMultiVersionCrowd({model,data}) {
    return this.fetch({
        method: 'post',
        url: '/api/multiVersionCrowd/'+model,
        data,
        isJSON: true
    })
}
// 编辑保存
export function saveEditMultiVersionCrowd({model,data}) {
    return this.fetch({
        method: 'put',
        url: '/api/multiVersionCrowd/'+model,
        data,
        isJSON: true
    })
}
// 编辑获取详情接口
export function editMultiVersionCrowd(params) {
    return this.fetch({
        method: 'get',
        url: '/api/multiVersionCrowd/modify/' + params
    })
}
// 删除
export function delMultiVersionCrowd(params) {
    return this.fetch({
        method: 'delete',
        url: '/api/multiVersionCrowd/' + params
    })
}
// 人群条件
export function MultiVersionCrowdPeople(params) {
    return this.fetch({
        method: 'get',
        url: '/api/multiVersionCrowd/ruleDetail',
        params
    })
}
// 投放
export function LaunchMultiVersionCrowd(params) {
    return this.fetch({
        method: 'get',
        url: '/api/multiVersionCrowd/launch',
        params
    })
}
// 取消投放
export function cancelLaunchMultiVersionCrowd(params) {
    return this.fetch({
        method: 'get',
        url: '/api/multiVersionCrowd/cancelLaunch',
        params
    })
}
