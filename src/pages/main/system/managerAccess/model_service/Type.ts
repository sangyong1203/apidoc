export type ManagerAccessModel = {
    id: number // 아이디
    loginId: string // 운영자 아이디
    name: string // 운영자명
    phone: string // 전화번호
    email: string // 이메일주소
    password: string // 비밀번호
    roleCode: string // 권한코드
    roleName: string // 권한명
    statusCode: string // 상태코드
    statusName: string // 상태명
    pauseStatusCode: string // 일시정지 구분 코드
    pauseStatusName: string // 일시정지 구분 명
    stopDescription: string // 정지설명
    createName: string // 생성자명
    updateName: string // 수정자명
    stopDate: string // 정지일시
    createDate: string // 등록일시
    updateDate: string // 수정일시
}

export type SearchParams = {
    page: number
    searchKey?: string
    searchValue?: string
    dateKey?: string
    startDate?: string
    endDate?: string
    sortColumn: string
    sortAscending: boolean
    rowSize:number
    statusCode: string 
    pauseStatusCode: string 
    companyId: number

}