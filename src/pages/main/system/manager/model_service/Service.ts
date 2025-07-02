import api from './SelfApi.ts'
import type { List, Item, CreatePrams, UpdatePrams, SearchParams, DeletePrams } from './Type.ts'
import {CommonService} from '@/common/service/ComService.ts'

export class Service {
    totalRow= 0
    list:List[]= []
    item:Item = {
        id: 0, // 아이디
        loginId: '', // 운영자 아이디
        name: '', // 운영자명
        phone: '', // 전화번호
        email: '', // 이메일주소
        password: '', // 비밀번호
        roleCode: '', // 권한코드
        roleName: '', // 권한명
        statusCode: '', // 상태코드
        companyId: 0,
        companyName: ''
    }
    roleList:any = []
    siteList:{id:number, companyName:string}[] = []


    async getList(param: SearchParams): Promise<void> {
        const res = await api.getList(param)
        this.list = res.data.list??[]
        this.totalRow = res.data.totalRow
    }

    async getInfo(params:{id:number}): Promise<void> {
        const res = await api.getInfo(params)
        this.item = Object.assign({},this.item, res.data)
    }

    async create(params:CreatePrams): Promise<any> {
        return await api.create(params)
    }

    async update(params:UpdatePrams): Promise<any> {
        return await api.update(params)
    }

    async delete(params:DeletePrams): Promise<any> {
        return await api.delete(params)
    }

    async resetPassword(params:{id:number}): Promise<boolean> {
        const res = await api.resetPassword(params)
        return res.data
    }

    // 중복아이디 체크
    checkDuplicateId = async(params:{loginId:string}) => {
        const res = await api.checkDuplicateId(params)
        return res.data
    }

    async getRoleList(): Promise<void> {
        const res = await api.getRoleList()
        this.roleList = res.data.list??[]
    }

    async getSiteList(): Promise<any[]> {
        const res = await CommonService.getSiteList()
        this.siteList = res??[]
        return this.siteList
    }
}
