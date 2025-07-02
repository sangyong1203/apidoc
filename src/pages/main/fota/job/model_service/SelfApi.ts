import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 업데이트 잡 목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/fota/job/list', { payload })
    },
    // 업데이트 잡 등록 
    async create(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().post('/api/fota/job', { payload })
    },
    // 업데이트 잡 삭제 
    async delete(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().put('/api/fota/job', { payload })
    },

    // 잡 생성 시 디바이스 선택 목록
    async getDeviceList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/fota/job/target/list', { payload })
    },
    // 잡 생성 시 버전 선택 목록
    async getVersionList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/fota/firmware/version/list', { payload })
    },
    // 업데이트 대상 디바이스 목록
    async getUpdateDeviceList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/fota/job/serial/list', { payload })
    },
}
