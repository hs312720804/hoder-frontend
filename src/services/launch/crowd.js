import qs from "qs";
import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
function fetch({ method = "get", url, data, params, isJSON = false }) {
    NProgress.start()
    return axios({
      method,
      url,
      data: isJSON ? data : qs.stringify(data),
      params,
      // headers: {
      //   Authorization: this.state.token
      // }
    }).then(function({ data }) {
      NProgress.done()
      //if (data.code === 0) {
        return data;
    //   } else {
    //     throw {
    //       code: data.code,
    //       message: data.msg
    //     };
    //   }
    }).catch((e) => {
      NProgress.done()
      throw e
    })
}
//人群策略首页分页数据
const crowdData={"endRow":5,"firstPage":1,"hasNextPage":false,"hasPreviousPage":false,"isFirstPage":true,"isLastPage":true,"lastPage":1,"list":[{"biName":"活动平台","createTime":"2018-10-24T14:15:49.000+08:00","creator":91,"dataSource":2,"delFlag":1,"dmpCrowdId":540,"dmpEstimate":12324,"expiryTime":"2018-10-30T22:49:00.000+08:00","launchCrowdId":79,"launchName":"eeeee","policyCrowdIds":"171","policyIds":"102","remark":"","status":1,"updateTime":"2018-10-23T22:49:47.000+08:00","updator":91},{"biName":"活动平台","createTime":"2018-10-24T17:21:24.000+08:00","creator":94,"dataSource":2,"delFlag":1,"dmpCrowdId":543,"dmpEstimate":null,"expiryTime":"2018-10-31T17:21:11.000+08:00","launchCrowdId":80,"launchName":"test投放10","policyCrowdIds":"168,173","policyIds":"102","remark":"","status":1,"updateTime":null,"updator":null},{"biName":"影视订单平台","createTime":"2018-10-24T17:46:38.000+08:00","creator":102,"dataSource":2,"delFlag":1,"dmpCrowdId":544,"dmpEstimate":5188937,"expiryTime":"2018-10-31T05:46:37.000+08:00","launchCrowdId":81,"launchName":"订单测试","policyCrowdIds":"184","policyIds":"108","remark":"订单测试","status":3,"updateTime":"2018-11-01T02:43:18.000+08:00","updator":102},{"biName":"活动平台","createTime":"2018-11-06T17:52:33.000+08:00","creator":94,"dataSource":2,"delFlag":1,"dmpCrowdId":545,"dmpEstimate":5193743,"expiryTime":"2018-11-13T17:52:12.000+08:00","launchCrowdId":82,"launchName":"回调投放","policyCrowdIds":"203","policyIds":"120","remark":"","status":3,"updateTime":"2018-11-07T01:13:24.000+08:00","updator":94},{"biName":"活动平台","createTime":"2018-11-23T11:26:16.000+08:00","creator":26,"dataSource":2,"delFlag":1,"dmpCrowdId":546,"dmpEstimate":null,"expiryTime":"2018-11-29T22:26:16.000+08:00","launchCrowdId":83,"launchName":"ewqe","policyCrowdIds":"204","policyIds":"121","remark":"qweqwe","status":1,"updateTime":null,"updator":null},{"biName":"活动平台","createTime":"2018-11-26T10:50:06.000+08:00","creator":104,"dataSource":2,"delFlag":1,"dmpCrowdId":547,"dmpEstimate":197803,"expiryTime":"2018-12-02T21:50:06.000+08:00","launchCrowdId":84,"launchName":"影视会员","policyCrowdIds":"207","policyIds":"123","remark":"","status":3,"updateTime":"2018-11-25T21:51:04.000+08:00","updator":104}],"navigateFirstPage":1,"navigateLastPage":1,"navigatePages":8,"navigatepageNums":[1],"nextPage":0,"pageNum":1,"pageSize":6,"pages":1,"prePage":0,"size":6,"startRow":0,"total":6}
//人群策略新增策略平台
const strategyPlatformData=[{"conditionTagIds":"1453,1459","createTime":"2018-10-22T19:25:11.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":102,"policyName":"test策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1450,1455,1459,1463","createTime":"2018-10-23T15:41:40.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":105,"policyName":"复杂策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449,1450,1451,1453,1454,1455,1459,1462,1463,1464","createTime":"2018-10-24T09:45:57.000+08:00","creator":26,"dataSource":2,"delFlag":1,"policyId":106,"policyName":"twltetst","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1461,1462,1463,1464","createTime":"2018-10-24T15:11:37.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":107,"policyName":"ffff","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1450","createTime":"2018-10-24T04:42:45.000+08:00","creator":102,"dataSource":2,"delFlag":1,"policyId":108,"policyName":"订单系统策略","remark":null,"status":1,"tagsList":null,"updateTime":"2018-10-24T04:50:14.000+08:00","updator":102},{"conditionTagIds":"1460,1461,1462,1463","createTime":"2018-10-24T22:32:43.000+08:00","creator":100,"dataSource":2,"delFlag":1,"policyId":109,"policyName":"设备特征（媒资测试专用，请勿删除）","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1461,1462,1463","createTime":"2018-10-24T22:48:16.000+08:00","creator":100,"dataSource":2,"delFlag":1,"policyId":111,"policyName":"渠道","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449,1459,1461","createTime":"2018-10-24T23:05:21.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":112,"policyName":"用户构成策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1460,1461,1462","createTime":"2018-10-29T22:11:05.000+08:00","creator":91,"dataSource":2,"delFlag":1,"policyId":119,"policyName":"eeeee","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449,1460","createTime":"2018-11-06T17:49:26.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":120,"policyName":"回调策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449","createTime":"2018-11-22T21:26:53.000+08:00","creator":26,"dataSource":2,"delFlag":1,"policyId":121,"policyName":"元旦活动","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1450,1452","createTime":"2018-11-25T21:36:13.000+08:00","creator":104,"dataSource":2,"delFlag":1,"policyId":123,"policyName":"影视","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null}]
const launchPlatformData=[{"apiSec":null,"biId":1,"biName":"活动平台","createTime":"2018-08-27T14:16:38.000+08:00","creator":null,"delFlag":null,"launchPolicyIds":"123,124,127","remark":null,"status":1,"updateTime":null,"updator":null},{"apiSec":null,"biId":2,"biName":"主页平台","createTime":"2018-08-27T14:16:47.000+08:00","creator":null,"delFlag":null,"launchPolicyIds":"114,115,116","remark":null,"status":1,"updateTime":null,"updator":null},{"apiSec":null,"biId":4,"biName":"媒资平台","createTime":"2018-10-09T15:05:03.000+08:00","creator":null,"delFlag":null,"launchPolicyIds":"109,110","remark":null,"status":1,"updateTime":null,"updator":null},{"apiSec":null,"biId":5,"biName":"影视订单平台","createTime":"2018-10-24T14:58:42.000+08:00","creator":null,"delFlag":null,"launchPolicyIds":"104,113,121","remark":null,"status":1,"updateTime":null,"updator":null}]
export function crowdList(data) {
    return Promise.resolve({
        code:0,data:crowdData
    });
}
export function strategyPlatform(data) {
    return Promise.resolve({
        code:0,data:strategyPlatformData
    });
}
export function launchPlatform(data) {
    return Promise.resolve({
        code:0,data:launchPlatformData
    });
}
//修改新增人群策略
export function modifyLaunchCrowd(data){
    return fetch({
        method: 'POST',
        url: '/api/launchCrowd/modifyLaunchCrowd/',
        data 
      })
}
//根据选择的策略得到人群 /crowd/getPolicyCrowds?policyIds=109
export function getStrategyCrowds(params){
    return fetch({
        method: 'GET',
        url: '/api/crowd/getPolicyCrowds/',
        params 
      })
}
export function addCrowd(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/crowd/add',
        data 
      })
}
export function updateCrowd(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/crowd/update',
        data 
      })
}
export function batchDelCrowd(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/crowd/batchDel',
        data 
      })
}
export function delCrowd(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/crowd/del',
        data 
      })
}
/** 修改状态*/
export function launch(data){
    return fetch({
        method: 'POST',
        url: '/api/launchCrowd/launch',
        data 
      })
}