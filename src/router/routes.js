import Main from '@/components/Main'
import Wrapper from '@/components/Wrapper.vue'
import Login from '@/views/Login'
import TagGroup from '@/views/TagGroup/Index.vue'
import strategyList from '@/views/crowdStrategy/index'
import crowd from '@/views/launch/crowd'
// import strategy from '@/views/launch/strategy'
import strategy from '@/views/launch/strategy/List'
import validate from '@/views/launch/validate'
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
import notice from '@/views/setting/messageNotice'
import oneTouchDrop from '@/views/OneTouchDrop/Index'
import AddMoreCrowds from '@/views/crowdStrategy/AddMoreCrowds'
const children = [
    {
        name: 'homePage',
        path: 'homePage',
        component: Wrapper,
        meta: {
            title: '首页',
            icon: 'el-icon-cc-home'
        },
        children: [
            {
                name: 'OverallDeliveryStatistics',
                path: 'OverallDeliveryStatistics',
                component: OverallDeliveryStatistics,
                meta: {
                    tagId: 'OverallDeliveryStatistics',
                    title: '整体指标统计',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'OverallCrowdStatistics',
                path: 'OverallCrowdStatistics',
                component: OverallCrowdStatistics,
                meta: {
                    tagId: 'OverallCrowdStatistics',
                    title: '整体人群统计',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'indexBI',
                path: 'indexBI',
                component: indexBI,
                meta: {
                    tagId: 'indexBI',
                    title: '已有的BI指数',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'CurrentPopulationClassification',
                path: 'CurrentPopulationClassification',
                component: CurrentPopulationClassification,
                meta: {
                    tagId: 'CurrentPopulationClassification',
                    title: '现有人群分类',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'OTTBigscreenIndex',
                path: 'OTTBigscreenIndex',
                component: OTTBigscreenIndex,
                meta: {
                    tagId: 'OTTBigscreenIndex',
                    title: 'OTT大屏指数',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'tabStructure',
                path: 'tabStructure',
                component: tabStructure,
                meta: {
                    tagId: 'tabStructure',
                    title: '标签结构',
                    icon: 'el-icon-cc-home'
                }
            },
            {
                name: 'crowdPortrayal',
                path: 'crowdPortrayal',
                component: crowdPortrayal,
                meta: {
                    tagId: 'crowdPortrayal',
                    title: '投前人群画像',
                    icon: 'el-icon-cc-home'
                }
            }
        ]
    },
    {
        name: 'dashboard',
        path: '/',
        component: Wrapper,
        meta: {
            title: '标签管理',
            icon: 'el-icon-cc-home'
        },
        children:[
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
            }
        ]
    },
    {
        path: 'launch',
        name:"launch",
        meta: {
            title: '人群管理',
            icon: 'el-icon-cc-file',
        },
        component: Wrapper,
        children: [
            {
                name: 'crowd',
                path: 'crowd',
                component: crowd,
                meta: {
                    tagId:"crowd",
                    title: '人群圈定',
                    icon: 'el-icon-cc-file'
                },
            }
            ,
            {
                name: 'strategy',
                path: 'strategy',
                component: strategy,
                meta: {
                    title: '人群分割 投放',
                    tagId:"strategy",
                  //  hideInMenu: true,
                    isCache: false,
                    icon: 'el-icon-cc-file',
                }
            }
            ,

            {
                name: 'strategyList',
                path: 'strategyList',
                component: strategyList,
                meta: {
                    tagId:"strategyList",
                    title: '人群分隔 管理',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'multiVersionCrowd',
                path: 'multiVersionCrowd',
                component: multiVersionCrowd,
                meta: {
                    title: '人群多版本圈定',
                    tagId:"multiVersionCrowd",
                    isCache: false,
                    icon: 'el-icon-cc-file',
                }
            },

            {
              name: 'AddMoreCrowds',
              path: 'AddMoreCrowds',
              component: AddMoreCrowds,
              meta: {
                  tagId:"AddMoreCrowds",
                  title: '添加多个人群',
                  icon: 'el-icon-cc-file'
              }
          },
        ],
    },
    {
        name: 'launchHelper',
        path: 'launchHelper',
        component: Wrapper,
        meta: {
            title: '投放助手',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'validate',
                path: 'validate',
                component: validate,
                meta: {
                    title: '投放验证',
                    tagId:"validate",
                    //  hideInMenu: true,
                    isCache: false,
                    icon: 'el-icon-cc-file',
                }
            },
            // {
            //     name: 'statisticsHomePage',
            //     path: 'statisticsHomePage',
            //     component: statisticsHomePage,
            //     meta: {
            //         title: '投放统计',
            //         tagId:"statisticsHomePage",
            //         isCache: false,
            //         icon: 'el-icon-cc-file',
            //     }
            // },
            {
                name: 'DeliveryMonitor',
                path: 'DeliveryMonitor',
                component: DeliveryMonitor,
                meta: {
                    title: '投放中的投放监控',
                    tagId:"DeliveryMonitor",
                    isCache: false,
                    icon: 'el-icon-cc-file',
                }
            }
        ]
    },
    {
        name: 'dataManage',
        path: 'dataManage',
        component: Wrapper,
        meta: {
            title: '开发工具',
            icon: 'el-icon-cc-institute'
        },
        children:[
            {
                name: 'dataManage',
                path: 'dataManage',
                component: dataMange,
                meta: {
                    tagId:"dataManage",
                    title: '人群位置信息管理',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'thirdInterface',
                path: 'thirdInterface',
                component: thirdInterface,
                meta: {
                    tagId:"thirdInterface",
                    title: '第三方接口',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'clearCache',
                path: 'clearCache',
                component: clearCache,
                meta: {
                    tagId:"clearCache",
                    title: '清除缓存',
                    icon: 'el-icon-cc-close-circle'
                }
            },
            {
                name: 'ipManage',
                path: 'ipManage',
                component: ipManage,
                meta: {
                    tagId:"ipManage",
                    title: '接口服务器管理',
                    icon: 'el-icon-cc-close-circle'
                }
            },
        ]
    },
    {
        name: 'analyse',
        path: 'analyse',
        component: Wrapper,
        meta: {
            title: '洞察分析',
            icon: 'el-icon-cc-institute'
        },
        children:[
            {
                name: 'DeliveryAfterPeopleDraw',
                path: 'DeliveryAfterPeopleDraw',
                component: DeliveryAfterPeopleDraw,
                meta: {
                    tagId:"DeliveryAfterPeopleDraw",
                    title: '投后人群画像',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'DeliveryDataAnalyse',
                path: 'DeliveryDataAnalyse',
                component: DeliveryDataAnalyse,
                meta: {
                    tagId:"DeliveryDataAnalyse",
                    title: '数据分析报告',
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
    {
        name: 'thirdParty',
        path: 'thirdParty',
        component: Wrapper,
        meta: {
            title: '第三方管理',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'thirdPartyDMP',
                path: 'thirdPartyDMP',
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
                path: 'operateLog',
                component: operateLog,
                meta: {
                    tagId:"operateLog",
                    title: '操作日志',
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
    {
        name: 'Setting',
        path: 'Setting',
        component: Wrapper,
        meta: {
            title: '系统设置',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'notice',
                path: 'notice',
                component: notice,
                meta: {
                    tagId:"notice",
                    title: '消息通知',
                    icon: 'el-icon-cc-xinxi'
                }
            },
            {
                name: 'menuSetting',
                path: 'menuSetting',
                component: menuSetting,
                meta: {
                    tagId:"menuSetting",
                    title: '菜单设置',
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'emailNotice',
                path: 'emailNotice',
                component: emailNotice,
                meta: {
                    title: '邮件通知',
                    tagId:"emailNotice",
                    icon: 'el-icon-cc-file'
                }
            },
            {
                name: 'launchSettings',
                path: 'launchSettings',
                component: launchSettings,
                meta: {
                    title: '投放设置',
                    tagId:"launchSettings",
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
    {
        name: 'administration',
        path: 'administration',
        component: Wrapper,
        meta: {
            title: '行政管理',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'personManage',
                path: 'personManage',
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
                path: 'organManage',
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
                path: 'roleManage',
                component: roleManage,
                meta: {
                    tagId:"roleManage",
                    title: '角色管理',
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
    {
        name: 'Account',
        path: 'Account',
        component: Wrapper,
        meta: {
            title: '账号管理',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'personalInformation',
                path: 'personalInformation',
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
                path: 'password',
                component: password,
                meta: {
                    tagId:"password",
                    title: '密码修改',
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
    {
        name: 'Log',
        path: 'Log',
        component: Wrapper,
        meta: {
            title: '日志管理',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'loginLog',
                path: 'loginLog',
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
                path: 'operateLog',
                component: operateLog,
                meta: {
                    tagId:"operateLog",
                    title: '操作日志',
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
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
    }
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
