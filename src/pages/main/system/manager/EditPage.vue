<template>
    <PageHeader :title="pageTitle" :description="pageDescription"></PageHeader>
    <PageBody>
        <el-form
            class="edit-form one-column"
            :model="ruleForm"
            :rules="rules"
            ref="ruleFormRef"
            label-position="left"
            size="large"
            label-width="auto"
            require-asterisk-position="right"
        >
            <el-form-item prop="loginId" :label="L.아이디">
                <el-input
                    v-model="ruleForm.loginId"
                    :placeholder="L.아이디를입력해주세요"
                    autocomplete="off"
                    style="flex: 1; "
                    @change="onChangeId"
                    :disabled="isEditPage"
                />
                <el-button v-if="!isEditPage" type="primary" @click="checkDuplicateId">{{ L.중복검사 }}</el-button>
            </el-form-item>
            <el-form-item prop="name" :label="L.이름">
                <el-input v-model="ruleForm.name" :placeholder="L.이름을입력해주세요" />
            </el-form-item>
            <el-form-item prop="phone" :label="L.전화번호">
                <el-input v-model="ruleForm.phone"  :maxlength="13" :formatter="ComUtil.phoneFormatter" :parser="ComUtil.phoneParse"  :placeholder="L.전화번호를입력해주세요" />
            </el-form-item>
            <el-form-item prop="email" :label="L.이메일">
                <el-input
                    v-model="ruleForm.email"
                    :placeholder="L.이메일을입력해주세요"
                    type="email"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item prop="roleCode" :label="L.운영권한">
                <DropdownList
                    style="width: 100%"
                    v-model="ruleForm.roleCode"
                    :placeholder="L.운영권한을선택해주세요"
                    :list="obj.roleList"
                    option-label="roleName"
                    option-value="roleCode"
                />
            </el-form-item>
            <el-form-item prop="companyId" :label="L.운영사이트">
                <DropdownList
                    style="width: 100%"
                    v-model="ruleForm.companyId"
                    :placeholder="L.운영사이트를선택해주세요"
                    :list="obj.siteList"
                    option-label="companyName"
                    option-value="id"
                />
            </el-form-item>
            <el-form-item prop="password" :label="L.비밀번호" v-show="!isEditPage">
                <template #label>
                    {{ L.비밀번호 }}
                    <el-popover title="Tip" :width="240" trigger="hover" :content="L.비밀번호입력조건설명">
                        <template #reference>
                            <el-icon style="margin-left: 5px">
                                <QuestionFilled />
                            </el-icon>
                        </template>
                    </el-popover>
                </template>

                <el-input
                    v-model="ruleForm.password"
                    prefix-icon="lock"
                    :placeholder="L.비밀번호를입력해주세요"
                    type="password"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item prop="checkPass" :label="L.비밀번호확인" v-show="!isEditPage">
                <el-input
                    v-model="checkPass"
                    prefix-icon="lock"
                    :placeholder="L.비밀번호를다시입력해주세요"
                    type="password"
                    autocomplete="off"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <OperationBox top-line>
                <OperationButton type="취소" @click="onCancel" />
                <OperationButton type="저장" @click="submitForm(ruleFormRef)" />
            </OperationBox>
        </template>
    </PageBody>
    <!-- <ChangePasswordDialog ref="changePasswordRef"></ChangePasswordDialog> -->
</template>
<script lang="ts" setup>
import { DropdownList, OperationBox, OperationButton } from '@/components'
import { Service } from './model_service/Service'
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useGlobalDialog } from '@/common/dialog/ComDialog'
import { Notification } from '@/common/dialog/ComDialog'
import ComUtil from '@/common/utils/ComUtil'
import { useNavStore } from '@/stores/NavStore'
// import ChangePasswordDialog from './ChangePasswordDialog.vue'
import { useLangStore } from '@/stores/LangStore'
import type { Item } from './model_service/Type'

// 다국어 설정
const L = useLangStore().lang.systemManager

