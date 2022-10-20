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
            {
                path: '/order',
                redirect:'/order/orderlist',
                meta: { title: 'order'},
                children:[
                    {
                        path:'/order/orderlist',
                        meta: { title: 'order list'},
                        component: () => import('../views/order/orderlist.vue'),

                    },
                    {
                        path:'/order/refundorder',
                        meta: { title: 'refund order'},
                        component: () => import('../views/order/refundorder.vue'),

                    },
                    {
                        path:'/order/reshiporder',
                        meta: { title: 'reship order'},
                        component: () => import('../views/order/reshiporder.vue'),

                    },

                ]
            },


            {
                path:'/siteandwarehouse',
                redirect:'/siteandwarehouse/sitelist',
                meta: { title: 'site & warehouse'},
                children:[
                    {
                        path:'/siteandwarehouse/sitelist',
                        meta: { title: 'site list'},
                        component: () => import('../views/siteandwarehouse/sitelist.vue'),

                    },
                    {
                        path:'/siteandwarehouse/addsite',
                        meta: { title: 'add site'},
                        component: () => import('../views/siteandwarehouse/addsite.vue'),
                    },
                    {
                        path:'/siteandwarehouse/warehouselist',
                        meta: { title: 'ware house'},
                        component: () => import('../views/siteandwarehouse/warehouselist.vue'),
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
                    {
                        path:'/product/predefineattrspec',
                        meta: { title: 'predefine attr & specification'},
                        component: () => import('../views/product/predefineattrspec.vue'),
                    },
                    {
                        path:'/product/brandlist',
                        meta: { title: 'brand'},
                        component: () => import('../views/product/brandlist.vue'),
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
