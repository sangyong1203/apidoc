import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 운영 권한 목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/authority/list', { payload })
    },
    // 운영 권한 상세 정보
    async getInfo(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/authority', { payload })
    },
    // 운영자 권한 등록
    async create(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().post('/api/system/authority', { payload })
    },
    // 운영자 권한 수정 
    async update(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/authority', { payload })
    },
    // 운영자 권한 삭제 
    async delete(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().delete('/api/system/authority', { payload })
    },
    // 운영자 권한 메뉴
    async getMenuList(params: Params): Promise<any> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/authenticated/userMenu', { payload })
    },
    // 운영자 권한 등록 수정
    async updateAuthMenu(params: Params): Promise<any> {
        const payload: PayloadModel = { body: params }
        return await fetch().post('/api/system/authority/menu', { payload })
    }
}
