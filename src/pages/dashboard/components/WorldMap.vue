<template>
    <BlockLayout :title="L.종합운영현황" id="WorldMap" :className="className">
        <el-descriptions :column="4" size="small" direction="vertical" border>
            <el-descriptions-item :label="L.전체등록제품" align="center" width="120">
                <span>{{ obj.operationStatus.totalCnt }}</span>
            </el-descriptions-item>
            <el-descriptions-item :label="L.미운영" align="center" width="100">
                <span>{{
                    obj.operationStatus.totalCnt - obj.operationStatus.operatingCnt - obj.operationStatus.errorCnt
                }}</span>
            </el-descriptions-item>
            <el-descriptions-item :label="L.정상운영" align="center" width="100">
                <span>{{ obj.operationStatus.operatingCnt }}</span>
            </el-descriptions-item>
            <el-descriptions-item :label="L.장애" align="center" width="100">
                <span>{{ obj.operationStatus.errorCnt }}</span>
            </el-descriptions-item>
        </el-descriptions>
        <div style="height: calc(100% - 6.5vh); width: 100%; flex:1;">
            <div class="konva" ref="konvaRef">
                <div class="left-title">{{ L.권역별현황 }}</div>
                <!-- 컨트롤 버튼 -->
                <div class="control">
                    <div class="control-btn" @click="zoomIn">
                        <el-icon><Plus /></el-icon>
                    </div>
                    <div class="control-btn" @click="zoomOut">
                        <el-icon><Minus /></el-icon>
                    </div>
                    <div class="control-btn">{{ Math.floor(zoomRate * 100) + '%' }}</div>
                    <div class="control-btn" @click="initPosition">Fit</div>
                </div>
                <!-- X Y 좌표 -->
                <div class="xy-position">* {{ `${L.장애} / ${L.정상} / ${L.미운영} / ${L.등록권역별대수} ` }}</div>
                <!-- 맵 -->
                <v-stage ref="stageRef" :config="stageConfig">
                    <v-layer ref="layerRef">
                        <v-group ref="groupRef" :config="groupConfig">
                            <!-- 한국 지도 이미지  -->
                            <v-image ref="bgImageRef" :config="bgImageConfig"/>
                            <!-- 지역 지도 이미지  -->
                            <template v-for="(item, key) in regionDataList" :key="key">
                                <RegionMap :x="item.x" :y="item.y" :regionName="item.regionName" :airLevel="item.airLevel"/>
                            </template>

                            <!-- 점, 지역명, 통계수자 -->
                            <v-circle
                                v-for="(item, key) in obj.operationRegionStatus"
                                :key="key + 'A'"
                                :config="locationPoint(item)"
                            />
                            <v-text
                                v-for="(item, key) in obj.operationRegionStatus"
                                :key="key + 'B'"
                                :config="locationText(item)"
                                @click="openAreaOpStatusDialog(item.province)"
                            />
                            <v-text
                                v-for="(item, key) in obj.operationRegionStatus"
                                :key="key + 'C'"
                                :config="locationTextNum(item)"
                            />
                        </v-group>
                    </v-layer>
                </v-stage>
            </div>
        </div>
    </BlockLayout>
    <AreaOpStatusDialog ref="areaOpStatusDialogRef" />
</template>
<script lang="ts" setup>
import BlockLayout from '../layout/BlockLayout.vue'
import koreaMapSVG from '@/assets/images/regionSVG/koreaMapSVG.svg'
import RegionMap from './RegionMap.vue'

import { nextTick, toRefs, ref, onMounted, onUnmounted } from 'vue'
import AreaOpStatusDialog from './AreaOpStatusDialog.vue'
import { useService } from '../model_service/Service'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정
const L = useLangStore().lang.dashboard

const obj = useService()
let interval: any = null

interface Prop {
    className?: string
}

const props = defineProps<Prop>()
const { className } = toRefs(props)

/**-------- 지도 맵 ----------**/
const bgImgObj = new Image() // 바탕 지도 이미지 객체
const bgImageRef: any = ref(null)
const konvaRef: any = ref(null)
const stageRef: any = ref(null)
const layerRef: any = ref(null)
const groupRef: any = ref(null)

