import Main from '@/components/Main'
import Wrapper from '@/components/Wrapper.vue'
import Login from '@/views/Login'
import TagGroup from '@/views/TagGroup/Index.vue'
import strategyList from '@/views/crowdStrategy/index'
import crowd from '@/views/launch/crowd'
import launchTabList from '@/views/launch/LaunchTabList'
import strategy from '@/views/launch/strategy/List'
import validate from '@/views/launch/CrowdValidate'
// import dictionaryManage from '@/views/setting/dictionaryManage'
import emailNotice from '@/views/setting/emailNotice'
import loginLog from '@/views/setting/loginLog'
import menuSetting from '@/views/setting/menuSetting/index'
import operateLog from '@/views/setting/operateLog'
import organManage from '@/views/setting/organManage'
import password from '@/views/setting/password'
import personalInformation from '@/views/setting/personalInformation'
import personManage from '@/views/setting/personManage'
import roleManage from '@/views/setting/roleManage'
import dataMange from '@/views/DataManage/peoplePositionIndex'
import tagDictDatabase from '@/views/Tag/tagDictDatabase'
import statisticsHomePage from '@/views/DeliveryStatistics/HomePage'
// import statisticsHomePage from '@/views/DeliveryStatistics/StatisticsHomePage'
import DeliveryDataAnalyse from '@/views/DeliveryStatistics/DeliveryDataAnalyse'
import DeliveryMonitor from '@/views/DeliveryStatistics/DeliveryMonitor'
import DeliveryAfterPeopleDraw from '@/views/DeliveryStatistics/DeliveryAfterPeopleDraw'
import OverallDeliveryStatistics from '@/views/HomePage/OverallDeliveryStatistics'
import CurrentPopulationClassification from '@/views/HomePage/CurrentPopulationClassification'
import OTTBigscreenIndex from '@/views/HomePage/OTTBigscreenIndex'
import tabStructure from '@/views/HomePage/tabStructure'
import indexBI from '@/views/HomePage/indexBI'
import crowdPortrayal from '@/views/HomePage/crowdPortrayal'
import thirdPartyDMP from '@/views/ThirdParty/thirdPartyDMP'
import OverallCrowdStatistics from '@/views/HomePage/OverallCrowdStatistics'
import thirdInterface from '@/views/thirdInterface/index'
import clearCache from '@/views/DevelopTools/clearCache/clearCacheIndex'
import ipManage from '@/views/DevelopTools/ipManage/index'
import multiVersionCrowd from '@/views/launch/multiVersionCrowd/Index'
import launchSettings from '@/views/setting/launchSetting'
import notice from '@/views/setting/messageNotice/index'
import oneTouchDrop from '@/views/OneTouchDrop/Index'
import AddMoreCrowds from '@/views/crowdStrategy/AddMoreCrowds'
import anomalyEcharts from '@/views/launch/anomaly'
import homepageReleaseRecord from '@/views/crowdStrategy/HomepageReleaseRecord'
import myPolicy from '@/views/MyPolicy/Index'
import redirectList from '@/views/crowdStrategy/redirect/List'
import redirectAdd from '@/views/crowdStrategy/redirect/Add'
import groupImageInsight from '@/views/GroupImageInsight/Index'
import userTagsSearch from  '@/views/launch/userTagsSearch'
import hitSearch from  '@/views/launch/hitSearch'
import labelSquare from '@/views/LabelSquare/Index'
import specialTag from '@/views/SpecialTag/Index'

