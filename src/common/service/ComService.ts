import api from './SelfApi'
import type {
    SiteList, CodeList
} from './Type'

export class CommonService {

    // 일시정지 구분
    static async getTempPauseList():Promise<CodeList[]> {
        const res = await api.getTempPauseList()
        return res.data??[]
    }
    // 회원 상태 구분
    static async getUserStatusList():Promise<CodeList[]> {
        const res = await api.getUserStatusList()
        return res.data??[]
    }
    // 카테고리 검색 조건 
    static async getCategoryList():Promise<any[]> {
        const res = await api.getCategoryList()
        return res.data
    }
    // 모델 검색 조건 
    static async getModelList(params:{categoryId:number}):Promise<any[]> {
        const res = await api.getModelList(params)
        return res.data.list
    }
    // 사이트 검색 조건 
    static async getSiteList():Promise<SiteList[]> {
        const res = await api.getSiteList()
        return res.data
    }
}

