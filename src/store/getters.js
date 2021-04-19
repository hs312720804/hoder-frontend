const getters = {
    policyId: state => state.configScheme.policyId,
    policyInfo: state => state.configScheme.policyInfo,
    smartDetail: state => state.configScheme.smartDetail,
    isSmartEdit: state => state.configScheme.isSmartEdit
}

export default getters;