const children = [
    // {
    //     name: 'homePage',
    //     path: 'homePage',
    //     component: Wrapper,
    //     meta: {
    //         title: '首页',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children: [
            {
                name: 'OverallDeliveryStatistics',
                path: 'homePage/OverallDeliveryStatistics',
                component: OverallDeliveryStatistics,
                meta: {
                    tagId: 'OverallDeliveryStatistics',
                    title: '整体指标统计',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'OverallCrowdStatistics',
                path: 'homePage/OverallCrowdStatistics',
                component: OverallCrowdStatistics,
                meta: {
                    tagId: 'OverallCrowdStatistics',
                    title: '整体人群统计',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'indexBI',
                path: 'homePage/indexBI',
                component: indexBI,
                meta: {
                    tagId: 'indexBI',
                    title: '已有的BI指数',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'CurrentPopulationClassification',
                path: 'homePage/CurrentPopulationClassification',
                component: CurrentPopulationClassification,
                meta: {
                    tagId: 'CurrentPopulationClassification',
                    title: '现有人群分类',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'OTTBigscreenIndex',
                path: 'homePage/OTTBigscreenIndex',
                component: OTTBigscreenIndex,
                meta: {
                    tagId: 'OTTBigscreenIndex',
                    title: 'OTT大屏指数',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'tabStructure',
                path: 'homePage/tabStructure',
                component: tabStructure,
                meta: {
                    tagId: 'tabStructure',
                    title: '标签结构',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'crowdPortrayal',
                path: 'homePage/crowdPortrayal',
                component: crowdPortrayal,
                meta: {
                    tagId: 'crowdPortrayal',
                    title: '投前人群画像',
                    icon: 'el-icon-cc-home'
                }
            },
    //     ]
    // },
    // {
    //     name: 'dashboard',
    //     path: '/',
    //     component: Wrapper,
    //     meta: {
    //         title: '标签管理',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'tag',
                path: 'tag',
                component: TagGroup,
                props: {
                    mode: 'list-tag-group'
                },
                meta: {
                    tagId: "tag",
                    title: '标签列表',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'labelSquare',
                path: 'labelSquare',
                component: labelSquare,
                meta: {
                    tagId: "labelSquare",
                    title: '标签广场',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'tag-group-read',
                path: 'tag-group/:id',
                component: TagGroup,
                props: {
                    mode: 'read-tag-group'
                },
                meta: {
                    tagId: "tag",
                    title: '标签列表',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'tag-category-read',
                path: 'tag-category/:id',
                component: TagGroup,
                props: {
                    mode: 'read-tag-category'
                },
                meta: {
                    tagId: "tag",
                    title: '查看标签',
                    icon: 'el-icon-cc-file',
                    hideInMenu: true
                }
            },
            {
                name: 'tagDictDatabase',
                path: 'tagDictDatabase',
                component: tagDictDatabase,
                props: {
                    mode: 'list-tag-dict-database'
                },
                meta: {
                    tagId: "tagDictDatabase",
                    title: '标签字典库',
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     path: 'launch',
    //     name:"launch",
    //     meta: {
    //         title: '人群管理',
    //         icon: 'el-icon-cc-file',
    //     },
    //     component: Wrapper,
    //     children: [
            {
                name: 'crowd',
                path: 'launch/crowd',
                component: crowd,
                meta: {
                    tagId:"crowd",
                    title: '人群圈定',
                    icon: 'el-icon-cc-file'
                },
            },
            {
                name: 'launchTabList',
                path: 'launch/launchTabList',
                component: launchTabList,
                meta: {
                    tagId:"launchTabList",
                    title: '投放管理',
                    icon: 'el-icon-cc-file'
                },
            },
            {
                name: 'myPolicy',
                path: 'launch/myPolicy',
                component: myPolicy,
                meta: {
                    tagId:"myPolicy",
                    title: '我的人群',
                    icon: 'el-icon-cc-file',
                    isCache: false
                },
            },
            {
                name: 'strategy',
                path: 'launch/strategy',
                component: strategy,
                meta: {
                    title: '人群分割 投放',
                    tagId:"strategy",
                  //  hideInMenu: true,
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'strategyList',
                path: 'launch/strategyList',
                component: strategyList,
                meta: {
                    tagId:"strategyList",
                    title: '人群分隔 管理',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'multiVersionCrowd',
                path: 'launch/multiVersionCrowd',
                component: multiVersionCrowd,
                meta: {
                    title: '人群多版本圈定',
                    tagId:"multiVersionCrowd",
                    icon: 'el-icon-cc-file'
                }
            },
            {
              name: 'AddMoreCrowds',
              path: 'launch/AddMoreCrowds',
              component: AddMoreCrowds,
              meta: {
                  tagId:"AddMoreCrowds",
                  title: '添加多个人群',
                  icon: 'el-icon-cc-file',
                  hideInMenu: true
              }
            },
    //     ],
    // },
    // {
    //     name: 'launchHelper',
    //     path: 'launchHelper',
    //     component: Wrapper,
    //     meta: {
    //         title: '投放助手',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'validate',
                path: 'launchHelper/validate',
                component: validate,
                meta: {
                    title: '投放验证',
                    tagId:"validate",
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'anomalyEcharts',
                path: 'launchHelper/anomalyEcharts',
                component: anomalyEcharts,
                meta: {
                    title: '异常监测',
                    tagId:"anomalyEcharts"
                }
            },
            {
                name: 'DeliveryMonitor',
                path: 'launchHelper/DeliveryMonitor',
                component: DeliveryMonitor,
                meta: {
                    title: '投放中的投放监控',
                    tagId:"DeliveryMonitor",
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'userTagsSearch',
                path: 'launchHelper/userTagsSearch',
                component: userTagsSearch,
                meta: {
                    title: '用户标签查询',
                    tagId:"userTagsSearch",
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'hitSearch',
                path: 'launchHelper/hitSearch',
                component: hitSearch,
                meta: {
                    title: '命中查询',
                    tagId:"hitSearch",
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     name: 'dataManage',
    //     path: 'dataManage',
    //     component: Wrapper,
    //     meta: {
    //         title: '开发工具',
    //         icon: 'el-icon-cc-institute'
    //     },
    //     children:[
            {
                name: 'dataManage',
                path: 'dataManage/dataManage',
                component: dataMange,
                meta: {
                    tagId:"dataManage",
                    title: '人群位置信息管理',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'thirdInterface',
                path: 'dataManage/thirdInterface',
                component: thirdInterface,
                meta: {
                    tagId:"thirdInterface",
                    title: '第三方接口',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'clearCache',
                path: 'dataManage/clearCache',
                component: clearCache,
                meta: {
                    tagId:"clearCache",
                    title: '清除缓存',
                    icon: 'el-icon-cc-close-circle'
                }
            },
            {
                name: 'ipManage',
                path: 'dataManage/ipManage',
                component: ipManage,
                meta: {
                    tagId:"ipManage",
                    title: '接口服务器管理',
                    icon: 'el-icon-cc-close-circle'
                }
            },
    //     ]
    // },
    // {
    //     name: 'analyse',
    //     path: 'analyse',
    //     component: Wrapper,
    //     meta: {
    //         title: '洞察分析',
    //         icon: 'el-icon-cc-institute'
    //     },
    //     children:[
            {
                name: 'DeliveryAfterPeopleDraw',
                path: 'analyse/DeliveryAfterPeopleDraw',
                component: DeliveryAfterPeopleDraw,
                meta: {
                    tagId:"DeliveryAfterPeopleDraw",
                    title: '投后人群画像',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'DeliveryDataAnalyse',
                path: 'analyse/DeliveryDataAnalyse',
                component: DeliveryDataAnalyse,
                meta: {
                    tagId:"DeliveryDataAnalyse",
                    title: '数据分析报告',
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     name: 'thirdParty',
    //     path: 'thirdParty',
    //     component: Wrapper,
    //     meta: {
    //         title: '第三方管理',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'thirdPartyDMP',
                path: 'thirdParty/thirdPartyDMP',
                component: thirdPartyDMP,
                meta: {
                    tagId:"thirdPartyDMP",
                    title: '第三方DMP',
                    icon: 'el-icon-cc-file'
                }
            }
            ,
            {
                name: 'operateLog',
                path: 'thirdParty/operateLog',
                component: operateLog,
                meta: {
                    tagId:"operateLog",
                    title: '操作日志',
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     name: 'Setting',
    //     path: 'Setting',
    //     component: Wrapper,
    //     meta: {
    //         title: '系统设置',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'notice',
                path: 'Setting/notice',
                component: notice,
                meta: {
                    tagId:"notice",
                    title: '消息通知',
                    icon: 'el-icon-cc-xinxi'
                }
            },
            {
                name: 'menuSetting',
                path: 'Setting/menuSetting',
                component: menuSetting,
                meta: {
                    tagId:"menuSetting",
                    title: '菜单设置',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'emailNotice',
                path: 'Setting/emailNotice',
                component: emailNotice,
                meta: {
                    title: '邮件通知',
                    tagId:"emailNotice",
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'launchSettings',
                path: 'Setting/launchSettings',
                component: launchSettings,
                meta: {
                    title: '投放设置',
                    tagId:"launchSettings",
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     name: 'administration',
    //     path: 'administration',
    //     component: Wrapper,
    //     meta: {
    //         title: '行政管理',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'personManage',
                path: 'administration/personManage',
                component: personManage,
                meta: {
                    tagId:"personManage",
                    title: '人员管理',
                    icon: 'el-icon-cc-file'
                }
            }
            ,
            {
                name: 'organManage',
                path: 'administration/organManage',
                component: organManage,
                meta: {
                    tagId:"organManage",
                    title: '机构管理',
                    icon: 'el-icon-cc-file'
                }
            }
            ,
            {
                name: 'roleManage',
                path: 'administration/roleManage',
                component: roleManage,
                meta: {
                    tagId:"roleManage",
                    title: '角色管理',
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     name: 'Account',
    //     path: 'Account',
    //     component: Wrapper,
    //     meta: {
    //         title: '账号管理',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'personalInformation',
                path: 'Account/personalInformation',
                component: personalInformation,
                meta: {
                    tagId:"personalInformation",
                    title: '个人信息',
                    icon: 'el-icon-cc-file'
                }
            }
            ,
            {
                name: 'password',
                path: 'Account/password',
                component: password,
                meta: {
                    tagId:"password",
                    title: '密码修改',
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    // {
    //     name: 'Log',
    //     path: 'Log',
    //     component: Wrapper,
    //     meta: {
    //         title: '日志管理',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'loginLog',
                path: 'Log/loginLog',
                component: loginLog,
                meta: {
                    tagId:"loginLog",
                    title: '登录日志',
                    icon: 'el-icon-cc-file'
                }
            }
            ,
            {
                name: 'operateLog',
                path: 'Log/operateLog',
                component: operateLog,
                meta: {
                    tagId:"operateLog",
                    title: '操作日志',
                    icon: 'el-icon-cc-file'
                }
            },
    //     ]
    // },
    {
        name: 'statisticsHomePage',
        path: 'statisticsHomePage',
        component: statisticsHomePage,
        meta: {
            title: '投放统计',
            tagId:"statisticsHomePage",
        }
    },
    {
        name: 'oneTouchDrop',
        path: 'oneTouchDrop',
        component: oneTouchDrop,
        meta: {
            title: '一键投放',
            tagId:"oneTouchDrop",
            hideInMenu: true
        }
    },
    {
        name: 'homepageReleaseRecord',
        path: 'homepageReleaseRecord/:homepageReleaseRecordId',
        component: homepageReleaseRecord,
        meta: {
            title: '主页投放记录',
            tagId:"homepageReleaseRecord",
            hideInMenu: true
        }
    },
    {
        name: 'redirectList',
        path: 'redirectList/:redirectListId',
        component: redirectList,
        meta: {
            title: '重定向投放记录',
            tagId:"redirectList",
            hideInMenu: true
        }
    },
    // {
    //     name: 'dashboard',
    //     path: '/',
    //     component: Wrapper,
    //     meta: {
    //         title: '重定向',
    //         icon: 'el-icon-cc-home'
    //     },
    //     children:[
            {
                name: 'redirectAdd',
                path: 'redirectAdd',
                component: redirectAdd,
                meta: {
                    title: '新增/编辑重定向人群',
                    tagId:"redirectAdd",
                    hideInMenu: true
                }
            },
    //         ]
    // },
    // {
        // name: 'dashboard',
        // path: '/',
        // component: Wrapper,
        // meta: {
        //     title: '群像洞察',
        //     icon: 'el-icon-cc-home'
        // },
        // children:[
            {
                name: 'groupImageInsight',
                path: 'groupImageInsight',
                component: groupImageInsight,
                meta: {
                    title: '设备画像',
                    tagId:"groupImageInsight",
                }
            },
    //     ]
    // },
    {
        name: 'specialTag',
        path: 'specialTag',
        component: specialTag,
        meta: {
            title: '重定向投放记录',
            tagId:"specialTag",
            hideInMenu: true
        }
    },
]

const routes = [
    {
        path: '/',
        component: Main,
        children,
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
        meta: {
            title: '登录'
        }
    }
]

export default routes
