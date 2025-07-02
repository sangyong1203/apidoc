<template>
    <DashboardLayout>
        <div class="dashboard">
            <el-row class="section1">
                <div
                    v-for="(item, key) in blockItems1"
                    :key="key"
                    :class="item.position"
                    class="section-container"
                    :id="item.position"
                >
                    <component :is="item.el && item.el[0]" :className="item.position"></component>
                    <component :is="item.el && item.el[1]" :className="item.position"></component>
                    <component :is="item.el && item.el[2]" :className="item.position"></component>
                </div>
            </el-row>
            <el-row class="section2" style="display: flex; flex-direction: column">
                <div
                    v-for="(item, key) in blockItems2"
                    :key="key"
                    :class="item.position"
                    class="section-container second"
                    :id="item.position"
                >
                    <component v-for="(bl, key) in item.el" :is="bl" :key="key" :className="item.position" />
                </div>
            </el-row>
        </div>
    </DashboardLayout>
    <template v-for="(item, key) in obj.alarmPopup" :key="key">
        <AlarmDialog :index="key + 1" :data="item" />
    </template>

</template>
<script lang="ts" setup>
import { markRaw, onMounted, reactive, onUnmounted } from 'vue'
import DashboardLayout from './layout/DashboardLayout.vue'
import AlarmDialog from './components/AlarmDialog.vue'

import WorldMap from './components/WorldMap.vue'
import RegionStatus from './components/RegionStatus.vue'
import TodaySum from './components/TodaySum.vue'
import Weather from './components/Weather.vue'
import AirStatus from './components/AirStatus.vue'
import RobotState from './components/RobotState.vue'
import AlarmStatus from './components/AlarmStatus.vue'
import ErrorStatus from './components/ErrorStatus.vue'
import ErrorHistory from './components/ErrorHistory.vue'
import WorkHours from './components/WorkHours.vue'

import { useService } from './model_service/Service'

// 동적으로 대시보드 설정을 위한 대시보드 각 블록 컴포넌트 집합 
const comps: any = {
    WorldMap: markRaw(WorldMap), // 종합운영현황 
    RegionStatus: markRaw(RegionStatus), // 지역별 현황
    TodaySum: markRaw(TodaySum), // Today집계 
    Weather: markRaw(Weather), // 날씨 
    AirStatus: markRaw(AirStatus), // 통합공기질 현황 
    RobotState: markRaw(RobotState), // 로봇 관제 상태 
    AlarmStatus: markRaw(AlarmStatus), // 알람현황 
    ErrorStatus: markRaw(ErrorStatus), // 주간 에러현황 
    ErrorHistory: markRaw(ErrorHistory), // 에러이력
    WorkHours: markRaw(WorkHours), // 작업시간 
    
}
// DB에서 받아온 대시보드 설정 값
const dashboardBlocks1: any = reactive([])
const dashboardBlocks2: any = reactive([])

// 대시보드 블록 상반부 객체
let blockItems1 = reactive([
    { position: 'left', el: [] as any },
    { position: 'center', el: [] as any },
    { position: 'right', el: [] as any },
])
// 대시보드 블록 하반부 객체
let blockItems2 = reactive([{ position: 'up', el: [] as any }])

let timer: any = [] // 알람 팝업 interval timer
const obj = useService()

