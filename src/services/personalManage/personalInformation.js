import qs from 'qs'
import NProgress from 'nprogress'
import axios from 'axios'

export function get_user_json (params) {
  return this.fetch({
    method: 'get',
    url: '/api/manage/user/personalInformation',
    params
  }).then((data) => {
    return data
  })
}

export function updateUserInformation (params) {
  return this.fetch({
    method: 'post',
    url: '/api/manage/user/updateUsernameAndEmail',
    params
  }).then((data) => {
    return data
  })
}

function fetch ({ method = 'get', url, data, params, isJSON = false }) {
  NProgress.start()
  return axios({
    method,
    url,
    data: isJSON ? data : qs.stringify(data),
    params
    // headers: {
    //   Authorization: this.state.token
    // }
  }).then(function ({ data }) {
    NProgress.done()
    // if (data.code === 0) {
    return data
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
