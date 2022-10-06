import { createWebHashHistory, createRouter } from 'vue-router'
import { localGet } from '@/utils'
import NProgress from 'nprogress'
// 路由
let routes=[
    {
        path: '/',
        component: () => import('../views/layout/layout.vue'),
        redirect: '/product/addproduct',
        children: [
            // {
            //     path: '/dashboard',
            //     meta: { title: 'dashboard'},
            //     component: () => import('../views/404.vue'),
            // },
            // {
            //     path: '/dashboard2',
            //     meta: { title: 'dashboard2'},
            //     component: () => import('../views/404.vue'),
            // },


            {
                path:'/shopandwarehouse',
                redirect:'/shopandwarehouse/shoplist',
                meta: { title: 'shop & warehouse'},
                children:[
                    {
                        path:'/shopandwarehouse/shoplist',
                        meta: { title: 'shop list'},
                        component: () => import('../views/shopandwarehouse/shoplist.vue'),

                    },
                    {
                        path:'/shopandwarehouse/addshop',
                        meta: { title: 'add shop'},
                        component: () => import('../views/shopandwarehouse/addshop.vue'),
                    },
                    {
                        path:'/shopandwarehouse/warehouselist',
                        meta: { title: 'ware house'},
                        component: () => import('../views/shopandwarehouse/warehouselist.vue'),
                    },
                    {
                        path:'/shopandwarehouse/addwarehouse',
                        meta: { title: 'add warehouse'},
                        component: () => import('../views/shopandwarehouse/addwarehouse.vue'),
                    },
                ]
            },

            {
                path:'/product',
                redirect:'/product/productlist',
                meta: { title: 'product'},
                children:[
                    {
                        path:'/product/productlist',
                        meta: { title: 'product list'},
                        component: () => import('../views/product/productlist.vue'),

                    },
                    {
                        path:'/product/addproduct',
                        meta: { title: 'add product'},
                        component: () => import('../views/product/addproduct.vue'),
                    },
                    {
                        path:'/product/category',
                        meta: { title: 'category'},
                        component: () => import('../views/product/category.vue'),
                    },
                    {
                        path:'/product/addcategory',
                        meta: { title: 'add category'},
                        component: () => import('../views/product/addcategory.vue'),
                    },
                ]
            },
            {
                path:'/user',
                redirect:'/user/userlist',
                meta: { title: 'user'},
                children:[
                    {
                        path:'/user/userlist',
                        meta: { title: 'user list'},
                        component: () => import('../views/user/userlist.vue'),

                    },
                    {
                        path:'/user/adduser',
                        meta: { title: 'add user'},
                        component: () => import('../views/user/adduser.vue'),
                    },
                ]
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
                        meta: { title: 'role permission'},
                        component: () => import('../views/permission/apipermissionlist.vue'),
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
