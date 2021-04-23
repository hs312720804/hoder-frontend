import API from '@/services'
const configScheme = {
    state: {
        policyId: undefined, // 方案id
        policyInfo: {}, // 编辑策略人群时需要携带的数据
        smartDetail: {}, // 获取流程图数据
        isSmartEdit: false // 是否处于编辑逻辑
    },
    mutations: {
        // 设置方案id
        setPolicyId (state, id) {
            state.policyId = id;
        },
        'SET_POLICY_INFO': (state, data) => {
            state.policyInfo = data;
        },
        'SET_SMART_DETAIL': (state, data) => {
            state.smartDetail = data
        },
        setEditSchemeConfig (state, status) {
            state.isSmartEdit = status;
        },
        setSchemeConfigNull (state) {
            state.policyId = undefined;
            state.isSmartEdit = false;
        }
    },
    actions: {
        // 根据方案id获取方案信息
        getPolicyInfo ({commit}, policyId) {
            return new Promise((resolve) => {
                API.smartProframPolicyInfo({policyId}).then(rs => {
                    resolve(rs.policy)
                })
            })
        },
        // 根据policyId获取流程图策略信息
        getSchemeConfigInfo ({commit}, policyId) {
            API.smartProgrammeDetail(this.policyId).then(res => {
                commit('SET_SMART_DETAIL', res.data)
            })
        },
        // 根据policyId判断是编辑还是创建
        saveSmartProgramme ({commit, state}, params) {
            return new Promise((resolve, reject) => {
                if (state.policyId) {
                    API.smartProframPolicyUpdate(params, '编辑成功').then(rs => {
                        resolve(rs)
                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    API.smartProgramme(params, '保存成功').then(rs => {
                        resolve(rs)
                    }).catch(err => {
                        reject(err)
                    })
                }
            })
        }
    }
}

export default configScheme
