<template>
    <BlockLayout :title="L.통합공기질현황" id="AirStatus" :className="className">
        <template #header>
            <DropdownList
                popperClass="popperOption"
                width="120px"
                size="small"
                v-model="airType"
                :placeholder="L.구분선택"
                :list="airTypeList"
                option-label="label"
                option-value="value"
                :clearable="false"
            />
        </template>
        <el-row>
            <el-col :span="13">
                <div style="height: 100%; width: 100%" ref="chartRef" class="chart"></div>
            </el-col>
            <el-col :span="11">
                <el-descriptions :column="1" size="small" style="flex: 1; width: 100%" border>
                    <el-descriptions-item :label="L.좋음" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.airQuality.level1??0 }} </span> 
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.보통" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.airQuality.level2??0  }} </span> 
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.나쁨" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.airQuality.level3??0  }} </span> 
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.매우나쁨" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.airQuality.level4??0  }} </span> 
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, reactive, watch, onUnmounted } from 'vue'
import BlockLayout from '../layout/BlockLayout.vue'
import * as echarts from 'echarts'
import { useService } from '../model_service/Service'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.dashboard

interface Prop {
    className?: string
}
const props = defineProps<Prop>()
const { className } = toRefs(props)

const airType: any = ref('pm10')
const airTypeList = [
    { label: L.미세먼지, value: 'pm10' },
    { label: L.초미세먼지, value: 'pm25' },
    { label: L.극초미세먼지, value: 'pm1' },
    { label: 'TVOCs', value: 'voc' },
    { label: L.질소산화물, value: 'nox' },
]

const obj = useService()
let interval:any = null
onMounted( async ()=>{
    await obj.getAirQuality({airType: airType.value})
    setChartData()
    
    myChart = echarts.init(chartRef.value)
    drawChart()

    interval = setInterval(async ()=>{
        await obj.getAirQuality({airType: airType.value})
        setChartData()
        drawChart()
    }, 1000 * 60 )

    // Resize chart
    new ResizeObserver(() => {
        myChart.resize()
    }).observe(chartRef.value!)
})
onUnmounted(()=>{
    clearInterval(interval)
    interval = null
})

// chart data 설정
const chartData: any = ref([{ name: '', value: 0 }])
function setChartData() {
    let newArr = [
        { name: L.좋음, value: obj.airQuality.level1 },
        { name: L.보통, value: obj.airQuality.level2 },
        { name: L.나쁨, value: obj.airQuality.level3 },
        { name: L.매우나쁨, value: obj.airQuality.level4 },
    ]
    // chartData.value = newArr
    option.series[0].data = newArr
}

watch(airType, async () => {
    await obj.getAirQuality({airType: airType.value})

    setChartData()
    drawChart()
})

const chartRef = ref(null)
let myChart: any = null
let option = reactive({
    // color: [COLOR_TYPE.TEAL, COLOR_TYPE.GREEN, COLOR_TYPE.ORANGE, COLOR_TYPE.RED],
    color: ['#4ca5d7', '#56ba64', '#f19c4d', '#f96060'],
    tooltip: {
        trigger: 'item',
        // position: 'right'
        textStyle: {
            fontSize: 12,
        },
    },
    legend: {
        // bottom: 0,
        orient: 'vertical',
        left: 'left',
        textStyle: {
            fontSize: 10,
            color: '#dddddd',
        },
        itemWidth: 10,
        itemHeight: 10,
    },
    series: [
        {
            top: 0,
            bottom: 0,
            left: 70,
            type: 'pie',
            radius: ['50%', '95%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 0,
                borderColor: '#1c1c24',
                borderWidth: 0,
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold',
                },
            },
            label: {
                show: false,
                position: 'center',
            },
            labelLine: {
                show: false,
            },
            data: chartData.value,
        },
    ],
})
function drawChart() {
    console.log('option.series[0].data', option)

    option && myChart.setOption(option)
}
</script>
<style lang="scss" scoped>
#AirStatus {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    :deep(.el-descriptions__label){
        width: 50%;
    }
    .value-unit{
        display: flex; 
        align-items: center;
        justify-content: flex-end;
    }
    .value{
        display: inline-flex;
        justify-content: flex-end;
        flex:1;
        padding-right: 4px;
    }
    .unit{
        font-size: var(--font10) !important;
        display: inline-flex;
        justify-content: flex-start;
        margin-right: 4px;
    }
}
.el-col {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 12px;
    height: 100%;
}
.el-row {
    height: 100%;
}
:deep(.el-select__placeholder span) {
    font-size: var(--font12) !important;
    line-height: 12px;
}
:deep(.el-select__wrapper) {
    background-color: var(--color-gray-dark) !important;
    box-shadow: 0 0 0 0.0625rem #464646 inset !important;
}
</style>
