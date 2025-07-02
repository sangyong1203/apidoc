<template>
    <el-container style="height: 100%">
        <el-header>
            <el-row>
                <el-col :span="14">
                    <div class="header-left">
                        <el-button :icon="state.collapseIcon" @click="collapse" class="colapse-btn" />
                        
                        <div class="title">
                            <img class="header-logo" :src="logo"/>
                            <div style="font-size: 20px;  margin-top:2px; ">{{ L.통합관제시스템 }}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="header-right">
                        <CurrentTime :label="L.현재시간"/>
                        <el-button type="primary" circle @click="logOut()" class="logout" >
                            <el-icon ><SwitchButton/></el-icon>
                        </el-button>
                        <el-button type="info" circle @click="refresh()" class="refresh">
                            <el-icon><Refresh /></el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <div class="contents-wrapper">
                <div class="left-wrapper">
                    <DashboardMenu v-model:isOpen="state.isOpen" />
                </div>
                <div class="contents">
                    <slot />
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { reactive, ref, onUnmounted } from 'vue'
import { useNavStore } from '@/stores/NavStore'
import DashboardMenu from './DashboardMenu.vue'
import { LoginService } from '@/pages/login/model_service/LoginService'
import dayjs from 'dayjs'
import logo from '@/assets/images/LOGO.png'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.common

const loginService = new LoginService()

const state: any = reactive({
    isOpen: false,
    collapseIcon: 'Menu',
})

const collapse = () => {
    state.isOpen = !state.isOpen
    useNavStore().setMenuCollapse(state.isOpen)
}

const logOut = () => {
    // 로그아웃 API 호출
    loginService.logout()
}
// 현재 화면 강제 리프레쉬
const refresh = () => {
    location.reload()
}

const currentTime = ref(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const timer = setInterval(()=>{
    currentTime.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
}, 1000)
onUnmounted(()=>{
    clearInterval(timer)
})
</script>

<style scoped>
/* header  */
.el-header {
    width: 100%;
    align-items: center;
    height: 50px;
}
.el-row,
.el-col,
.header-left,
.header-right {
    height: 100%;
}
/* header left ------------ */
.header-left {
    display: flex;
    align-items: center;
    margin-left: 8px;
}
.header-left .colapse-btn {
    border: none;
    background-color: transparent;
    color: #dddddd;
    padding: 0 !important;
}
:deep(.colapse-btn .el-icon),
:deep(.colapse-btn .el-icon svg) {
    height: 24px;
    width: 24px;
    color: #bbbbbb;
}
:deep(.colapse-btn .el-icon svg):hover {
    color: #eeeeee;
}
.header-left .header-logo{
    height: 24px;
    margin-right: 12px;
}
.header-left .title {
    display: flex;
    color: #dddddd;
    margin-left: 20px;
    text-decoration-line: none;
    text-decoration: none;
    align-items: center;
}
/* header right ------------ */
.header-right {
    text-align: right;
    color: #dddddd;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.header-right .time {
    padding: 0 32px;
    font-weight: 500;
}
.header-right .logout {
    margin-right: 4px;
    border: none;
    background-color: var(--color-main);
}
.header-right .logout:hover {
    text-decoration: underline;
    cursor: pointer;
}
.header-right .logout .el-icon  {
    width: 18px;
    height: 18px;
    transform: rotate(90deg);
}
.header-right .logout .el-icon svg {
    width: 18px;
    height: 18px;
}
.header-right .refresh {
    background: var(--color-orange);
    border: none;
    margin-right: 8px;
    color: var(--primary-text-color);
}
.header-right .refresh .el-icon {
    width: 18px;
    height: 18px;
}
.header-right .refresh .el-icon svg {
    width: 18px;
    height: 18px;
}
.el-button.is-circle{
    padding: 0 !important;
}
/* 메인 */
.el-main {
    --el-main-padding: 0px;
    color: var(--primary-text-color);
    overflow: hidden;
}
.contents-wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;
}
.contents-wrapper .contents {
    padding: 0 20px 15px 20px;
    width: 100%;
}

/* 컨텐츠 본문 내용 */
.contents {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
