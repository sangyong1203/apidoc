<template>
    <BasicDialog
        :model-value="isShowDialog"
        :title="L.설정내용"
        description=""
        width="800"
        :buttonTypes="['확인']"
        @on-confirm="onConfirm"
        @on-close="onClose"
    >
        <el-text style=" white-space: pre-wrap;">{{ data }}</el-text>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog,  } from '@/components'
import { ref } from 'vue'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.fotaFirmware

const isShowDialog:any = ref(false)
const data:any = ref('')

const onConfirm = () => {
    data.value = ''
    onClose()
}
const onClose = () => {
    isShowDialog.value = false
}
// 창 열기
const openDialog = async (value:any) =>{
    isShowDialog.value = true
    data.value = value
}

defineExpose({openDialog})
</script>
<style lang="scss" scoped>
.detail-form{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
:deep(.el-form-item){
    margin-bottom: 0;
}
:deep(.el-form-item__content){
    .el-button{
        width:90px;
        margin-left: 8px;
    }
    .el-input{
        flex: 1;
    }
}
.page-description{
    font-size: 14px; 
    padding-bottom: 28px; 
    margin-left: -14px; 
    line-height: 30px;
}
</style>

