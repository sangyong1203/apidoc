type FotaFirmwareModel = {
    id: number | null // 아이디
    categoryName: string // 카테고리 명 
    categoryId: number | null // 카테고리 아이디
    modelName: string // 모델 명  
    modelId: number | null // 모델아이디
    version: string // 버전
    note: string // 설명
    setting: string // 설정 더보기
    createDate: string // 등록일시
    files: [] // 파일
}
export type List = Pick<FotaFirmwareModel, 'id' | 'categoryId' | 'categoryName' | 'modelId' | 'modelName' | 'note' | 'version' | 'setting' | 'createDate'>
export type Item = Pick<FotaFirmwareModel, 'modelId' | 'categoryId' | 'version' | 'note' | 'files'>
export type CreatePrams = Pick<FotaFirmwareModel, 'modelId' | 'categoryId' | 'version' | 'note' | 'files'>

export type SearchParams = {
    page: number
    searchKey: string
    searchValue: string
    sortColumn: string
    sortAscending: boolean
    rowSize: number
}
