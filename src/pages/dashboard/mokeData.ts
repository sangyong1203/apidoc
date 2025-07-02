export const data = {
    // Map 기반 관제 현황
    mapStatus:{},
    // 알람 현황
    alarmStatus: {},  
    // 지역별 현황
    regionStatus: [], 
    // Today 집계
    todaySum: {},
    // 날씨 현황
    weather: {}, 
    // 공기질 현황
    airStatus:{ },
    // 로봇 관제 상태
    robotState: { },
    // 에러 현황
    errorStatus:[], 
}

// 총 디바이스 운영 현황
export const deviceData = {
    totalCnt: 4500,
    idle: 300,
    operatingCnt: 4100,
    errorCnt: 100
}


// ---------------- 종합 운영 현황 ---------------
// 권역별 현황 지도 데이터
export const mapAreaData = [
    {province: '서울', x:-207, y:-540, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '경기', x:-169, y:-432, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '강원', x:108, y:-655, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '충남', x:-300, y:-210, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '충북', x:-90, y:-252, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '전남', x:-280, y:337, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '전북', x:-190, y:40, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '경남', x:120, y:187, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '경북', x:260, y:-218, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '제주', x:-345, y:810, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '부산', x:360, y:246, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '인천', x:-308, y:-514, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '울산', x:433, y:129, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '세종', x:-137, y:-194, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '대구', x:220, y:9, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '광주', x:-238, y:246, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
    {province: '대전', x:-92, y:-126, color:'#0072c6',totalCnt:240, operatingCnt:50, errorCnt:1},
]

// 권역 운영 현황 다이얼로그에 데티터
export const areaOpStatusList = [
    {province: '종로구' ,totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '중구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '용사구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '성동구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '광진구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '동대문구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '증량구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '성북구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '강북구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '도봉구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '노원구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '은평구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '서대문구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '마포구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '양천구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '강서구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '도봉구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '서초구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},
    {province: '신림구', totalCnt:240, operatingCnt:50, errorCnt:1, idle:20},

]
