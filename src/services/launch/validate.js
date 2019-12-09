
export function searchUsedCrowd(data){
    return this.fetch({
        method: 'POST',
        url: '/api/launchHelp/searchUsedCrowd/',
        data
      })
}
export function launchHelpIndex(params){
    return this.fetch({
        method: 'GET',
        url: '/api/launchHelp/index',
        params
      })
}
export function launchHelpCrowdIndex(data){
    return this.fetch({
        method: 'POST',
        url: '/api/launchValidate/searchHitRes',
        data,
        isJSON: true
      })
}
