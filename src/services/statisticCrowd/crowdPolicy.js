export function get_total_policy(params){
    return this.fetch({
        method: 'get',
        url: '/api/statistic/getTotalPolicy',
        params
    })
}
