<template>
    <BasicDialog
        :model-value="isShowDialog"
        width="1000"
        :title="title"
        :description="description"
        :buttonTypes="['확인']"
        @on-confirm="onConfirm"
        @on-close="onClose"
    >
    <el-table class="areaStatus" :data="obj.operationRegionList" height="600px"  border class-name="no-border">
            <el-table-column label="NO" type="index" width="80"/>
            <el-table-column prop="district" :label="L.시군구" />
            <el-table-column prop="totalCnt" :label="L.등록제품수" />
            <el-table-column :label="L.미운영수" >
                <template #default="{row}">
                    {{ row.totalCnt - row.operatingCnt - row.errorCnt}}
                </template>
            </el-table-column>
            <el-table-column prop="operatingCnt" :label="L.정상운영수" />
            <el-table-column prop="errorCnt" :label="L.장애발생수" />
        </el-table>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog } from '@/components'
import { ref } from 'vue'
import { useService } from '../model_service/Service'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.dashboard

const obj = useService()
const isShowDialog = ref(false)
const title = ref('')
const description = ref('')

// 테이블 데이터 호출
const getList = async (province: string) => {
    await obj.getOperationRegionList({province})
}

const onConfirm = () => {
    onClose()
}
const onClose = () => {
    isShowDialog.value = false
}

const openDialog = (area: string) => {
    isShowDialog.value = true
    title.value = `${area} ${L.권역운영현황}`
    description.value = area + L.시군구단위의운영현황입니다
    getList(area)
}
defineExpose({openDialog})
</script>
<style lang="scss" scoped>
:deep(.el-table__header-wrapper .el-table__header tr .cell){
    color:var(--primary-text-color);
    font-size: 14px !important;
}
:deep(.areaStatus .el-table .el-table__header th.el-table__cell){
    background-color: white !important;
}
</style>