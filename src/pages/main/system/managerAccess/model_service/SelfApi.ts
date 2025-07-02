import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 운영자목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/managerAccess/list', { payload })
    },
    // 운영자 접근 해제
    async release(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/managerAccess/release', { payload })
    },
    // 운영자 일시정지 
    async pause(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/managerAccess/pause', { payload })
    },
    // 운영자 영구정지
    async terminate(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/managerAccess/terminate', { payload })
    },

}
