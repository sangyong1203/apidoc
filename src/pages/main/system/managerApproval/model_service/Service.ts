import api from './SelfApi.ts'
import type { ManagerApprovalModel, SearchParams, AcceptParams } from './Type.ts'
import { CommonService } from '@/common/service/ComService.ts'

export class Service {
    totalRow = 0
    list: ManagerApprovalModel[] = []
    item: ManagerApprovalModel = {
        id: 0, // 아이디
        loginId: '', // 운영자 아이디
        name: '', // 운영자명
        phone: '', // 전화번호
        email: '', // 이메일주소
        roleCode: '', // 권한코드
        roleName: '', // 권한명
        createDate: '', // 등록일시
        pendingCode: '', // 승인 상태 코드
        pendingName: '', // 승인 상태 명 
        companyId: 0,
        approvalYn: 'N'
    }
    roleList: any = []
    siteList: { id: number; companyName: string }[] = []
    async getList(param: SearchParams): Promise<void> {
        const res = await api.getList(param)
        this.list = res.data.list ?? []
        this.totalRow = res.data.totalRow
    }

    async accept(params: {managers:AcceptParams[]}): Promise<void> {
        const res = await api.accept(params)
        this.item = res.data
    }

    async reject(params: {managers:AcceptParams[]}): Promise<void> {
        const res = await api.reject(params)
        this.item = res.data
    }

    async getRoleList(): Promise<void> {
        const res = await api.getRoleList()
        this.roleList = res.data.list ?? []
    }

    async getSiteList(): Promise<void> {
        const res = await CommonService.getSiteList()
        this.siteList = res ?? []
    }
}