const bgImageConfig: any = ref(null) // 이미지 설정 config
const stageConfig: any = ref({ width: 0, height: 0 }) // stage 설정 config
const groupConfig: any = ref(null) // group 설정 config
const zoomRate: any = ref(1) // 확대율
const x = ref(0) // 마우스 좌표 x
const y = ref(0) // 마우스 좌표 y

onMounted(async () => {
    await setMap() // map 이미지 설정
    getData()
})
onUnmounted(() => {
    clearInterval(interval)
    interval = null
})
// 데이터 호출
const getData = async () => {
    obj.getOperationStatus()
    obj.getOperationRegionStatus()
    interval = setInterval(() => {
        obj.getOperationStatus()
        obj.getOperationRegionStatus()
    }, 1000 * 5)
}

// 지역지도 데이터 
const regionDataList = ref([
    { x:662, y:232, regionName: '경기', airLevel:'default'},
    { x:795, y:102, regionName: '강원', airLevel:'default'},
    { x:547, y:622, regionName: '충남', airLevel:'default'},
    { x:865, y:564, regionName: '충북', airLevel:'default'},
    { x:1006, y:597, regionName: '경북', airLevel:'default'},
    { x:584, y:926, regionName: '전북', airLevel:'default'},
    { x:943, y:1013, regionName: '경남', airLevel:'default'},
    { x:270, y:1149, regionName: '전남', airLevel:'default'},
    { x:1333, y:1070, regionName: '울산', airLevel:'default'},
    { x:1281, y:1176, regionName: '부산', airLevel:'default'},
    { x:828, y:737, regionName: '세종', airLevel:'default'},
    { x:858, y:815, regionName: '대전', airLevel:'default'},
    { x:534, y:371, regionName: '인천', airLevel:'default'},
    { x:734, y:413, regionName: '서울', airLevel:'default'},
    { x:560, y:1768, regionName: '제주', airLevel:'default'},
])

// 바탕 지도 이미지 설정
async function setMap() {
    nextTick(() => {
        // 이미지 설정
        bgImgObj.src = koreaMapSVG
        bgImgObj.onload = () => {
            bgImageConfig.value = {
                image: bgImgObj,
                width: bgImgObj.width,
                height: bgImgObj.height,
            }
            resizeDraw() // 화면크기 따라 map 조절
            eventSetting() // 맵 이벤트 설정
            initPosition() // 위치 초기화
        }
    })
}
// Table 창크기 따라 크기 자동 조절
function resizeDraw() {
    let resizeObserver: ResizeObserver | null = null
    if (konvaRef.value) {
        resizeObserver = new ResizeObserver(entries => {
            drawMap()
        })
        resizeObserver.observe(konvaRef.value)
    }
}
// 맴 그리기
function drawMap() {
    // stage 크기 설정
    stageConfig.value.width = konvaRef.value?.clientWidth
    stageConfig.value.height = konvaRef.value?.clientHeight

    // group를 중심 위치로 세팅
    groupConfig.value = {
        width: bgImgObj.width,
        height: bgImgObj.height,
        x: stageConfig.value.width * 0.5,
        y: stageConfig.value.height * 0.5,
        offsetX: bgImgObj.width * 0.5,
        offsetY: bgImgObj.height * 0.5,
        draggable: true,
    }
}
// 각 마우스 이벤트 설정
function eventSetting() {
    const stageNode = stageRef.value.getNode()
    stageNode.on('mouseover', function () {
        document.body.style.cursor = 'crosshair'
    })
    stageNode.on('mouseout', function () {
        document.body.style.cursor = 'default'
    })
    stageNode.on('mousemove', function () {
        x.value = getPointerPositionX()
        y.value = getPointerPositionY()
    })
    stageNode.on('wheel', function (event: any) {
        let ev = event.evt.wheelDelta
        if (ev > 0) {
            zoomIn()
        } else {
            zoomOut()
        }
    })
    stageNode.on('mousedown', function (event: any) {
        event.target.preventDefault()
        document.body.style.cursor = 'grab'
    })
    stageNode.on('mouseup', function () {
        document.body.style.cursor = 'crosshair'
    })
}
// 지도위의 점
const locationPoint = (data: any) => {
    return {
        x: locationX(data.x),
        y: locationY(data.y),
        radius: setCirclePointRadius(data),
        fill: data.color,
        stroke: 'gray',
        strokeWidth: 2,
    }
}
const setCirclePointRadius = (data: any) => {
    let num = 0
    if (data.totalCnt === 0 || obj.operationStatus.totalCnt === 0) {
        return num
    }

    // 각지역 제품 수량으로 표시
    const total = data.totalCnt
    // const total = 80
    if (total < 100) num = 32
    if (total >= 100 && total < 1000) num = 40
    if (total >= 1000 && total < 2000) num = 80
    if (total >= 2000 && total < 3000) num = 100
    if (total >= 3000 && total < 4000) num = 120
    if (total >= 4000 && total < 5000) num = 140
    if (total >= 5000) num = 160
    return num
}
// 지도위의 문자
const locationText = (data: any) => {
    return {
        x: data.x + bgImgObj.width / 2 + 18,
        y: data.y + bgImgObj.height / 2 - 10,
        text: `${data.province}`,
        fontSize: 26,
        stroke: '#dddddd',
        strokeWidth: 1,
        fill: '#dddddd',
    }
}
// 지도위의 문자아래 통계수자
const locationTextNum = (data: any) => {
    return {
        x: data.x + bgImgObj.width / 2 + 20,
        y: data.y + bgImgObj.height / 2 + 20,
        text: `${data.errorCnt} / ${data.operatingCnt} / ${data.totalCnt - data.operatingCnt - data.errorCnt} / ${data.totalCnt}`,
        fontSize: 24,
        // stroke: '#dddddd',
        // strokeWidth: 1,
        fill: '#dddddd',
    }
}

