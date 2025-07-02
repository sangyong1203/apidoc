import { fetch } from '@/common/modules/axios'
import { APIResponse } from '@/common/modules/axios/response'
import type { Params, PayloadModel } from '@/common/modules/axios/request'

export default {

    // 종합 운영 현황
    async getOperationStatus(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/operation/status')
    },
    // 권역별/지역별 현황 - 맵
    async getOperationRegionStatus(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/operation/region')
    },
    // 권역별/지역별 현황 상세 - 팝업
    async getOperationRegionList(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/dashboard/operation/region/detail', { payload })
    },
    // Today 집계
    async getOperationToday(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/dashboard/operation/today', { payload })
    },
    // 날씨 현황
    async getWeather(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/dashboard/weather', { payload })
    },
    // 날씨현황 검색조건 - 권역
    async getWeatherProvince(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/weather/province')
    },
    // 날씨현황 검색조건 - 지역
    async getWeatherDistrict(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/dashboard/weather/district', { payload })
    },
    // 날씨 공기질 현황
    async getWeatherAirQuality(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/dashboard/weather/airQuality', { payload })
    },
    // 공기질 현황
    async getAirQuality(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/dashboard/airQuality', { payload })
    },
    // 배터리 상태
    async getBattery(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/battery')
    },
    // 통신 상태
    async getNetwork(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/network')
    },
    // 에러 현황 조회
    async getError(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/error')
    },
    // 알람 현황 조회
    async getAlarm(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/alarm')
    },

    // 대시보드 알람 팝업 
    async getAlarmPopup(): Promise<APIResponse> {
        return await fetch().get('/api/dashboard/alarm/popup')
    },
    // 대시보드 알람 팝업 확인  
    async confirmAlarmPopup(params: Params): Promise<APIResponse> {
        const payload:PayloadModel = { body: params}
        return await fetch().post('/api/dashboard/alarm/popup', { payload })
    },

    // 대시보드 설정 데이터 호출 
    async getDashboarSettingList():Promise<APIResponse>{
        return await fetch().get('/api/setting/dashboard/list')
    }
}
