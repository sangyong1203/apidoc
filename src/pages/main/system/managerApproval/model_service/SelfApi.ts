import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 운영자 계정 신청 목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/managerApproval/list', { payload })
    },
    // 운영자 계정 신청 승인
    async accept(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/managerApproval/accept', { payload })
    },
    // 운영자 계정 신청 반려
    async reject(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/managerApproval/accept', { payload })
    },
    // 운영자 권한 목록
    async getRoleList(): Promise<APIResponse> {
        return await fetch().get('/api/system/authority/list')
    },
}
