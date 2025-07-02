import api from './SelfApi.ts'
import type { List, Item, CreatePrams,  SearchParams, DeletePrams, VersionList, DeviceList} from './Type.ts'
import { CommonService } from '@/common/service/ComService.ts'

export class Service {
    totalRow= 0
    list:List[]= []
    item:Item = {
        categoryId: null,  // 카테고리 아이디
        modelId: null, // 모델아이디
        firmwareId: '', // 버전
        deviceList: [] as DeviceList[],
        versionList: [] as VersionList[]
    }

    updateDeviceList:DeviceList[]= [] // 업데이트 대상 컬럼에 목록보기 리스트 데이터 
    categoryList:any= [] // 카테고리 드롭다운 리스트 
    modelList:any= [] // 모델 드롭다운 리스트 
    
    async getList(param: SearchParams): Promise<List[]> {
        const res = await api.getList(param)
        this.list = res.data.list??[]
        this.totalRow = res.data.totalRow
        return this.list
    }

    async create(params:CreatePrams): Promise<any> {
        return await api.create(params)
    }

    async delete(params:DeletePrams): Promise<any> {
        return await api.delete(params)
    }

    async getDeviceList(params:{modelId:number, categoryId:number}): Promise<any[]> {
        const res = await api.getDeviceList(params)
        this.item.deviceList = res.data.list??[]
        return this.item.deviceList
    }
    async getVersionList(params:{modelId:number, categoryId:number}): Promise<any[]> {
        const res = await api.getVersionList(params)
        this.item.versionList = res.data.list??[]
        return this.item.versionList
    }

    //  업데이트 대상 - 목록보기 
    async getUpdateDeviceList(params:{jobId:string}): Promise<any[]> {
        const res = await api.getUpdateDeviceList(params)
        this.updateDeviceList = res.data.list??[]
        return this.updateDeviceList
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
