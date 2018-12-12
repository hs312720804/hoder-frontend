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
import * as crowd from './launch/crowd'
const service = {
    state: {},
    fetch,
    login,
    getConstants,
    ...email,
    ...personManage,
    ...organ,
    ...role,
    ...validate,
    ...crowd
}
Vue.prototype.$service = utils.wrapService(service)