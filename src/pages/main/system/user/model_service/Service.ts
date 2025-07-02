import api from './SelfApi.ts'
import type { List, Item, SearchParams } from './Type.ts'

export class Service {
    paginationToken = ''
    list:List[]= []
    item:Item = {
        name: '', // 이름
        gender: '', // 성별
        email: '',
        birthdate: '', // 생년월일
        phone_number: '', // 전화번호
        userCreateDate: '', // 등록일시
        userLastModifiedDate: '', // 수정일시
        kakao: 'N',
        google: 'N',
    }
    siteList:{id:number, companyName:string}[] = []

    async getList(param: SearchParams): Promise<void> {
        const res = await api.getList(param)
        this.list = res.data.users
        this.paginationToken = res.data.paginationToken === null ? 'end' : res.data.paginationToken
    }

    async getInfo(params:{sub:string}): Promise<void> {
        const res = await api.getInfo(params)
        this.item = Object.assign({},this.item, res.data)
    }
}
