import api from './SelfApi.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    type BlockModel,
    type OperationStatus,
    type OperationRegionList,
    type OperationRegionStatus,
    type OperationToday,
    type Weather,
    type WeatherAirQuality,
    type WeatherDistrict,
    type WeatherProvince,
    type AirQuality,
    type Battery,
    type Alarm,
    type Error,
    type Network,
    type AlarmPopup,
} from './Type.ts'
import ComUtil from '@/common/utils/ComUtil.ts'
export const useService = defineStore('counter', () => {
    const settingList = ref<BlockModel[]>([]) // 블록 위치 설정

    const operationStatus = ref<OperationStatus>({
        // 종합 운영 현황
        totalCnt: 0,
        operatingCnt: 0,
        errorCnt: 0,
    })
    const operationRegionStatus = ref<OperationRegionStatus[]>([]) // 권역별/지역별 현황
    const operationRegionList = ref<OperationRegionList[]>([]) // 권역별/지역별 현황 상세 - 팝업
    const operationToday = ref<OperationToday>({
        // Today 집계
        buildingCnt: 0,
        operatingCnt: 0,
        distance: 0,
        workTime: 0,
        aqLevel: null,
        levelCnt: 0,
        levelTotalCnt: 0,
    })
    const weather = ref<Weather>({
        // 날씨 현황
        weatherMain: '',
        weatherDescription: '',
        temp: '',
        tempMin: '',
        tempMax: '',
        feelsLike: '',
        humidity: '',
        pressure: '',
        windDeg: '',
        windSpeed: '',
    })
    const weatherProvince = ref<WeatherProvince[]>([]) // 날씨현황 검색조건 - 권역
    const weatherDistrict = ref<WeatherDistrict[]>([]) // 날씨현황 검색조건 - 지역
    const weatherAirQuality = ref<WeatherAirQuality>({
        // 날씨 공기질 현황
        aqi: '',
        co: '',
        no: '',
        no2: '',
        o3: '',
        so2: '',
        pm25: '',
        pm10: '',
        nh3: '',
    })
    const airQuality = ref<AirQuality>({
        // 공기질 현황
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
    })
    const battery = ref<Battery>({
        // 배터리 상태
        BS01: 0,
        BS02: 0,
        BS03: 0,
        BS04: 0,
        totalCnt: 0,
    })
    const network = ref<Network>({
        // 통신 상태
        TS01: 0,
        TS02: 0,
        TS03: 0,
        TS04: 0,
        totalCnt: 0,
    })
    const error = ref<Error[]>([]) // 에려 현황 조회
    const alarm = ref<Alarm[]>([]) // 알람 현황 조회
    const alarmPopup = ref<AlarmPopup[]>([])// 알람 팝업 
        

    // 종합 운영 현황
    async function getOperationStatus(): Promise<any> {
        const res = await api.getOperationStatus()
        operationStatus.value = ComUtil.isEmpty(res.data) ? operationStatus.value : res.data
    }
    // 권역별/지역별 현황 - 맵
    async function getOperationRegionStatus(): Promise<any> {
        const res = await api.getOperationRegionStatus()
        const newArr:any = []
        res.data.forEach((element: any) => {
            // 장애율
            const errorRate = (element.errorCnt / element.operatingCnt) * 100
            // 좌표및 상태컬러 설정
            mapArea.forEach(item => {
                if (element.province === item.province) {
                    newArr.push({
                        province: item.province,
                        totalCnt: element.totalCnt,
                        errorCnt: element.errorCnt,
                        operatingCnt: element.operatingCnt,
                        operatingRate: element.operatingRate,
                        x: item.x,
                        y: item.y,
                        color: errorRate < 0.01
                        ? '#0000ff33'
                        : errorRate >= 0.01 && errorRate <= 0.02
                            ? '#ffff0033'
                            : errorRate > 0.02
                            ? '#ff000033'
                            : 'gray'
                    })
                }
            })
        })
        
        const a:any = []
        console.log( a ?? 1 )
        operationRegionStatus.value = ComUtil.isEmpty(newArr) ? [] : newArr
    }
    // 권역별/지역별 현황 상세 - 팝업
    async function getOperationRegionList(params: { province: string }): Promise<any> {
        const res = await api.getOperationRegionList(params)
        operationRegionList.value = ComUtil.isEmpty(res.data) ? operationRegionList.value : res.data 
    }
    // Today 집계
    async function getOperationToday(params: { todayDate: string }): Promise<any> {
        const res = await api.getOperationToday(params)
        operationToday.value = res.data ?? operationToday.value
    }
    // 날씨 현황
    async function getWeather(params: { province: string; district?: string }): Promise<any> {
        const res = await api.getWeather(params)
        weather.value = res.data ?? weather.value
    }
    // 날씨현황 검색조건 - 권역
    async function getWeatherProvince(): Promise<any> {
        const res = await api.getWeatherProvince()
        weatherProvince.value = res.data ?? weatherProvince.value
    }
    // 날씨현황 검색조건 - 지역
    async function getWeatherDistrict(params: { province: string }): Promise<any> {
        const res = await api.getWeatherDistrict(params)
        weatherDistrict.value = res.data ?? weatherDistrict.value
    }
    // 날씨 공기질 현황
    async function getWeatherAirQuality(params: { province: string; district?: string }): Promise<any> {
        const res = await api.getWeatherAirQuality(params)
        weatherAirQuality.value = res.data ?? weatherAirQuality.value
    }
    // 공기질 현황
    async function getAirQuality(params: { airType: 'pm25' | 'pm10' | 'co2' }): Promise<any> {
        const res = await api.getAirQuality(params)
        airQuality.value = res.data ?? airQuality.value
    }
    // 배터리 상태
    async function getBattery(): Promise<any> {
        const res = await api.getBattery()
        battery.value = res.data ?? battery.value
    }
    // 통신 상태
    async function getNetwork(): Promise<any> {
        const res = await api.getNetwork()
        network.value = res.data ?? network.value
    }
    // 에러 현황 조회
    async function getError(): Promise<any> {
        const res = await api.getError()
        error.value = res.data ?? error.value
    }
    // 알람 현황 조회
    async function getAlarm(): Promise<any> {
        const res = await api.getAlarm()
        alarm.value = res.data ?? alarm.value
    }
    // 대시보드 알람 팝업
    async function getAlarmPopup(): Promise<void> {
        const res = await api.getAlarmPopup()
        alarmPopup.value = res.data
    }
    // 대시보드 알람 팝업 확인 
    async function confirmAlarmPopup(params:{id:number, serial?:string}): Promise<any> {
        return await api.confirmAlarmPopup(params)
    }

    // 대시보드 설정 데티터 호출 
    async function getDashboarSettingList():Promise<any>{
        const res = await api.getDashboarSettingList()
        settingList.value = res.data
    }
    return {
        settingList,
        operationStatus,
        operationRegionStatus,
        operationRegionList,
        operationToday,
        weather,
        weatherProvince,
        weatherDistrict,
        weatherAirQuality,
        airQuality,
        battery,
        network,
        error,
        alarm,
        alarmPopup,
        getDashboarSettingList,
        getOperationStatus,
        getOperationRegionStatus,
        getOperationRegionList,
        getOperationToday,
        getWeather,
        getWeatherProvince,
        getWeatherDistrict,
        getWeatherAirQuality,
        getAirQuality,
        getBattery,
        getNetwork,
        getError,
        getAlarm,
        getAlarmPopup,
        confirmAlarmPopup
    }
})

