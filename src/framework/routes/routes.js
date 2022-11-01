import statisticsHomePage from '@/views/DeliveryStatistics/HomePage'
import KeyIndicatorTrends from '@/views/DeliveryStatistics/KeyIndicatorTrends'
export default function createRoutes (frameRoutes = []) {
  frameRoutes = frameRoutes.concat([
    {
      name: 'statisticsHomePage',
      path: '/total/statisticsHomePage',
      component: statisticsHomePage,
      meta: {
        title: '投放统计',
        tagId: 'statisticsHomePage',
        icon: 'el-icon-cc-file',
        isCloseable: false
      }
    },
    {
      name: 'keyIndicatorTrends',
      path: '/total/keyIndicatorTrends',
      component: KeyIndicatorTrends,
      meta: {
        title: '关键指标趋势',
        tagId: 'keyIndicatorTrends',
        icon: 'el-icon-cc-file',
        isCloseable: false
      }
    }
  ])
  return frameRoutes
}
