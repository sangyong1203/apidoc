<template>
    <PageHeader :title="L.운영자상세정보" :description="L.운영자상세정보조회수정비밀번호초기화를할수있습니다"></PageHeader>
    <PageBody>
        <div class="detail-page">
            <el-descriptions size="large" :column="1" border>
                <el-descriptions-item :label="L.아이디" label-align="center">{{ form.loginId }}</el-descriptions-item>
                <el-descriptions-item :label="L.이름" label-align="center">{{ form.name }}</el-descriptions-item>
                <el-descriptions-item :label="L.전화번호" label-align="center">{{ ComUtil.phoneFormatter(form.phone ) }}</el-descriptions-item>
                <el-descriptions-item :label="L.이메일" label-align="center">{{ form.email }}</el-descriptions-item>
                <el-descriptions-item :label="L.운영권한" label-align="center">{{ form.roleName }}</el-descriptions-item>
                <el-descriptions-item :label="L.운영사이트" label-align="center">{{ form.companyName }}</el-descriptions-item>
                <el-descriptions-item :label="L.비밀번호초기화" label-align="center">
                    <el-button type="primary" @click="initPassward">{{L.초기화}}</el-button>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <template #footer>
            <OperationBox top-line>
                <OperationButton type="목록"  @click="goBack"/>
                <OperationButton type="수정"  :auth="useNavStore().getAuthAction()" @click="toEditPage"/>
            </OperationBox>
        </template>
    </PageBody>
</template>
<script lang="ts" setup>
import { OperationBox, OperationButton } from '@/components'
import { Service } from './model_service/Service'
import { ref, onMounted } from 'vue'
import { useGlobalDialog } from '@/common/dialog/ComDialog'
import { Notification } from '@/common/dialog/ComDialog'
import { useNavStore } from '@/stores/NavStore'
import { useLangStore } from '@/stores/LangStore'
import ComUtil from '@/common/utils/ComUtil'
import type { Item } from './model_service/Type'

// 다국어 설정 
const L = useLangStore().lang.systemManager

const obj = new Service()
const form = ref<Item>(obj.item)

// 비밀번호 초기화
const initPassward = () => {
    useGlobalDialog(L.비밀번호를초기화하시겠습니까, L.확인, 'YN')
        .onConfirm(()=>{
            obj.resetPassword({id:form.value.id}).then( res => {
                Notification.success(L.비밀번호초기화되였습니다)
            }).catch(error => {
                Notification.error(L.비밀번호초기화실패하였습니다)
            })
        })
        .onCancel(()=>{})
}

// 뒤로 가기
const goBack = () => {
    useNavStore().backTo()
}
const toEditPage = () =>{
    useNavStore().navTo(L.운영자수정, '/system/manager/edit', form.value)

}
// 상세 데이터 불러오기
const getInfoData = async () => {
    let navData = useNavStore().getNavData()
    await obj.getInfo({id:navData.id})
    
    form.value = obj.item
}
onMounted(()=>{
    getInfoData()
})
</script>
<style lang="scss" scoped>
.detail-page{
    width: 50%;
    height: 400px;
}
</style>
