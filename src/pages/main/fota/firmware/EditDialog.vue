<template>
    <BasicDialog
        :model-value="isShowDialog"
        :title="L.업데이트등록"
        description=""
        width="1000"
        :buttonTypes="['저장', '취소']"
        @on-save="submitForm(ruleFormRef)"
        @on-cancel="onCancel"
        @on-close="onClose"
    >
        <div class="page-description">
            {{ L.업데이트를하기위한준비단계입니다펌웨어파일을서버로업로드하고업데이트정보를등록하기위한정보를입력해주세요 }}
        </div>
        <el-form
            class="detail-form"
            :model="obj.item"
            :rules="rules"
            ref="ruleFormRef"
            label-position="left"
            size="large"
            label-width="auto"
            require-asterisk-position="right"
        >
            <el-form-item prop="categoryId" :label="L.카테고리">
                <DropdownTreeList
                    v-model="obj.item.categoryId"
                    :placeholder="L.카테고리선택"
                    :list="obj.categoryList"
                    option-label="categoryName"
                    option-value="id"
                    @on-change="getModelList"
                />
            </el-form-item>
            <el-form-item prop="modelId" :label="L.모델">
                <DropdownList
                    v-model="obj.item.modelId"
                    :placeholder="L.모델선택"
                    :list="obj.modelList"
                    option-label="modelName"
                    option-value="id"
                />
            </el-form-item>
            <el-form-item prop="version" :label="L.버전">
                <el-input v-model="obj.item.version" :placeholder="L.버전을입력해주세요" />
            </el-form-item>
            <el-form-item prop="note" :label="L.설명" style="flex: 1">
                <el-input
                    type="textarea"
                    v-model="obj.item.note"
                    :placeholder="L.내용을입력해주세요"
                    :autosize="{ minRows: 10, maxRows: 20 }"
                />
            </el-form-item>
            <el-form-item prop="files" :label="L.펌웨어파일">
                <FileUpload
                    label="파일선택"
                    ref="uplaodFileRef"
                    @on-select="onUpload"
                />
            </el-form-item>
        </el-form>
    </BasicDialog>
</template>
<script lang="ts" setup>
import { BasicDialog, FileDragUpload, DropdownTreeList, DropdownList, FileUpload } from '@/components'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Service } from './model_service/Service'
import { useGlobalDialog, Notification } from '@/common/dialog/ComDialog'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.fotaFirmware

const emits = defineEmits(['update:modelValue', 'refresh'])
const obj = reactive(new Service())
const ruleFormRef: any = ref(null)
const uplaodFileRef = ref<typeof FileDragUpload>() // 업로드 컴포넌트 객체 Ref
const isShowDialog: any = ref(false)

// 입력 값 인증 룰
const rules = reactive<FormRules>({
    modelId: { required: true, message: L.모델을선택해주세요, trigger: ['change', 'blur'] },
    categoryId: { required: true, message: L.카테고리를선택해주세요, trigger: ['change', 'blur'] },
    version: { required: true, message: L.버전을입력해주세요, trigger: ['change', 'blur'] },
    note: { required: true, message: L.내용을입력해주세요, trigger: ['change', 'blur'] },
    files: { required: true, message: 'There is no upload file.', trigger: ['change', 'blur'] },
})

// 저장
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid: any) => {
        if (valid) {
            createSubmit()
        }
    })
}
// 등록 저장
const createSubmit = () => {
    useGlobalDialog(L.저장하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            const { categoryId, modelId, version, note, files } = obj.item
            const params = { categoryId, modelId, version, note, files: files }

            obj.create(params)
                .then((res: any) => {
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

// 상새내역 갱신 후 창 닫김
const refreshData = () => {
    emits('refresh')
    onClose()
}
const onUpload = (files: any) => {
    obj.item.files = files
    ruleFormRef.value.validateField('files')
}
const onClose = () => {
    ruleFormRef.value?.resetFields()
    isShowDialog.value = false
}
// 창 열기
const openDialog = async () => {
    isShowDialog.value = true
    await obj.getCategoryList()
}
const getModelList = async (value: any) => {
    await obj.getModelList({categoryId: value})
}
defineExpose({ openDialog })
</script>
<style lang="scss" scoped>
.detail-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
:deep(.el-form-item) {
    margin-bottom: 0;
}
:deep(.el-form-item__content) {
    .el-button {
        width: 90px;
        margin-left: 8px;
    }
    .el-input {
        flex: 1;
    }
}
.page-description {
    font-size: 14px;
    padding-bottom: 28px;
    margin-left: -14px;
    line-height: 30px;
}
</style>
