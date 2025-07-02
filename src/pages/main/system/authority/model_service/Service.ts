import api from './SelfApi.ts'
import type { List, Item, CreatePrams, UpdatePrams, DeletePrams, SearchParams, UpdateMenuParams } from './Type.ts'
export class Service {
    totalRow=0
    list:List[]= []
    item:Item = {
        id: 0,
        roleCode: '',
        roleName: '',
        description: '',
        useYn: '',
        createId: '',
        updateId: '',
        createDate: '',
        updateDate: '',
    }
    menuList:any = []
    checkedNodeList:any = []

    async getList(params:SearchParams): Promise<void> {
        const res = await api.getList(params)
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
        return  await api.update(params)
    }
    async delete(params:DeletePrams): Promise<any> {
        return await api.delete(params)
    }
    async getMenuList(params:{roleCode:string}): Promise<void> {
        const res = await api.getMenuList(params)
        this.menuList = res.data??[]
        this.setAuthAction(this.menuList)
    }
    async updateAuthMenu(params:UpdateMenuParams): Promise<any> {
        const res = await api.updateAuthMenu(params)
        return res.result
    }

    // authAction 값 재설정-----------
    setAuthAction = (menuData: any[]) => {
        menuData.forEach((items:any)=>{
            if(items.useYn === 'Y'){
                this.checkedNodeList.push(items.id)
            }
            if(items.authAction.length === 0){
                items.authAction = []
            } else {
                items.authAction = items.authAction.split(',')
            }
            this.setAuthAction(items.children)
        })
    }
    // el-tree 상세페이지에서 편집불거 설정
    setDisabledTree = (menuData: any[]) =>{
        menuData.forEach((items:any)=>{
            items.disabled = true
            this.setDisabledTree(items.children)
        })
    }

}
