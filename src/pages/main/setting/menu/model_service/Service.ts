import api from './SelfApi.ts'
import type { List, Item, CreateParams, UpdateParams, LangDataList, DeletePrams, SearchLangParams } from './Type.ts'

export class Service {
    list:List[]= []
    item:Item = {
        id: 0, // 메뉴 아이디
        title: '', // 메뉴 명
        titleEn: '', // 메뉴 영어
        path: '', // 경로
        icon: '', // 아이콘
        stp: 0, // 순서
        useYn: 'Y', // 사용여부
    }
    langList = [] // 다국어 메뉴 언어

    async getMenuList(): Promise<void> {
        const res = await api.getMenuList()
        this.list = res.data[0].children??[]
    }
    async createMenu(params:CreateParams): Promise<any> {
        return await api.createMenu(params)
    }
    async updateMenu(params:UpdateParams): Promise<any> {
        return await api.updateMenu(params)
    }
    async deleteMenu(params:DeletePrams): Promise<any> {
        return await api.deleteMenu(params)
    }

    // 다국어 데이터 호출 api
    async getLangList(params:SearchLangParams) {
        const res = await api.getLangList(params)
        this.langList = res.data.list??[]
    }
    // 다국어 수정
    async updateLangData(params:LangDataList) {
        return await api.updateLangData(params)
    }

}
