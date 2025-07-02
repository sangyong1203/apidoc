import api from './SelfApi.ts'
import type { LangDataList, SearchLangParams } from './Type.ts'

export class Service {
    langList = [] as LangDataList[] // 다국어 메뉴 언어
    pageList = [] as {lable:string, value:string}[]

    // 다국어 데이터 호출 api
    async getLangList(params:SearchLangParams) {
        const res = await api.getLangList(params)
        this.langList = res.data
    }
    // 다국어 수정
    async updateLangData(params:LangDataList[]) {
        return await api.updateLangData(params)
    }
    // 다국어 수정
    async deleteLangData(params:{langType: string, page: string}) {
        return await api.updateLangData(params)
    }
    // 다국어 데이터 호출 api
    async getPageList(params:SearchLangParams) {
        const res = await api.getLangList(params)
        this.pageList = res.data.map((item: any) => {
            return { label: item.page, value: item.page }
        })
    }
}
