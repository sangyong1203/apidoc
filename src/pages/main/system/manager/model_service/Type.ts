type ManagerModel = {
    id: number // 일련번호
    loginId: string // 운영자 아이디
    name: string // 운영자명
    phone: string // 전화번호
    email: string // 이메일주소
    password: string // 비밀번호
    roleCode: string // 권한코드
    roleName: string // 권한명
    statusCode: string // 상태코드
    createName: string // 생성자명
    updateName: string // 수정자명
    createDate: string // 등록일시
    updateDate: string // 수정일시
    companyId:number // 사이트 아이디 
    companyName: string // 사이트 명 

}
export type List = Pick<ManagerModel, 'id' | 'loginId' | 'name' | 'phone' | 'email' | 'roleCode' | 'roleName' | 'statusCode' | 'createDate' | 'updateDate'>
export type Item = Pick<ManagerModel, 'id' | 'loginId' | 'name' | 'phone' | 'email' | 'roleCode' | 'roleName' | 'companyId' | 'companyName' | 'statusCode' | 'password'>
export type CreatePrams = Pick<ManagerModel, 'loginId' | 'name' | 'phone' | 'email' | 'roleCode' | 'companyId' | 'password' >
export type UpdatePrams = Pick<ManagerModel, 'id' | 'loginId' | 'name' | 'phone' | 'email' | 'roleCode' | 'companyId'>
export type DeletePrams = Pick<ManagerModel, 'id'>

export type SearchParams = {
    page: number
    searchKey: string
    searchValue: string
    dateKey: string
    startDate: string
    endDate: string
    sortColumn: string
    sortAscending: boolean
    rowSize:number
    companyId:number
}
