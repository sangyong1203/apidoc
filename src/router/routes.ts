import { type RouteRecordRaw } from 'vue-router'

export const routes:RouteRecordRaw[] = [
    
    // ----- 메인 관리 페이지 -----
    {
        path: '/',
        redirect: { name: 'postApi' },
        name: 'main',
        component: () => import('@/pages/main/index.vue'),
        children: [

            // api dco 
            {
                path: '',
                name: 'postApi',
                component: () => import('@/pages/main/postApi/index.vue'),
            },

            /** -------에러 페이지------------ **/ 
            { path: '/404', name: '404', component: () => import('@/pages/main/not_found/404.vue') },
            { path: '/403', name: '403', component: () => import('@/pages/main/not_found/403.vue') },
            { path: '/401', name: '401', component: () => import('@/pages/main/not_found/401.vue') },
            { path: '/:pathMatch(.*)*', redirect: '/404' },
        ],
    },

    
]