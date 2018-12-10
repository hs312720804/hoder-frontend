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
export function get_offices_json(params){
    return fetch({
        method: 'get',
        url: '/api/manage/office/get_offices_json',
        params 
      })
}
export function addOrgan(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/office/add',
        data 
      })
}
export function updateOrgan(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/office/update',
        data 
      })
}
export function delOrgan(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/office/del',
        data 
      })
}
/** 修改人员状态*/
export function changeOrganStatus(data){
    return fetch({
        method: 'POST',
        url: '/api/manage/office/changeStatus',
        data 
      })
}