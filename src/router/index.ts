import { useNavStore } from '@/stores/NavStore'
import { useUserStore } from '@/stores/UserStore'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from) => {
    // const userStore =  useUserStore()
    // const ls = userStore

    // // 대시보드에서 메뉴 클릭하여 새창으로 페이지 들어갈때 sessionStorage 공유하기
    // if (!sessionStorage.getItem('User')) {
    //     const tempuser = localStorage.getItem('mommoss-user')??''
    //     if(tempuser.length > 0){
    //         userStore.set(JSON.parse(tempuser).loggedInUser)
    //     } 
    // }

    // // 조건 따라 login 페이지 redirect 혹은 해당 페이지 이동
    // if (!ls && from.path !== '/' && from.path !== '/login') {
    //     return { name: 'login' }
    // } else if (
    //     !ls?.loginUser?.accessToken &&
    //     to.path !== '/login' &&
    //     to.path !== '/expired_password' &&
    //     to.path !== '/sign_up'
    // ) {
    //     // redirect the user to the login page
    //     console.log('there may be no accessToken, check loggedInUser acesstoken ')
    //     return { name: 'login' }
    // } else {
    //     const navStore = useNavStore()
    //     const nav = navStore.getNav()
    //     nav.forEach((item: any, index: number) => {
    //         if (to.path === item.path) {
    //             nav.splice(index + 1)
    //         }
    //     })
    // }

    // if(from.path === '/dashboard'){
    //     const navStore = useNavStore()
    //     const nav = navStore.getNav()
    //     if(nav.find((item:any) => item.path === '/dashboard')) return
    //     nav.unshift({ name:'대시보드', path:'/dashboard'})
    //     navStore.setNav(nav)
    // } 
})

export default router
