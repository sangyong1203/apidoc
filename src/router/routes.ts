import { type RouteRecordRaw } from 'vue-router'

export const routes:RouteRecordRaw[] = [
    // ----- 로그인 페이지 -----
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login/login.vue'),
    },
    // ----- 대시보드 페이지 -----
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
    },
    // ----- 메인 관리 페이지 -----
    {
        path: '/',
        redirect: { name: 'postApi' },
        name: 'main',
        component: () => import('@/pages/main/index.vue'),
        children: [

           
            /** -------------계정 및 권한------------ **/ 
            // 사용자 관리 사용자 목록
            {
                path: '/system/user',
                name: 'systemUser',
                component: () => import('@/pages/main/system/user/index.vue'),
            },
            // 사용자 관리 사용자 상세 
            {
                path: '/system/user/detail',
                name: 'systemUserDetail',
                component: () => import('@/pages/main/system/user/DetailPage.vue'),
            },
            // 운영자 관리 
            {
                path: '/system/manager',
                name: 'systemManager',
                component: () => import('@/pages/main/system/manager/index.vue'),
            },
            // 운영자 관리 등록 / 수정 페이지
            {
                path: '/system/manager/edit',
                name: 'systemManagerEdit',
                component: () => import('@/pages/main/system/manager/EditPage.vue'),
            },
            // 운영자 관리 상세 페이지
            {
                path: '/system/manager/detail',
                name: 'systemManagerDetail',
                component: () => import('@/pages/main/system/manager/DetailPage.vue'),
            },
            // 운영자 권한 관리 목록 페이지
            {
                path: '/system/authority',
                name: 'systemAuthority',
                component: () => import('@/pages/main/system/authority/index.vue'),
            },
            // 운영자 권한 관리 등록 / 수정 페이지
            {
                path: '/system/authority/edit',
                name: 'systemAuthorityEdit',
                component: () => import('@/pages/main/system/authority/EditPage.vue'),
            },
            // 운영자 권한 관리 상세 
            {
                path: '/system/authority/detail',
                name: 'systemAuthorityDetail',
                component: () => import('@/pages/main/system/authority/DetailPage.vue'),
            },
            // 운영자 접근 관리 
            {
                path: '/system/managerAccess',
                name: 'systemManagerAccess',
                component: () => import('@/pages/main/system/managerAccess/index.vue'),
            },
            // 운영자 계정 신청 관리 
            {
                path: '/system/managerApproval',
                name: 'systemManagerApproval',
                component: () => import('@/pages/main/system/managerApproval/index.vue'),
            },

            // 메뉴 관리
            {
                path: '/setting/menu',
                name: 'settingMenu',
                component: () => import('@/pages/main/setting/menu/Menu.vue'),
            },
            // 다국어 관리
            {
                path: '/setting/localization',
                name: 'settingLocalization',
                component: () => import('@/pages/main/setting/localization/index.vue'),
            },

            // Post api
            {
                path: '/postApi',
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
    // ----- None AuthorizedIp-----
    {
        path: '/401',
        name: 'none_authorized',
        component: () => import('@/pages/main/not_found/401.vue'),
    },
    // ----- 회원가입 페이지 -----
    {
        path: '/sign_up',
        name: 'sign_up',
        component: () => import('@/pages/login/sign_up/index.vue'),
    },
    
]