const startMonitoring = async () => {
    // 대시보드 설정 데이터 호출 
    await obj.getDashboarSettingList()
    console.log('obj.settingList', obj.settingList)
    setDashboardPosition(obj.settingList)

    // // 대시보드 설정 가상 데이터 (대시보드 설정 데이터 호출 없을때 사용)
    // const moke = [
    //     { el: 'WorldMap', position: 'left', section: 'section1' },
    //     { el: 'RegionStatus', position: 'center', section: 'section1' },
    //     { el: 'TodaySum', position: 'center', section: 'section1' },
    //     { el: 'Weather', position: 'right', section: 'section1' },
    //     { el: 'AirStatus', position: 'right', section: 'section1' },
    //     { el: 'RobotState', position: 'right', section: 'section1' },
    //     { el: 'AlarmStatus', position: 'up', section: 'section2' },
    //     { el: 'ErrorStatus', position: 'up', section: 'section2' },
    // ]
    // // 대시보드 블록 위치 설정
    // setDashboardPosition(moke)

    // 주기로 알람 팝업 호출 
    obj.getAlarmPopup()
    timer.push(setInterval(()=>{
        obj.getAlarmPopup()
    }, 5000))

    // 대시보드 설정값으로 대시보드 블록 설정
    setDashboardBlockData(blockItems1, dashboardBlocks1)
    setDashboardBlockData(blockItems2, dashboardBlocks2)
    
}
// 대시보드 블록 위치 설정
function setDashboardPosition(settingList: any[]) {
    settingList.forEach((item: any) => {
        const block = {
            el: item.el,
            position: item.position,
        }
        if (item.section === 'section1') {
            dashboardBlocks1.push(block)
        } else {
            dashboardBlocks2.push(block)
        }
    })
}
// 대시보드 각 블록에 필요하는 데이터 설정
function setDashboardBlockData(blockitems: any, dashboardBlocks: any) {
    blockitems.forEach((item: any) => {
        item.el = []
    })
    blockitems.forEach((itemI: any) => {
        dashboardBlocks.forEach((itemB: any) => {
            if (itemB.position === itemI.position) {
                itemI.el.push(comps[itemB.el])
            }
        })
    })
}

onMounted(() => {
    startMonitoring()
})
onUnmounted(() => {
    // 알람 팝업 등 interval 제거 
    timer.forEach((item:number)=>{
        clearInterval(item)
    })
})
</script>

<style lang="scss" scoped>

