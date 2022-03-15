const getters = {
  policyId: state => state.configScheme.policyId,
  policyName: state => state.configScheme.policyName,
  policyInfo: state => state.configScheme.policyInfo,
  smartDetail: state => state.configScheme.smartDetail,
  isSmartEdit: state => state.configScheme.isSmartEdit
}

export default getters
