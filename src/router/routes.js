import Main from '@/components/Main'
import Wrapper from '@/components/Wrapper.vue'
import Login from '@/views/Login'
import TagGroup from '@/views/TagGroup/Index.vue'
import strategyList from '@/views/crowdStrategy/index'
import crowd from '@/views/launch/crowd'
import strategy from '@/views/launch/strategy'
import validate from '@/views/launch/validate'
import dictionaryManage from '@/views/setting/dictionaryManage'
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
const children = [
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
                    tagId: "tag",
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
            title: '投放助手',
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
                    title: '人群投放',
                    icon: 'el-icon-cc-file'
                },
            }
            ,
            {
                name: 'strategy',
                path: 'strategy',
                component: strategy,
                meta: {
                    title: '策略投放',
                    tagId:"strategy",
                  //  hideInMenu: true,
                    isCache: false,
                    icon: 'el-icon-cc-file',
                }
            }
            ,
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
            }
        ],
    },
    {
        name: 'strategy',
        path: 'strategy',
        component: Wrapper,
        meta: {
            title: '人群策略管理',
            icon: 'el-icon-cc-home'
        },
        children:[
            {
                name: 'strategyList',
                path: 'strategyList',
                component: strategyList,
                meta: {
                    tagId:"strategyList",
                    title: '策略列表',
                    icon: 'el-icon-cc-file'
                }
            }
        ]
    },
    {
        name: 'dataManage',
        path: 'dataManage',
        component: Wrapper,
        meta: {
            title: '数据管理',
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