// robotLocation X 따라 좌표 X 계산
const locationX = (x: any) => {
    return x + bgImgObj.width / 2
}
// robotLocation Y 따라 좌표 Y 계산
const locationY = (y: number) => {
    return y + bgImgObj.height / 2
}
// 포인트 position X
function getPointerPositionX() {
    const stageNode = stageRef.value.getNode()
    const p = stageNode.getPointerPosition()
    const groupNode = groupRef.value.getNode()
    const positionX = (p.x - groupNode.x()) / groupNode.scaleX()
    const x = Math.round(positionX * 1000) / 1000
    return Number(x)
}
// 포인트 position Y
function getPointerPositionY() {
    const stageNode = stageRef.value.getNode()
    const p = stageNode.getPointerPosition()
    const groupNode = groupRef.value.getNode()
    const positionY = (p.y - groupNode.y()) / groupNode.scaleY()
    const y = Math.round(positionY * 1000) / 1000

    return Number(y)
}

// 확대
function zoomIn() {
    const node = groupRef.value.getNode()
    node.scaleX(node.scaleX() * 1.1)
    node.scaleY(node.scaleY() * 1.1)
    zoomRate.value = node.scaleX()
    // node.cache()
}
// 축소
function zoomOut() {
    const node = groupRef.value.getNode()
    node.scaleX(node.scaleX() / 1.1)
    node.scaleY(node.scaleY() / 1.1)
    zoomRate.value = node.scaleX()
    // node.cache()
}
// 위치 초기화
function initPosition() {
    const node = groupRef.value.getNode()
    node.scaleX(0.29)
    node.scaleY(0.29)
    zoomRate.value = node.scaleX()
}

// 권역 운영 현황 다이얼로그
const areaOpStatusDialogRef: any = ref(null)
const openAreaOpStatusDialog = (area: string) => {
    areaOpStatusDialogRef.value!.openDialog(area)
}
</script>
<style lang="scss" scoped>
#WorldMap {
    width: calc(50vw - 20px);
    height: 100%;
    :deep(.el-descriptions) {
        height: 60px;
        margin-bottom: 8px;
        width: 100%;
    }
    :deep(.block-item-body) {
        height: 100%;
        padding: 12px;
    }
}

.konva {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .left-title {
        position: absolute;
        left: 2px;
        top: 4px;
        font-size: 1.4vh !important;
        // color: #b5b5b5 !important;
    }
    .center-point {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100;
    }
    .control {
        position: absolute;
        top: 4px;
        right: 0px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        z-index: 100;
    }
    .control-btn {
        background: transparent;
        border-radius: 4px;
        height: 28px;
        padding: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .control-btn:hover {
        cursor: pointer;
    }
    .xy-position {
        position: absolute;
        right: 0px;
        bottom: 0px;
        text-align: center;
        background: transparent;
        border-radius: 4px;
        padding: 4px;
        z-index: 100;
        // color: #b5b5b5 !important;
        font-size: 1.2vh !important;
    }
}

</style>
