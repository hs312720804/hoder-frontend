import Vue from 'vue'
import { utils } from "admin-toolkit";

import fetch from './fetch'
import login from './login'
import getConstants from './getConstants'

const service = {
    state: {},
    fetch,
    login,
    getConstants
}

Vue.prototype.$service = utils.wrapService(service)