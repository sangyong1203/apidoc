type UserInfoModel = {
    name: string // 이름
    gender: string // 성별
    email: string 
    phone_number: string // 전화번호
    birthdate: string // 생년월일
    userCreateDate: string // 등록일시
    userLastModifiedDate: string // 수정일시
    kakao: string
    google: string
}
export type List = Pick<UserInfoModel, 'name' | 'phone_number' | 'email' | 'userCreateDate' | 'userLastModifiedDate'>
export type Item = Pick<UserInfoModel, 'name' | 'phone_number' | 'gender' | 'birthdate' | 'email' | 'userCreateDate' | 'userLastModifiedDate' | 'google' | 'kakao'>

export type SearchParams = {
    page: number
    searchKey?: string
    searchValue?: string
    dateKey?: string
    startDate?: string
    endDate?: string
    sortColumn: string
    sortAscending: boolean
    paginationToken: string // 다음페이지 데이터 검색하는 token
}