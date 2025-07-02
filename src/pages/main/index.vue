<template>
    <MainLayout copyright="© Copyright *** All rights reserved.">
        <template #main-header>
            <MainHeader systemName="Postapi" :title-style="{fontWeight:'bold', fontSize:'24px', color: '#dbdbdb'}" @to-dashboard="toDashboard" @log-out="logOut"> </MainHeader>
        </template>
        <template #side-menu>
            <LeftMenu />
        </template>
        <RouterView v-slot="{ Component }">
            <KeepAlive :max="40" :exclude="excludeComponents">
                <component :is="Component"></component>
            </KeepAlive>
        </RouterView>
    </MainLayout>
</template>

<script setup lang="ts">
import logo from '@/assets/images/LOGO.png'
import logoFooter from '@/assets/images/logo_footer.png'
import { onMounted, onUnmounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useNavStore } from '@/stores/NavStore'
import { useLangStore } from '@/stores/LangStore'
import { LoginService } from '@/pages/login/model_service/LoginService'
import { useUserStore } from '@/stores/UserStore'
const loginService = new LoginService()

// 다국어 설정
const L = useLangStore().lang.common

const navStore = useNavStore()
const excludeComponents = ['RegisterPage', 'DetailPage', 'UpdatePage', 'EditPage']
const route = useRoute()

onMounted(() => {
    // browser back 버튼 처리
    window.addEventListener('popstate', backButtonEvent)
})
onUnmounted(() => {
    window.removeEventListener('popstate', backButtonEvent)
})
// 로그아웃
const logOut = () => {
    loginService.logout()
}
// 대시보드로 이동 
const toDashboard = () => {
    navStore.navTo('대시보드', '/dashboard')
    navStore.init()
}

// browser back 버튼 처리
function backButtonEvent(event: any) {
    console.log('popstate event triggered:', event.state)
    const nav = navStore.getNav()
    const lastNav = nav.at(-1)
    if (nav.length <= 2 && route.path !== '/login' && route.path !== '/dashboard') {
        history.pushState(null, '', '')
        navStore.navTo(lastNav.name, lastNav.path)
    }
}
onBeforeMount(()=>{
    useUserStore().setDarkMode()
})
</script>
