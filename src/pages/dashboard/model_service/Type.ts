
// 종합 운영 현황
export type OperationStatus = {
    totalCnt: number // 전제 등록제품 수
    operatingCnt: number // 정상운영 수
    errorCnt: number // 장애 수
}

// 권역별/지역별 현황
export type OperationRegionStatus = {
    province: string // 권역명
    totalCnt: number // 전제 등록제품 수
    operatingCnt: number // 정상운영 수
    operatingRate: number // 정상운영 율
    errorCnt: number // 장애 수
    x: number
    y: number 
}

// 권역별/지역별 현황 상세 - 팝업
export type OperationRegionList = {
    province: string // 권역명
    totalCnt: number // 전제 등록제품 수
    operatingCnt: number // 정상운영 수
    operatingRate: number // 정상운영 율
    errorCnt: number // 장애 수
}

// Today 집계
export type OperationToday = {
    buildingCnt: number // 건물 수
    operatingCnt: number // 활동로봇 수
    distance: number // 이동거리
    workTime: number // 작업시간
    aqLevel: 0 | 1 | 2 | 3 | null // 공기질 ( 0 : 좋음, 1 : 보통, 2 : 나쁨, 3 : 매우 나쁨)
    levelCnt: number // 공기질 수
    levelTotalCnt: number //총 공기질 수
}

// 날씨현황 검색조건 - 지역
export type WeatherProvince = {
    province: string // 지역명
}
// 날씨현황 검색조건 - 권역
export type WeatherDistrict = {
    district: string // 권역명
}
// 날씨현황
export type Weather = {
    weatherMain:  '맑음' | '구름' | '천둥번개' | '이슬비' | '비' | '눈' | '안개' | '연무' | '먼지' | '재' | '돌풍' | '토네이도' | ''
    weatherDescription: string // 상세날씨
    temp: string // 기온 C
    tempMin: string // 최저온도 C 
    tempMax: string // 최고온도 C
    feelsLike: string // 체감온도 C
    humidity: string // 습도 %
    pressure: string // 기압 hPa
    windDeg: string //풍향
    windSpeed: string // 풍속 m/s
}
// 날씨 공기질 현황
export type WeatherAirQuality = {
    aqi: string	// 공기질
    co: string	// 일산화탄소 : μg/m
    no: string	// 질소 : μg/m
    no2: string // 이산화질소 : μg/m
    o3: string // 오존 : μg/m
    so2: string // 이산화황 : μg/m
    pm25: string // 초미세먼지: PM2.5
    pm10: string // 미세먼지 : PM10
    nh3:string // 암모니아 : μg/m

}
// 공기질 현황
export type AirQuality = {
    level1: number // 매우 좋음 수
    level2: number // 좋음 수
    level3: number // 나쁨 수
    level4: number // 매우 나쁨 수
}
// 배터리 상태
export type Battery = {
    BS01: number // 90 ~
    BS02: number // 89 ~ 70
    BS03: number // 69 ~ 50
    BS04: number // 49 ~ 20
    totalCnt: number // 전체

}
// 통신 상태
export type Network = {
    TS01: number // 양호
    TS02: number // 주의
    TS03: number // 나쁨
    TS04: number // 무응답
    totalCnt: number // 전체
}
// 에려 현황 조회
export type Error = {
    critical: number // Critical 에러 개수
    major: number // Major 에러 개수
    fatal: number // Fatal 에러 개수
    createDate: string // 에러 발생일
}
// 알람 현황 조회
export type Alarm = {
    id: number // 알람 아이디
    alarmContent: string // 알람 내용
    modelName: string // 모델명
    alarmType: string // 알람 구분
    actionStatusName: string // 조치필요
    errorContent: string // 에러내용
    alarmTitle: string // 알람명
    errorId: string // 에러코드
    alarmCode: string // 알람코드
    errorLevel: string // 알람레벨
    createDate: string // 알람 발생일
}

export interface BlockModel {
    el:string
    dashboardName: string
    position: string
    section: string
}

export type AlarmPopup = {
    id:  number // 알람 이력 아이디
    alarmContent: string // 알람 설정에서 설정한 알람 내용
    serial: string // 제품 일련번호
    createDate: string
}