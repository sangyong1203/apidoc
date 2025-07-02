import api from './SelfApi.ts'
import type { ManagerAccessModel, SearchParams } from './Type.ts'
import {CommonService} from '@/common/service/ComService.ts'

export class Service {
    totalRow= 0
    list:ManagerAccessModel[]= []
    item:ManagerAccessModel = {
        id: 0, // 아이디
        loginId: '', // 운영자 아이디
        name: '', // 운영자명
        phone: '', // 전화번호
        email: '', // 이메일주소
        password: '', // 비밀번호
        roleCode: '', // 권한코드
        roleName: '', // 권한명
        statusCode: '', // 상태코드
        statusName: '', // 상태명
        pauseStatusCode: '', // 일시정지 구분 코드
        pauseStatusName: '', // 일시정지 구분 명
        stopDescription: '', // 정지설명
        createName: '', // 생성자명
        updateName: '', // 수정자명
        stopDate: '', // 정지일시
        createDate: '', // 등록일시
        updateDate: '', // 수정일시
    }
    siteList:{id:number, companyName:string}[] = []
    tempPauseList:{code:string, name:string}[] =[]
    userStatusList:{code:string, name:string}[] =[]

    async getList(params:SearchParams): Promise<ManagerAccessModel[]> {
        const res = await api.getList(params)
        this.list = res.data.list??[]
        this.totalRow = res.data.totalRow
        return this.list
    }

    async release(params:{ids:number[]}): Promise<any> {
        const res = await api.release(params)
        return res.result
    }

    async pause(params:{ids:number[]}): Promise<any> {
        const res = await api.pause(params)
        return res.result
    }

    async terminate(params:{ids:number[]}): Promise<any> {
        const res = await api.terminate(params)
        return res.result
    }

    async getSiteList(): Promise<void> {
        const res = await CommonService.getSiteList()
        this.siteList = res??[]
    }

    async getTempPauseList(): Promise<void> {
        const res = await CommonService.getTempPauseList()
        this.tempPauseList = res??[]
    }

    async getUserStatusList(): Promise<void> {
        const res = await CommonService.getUserStatusList()
        this.userStatusList = res??[]
    }
}
