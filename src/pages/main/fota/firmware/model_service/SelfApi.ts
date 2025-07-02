import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 업데이트 등록 목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/fota/firmware/list', { payload })
    },
    // 업데이트 등록 
    async create(params: Params): Promise<APIResponse> {
        const formData = new FormData();
        formData.append('version', params.version)
        formData.append('note', params.note)
        formData.append('modelId', params.modelId)
        formData.append('categoryId', params.categoryId)
        params.files.forEach( (file:any) => {
            formData.append('file', file);  // FormData 객체에 파일 추가
        })
        const payload: PayloadModel = { body: formData }
        return await fetch().post('/api/fota/firmware', { payload, progress:true })
    },
}
