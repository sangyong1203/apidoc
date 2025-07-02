<template>
    <PageHeader :title="pageTitle" :description="pageDescription"></PageHeader>
    <PageBody>
        <el-descriptions class="detail-page" size="large" :column="2" border>
            <el-descriptions-item :label="L.권한명" label-align="center" :span="2">{{ form.roleName }}</el-descriptions-item>
            <el-descriptions-item :label="L.권한설명" label-align="center" :span="2">{{ form.description }}</el-descriptions-item>
            <el-descriptions-item :label="L.사용여부" label-align="center" :span="2">
                    <div>{{ form.useYn === "Y" ? L.사용 : L.미사용 }}</div>
                </el-descriptions-item>
            <el-descriptions-item :label="L.등록일시" label-align="center">{{ ComUtil.dateFormat(form.createDate, 'YYYY-MM-DD HH:mm:ss') }}</el-descriptions-item>
            <el-descriptions-item :label="L.등록자" label-align="center">{{ form.createId }}</el-descriptions-item>
            <el-descriptions-item :label="L.수정일시" label-align="center">{{ ComUtil.dateFormat(form.updateDate, 'YYYY-MM-DD HH:mm:ss') }}</el-descriptions-item>
            <el-descriptions-item :label="L.수정자" label-align="center">{{ form.updateId }}</el-descriptions-item>
        </el-descriptions>
        <div class="menu-contents">
                <div class="menu-header">
                    <div class="menu-header-title">{{ L.메뉴접근권한 }}</div>
                </div>
                <el-tree
                    ref="treeRef"
                    node-key="id"
                    :data="obj.menuList"
                    :props="defaultProps"
                    :default-checked-keys="obj.checkedNodeList"
                    show-checkbox
                    highlight-current
                    :check-strictly="true"
                    default-expand-all
                >
                    <template #default="{ node, data }">
                        <div class="tree-node-content">
                            <div>{{ node.label }}</div>
                            <el-checkbox-group
                                v-if="data.children.length === 0"
                                v-model="data.authAction"
                                :disabled="true"
                            >
                                <el-checkbox :label="L.조회" value="GET" />
                                <el-checkbox :label="L.등록" value="POST" />
                                <el-checkbox :label="L.수정" value="PUT" />
                                <el-checkbox :label="L.삭제" value="DELETE" />
                            </el-checkbox-group>
                        </div>
                    </template>
                </el-tree>
            </div>
        <template #footer>
            <OperationBox top-line>
                <OperationButton type="목록"  @click="goBack"/>
                <OperationButton type="삭제"  :auth="useNavStore().getAuthAction()" @click="toDelete"/>
                <OperationButton type="수정"  :auth="useNavStore().getAuthAction()" @click="toEditPage"/>
            </OperationBox>
        </template>
    </PageBody>
</template>
<script lang="ts" setup>
import { OperationBox, OperationButton } from '@/components'
import { Service } from './model_service/Service.ts'
import { ref, reactive, onMounted } from 'vue'
import { useNavStore } from '@/stores/NavStore.ts'
import { useGlobalDialog, Notification } from '@/common/dialog/ComDialog.ts'
import { useLangStore } from '@/stores/LangStore.ts'
import ComUtil from '@/common/utils/ComUtil'
import type { Item } from './model_service/Type.ts'

// 다국어 설정 
const L = useLangStore().lang.systemAuthority

const obj = reactive(new Service())
const pageTitle = ref('') // 페이지 명
const pageDescription = ref('') // 페이지 설명
const form = ref<Item>(obj.item)
const navData:any = ref(null)
const defaultProps = {
    children: 'children',
    label: 'title',
    disabled: 'disabled'
}

// 뒤로 가기
const goBack = () => {
    useNavStore().backTo()
}
const toEditPage = () =>{
    useNavStore().navTo(L.운영자권한수정, '/system/authority/edit', form.value)
}
const toDelete = () => {
    useGlobalDialog(L.삭제하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.delete({id:form.value.id}).then(res=>{
                Notification.success(L.삭제성공)
                goBack()
            })
        })
        .onCancel(() => { })
    
}
onMounted(async ()=>{
    pageTitle.value = L.운영자권한상세
    pageDescription.value = L.운영자권한상세내용을조회할수있습니다

    navData.value =  useNavStore().getNavData()
    // 상세정보 할당
    await obj.getInfo({id:navData.value.id})
    form.value = obj.item
    await obj.getMenuList({roleCode:form.value.roleCode}) 
    obj.setDisabledTree(obj.menuList)
})

</script>
<style lang="scss" scoped>

.menu-contents {
    display: flex;
    border: 1px solid #dddddd;
    padding: 12px;
    height: 100%;
    overflow-y: scroll;
    flex-direction: column;
}

.menu-header {
    font-size: 18px;
    line-height: 40px;
    height: 48px;
    border-bottom: 1px solid #dddddd;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tree-node-content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-right: 20px;
    align-items: center;
    gap: 24px;
}

.el-tree {
    width: 100%;
    height: 100%;
    overflow: scroll;
    --el-tree-node-content-height: 32px !important;

}
:deep(.el-checkbox-group) {
    font-size: 0;
    line-height: 0;
    width: 400px;
    display: flex;
    justify-content: space-around;
}
.detail-page{
    width: 50%;
    height: 400px;
    margin-bottom: 20px;
}
</style>
