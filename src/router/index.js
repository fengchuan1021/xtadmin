import { createWebHashHistory, createRouter } from 'vue-router'
import { localGet } from '@/utils'
import NProgress from 'nprogress'
// pc端的路由
let routes=[
    {
        path: '/',
        component: () => import('../views/layout/layout.vue'),
        redirect: '/permission/rolelist',
        children: [
            {
                path: '/dashboard',
                meta: { title: 'dashboard'},
                component: () => import('../views/404.vue'),
            },

            {
                path:'/permission',
                redirect:'/permission/rolelist',
                meta: { title: 'permission'},
                children:[
                    {
                        path:'/permission/rolelist',
                        meta: { title: 'role list'},
                        component: () => import('../views/permission/rolelist.vue'),
                    },
                    {
                        path:'/permission/apilist',
                        meta: { title: 'api list'},
                        component: () => import('../views/permission/apilist.vue'),
                    },
                    {
                        path:'/permission/viewslist',
                        meta: { title: 'views list'},
                        component: () => import('../views/permission/viewslist.vue'),
                    },
                ]
            }
        ],
    },
    {
        path: '/login',
        meta: { title: 'login'},
        component: () => import('../views/login.vue'),
    },
    {
        path: '/404',
        meta: { title: '404',hidden:true},
        component: () => import('../views/404.vue'),
    },
];
let router = createRouter({
    history: createWebHashHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
    NProgress.start()

    if(to.path=='/login'){
        next()
    }else{
        if (to.matched.length === 0) {

            from.name ? next({ name: from.name }) : next('/404')
        } else {
            if (!localGet('token')) {

                next({ path: '/login' })
            } else {

                next()
            }

        }
    }


})

router.afterEach(to => {
    NProgress.done()
    document.title = `${to.meta.title}-xtadmin`
})

export default router
export {routes}
