import Vue from 'vue'
import { utils } from "admin-toolkit";

import fetch from './fetch'
import login from './login'
import getConstants from './getConstants'
import * as email from './systemSetting/email'
import * as personManage from './administration/person'
import * as organ from './administration/organ'
import * as role from './administration/role'
import * as validate from './launch/validate'
import {get_user_json,updateUserInformation} from './personalManage/personalInformation'
import {modifyPwd} from './personalManage/modifyPassword'
import * as crowd from './launch/crowd'
import * as crowdStrategy from "./crowdStrategy/index"
import * as menu from "./systemSetting/menu"
import * as tagGroup from "./tagGroup"
import * as tagCategory from "./tagCategory.js"
import * as tag from "./tag.js"
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
}
Vue.prototype.$service = utils.wrapService(service)