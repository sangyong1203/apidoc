<template>
    <div class="selector">
        <DropdownList
            popperClass="popperOption"
            width="49%"
            size="small"
            v-model="province"
            :placeholder="L.도특별광역시선택"
            :list="obj.weatherProvince"
            option-label="province"
            option-value="province"
            @onChange="selectProvince"
        />
        <DropdownList
            popperClass="popperOption"
            width="49%"
            size="small"
            v-model="district"
            :placeholder="L.시군구선택"
            :list="obj.weatherDistrict"
            option-label="district"
            option-value="district"
            @onChange="selectDistrict"
        />
    </div>
    <BlockLayout :title="L.날씨현황" id="Weather" :className="className" draggable="false">
        <el-row style="height: 100%">
            <el-col class="section1">
                <div class="weather-local">
                    <div class="local" v-if="location.length <= 2">
                        <span style="font-size: 6.5vh !important">{{ location }}</span>
                    </div>
                    <div class="local" v-if="location.length === 3">
                        <span style="font-size: 4.6vh !important">{{ location }}</span>
                    </div>
                    <div class="local" v-if="location.length >= 4">
                        <span style="font-size: 3.5vh !important">{{ location }}</span>
                    </div>
                    <div class="temperature">
                        <div class="temp-num">
                            {{ Math.round(Number(obj.weather.temp)) }}
                            <span style="position: absolute; top: 6px">℃</span>
                        </div>
                        <div class="weatherImage-container">
                            <img class="weather-image" v-if="obj.weather.weatherMain" :src="WeatherImageSrc(obj.weather.weatherMain)" />
                        </div>
                    </div>
                </div>
                <div class="weather-status">
                    <div style="flex: 1">
                        <div class="status-item">
                            <div class="status-item-label">{{ L.날씨 }}</div>
                            <div class="status-item-value">{{ obj.weather.weatherDescription }}</div>
                        </div>
                        <div class="status-item">
                            <div class="status-item-label">{{ L.체감온도 }}</div>
                            <div class="status-item-value">
                                <span class="value">{{ Math.round(Number(obj.weather.feelsLike)) }}</span>
                                <span class="unit">℃</span>
                            </div>
                        </div>
                        <div class="status-item" style="border:none">
                            <div class="status-item-label">{{ L.습도 }}</div>
                            <div class="status-item-value">
                                <span class="value">{{ obj.weather.humidity }}</span>
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>
                    <div style="flex: 1">
                        <div class="status-item">
                            <div class="status-item-label">{{ L.기압 }}</div>
                            <div class="status-item-value">
                                <span class="value">{{ obj.weather.pressure }}</span>
                                <span class="unit">hPa</span>
                            </div>
                        </div>
                        <div class="status-item">
                            <div class="status-item-label">{{ L.풍속 }}</div>
                            <div class="status-item-value">
                                <span class="value">{{ obj.weather.windSpeed }}</span>
                                <span class="unit">m/s</span>
                            </div>
                        </div>
                        <div class="status-item" style="border:none">
                            <div class="status-item-label">{{ L.풍향 }}</div>
                            <div class="status-item-value">
                                <span class="value">{{ obj.weather.windDeg }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="section2">
                <el-descriptions :column="5" border style="width: 100%" size="small" direction="vertical">
                    <el-descriptions-item :label="L.미세먼지" align="center">
                        <div class="air-value">{{ obj.weatherAirQuality.pm10 }}<span class="unit">µg/m</span></div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.초미세먼지" align="center">
                        <div class="air-value">{{ obj.weatherAirQuality.pm25 }}<span class="unit">µg/m</span></div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.오존" align="center">
                        <div class="air-value">{{ obj.weatherAirQuality.o3 }}<span class="unit">µg/m</span></div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.이산화질소" align="center">
                        <div class="air-value">{{ obj.weatherAirQuality.no2 }}<span class="unit">µg/m</span></div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.일산화탄소" align="center">
                        <div class="air-value">{{ obj.weatherAirQuality.co }}<span class="unit">µg/m</span></div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, onUnmounted } from 'vue'
import BlockLayout from '../layout/BlockLayout.vue'
import SUNNY from '@/assets/icons/weather/sunny.svg'
import CLOUD from '@/assets/icons/weather/cloud.svg'
import THUNDER from '@/assets/icons/weather/thunder.svg'
import RAINY from '@/assets/icons/weather/rainy.svg'
import SNOWY from '@/assets/icons/weather/snowy.svg'
import FOGGY from '@/assets/icons/weather/foggy.svg'
import DUST from '@/assets/icons/weather/dust.svg'
import SQUALL from '@/assets/icons/weather/squall.svg'
import TORNADO from '@/assets/icons/weather/tornado.svg'
import { useService } from '../model_service/Service'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정
const L = useLangStore().lang.dashboard

