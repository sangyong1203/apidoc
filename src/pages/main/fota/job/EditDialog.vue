<template>
    <BasicDialog
        :model-value="isShowDialog"
        :title="L.업데이트Job생성"
        width="1100"
        @on-cancel="onCancel"
        @on-close="onClose"
    >
        <el-form
            :model="obj.item"
            :rules="rules"
            ref="ruleFormRef"
            label-position="left"
            size="large"
            label-width="auto"
            require-asterisk-position="right"
        >
            <div class="content" v-show="step == 'step1'">
                <h3 style="margin-bottom: 20px;"><span style="font-size: 18px;">{{ L.Step1 }}</span> {{L.업데이트를진행할대상디바이스를선택해주세요}}</h3>

                <div style="display: flex; gap: 40px">
                    <el-form-item prop="categoryId" :label="L.카테고리">
                        <DropdownTreeList
                            v-model="obj.item.categoryId"
                            :placeholder="L.카테고리선택"
                            :list="obj.categoryList ?? []"
                            option-label="categoryName"
                            option-value="id"
                            @on-change="getModelCodeList"
                        />
                    </el-form-item>
                    <el-form-item prop="modelId" :label="L.모델">
                        <DropdownList
                            v-model="obj.item.modelId"
                            :placeholder="L.모델선택"
                            :list="obj.modelList ?? []"
                            option-label="modelName"
                            option-value="id"
                            @on-change="getDeviceVersionList"
                        />
                    </el-form-item>
                </div>
                <el-form-item prop="deviceList">
                    <el-table :data="obj.item.deviceList" height="100%" multiple @selection-change="getCheckedDeivices"  border class-name="no-border">
                        <el-table-column type="selection" width="40" />
                        <el-table-column label="NO" type="index" width="80" />
                        <el-table-column prop="serial" :label="L.시리얼번호" width="350" show-overflow-tooltip />
                        <el-table-column prop="version" :label="L.제품펌웨어버전" />
                        <el-table-column prop="status" :label="L.제품상태" />
                    </el-table>
                </el-form-item>
            </div>
            <div class="content" v-show="step == 'step2'"  border class-name="no-border">
                <h3 style="margin-bottom: 20px;"><span style="font-size: 18px;">{{ L.Step2 }}</span> {{ L.업데이트를진행할버전을선택해주세요 }}</h3>

                <el-form-item prop="versionList">
                    <el-table ref="tableRef" :data="obj.item.versionList" height="100%" @selection-change="getCheckedVersion">
                        <el-table-column type="selection" width="40" />
                        <el-table-column label="NO" type="index" width="80" />
                        <el-table-column prop="version" :label="L.버전" width="350" show-overflow-tooltip />
                        <el-table-column prop="note" :label="L.설명" />
                        <el-table-column prop="createDate" :label="L.등록일자" width="180" sortable>
                            <template #default="scope">
                                {{ ComUtil.dateFormat(scope.row.createDate, 'YYYY-MM-DD HH:mm:ss') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </div>
        </el-form>

        <template #footer>
            <div v-show="step == 'step1'">
                <OperationButton type="취소" @click="onCancel" />
                <OperationButton type="다음" @click="toNextPage" />
            </div>
            <div v-show="step == 'step2'">
                <OperationButton type="이전" @click="toPrePage" />
                <OperationButton type="완료" @click="onFinish" />
            </div>
        </template>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog, OperationButton } from '@/components'
import { ref, reactive } from 'vue'
import { Service } from './model_service/Service'
import { useGlobalDialog, Notification } from '@/common/dialog/ComDialog'
import type { FormInstance,FormRules } from 'element-plus'
import ComUtil from '@/common/utils/ComUtil'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.fotaJob

const emits = defineEmits(['update:modelValue', 'refresh'])

const obj = reactive(new Service())
const ruleFormRef = ref<FormInstance>()
const isShowDialog: any = ref(false)
const step = ref('step1')
const selectedDevices: any = ref([]) // 선택한 디바이스
const selectedVersion: any = ref([]) // 선택한 버전

// 입력 값 인증 룰
const rules = reactive<FormRules>({
    categoryId: { required: true, message: L.카테고리를선택해주세요, trigger: ['change', 'blur'] },
    modelId: { required: true, message: L.모델을선택해주세요, trigger: ['change', 'blur'] },
})
const getDeviceVersionList = () => {
    getDeviceList()
    getVersionList()
}
// 디바이스 데이터 호출
const getDeviceList = async () => {
    const params = {
        modelId: obj.item.modelId??0,
        categoryId: obj.item.categoryId??0,
    }
    await obj.getDeviceList(params)
}
// 버전 데이터 호출
const getVersionList = async () => {
    const params = {
        modelId: obj.item.modelId??0,
        categoryId: obj.item.categoryId??0,
    }
    await obj.getVersionList(params)
}

// 체크한 디바이스 값 받아오기
const getCheckedDeivices = (values: any[]) => {
    selectedDevices.value = values.map(item => item.serial)
}

const tableRef: any = ref(null)
const getCheckedVersion = (val: any) => {
    const selected = ComUtil.getTableSelection(tableRef, val)
    selectedVersion.value = selected[0]?.id
}
// 등록 저장
const onFinish = () => {
    if (selectedVersion.value.length === 0) {
        Notification.warning(L.업데이트할버전을선택해주세요)
        return
    }
    if (selectedDevices.value.length === 0) {
        Notification.warning(L.업데이트할제품을선택해주세요)
        return
    }
    if (selectedVersion.value.length > 0) {
        Notification.warning(L.업데이트할버전을하나만선택해주세요)
        return
    }
    useGlobalDialog(L.저장하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            const params = {
                modelId: obj.item.modelId,
                categoryId: obj.item.categoryId,
                firmwareId: selectedVersion.value,
                targets: selectedDevices.value, // 업데이트할 제품들
            }

            obj.create(params)
                .then(() => {
                    Notification.success(L.저장성공)
                    refreshData()
                })
                .catch((err: any) => {
                    Notification.error(err)
                })
        })
        .onCancel(() => {})
}
const onCancel = () => {
    onClose()
}
const toNextPage = () => {
    step.value = 'step2'
}
const toPrePage = () => {
    step.value = 'step1'
}
const onClose = () => {
    isShowDialog.value = false
    step.value = 'step1'
    selectedDevices.value = []
    selectedVersion.value = []
    ruleFormRef.value?.resetFields()
    console.log('obj init', obj.item)
}

// 모델 dropdown list 데이터 불러오기
const getModelCodeList = async (value: any) => {
    obj.modelList = []
    obj.item.modelId = null
    ruleFormRef.value?.clearValidate('modelId')

    if(!value) return
    await obj.getModelList({ categoryId: value })
}

// 상새내역 갱신 후 창 닫김
const refreshData = () => {
    emits('refresh')
    onClose()
}
// 창 열기
const openDialog = async () => {
    isShowDialog.value = true
    obj.getCategoryList()
}

defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    height: 600px;
}
:deep(.tui-grid-container) {
    height: 100%;
}
</style>
