<template>
    <BasicDialog
        :model-value="isShowDialog"
        :title="L.업데이트대상목록"
        width="500"
        :buttonTypes="['확인']"
        @on-confirm="onClose"
        @on-close="onClose"
    >
        <GridTable 
            ref="gridRef"
            :columns="columns"
            :row-size="1000"
            :current-page="1"
            :total-count="obj.updateDeviceList.length??0"
            />
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog } from '@/components'
import { Service } from './model_service/Service'
import { ref, reactive } from 'vue'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.fotaJob

const obj = reactive(new Service())
const jobId = ref('')
const isShowDialog = ref(false)
const gridRef: any = ref(null)

// 테이블 컬럼 설정값
const columns: any[] = [
    {
        header: 'NO',
        name: 'indexNum',
        align: 'center',
        width: 80
    },
    {
        header: L.시리얼번호,
        name: 'serial',
        align: 'center',
    },
]

// 테이블 데이터 호출
const getList = async () => {
    await obj.getUpdateDeviceList({jobId:jobId.value, })
    gridRef.value?.setTableData(obj.updateDeviceList)
}

const onClose = () => {
    isShowDialog.value = false
}

const openDialog = async (id:string) => {
    isShowDialog.value = true
    jobId.value = id
    await getList()
}
defineExpose({openDialog})
</script>
<style lang="scss" scoped>

</style>
