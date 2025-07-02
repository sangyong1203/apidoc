import { fetch } from '@/common/modules/axios'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
import { APIResponse } from '@/common/modules/axios/response'

export default {
    // 운영자목록
    async getList(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/manager/list', { payload })
    },
    // 운영자정보 상세 
    async getInfo(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().get('/api/system/manager', { payload })
    },
    // 운영자정보 등록 
    async create(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().post('/api/system/manager', { payload })
    },
    // 운영자정보 수정 
    async update(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/manager', { payload })
    },
    // 운영자정보 삭제 
    async delete(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { query: params }
        return await fetch().delete('/api/system/manager', { payload })
    },
    // 운영자 비밀번호 초기화  
    async resetPassword(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/manager/resetPassword', { payload })
    },
    // 중복아이디 체크
    async checkDuplicateId(params:{loginId:string}): Promise<APIResponse>{
        const payload = { body: params}
        return await fetch().post('/api/system/manager/checkId', { payload })
    },
    // 운영자 권한 목록
    async getRoleList(): Promise<APIResponse> {
        return await fetch().get('/api/system/authority/list')
    },
    // 운영자 비밀번호변경 
    async changePassword(params: Params): Promise<APIResponse> {
        const payload: PayloadModel = { body: params }
        return await fetch().put('/api/system/manager', { payload })
    },
}
