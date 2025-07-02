<template>
    <BlockLayout
        :title="L.주간에러현황"
        id="ErrorStatus"
        :className="className"
    >
        <template #header >
            <div @click="toPage" class="more">{{L.자세히보기}} ></div>
        </template>
        <BarChart
            type="bar"
            :xAxisData="barXAxisData"
            :series="barSeries"
            :color="legendColor"
        />
    </BlockLayout>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRefs, onUnmounted } from 'vue'
import BarChart  from './BarChart.vue'
import BlockLayout from '../layout/BlockLayout.vue'
import { useService } from '../model_service/Service'
import { useLangStore } from '@/stores/LangStore'
import { COLOR_TYPE } from '@/common/types/ComTypes'
import { useNavStore } from '@/stores/NavStore'

// 다국어 설정 
const L = useLangStore().lang.dashboard

interface Prop {
    className?: string
}
const props = defineProps<Prop>()
const { className } = toRefs(props)

const obj = useService()
let interval:any = null
onMounted( async ()=>{
    // 에러 데티터 호출
    await obj.getError()
    // 차트 데이터 설정
    setBarChartData(obj.error)
    // 반복 데이터 호출 및 차트 그리기
    interval = setInterval(async ()=>{
        await obj.getError()
        setBarChartData(obj.error)
    }, 1000 * 5)
})
onUnmounted(()=>{
    clearInterval(interval)
    interval = null
})
// 알람 이력 조회 페이지 이동
const toPage = () => {
    useNavStore().navTo(L.에러이력, '/analysis/error/errorHistory')
}

//  bar chart 데이터
const barXAxisData: any = ref([])
const barSeries: any = ref([])
const legendColor = [ COLOR_TYPE.RED, COLOR_TYPE.ORANGE,  COLOR_TYPE.GREEN, COLOR_TYPE.BLUE]
function setBarChartData(dataList: any[]) {
    barXAxisData.value = dataList.map((item: any) => {
        return item.createDate
    })
    barSeries.value = [
        {
            name: 'Code 1',
            type: 'bar',
            showBackground: true,
            data: dataList.map((item: any) => {
                return item.code1
            }),
        },
        {
            name: 'Code 2',
            type: 'bar',
            showBackground: true,
            data: dataList.map((item: any) => {
                return item.code2
            }),
        },
        {
            name: 'Code 3',
            type: 'bar',
            showBackground: true,
            data: dataList.map((item: any) => {
                return item.code3
            }),
        },
        {
            name: 'Code 4',
            type: 'bar',
            showBackground: true,
            data: dataList.map((item: any) => {
                return item.code4
            }),
        },
        
    ]
}

</script>
<style lang="scss" scoped>
#ErrorStatus{
    width: calc(50vw - 1.25rem);
    height: 100%;
    .more {
        font-size: var(--font12) !important;
        margin-right: 4px;
    }
    .more:hover {
        cursor: pointer;
    }
    :deep(.block-item-body) {
        height: 100%;
        padding: 8px 12px;
    }
}
</style>
