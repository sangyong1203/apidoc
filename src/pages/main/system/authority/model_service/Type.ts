type AuthorityModel = {
    id: number // 권한 아이디
    roleCode: string // 권한코드
    roleName: string // 권한명
    description: string // 권한설명
    useYn: string // 사용여부
    createId: string // 생성자명
    createDate: string // 생성일시
    updateId: string // 수정자명
    updateDate: string // 수정일시
}
export type List = Pick<AuthorityModel, 'id' | 'roleName' | 'description' | 'useYn' | 'createDate' | 'updateDate'>
export type Item = Pick<AuthorityModel, 'id' | 'roleCode' | 'roleName' | 'description' | 'useYn' | 'createDate' | 'updateDate' | 'createId' | 'updateId'>
export type CreatePrams = Pick<AuthorityModel, 'roleName' | 'description' | 'useYn'>
export type UpdatePrams = Pick<AuthorityModel, 'id' | 'roleName' | 'description' | 'useYn'>
export type DeletePrams = Pick<AuthorityModel, 'id'>

export type SearchParams = {
    page: number
    rowSize:number
    sortColumn: string
    sortAscending: boolean
}
export type UpdateMenuParams = {
    managerGroupId:number // 권한 그룹 아아디
    roleList:{
        menuId: number // 메뉴 아이디
        authAction:string // 접근권한
        useYn:string
    }[]
}

