import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 사용자목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/user/list', { payload })
    },
    // 사용자정보
    async getInfo(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/user/info', { payload })
    },
}