const obj = reactive(new Service())
// 비밀번호 편경 폼
const ruleFormRef: any = ref(null)
const checkPass = ref('')
const pageTitle = ref('')
const pageDescription = ref('')
const isEditPage = ref(false)
const ruleForm = ref<Item>(obj.item)
const validatePass = (rule: any, value: any, callback: any) => {
    if (navData.value) {
        callback()
    } else if (value === '') {
        callback(new Error(L.새비밀번호를입력해주세요))
    } else if (!ComUtil.validatePassword(value)) {
        callback(new Error(L.비밀번호입력조건설명))
    } else if (value == ruleForm.value.loginId) {
        callback(new Error(L.ID와비밀번호를동일하게입력하지마십시오))
    } else {
        if (checkPass.value !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass')
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (navData.value) {
        callback()
    } else if (checkPass.value === '') {
        callback(new Error(L.비밀번호확인을입력해주세요))
    } else if (checkPass.value !== ruleForm.value.password) {
        callback(new Error(L.입력한비밀번호가일치하지않습니다))
    } else {
        callback()
    }
}
const validatePhoneNumber = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.전화번호를입력해주세요))
    } else if (!ComUtil.validatePhoneNumer(value)) {
        callback(new Error(L.정확한전화번호를입력해주세요))
    } else {
        callback()
    }
}
const validateEmail = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.이메일을입력해주세요))
    } else if (!ComUtil.validateEmail(value)) {
        callback(new Error(L.정확한이메일을입력해주세요))
    } else {
        callback()
    }
}
const validateId = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.아이디를입력해주세요))
    } else if (isDuplicateId.value === true) {
        isDuplicateId.value = false
        isCheckedId.value = false
        callback(new Error(L.입력하신아이디가존재합니다확인후다시입력해주세요))
    } else {
        callback()
    }
}
// 입력 값 인증 룰
const rules = reactive<FormRules>({
    loginId: { required: true, validator: validateId, trigger: ['change', 'blur'] },
    name: { required: true, message: L.이름을입력해주세요, trigger: ['change', 'blur'] },
    phone: { required: true, validator: validatePhoneNumber, trigger: ['change', 'blur'] },
    email: { required: true, validator: validateEmail, trigger: ['change', 'blur'] },
    password: [{ required: true, validator: validatePass, trigger: ['change', 'blur'] }],
    checkPass: [{ required: true, validator: validatePass2, trigger: ['change', 'blur'] }],
    roleCode: { required: true, message: L.운영권한을선택해주세요, trigger: ['change', 'blur'] },
    companyId: { required: true, message: L.운영사이트를선택해주세요, trigger: ['change', 'blur'] },
})
// 취소
const onCancel = () => {
    goBack()
}
// 뒤로 가기
const goBack = () => {
    useNavStore().backTo()
}
// const changePasswordRef: any = ref(null)
// const changePassword = () => {
//     changePasswordRef.value.openDialog(ruleForm.value.id)
// }

// 저장
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(valid => {
        if (valid) {
            if (navData.value) {
                updateSubmit()
            } else {
                // 아이디 중복 확이 유무
                if (!isCheckedId.value) {
                    Notification.warning(L.아이디중복검사해주세요)
                    return
                }
                createSubmit()
            }
        }
    })
}
// 등록 저장
const createSubmit = () => {
    useGlobalDialog(L.등록하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.create(ruleForm.value)
                .then(res => {
                    Notification.success(L.등록성공)
                    goBack()
                })
                .catch(err => {
                    Notification.error(err)
                })
        })
        .onCancel(() => {})
}
// 수정 저장
const updateSubmit = () => {
    useGlobalDialog(L.수정하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            const { id, loginId, name, phone, email, roleCode, companyId } = ruleForm.value
            const params = { id, loginId, name, phone, email, roleCode, companyId }
            obj.update(params)
                .then(res => {
                    Notification.success(L.수정성공)
                    goBack()
                })
                .catch(err => {
                    Notification.error(err)
                })
        })
        .onCancel(() => {})
}

const isDuplicateId = ref(false)
const isCheckedId = ref(false)
const checkDuplicateId = async () => {
    if(!ruleForm.value.loginId){
        ruleFormRef.value?.validateField('loginId')
        return
    }
    const res = await obj.checkDuplicateId({ loginId: ruleForm.value.loginId })
    if (res.success == true) {
        Notification.success(L.사용가능한아이디입니다)
        isDuplicateId.value = false
        isCheckedId.value = true
    } else {
        Notification.error(L.입력하신아이디가존재합니다확인후다시입력해주세요)
        isDuplicateId.value = true
        ruleFormRef.value?.validateField('loginId')
    }
}
const onChangeId = () => {
    isCheckedId.value = false
}

const navData: any = ref(null)
onMounted(() => {
    navData.value = useNavStore().getNavData()
    obj.getRoleList()
    obj.getSiteList()
    if (navData.value) {
        pageTitle.value = L.운영자수정
        pageDescription.value = L.운영자의정보를수정할수있습니다
        ruleForm.value = navData.value
        isEditPage.value = true
    } else {
        pageTitle.value = L.운영자등록
        pageDescription.value = L.운영자의정보를등록할수있습니다
        isEditPage.value = false
    }
})
</script>
<style lang="scss" scoped>
:deep(.el-form) {
    width: 100%;
    .el-input {
        flex: 1;
    }
}
:deep(.el-form-item__content) {
    gap: 8px;
}
</style>
