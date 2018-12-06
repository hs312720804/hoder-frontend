import Vue from 'vue'
import { utils } from "admin-toolkit";

import fetch from './fetch'
import login from './login'
import getConstants from './getConstants'
import * as email from './systemSetting/email'
import * as personManage from './administration/person'

const service = {
    state: {},
    fetch,
    login,
    getConstants,
    ...email,
    ...personManage
}
Vue.prototype.$service = utils.wrapService(service)