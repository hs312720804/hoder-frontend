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
const policyListData=[{"conditionTagIds":"1453,1459","createTime":"2018-10-22T19:25:11.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":102,"policyName":"test策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1459,1465,1466,1467,741","createTime":"2018-10-23T13:51:55.000+08:00","creator":91,"dataSource":1,"delFlag":1,"policyId":104,"policyName":"tess1(xcd测试，请勿动)","remark":null,"status":1,"tagsList":null,"updateTime":"2018-10-24T15:55:09.000+08:00","updator":94},{"conditionTagIds":"1450,1455,1459,1463","createTime":"2018-10-23T15:41:40.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":105,"policyName":"复杂策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449,1450,1451,1453,1454,1455,1459,1462,1463,1464","createTime":"2018-10-24T09:45:57.000+08:00","creator":26,"dataSource":2,"delFlag":1,"policyId":106,"policyName":"twltetst","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1461,1462,1463,1464","createTime":"2018-10-24T15:11:37.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":107,"policyName":"ffff","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1450","createTime":"2018-10-24T04:42:45.000+08:00","creator":102,"dataSource":2,"delFlag":1,"policyId":108,"policyName":"订单系统策略","remark":null,"status":1,"tagsList":null,"updateTime":"2018-10-24T04:50:14.000+08:00","updator":102},{"conditionTagIds":"1460,1461,1462,1463","createTime":"2018-10-24T22:32:43.000+08:00","creator":100,"dataSource":2,"delFlag":1,"policyId":109,"policyName":"设备特征（媒资测试专用，请勿删除）","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"741","createTime":"2018-10-24T22:33:37.000+08:00","creator":100,"dataSource":1,"delFlag":1,"policyId":110,"policyName":"区域（媒资测试专用，请勿删除）","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1461,1462,1463","createTime":"2018-10-24T22:48:16.000+08:00","creator":100,"dataSource":2,"delFlag":1,"policyId":111,"policyName":"渠道","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449,1459,1461","createTime":"2018-10-24T23:05:21.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":112,"policyName":"用户构成策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1472","createTime":"2018-10-24T23:26:08.000+08:00","creator":101,"dataSource":1,"delFlag":1,"policyId":113,"policyName":"订单会员策略","remark":null,"status":1,"tagsList":null,"updateTime":"2018-10-25T02:19:02.000+08:00","updator":101},{"conditionTagIds":"1471","createTime":"2018-10-24T23:30:54.000+08:00","creator":97,"dataSource":1,"delFlag":1,"policyId":114,"policyName":"是否4k","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1473","createTime":"2018-10-25T03:04:50.000+08:00","creator":97,"dataSource":1,"delFlag":1,"policyId":115,"policyName":"首页区域","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1471,1473,1474","createTime":"2018-10-25T03:22:00.000+08:00","creator":97,"dataSource":1,"delFlag":1,"policyId":116,"policyName":"test","remark":null,"status":1,"tagsList":null,"updateTime":"2018-10-25T03:24:02.000+08:00","updator":97},{"conditionTagIds":"1475","createTime":"2018-10-25T03:23:05.000+08:00","creator":97,"dataSource":1,"delFlag":1,"policyId":118,"policyName":"MAC地址","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1460,1461,1462","createTime":"2018-10-29T22:11:05.000+08:00","creator":91,"dataSource":2,"delFlag":1,"policyId":119,"policyName":"eeeee","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449,1460","createTime":"2018-11-06T17:49:26.000+08:00","creator":94,"dataSource":2,"delFlag":1,"policyId":120,"policyName":"回调策略","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1449","createTime":"2018-11-22T21:26:53.000+08:00","creator":26,"dataSource":2,"delFlag":1,"policyId":121,"policyName":"元旦活动","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1474,1475","createTime":"2018-11-23T02:25:25.000+08:00","creator":104,"dataSource":1,"delFlag":1,"policyId":122,"policyName":"performanceTest","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1450,1452","createTime":"2018-11-25T21:36:13.000+08:00","creator":104,"dataSource":2,"delFlag":1,"policyId":123,"policyName":"影视","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1465,1472","createTime":"2018-11-26T01:53:15.000+08:00","creator":104,"dataSource":1,"delFlag":1,"policyId":124,"policyName":"影视会员","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1465","createTime":"2018-11-26T22:07:41.000+08:00","creator":104,"dataSource":1,"delFlag":1,"policyId":127,"policyName":"新用户非会员优惠活动_测试","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1471,1472","createTime":"2018-11-26T22:11:31.000+08:00","creator":104,"dataSource":1,"delFlag":1,"policyId":128,"policyName":"4K老用户非会员优惠活动_测试","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null},{"conditionTagIds":"1465,1471,1475","createTime":"2018-11-28T05:03:10.000+08:00","creator":104,"dataSource":1,"delFlag":1,"policyId":129,"policyName":"1策略8人群","remark":null,"status":1,"tagsList":null,"updateTime":null,"updator":null}]
export function policyList(data) {
    return Promise.resolve({
        code:0,data:policyListData
    });
}
export function searchUsedCrowd(data){
    return fetch({
        method: 'POST',
        url: '/api/launchHelp/searchUsedCrowd/',
        data 
      })
}