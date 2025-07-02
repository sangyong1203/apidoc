import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Menu = {
    id: number
    title: string
    path: string
    icon: string
    children: Menu[] // 일력력
}

export const useMenuStore = defineStore(
    'menu',
    () => {
        const data = ref<Menu[]>([])
        const init = () => {
            data.value = []
        }
        const getMenu = (): Menu[] => {
            return data.value
        }
        const setMenu = (arr: Menu[]) => {
            data.value = arr
        }
        const setTempMenu = () => {
            data.value = tempMenu
        }
        return { data, init, getMenu, setMenu, setTempMenu }
    },
    { persist: true },
)

const tempMenu = [
    
    {
        id: 8,
        title: 'API 관리',
        path: '',
        icon: 'Memo',
        useYn: 'Y',
        authAction: 'GET,PUT,POST,DELETE',
        children: [
            {
                id: 81,
                title: 'API',
                path: '/postApi',
                icon: '',
                authAction: 'GET,PUT,POST,DELETE',
                useYn: 'Y',
                children: [],
            },
        ]
    },
    // {
    //     id: 10,
    //     title: '계정 및 권한',
    //     path: '',
    //     icon: 'UserFilled',
    //     useYn: 'Y',
    //     children: [
    //         {
    //             id: 102,
    //             title: '운영자 관리',
    //             path: '/system/manager',
    //             icon: '',
    //             authAction: 'GET,PUT,POST,DELETE',
    //             useYn: 'Y',
    //             children: [],
    //         },
    //         {
    //             id: 103,
    //             title: '운영 권한 관리',
    //             path: '/system/authority',
    //             icon: '',
    //             authAction: 'GET,PUT,POST,DELETE',
    //             useYn: 'Y',
    //             children: [],
    //         },
    //         {
    //             id: 104,
    //             title: '운영자 접근 관리',
    //             path: '/system/managerAccess',
    //             icon: '',
    //             authAction: 'GET,PUT,POST,DELETE',
    //             useYn: 'Y',
    //             children: [],
    //         },
    //         {
    //             id: 105,
    //             title: '운영자 계정 신청 관리',
    //             path: '/system/managerApproval',
    //             icon: '',
    //             authAction: 'GET,PUT,POST,DELETE',
    //             useYn: 'Y',
    //             children: [],
    //         },
    //     ],
    // },
    // {
    //     id: 9,
    //     title: '설정',
    //     path: '',
    //     icon: 'Setting',
    //     useYn: 'Y',
    //     children: [
            
           
    //         {
    //             id: 94,
    //             title: '메뉴 관리',
    //             path: '/setting/menu',
    //             icon: '',
    //             authAction: 'GET,PUT,POST,DELETE',
    //             useYn: 'Y',
    //             children: [],
    //         },
    //         {
    //             id: 94,
    //             title: '다국어 관리',
    //             path: '/setting/localization',
    //             icon: '',
    //             authAction: 'GET,PUT,POST,DELETE',
    //             useYn: 'Y',
    //             children: [],
    //         },
    //     ],
    // },
]