const mapArea = [
    { province: '서울', x: -207, y: -540, color: '#0072c6' },
    { province: '경기', x: -169, y: -432, color: '#0072c6' },
    { province: '강원', x: 108, y: -655, color: '#0072c6' },
    { province: '충남', x: -300, y: -210, color: '#0072c6' },
    { province: '충북', x: -90, y: -252, color: '#0072c6' },
    { province: '전남', x: -280, y: 337, color: '#0072c6' },
    { province: '전북', x: -190, y: 40, color: '#0072c6' },
    { province: '경남', x: 120, y: 187, color: '#0072c6' },
    { province: '경북', x: 260, y: -218, color: '#0072c6' },
    { province: '제주', x: -345, y: 810, color: '#0072c6' },
    { province: '부산', x: 360, y: 246, color: '#0072c6' },
    { province: '인천', x: -308, y: -514, color: '#0072c6' },
    { province: '울산', x: 433, y: 129, color: '#0072c6' },
    { province: '세종', x: -137, y: -194, color: '#0072c6' },
    { province: '대구', x: 220, y: 9, color: '#0072c6' },
    { province: '광주', x: -238, y: 246, color: '#0072c6' },
    { province: '대전', x: -92, y: -126, color: '#0072c6' },
    { province: '성남', x: -92, y: -126, color: '#0072c6' },

]
