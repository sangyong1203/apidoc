export type ManagerApprovalModel = {
    id: number // 아이디
    loginId: string // 운영자 아이디
    name: string // 운영자명
    phone: string // 전화번호
    email: string // 이메일주소
    roleCode: string // 권한코드
    roleName: string // 권한명
    createDate: string // 등록일시
    pendingCode: string
    pendingName: string // 승인 상태
    companyId:number
    approvalYn: string // 'Y' / 'N'
}

export type AcceptParams = Pick<ManagerApprovalModel, 'id' | 'companyId' | 'roleCode' | 'approvalYn'>

export type SearchParams = {
    page: number
    sortColumn: string
    sortAscending: boolean
    rowSize:number
}