//  대시보드 양식 설정 ------------
$main-color: #000000;
$sub-color: #000000;
$highlight-color: $main-color;
$highlight-color-1: $sub-color;
$header-color: $sub-color;
$header-line-color: linear-gradient(to right, $sub-color, $highlight-color-1, $sub-color, $highlight-color-1, $sub-color) 1;
$body-color: $sub-color;
$body-gradient-color: #000000;
$boddy-padding: 0 20px 16px 20px;
$block-box-shadow: unset;
$block-color: #161616;
$block-line-color: linear-gradient(to right, #2d2d2d, #2d2d2d) 1;
$block-radius: 6px;
$devide-line-color: #{$main-color}50;
$border-color: #2d2d2d;
$font-color: #dddddd;

:deep(.el-header) {
    background: $header-color;
    border-bottom: 1px solid;
    border-image: $header-line-color;
}
:deep(.contents-wrapper) {
    background-color: black;
}
:deep(.contents) {
    padding: $boddy-padding;
    background: linear-gradient(to bottom, $body-color, $body-color, $body-gradient-color);
}
:deep(.block-item-header) {
    border-bottom: 1px solid;
    border-image: $block-line-color;
}
:deep(.block-item) {
    // box-shadow: 0px 3px 8px #00000098;
    box-shadow: $block-box-shadow;
    background-color: $block-color;
    border-radius: $block-radius;
}
:deep(.block-container .el-table) {
    --el-table-row-hover-bg-color: #{$main-color}50;
}
:deep(.block-container .el-table th.el-table__cell) {
    background-color: #1312124d !important ;
}
:deep(.control-btn) {
    border: 1px solid #54555b;
    border-image: linear-gradient(to right, #3a3a3a, $highlight-color, #3a3a3a) 1;
}
:deep(.xy-position) {
    border: 1px solid #54555b;
    border-image: linear-gradient(to right, #3a3a3a, $highlight-color, #3a3a3a) 1;
}

:deep(.devide-line) {
    background-color: $devide-line-color;
}
//-------------------------------

.dashboard {
    display: flex;
    flex-direction: column;
    height: 100%;
}
:deep(.block-item-body) {
    flex: 1;
    overflow: hidden;
}

.section1 {
    height: 75%;
    flex-wrap: nowrap;
}
.section2 {
    height: 25%;
    flex-wrap: nowrap;
}
.section-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.section-container.right {
    flex:1;
    overflow: hidden;
}
.second {
    display: flex;
    flex-direction: row;
    flex: 1;
}

/**** 전체 대시보드 공통 양식 설정  ******/
//el-descriptions 설정
:deep(.el-descriptions) {
    --el-descriptions-table-border: 1px solid #2d2d2d;
}
:deep(.el-descriptions__body) {
    background-color: transparent !important;
}
:deep(.el-descriptions__body .el-descriptions__label) {
    padding: 0 8px;
    color: $font-color !important;
    font-weight: 700 !important;
    font-size: var(--font14) !important;
    background-color: #31313144 !important;
}
:deep(.el-descriptions__body .el-descriptions__cell) {
    padding: 0 8px !important;
    color: $font-color !important;
    font-size: var(--font14) !important;
    span {
        font-size: 14px !important;
        color: $font-color !important;
    }
}
// table 설정
:deep(.block-container .el-table) {
    --el-table-tr-bg-color: transparent !important;
    --el-table-bg-color: transparent !important;
    --el-table-border-color: #2d2d2d;
    --el-table-tr-hover-bg-color: transparent !important;
}
:deep(.el-table .el-table__header th.el-table__cell){
    height: 35px;
    background-color: #1d1d1d !important;
}
:deep(.el-dialog .el-table .el-table__header th.el-table__cell){
    background-color: var(--color-gray-lighter) !important;
}
:deep(.el-table thead th .cell){
    color: $font-color;
    font-size: var(--font14) !important;
    font-weight: 700;
}
/* --문자 컬러-- */
:deep(.block-container div){
    color: $font-color;
    font-size: var(--font14);
}
// dropdown list 설정
:deep(.el-select__selection){
    .el-select__selected-item{
        span{
            font-size: var(--font14);
            color:$font-color;
        }
    }
}
:deep(.el-select__popper.el-popper, .el-select__popper.el-popper .el-popper__arrow:before){
    background: #000000cc !important;
    border:none;
}
.el-select__popper.el-popper, .el-select__popper.el-popper .el-popper__arrow:before{
    background: #000000cc !important;

}
:deep(.el-select-dropdown__item .is-hovering){
    background-color: var(--color-mint20);
}

@media screen and (max-width: 1320px) {
    .dashboard{
        overflow: scroll;
    }
    :deep(.block-container) {
        width: 100% !important;
    }
    .section-container{
        height: unset;
    }
    .section1{
        height: unset;
        display: flex;
        flex-wrap: wrap;
    }
    .left {
        height: 800px;
        width: 100%;
    }
    .right {
        height: 900px;
    }
    .center {
        width: 50%;
    }
    #RegionStatus{
        height: 618px;
        flex: unset;
    }
    #TodaySum{
        height: 283px;
        flex: unset;

    }
    .section2{
        height: 800px !important;
        flex: 1;
    }
    #up{
        display: block;
    }
    .up{
        height: 300px !important;
    }
}

@media screen and (max-width: 1024px) {
    .section1{
        flex-wrap: nowrap;
        flex-direction: column;
    }
    .right, .center{
        width: 100%;
    }
    .right {
        height: 300px !important;
    }
    #right{
        display: block;
    }
    :deep(#Weather){
        height: 300px !important;
    }
    :deep(.selector){
        height: 50px;
    }
    :deep(.time){
        display: none;
    }
    :deep(.header-right){
        margin-right: 4px;
    }
}
@media screen and (max-width: 450px) {
    :deep(.header-left .title div){
        font-size: 20px !important;
        width: 160px;
    }
    :deep(.left-menu-list){
        overflow: scroll;
        flex-direction: column;
        .first-menu{
            flex: unset; 
            height: unset;
            overflow: unset;
        }
    }
    :deep(.menu-drawer){
        height: 100% !important;
    }
    :deep(#Weather){
        height: 440px !important;
        .section1{
            flex-direction: column;
            height: unset;
            margin: 20px 0;
        }
        .weather-local{
            justify-content: center;
        }
    }
}
</style>
