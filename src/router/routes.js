import Main from '@/components/Main'
import Wrapper from '@/components/Wrapper.vue'

import Login from '@/views/Login'
import Dashboard from '@/views/Dashboard.vue'
import PostList from '@/views/post/List.vue'
import PostCreate from '@/views/post/Create.vue'


const children = [
    {
        name: 'dashboard',
        path: '/',
        component: Dashboard,
        meta: {
            title: '控制面板',
            icon: 'el-icon-cc-home'
        }
    },
    {
        path: 'post/',
        meta: {
            title: '文章管理',
            icon: 'el-icon-cc-file',
        },
        component: Wrapper,
        children: [
            {
                name: 'post_list',
                path: 'list',
                component: PostList,
                meta: {
                    title: '文章列表',
                    icon: 'el-icon-cc-file'
                },
            },
            {
                name: 'post_create',
                path: 'create',
                component: PostCreate,
                meta: {
                    title: '创建文章',
                  //  hideInMenu: true,
                    isCache: false,
                    icon: 'el-icon-cc-file',
                }
            }
        ],
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