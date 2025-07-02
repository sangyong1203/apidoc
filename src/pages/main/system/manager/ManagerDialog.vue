<template>
    <BasicDialog
        :model-value="isShowDialog"
        :title="title"
        width="500"
        height="60%"
        :buttonTypes="['저장', '취소']"
        @on-save="onSave"
        @on-cancel="onCancel"
        @on-close="onClose"
    >
            <el-table
                :data="obj.roleList"
                highlight-current-row
                style="width: 100%"
                @row-click="onSelect"
            >
                <el-table-column property="roleName" :label="L.권한명" />
            </el-table>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog} from '@/components'
import { ref, reactive } from 'vue'
import { Service } from './model_service/Service'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.systemManager

const emits = defineEmits(['update:modelValue', 'refresh', 'onSelete'])

const obj = reactive(new Service())
const title = ref('')
const isShowDialog:any = ref(false)
const selectedRow :any = ref({})

// 테이블 데이터 호출
const getList = async () => {
    await obj.getRoleList()
}
// 저장
const onSave = () => {
    emits('onSelete', selectedRow.value)
    onClose()

}
const onCancel = () => {
    onClose()
}
const onClose = () => {
    isShowDialog.value = false
    selectedRow.value = {}
}
// 행 선택
const onSelect = (value:any) =>{
    selectedRow.value = value
}
// 창 열기
const openDialog = async () =>{
    isShowDialog.value = true
    title.value = L.운영권한선택
    getList()
}

defineExpose({openDialog})
</script>
<style lang="scss" scoped>
.detail{
    display: flex;
    flex-direction: column;
    flex:1;
    overflow: hidden;
    background-color: #ffffff;
    padding: 0 20px;
}
</style>

