<template>
        <div class="chart" ref="chartRef"></div>
</template>
<script lang="ts" setup>
/**
    데이터 분석에 통계 조회에 사용되는 공통 차트 컴포넌트. 주요 line, bar 형태인 차트로 적용된다.
*/
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import * as echarts from 'echarts'
import { CHART_COLOR } from '@/common/types/ComTypes'

export interface Props {
    title?: string
    xAxisData: string[] // x 좌표 선 아래 표시하는 데이터
    series: any[] // 데이터 및 차트 line 혹은 bar 설정
    type: 'line' | 'bar' // 차트 형식, bar 혹 line 형
    unit?: string // y축 단위 등을 표시할때
    legendData?: string[] // 예: ['A제품','B제품','C제품',]
    color?: string[]
    boundaryGap?: boolean
    legendOrient?: string // legend 방향
    legendLeft?: number //  legend 좌측 위치조절
    yMax?: number // y축 최대 수치
}

const props = defineProps<Props>()
const {
    legendData,
    xAxisData,
    series,
    unit,
    color,
    legendOrient,
    legendLeft,
    yMax,
} = toRefs(props)

// chart
const chartRef = ref(null)
let myChart: any = null
let option = reactive({
    color: color.value ?? [ CHART_COLOR.RED, CHART_COLOR.ORANGE,  CHART_COLOR.YELLOW, CHART_COLOR.TEAL],

    legend: {
        data: legendData.value,
        orient: legendOrient.value ?? 'horizontal',
        right: 10,
        left: legendLeft.value,
        padding: 4,
        textStyle: {
            color:'#dddddd',
            fontSize: 12,
            fontFamily:'Pretendard',
            fontWeight:700,
        },
    },
    tooltip: {},
        textStyle: {
        color: '#dddddd',
        fontSize: 10,
    },
    xAxis: {
        type: 'category',
        data: xAxisData.value,
        axisLabel: {
            fontSize: 10,
        }
    },
    yAxis: {
        type: 'value',
        name: unit.value,
        max: yMax.value,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ffffff2e', // x 축의 배경 라인 색상
            },
        },
    },
    grid: {
        top: 25,
        bottom: 24,
        right: 0,
        left: 0,
    },
    series: series.value,
})
function drawChart() {
    option.legend.data = legendData.value
    option.xAxis.data = xAxisData.value
    option.series = series.value
    option && myChart.setOption(option)
}
watch(series, () => {
    drawChart()
})
onMounted(() => {
    myChart = echarts.init(chartRef.value)
    drawChart()
    // Resize chart
    new ResizeObserver(() => {
        myChart.resize()
    }).observe(chartRef.value!)
})
</script>
<style scoped>

.chart {
    height: 100%;
    width: 100%;
    padding-top: 4px;
}
</style>
