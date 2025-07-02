<template>
    <div class="chart-box">
        <div class="chart" ref="chartRef"></div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import { CHART_COLOR } from '@/common/types/ComTypes'

export interface Props {
    title?: string
    data: { name: string, value: number} []
}

const props = defineProps<Props>()
const { title, data } = toRefs(props)

// chart
const chartRef = ref(null)
let myChart: any = null
let option = reactive({
    color: [CHART_COLOR.RED, CHART_COLOR.ORANGE, CHART_COLOR.TEAL, CHART_COLOR.BLUE],
    title: {
        // text: title,
        left: 'center',
        padding: 12,
        textStyle: {
            fontSize: 14,
        },
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        right: 20,
        top: 10,
        itemHeight: 10,
        itemWidth: 10,
        textStyle: {
            fontSize: 10,
            lineHeight: 14,
            color: '#ffffff',
            fontFamily:'Pretendard',
        },
    },

    textStyle: {
        fontSize: 12,
    },
    series: [
        {
            type: 'pie',
            radius: '95%',
            top: 10,
            left: -100,
            data: data.value,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
            label: {
                alignTo: 'edge',
                formatter: '{name|{b}} {value|{c}}',
                lineHeight: 20,
                rich:{
                    name: {
                        fontSize: 10,
                        lineHeight: 16,
                        color: '#ffffff'
                    },
                    value: {
                        fontSize: 10,
                        lineHeight: 16,
                        color: '#ffffff'
                    },
                },
            },
            
                labelLine: {
                    length: 10,
                },
        },
    ],
})
function drawChart() {
    option && myChart.setOption(option)
}

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
.chart-box {
    width: 100%;
    height: 100%;
}
.chart-name {
    width: 100%;
    padding: 12px;
    border-bottom: none;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
}
.chart {
    height: 100%;
    width: 100%;
}
</style>
