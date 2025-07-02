import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
   
    // 다국어 데이터 호출 api
    async getLangList(params:Params) {
        const payload = { query: params }
        return await fetch().get('/api/system/language', { payload })
    },
    // 다국어 수정
    async updateLangData(params:Params): Promise<APIResponse> {
        const payload:PayloadModel = { body: params }
        return await fetch().post('/api/system/language', { payload })
    },
    // 다국어 데이터 삭제 api
    async deleteLangData(params:Params) {
        const payload = { body: params }
        return await fetch().delete('/api/system/language', { payload })
    }
}
