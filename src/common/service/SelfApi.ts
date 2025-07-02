import { fetch } from '@/common/modules/axios'
import { APIResponse } from '@/common/modules/axios/response'
import type { Params, PayloadModel } from '@/common/modules/axios/request'
export default {
    // 일시정지 구분
    async getTempPauseList(): Promise<APIResponse>{
        return await fetch().get('/api/codeList?groupCode=PAUS')
    },
    // 회원 상태 구분
    async getUserStatusList(): Promise<APIResponse>{
        return await fetch().get('/api/codeList?groupCode=MSTS')
    },
    // 카테고리 검색 조건 
    async getCategoryList(): Promise<APIResponse> {
        return await fetch().get('/api/search/product/category/list')
    },
    // 모델 검색 조건 
    async getModelList(params:Params): Promise<APIResponse> {
        const payload:PayloadModel = { query: params}
        return await fetch().get('/api/search/product/model/list',{ payload })
    },
    // 사이트 목록
    async getSiteList(): Promise<APIResponse> {
        return await fetch().get('/api/search/setting/site/list')
    },
    
}
