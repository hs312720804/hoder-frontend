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
const service = {
    state: {},
    fetch,
    login,
    getConstants,
    ...email,
    ...personManage,
    ...organ,
    ...role,
    ...validate
}
Vue.prototype.$service = utils.wrapService(service)