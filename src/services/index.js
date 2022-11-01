// import Vue from 'vue'
// import { utils } from '@ccprivate/admin-toolkit'
import fetch from 'cseed-frame/services/_fetch'
import login from './login'
import getConstants from './getConstants'
import * as email from './systemSetting/email'
import * as personManage from './administration/person'
import * as organ from './administration/organ'
import * as role from './administration/role'
import * as validate from './launch/validate'
import { get_user_json, updateUserInformation } from './personalManage/personalInformation'
import { modifyPwd } from './personalManage/modifyPassword'
import * as crowd from './launch/crowd'
import * as crowdStrategy from './crowdStrategy/index'
import * as menu from './systemSetting/menu'
import * as tagGroup from './tagGroup'
import * as tagCategory from './tagCategory.js'
import * as tag from './tag.js'
import * as dataManage from './dataManage/peoplePosition'
import * as thirdInterface from './dataManage/thirdInterface'
import * as statisticCrowd from './statisticCrowd/crowdPolicy'
import * as clearCache from './dataManage/clearCache'
import * as ipManage from './dataManage/ipManage'
import * as launchSetting from './systemSetting/launch'
import * as notice from './systemSetting/notice'
import * as crowdStatistic from './statisticCrowd/crowdStatistic'
import * as anomaly from './launch/anomaly'
import * as devicePortrait from './GroupImageInsight/devicePortrait'
import * as userTagsSearch from './launch/useTagsSearch'
import * as listDimension from './listDimension'
import * as tempCrowd from './crowdStrategy/tempCrowd'
import * as localCrowd from './crowdStrategy/localCrowd'
const service = {
  state: {},
  fetch,
  login,
  getConstants,
  modifyPwd,
  get_user_json,
  updateUserInformation,
  ...email,
  ...personManage,
  ...organ,
  ...role,
  ...validate,
  ...crowd,
  ...crowdStrategy,
  ...menu,
  ...tagGroup,
  ...tagCategory,
  ...tag,
  ...dataManage,
  ...statisticCrowd,
  ...thirdInterface,
  ...clearCache,
  ...ipManage,
  ...launchSetting,
  ...notice,
  ...crowdStatistic,
  ...anomaly,
  ...devicePortrait,
  ...userTagsSearch,
  ...listDimension,
  ...tempCrowd,
  ...localCrowd
}
export default function install (Vue) {
  const $service = {}
  Object.keys(service).forEach((key) => {
    if (typeof service[key] === 'function') {
      $service[key] = async (args, message) => {
        return service[key](args)
          .then((result) => {
            if (message) {
              Vue.prototype.$notify({
                title: '操作成功',
                type: 'success',
                message
              })
            }
            return result
          })
          .catch(() => {
            // if (error.request && error.request.status === 401) {
            //   location.href = location.origin + location.pathname + '#/login'
            // } else {
            //   Vue.prototype.$notify({
            //     title: '操作失败',
            //     type: 'error',
            //     message: error.message
            //   })
            //   return Promise.reject(error)
            // }
          })
      }
    } else {
      $service[key] = service[key]
    }
  })
  Vue.prototype.$service = $service
}