interface Prop {
    className?: string
}
const props = defineProps<Prop>()
const { className } = toRefs(props)

const province = ref(L.서울)
const district = ref('')
const location = ref(L.서울)
const obj = useService()
let interval: any = null

// 날씨 이미지 메칭 
const WeatherImageSrc = (weatherName: string) => {
    const weathers: Record<string, string> = {
        맑음: SUNNY,
        구름: CLOUD,
        천둥번개: THUNDER,
        이슬비: RAINY,
        비: RAINY,
        눈: SNOWY,
        안개: FOGGY,
        연무: FOGGY,
        먼지: DUST,
        재: DUST,
        돌풍: SQUALL,
        토네이도: TORNADO,
    }
    return weathers[weatherName] ?? ''
}

onMounted(async () => {
    
    await obj.getWeatherProvince()
    await obj.getWeather({ province: province.value })
    obj.getWeatherAirQuality({ province: province.value })
    obj.getWeatherDistrict({ province: province.value })
    interval = setInterval(()=>{
        obj.getWeather({ province: province.value, district: district.value})
        obj.getWeatherAirQuality({ province: province.value, district: district.value })
    }, 1000 * 60 * 20)
})
onUnmounted(() => {
    clearInterval(interval)
    interval = null
})

const selectProvince = () => {
    obj.weatherDistrict = []
    district.value = ''
    if(province.value){
        province.value && obj.getWeatherDistrict({ province: province.value})
        obj.getWeather({ province: province.value})
        obj.getWeatherAirQuality({ province: province.value })
        location.value = province.value
    }
}
const selectDistrict = () => {
    if(district.value){
        obj.getWeather({ province: province.value, district: district.value})
        obj.getWeatherAirQuality({ province: province.value, district: district.value })
        location.value = district.value
    }
}
</script>
<style scoped lang="scss">
#Weather {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
}
.selector {
    display: flex;
    justify-content: space-between;
    padding: 0px 8px;
    margin: 4px;
    border-radius: 6px;
    background: #161616;
    gap: 12px;
    flex-grow: 0.08;
}
:deep(.el-select__placeholder span) {
    font-size: var(--font12) !important;
    line-height: 12px;
}
:deep(.el-select__wrapper) {
    background-color: var(--color-gray-dark) !important;
    box-shadow: 0 0 0 0.0625rem #464646 inset !important;
}
.el-row {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.section1 {
    display: flex;
    flex-direction: row;
    height: 65%;
    gap: 8px;
}
.section1 .local {
    width: 14vh;
    padding: 8px;
    font-size: 6vh !important;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
}
.weather-local{
    display: flex; 
    align-items: center;
}
.temperature {
    height: 100%;
    display: flex;
    align-items: center;
    min-width: 140px;
    justify-content: center;
    .temp-num {
        font-size: 7.5vh !important;
        font-weight: 500;
        letter-spacing: -3px !important;
        text-align: right;
    }
    .weatherImage-container {
        height: 100%;
        display: flex;
        align-items: flex-end;
        padding-bottom: 12px;
        padding-left: 4px;
    }
    .weather-image {
        display: flex;
        height: 5.5vh;
        width: 5.5vh;
    }
}

.section1 .weather-status {
    display: flex;
    flex:1;
    overflow: hidden;
    align-items: center;
    margin-top: -4px;
    gap: 8px;
    .status-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #2d2d2d;
        padding: 4px 8px;
        height: 30px;
        justify-content: space-between;
    }
    .status-item-label {
        // width: 80px;
        font-size: 12px !important;
        line-height: 12px;
        display: flex;
        justify-content: flex-start;
        height: 100%;
        align-items: center;
        font-weight: 700;
    }
    .status-item-value {
        font-size: 12px !important;
        display: flex;
        justify-content: flex-end;
        // width: calc(100% - 60px);
    }
    .value{
        font-size: 12px !important;
        line-height: 12px;
        width: calc(100% - 18px);
        justify-content: flex-end;
        display: flex;
    }
    .unit {
        font-size: 10px !important;
        line-height: 12px;

        margin-left: 4px;
        display: flex;
        justify-content: flex-start;
        width: 18px;
    }
}

.section2 {
    display: flex;
    height: 38%;
}
:deep(.el-descriptions .el-descriptions__body .el-descriptions__cell) {
    font-size: 12px !important;
    .air-value {
        font-size: 12px !important;
    }
    .unit {
        font-size: 8px !important;
        margin-left: 4px;
    }
}
:deep(.block-item-body) {
    padding: 4px 12px 16px;
}
.devide-line {
    height: 60%;
    width: 1px !important;
    border: 1px solid #2d2d2d;
}

</style>
