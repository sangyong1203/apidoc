import api from './SelfApi.ts'
import type { List, Item, CreatePrams, SearchParams } from './Type.ts'
import { CommonService } from '@/common/service/ComService.ts'

export class Service {
    totalRow= 0
    list:List[]= []
    item:Item = {
        categoryId: null,
        modelId: null,
        version: '', // 버전
        note: '', // 설명
        files: []
    }
    categoryList:any= []
    modelList:any= []

    async getList(param: SearchParams): Promise<void> {
        const res = await api.getList(param)
        this.totalRow = res.data.totalRow
        this.list = res.data.list??[]
    }

    async create(params:CreatePrams): Promise<any> {
        return await api.create(params)
    }

    async getCategoryList(): Promise<void> {
        const res = await CommonService.getCategoryList()
        this.categoryList = res??[]
    }
    async getModelList(param: {categoryId:number}): Promise<void> {
        const res = await CommonService.getModelList(param)
        this.modelList = res??[]
    }
}
