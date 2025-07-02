type FotaJobModel = {
    id: number | null // 아이디
    jobId: string // 잡 아이디
    categoryName: string // 카테고리 명
    categoryId: number | null // 카테고리 아이디
    modelName: string // 모델 명
    modelId: number | null // 모델아이디
    deviceId: 0,
    type: string // 유형
    version: string // 버전 
    status: string // 상태
    createDate: string // 시작일자
    firmwareId: string // 펌웨어 아이디 
    targets: DeviceList[] // 선택한 업데이트할 디바이스
    deviceList: DeviceList[] // 업데이트를 진행할 대상 디바이스 목록 
    versionList: VersionList[] // 버전 목록 
}
export type List = Pick<FotaJobModel, 'id' | 'jobId' | 'categoryId' | 'categoryName' | 'deviceId' | 'firmwareId' | 'modelId' | 'modelName' | 'type' | 'version' | 'status' | 'createDate'>
export type Item = Pick<FotaJobModel, 'categoryId' | 'modelId'| 'firmwareId' | 'deviceList' | 'versionList'>
export type CreatePrams = Pick<FotaJobModel, 'modelId' | 'categoryId' | 'firmwareId' | 'targets'>
export type DeletePrams = Pick<FotaJobModel, 'jobId'>

export type SearchParams = {
    page: number
    searchKey: string
    searchValue: string
    sortColumn: string
    sortAscending: boolean
    rowSize: number
    categoryId: number | null
    modelId: number | null
    status: string
}
export type VersionList = {
    id: number
    categoryId: number
    firmwareJobId: number
    modelId: number
    note: string
    version: string
    createDate: string
}
export type DeviceList = {
    id: number
    categoryId: number
    firmwareJobId: number
    modelId: number
    serial: string
    status: string
} 
