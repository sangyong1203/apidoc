<template>
    <PageHeader :title="pageTitle" :description="pageDescription"></PageHeader>
    <PageBody>
        <el-form
            class="edit-form one-column"
            :model="ruleForm"
            :rules="rules"
            require-asterisk-position="right"
            ref="ruleFormRef"
            label-position="left"
            size="large"
            label-width="auto"
        >
            <!-- <el-form-item prop="roleCode" :label="L.권한코드">
                <el-input
                    v-model="ruleForm.roleCode"
                    :placeholder="L.권한코드를입력해주세요"
                    autocomplete="off"
                    :disabled="isEdit"
                    style="flex: 1; margin-right: 8px"
                    @change="onChangeRoleCode"
                />
                <el-button type="primary" v-if="!isEdit" @click="checkDuplicateRoleCode">{{ L.중복확인 }}</el-button>
            </el-form-item> -->
            <el-form-item prop="roleName" :label="L.권한명">
                <el-input
                    v-model="ruleForm.roleName"
                    :placeholder="L.권한명을입력해주세요"
                    autocomplete="off"
                    style="flex: 1; margin-right: 8px"
                    @change="onChangeRoleName"
                    />
                <el-button type="primary" @click="checkDuplicateRoleName">{{ L.중복확인 }}</el-button>
            </el-form-item>
            <el-form-item prop="description" :label="L.권한설명">
                <el-input v-model="ruleForm.description" :placeholder="L.권한설명을입력해주세요" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="useYn" :label="L.사용여부">
                <el-radio-group v-model="ruleForm.useYn">
                    <el-radio value="Y">{{ L.사용 }}</el-radio>
                    <el-radio value="N">{{ L.미사용 }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
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
                default-expand-all
                :check-strictly="true"
                @check-change="handleCheckChange"
            >
                <template #default="{ node, data }">
                    <div class="tree-node-content">
                        <div>{{ node.label }}</div>
                        <el-checkbox-group v-if="data.children.length === 0" v-model="data.authAction">
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
                <OperationButton type="취소" @click="onCancel" />
                <OperationButton type="저장" @click="submitForm(ruleFormRef)" />
            </OperationBox>
        </template>
    </PageBody>
</template>
<script lang="ts" setup>
import { OperationBox, OperationButton } from '@/components'
import { Service } from './model_service/Service.ts'
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useGlobalDialog, Notification } from '@/common/dialog/ComDialog.ts'
import { useNavStore } from '@/stores/NavStore.ts'
import { useLangStore } from '@/stores/LangStore.ts'
import type { Item } from './model_service/Type.ts'

// 다국어 설정
const L = useLangStore().lang.systemAuthority

const obj = reactive(new Service())
const pageTitle = ref('') // 페이지 명
const pageDescription = ref('') // 페이지 설명
const ruleFormRef: any = ref(null)
const isEdit = ref(false)
const originRolename = ref('')
const ruleForm = ref<Item>(obj.item)
const navData: any = ref(null)
const defaultProps = {
    children: 'children',
    label: 'title',
}
const treeRef: any = ref(null)

const validateRoleName = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error(L.권한명을입력해주세요))
    } else if (isDuplicateRoleName.value === true) {
        isDuplicateRoleName.value = false
        isCheckedRoleName.value = false
        callback(new Error(L.이미사용중인권한명입니다중복되지않는권한명을입력해주세요))
    } else {
        callback()
    }
}
// const validateRoleCode = (rule: any, value: any, callback: any) => {
//     if (value === '') {
//         callback(new Error(L.권한코드를입력해주세요))
//     } else if (isDuplicateRoleCode.value === true) {
//         isDuplicateRoleCode.value = false
//         isCheckedRoleCode.value = false
//         callback(new Error(L.이미사용중인코드입니다중복되지않는코드를입력해주세요))
//     } else {
//         callback()
//     }
// }
// 입력 값 인증 룰
const rules = reactive<FormRules>({
    roleName: { required: true, validator: validateRoleName, trigger: ['change', 'blur'] },
    // roleName: { required: true, message: L.권한명을입력해주세요, trigger: ['change', 'blur'] },
    // roleCode: { required: true, validator: validateRoleCode, trigger: ['change', 'blur'] },
    description: { required: true, message: L.권한설명을입력해주세요, trigger: ['change', 'blur'] },
    useYn: { required: true, message: L.사용여부를선택해주세요, trigger: ['change', 'blur'] },
})

// 취소
const onCancel = () => {
    goBack()
}
// 뒤로 가기
const goBack = () => {
    useNavStore().backTo()
}
// 권한명 중복체크
const isDuplicateRoleName = ref(false)
const isCheckedRoleName = ref(false)
const checkDuplicateRoleName = async () => {
    const params = { page: 1, rowSize: 100, sortColumn:'', sortAscending:false}
    await obj.getList(params)
    isDuplicateRoleName.value = obj.list.some((item:any) => item.roleName === ruleForm.value.roleName)
    if (isDuplicateRoleName.value) {
        Notification.warning(L.이미사용중인권한명입니다중복되지않는권한명을입력해주세요)
        ruleFormRef.value?.validateField('roleName')
    } else {
        Notification.success(L.사용가능한권한명입니다)
        isCheckedRoleName.value = true
    }
}
const onChangeRoleName = () => {
    isCheckedRoleName.value = false
}
// 권한코드 중복체크
// const isDuplicateRoleCode = ref(false)
// const isCheckedRoleCode = ref(false)
// const checkDuplicateRoleCode = async () => {
//     await obj.getList({ page: 1, rowSize: 100, sortColumn:'', sortAscending:false})
//     isDuplicateRoleCode.value = obj.list.some((item:any) => item.roleCode === ruleForm.value.roleCode)
//     if (isDuplicateRoleCode.value) {
//         Notification.error(L.이미사용중인코드입니다중복되지않는코드를입력해주세요)
//         ruleFormRef.value?.validateField('roleCode')
//     } else {
//         Notification.success(L.사용가능한코드입니다)
//         isCheckedRoleCode.value = true
//     }
// }
// const onChangeRoleCode = () => {
//     isCheckedRoleCode.value = false
// }
// 저장
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(valid => {
        if (valid) {
            if (navData.value) {
                updateSubmit()
            } else {
                createSubmit()
            }
        }
    })
}
// 등록 저장
const createSubmit = () => {
    // 권한명 중복 확이 유무
    if (!isCheckedRoleName.value) {
        Notification.warning(L.권한명중복확인해주세요)
        return
    }
    // // 권한코드 중복 확이 유무
    // if (!isCheckedRoleCode.value) {
    //     Notification.warning(L.권한코드중복확인해주세요)
    //     return
    // }

    useGlobalDialog(L.등록하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            const {  roleName, description, useYn } = ruleForm.value
            const params = {  roleName, description, useYn }
            obj.create(params)
                .then(res => {
                    updateAuthMenu(res.data.managerGroupId)
                    goBack()
                })
                .catch((err: any) => {
                    Notification.error(err)
                })
        })
        .onCancel(() => {})
}
// 수정 저장
const updateSubmit = () => {
    // 권한명 중복 확이 유무
    if (originRolename.value !== ruleForm.value.roleName && !isCheckedRoleName.value ) {
        Notification.warning(L.권한명중복확인해주세요)
        return
    }
    useGlobalDialog(L.수정하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            const { id, roleName, description, useYn } = ruleForm.value
            const params = { id, roleName, description, useYn }
            obj.update(params)
                .then((res: any) => {
                    updateAuthMenu(ruleForm.value.id)
                })
                .catch((err: any) => {
                    Notification.error(err)
                })
        })
        .onCancel(() => {})
}
// 권한메뉴 등록 수정
const updateAuthMenu = async (managerGroupId: number) => {
    const params = {
        managerGroupId: managerGroupId,
        roleList: setUpdateMenuParams(obj.menuList),
    }
    obj.updateAuthMenu(params)
        .then(res => {
            Notification.success(L.저장성공)
            goBack()
        })
        .catch((err: any) => {
            Notification.error(err)
        })

    //  등록/ 수정 메뉴 params 설정
    function setUpdateMenuParams(menuList: any[]) {
        const menuParam: any = []
        setMuneParam(menuList)
        function setMuneParam(menuData: any[]) {
            menuData.forEach((items: any) => {
                menuParam.push({
                    menuId: items.id,
                    authAction: items.authAction.join(','),
                    useYn: items.useYn,
                })
                setMuneParam(items.children)
            })
        }
        return menuParam
    }
}

const handleCheckChange = (node: any, useYn: boolean) => {
    if (useYn) {
        node.useYn = 'Y'
    } else {
        node.useYn = 'N'
        node.authAction = []
    }
}

onMounted(() => {
    navData.value = useNavStore().getNavData()
    if (navData.value) {
        isEdit.value = true
        pageTitle.value = L.운영자권한수정
        pageDescription.value = L.운영자의권한정보를수정할수있습니다
        originRolename.value = navData.value.roleName
        ruleForm.value = navData.value
        obj.getMenuList({ roleCode: navData.value.roleCode })
    } else {
        isEdit.value = false
        pageTitle.value = L.운영자권한등록
        pageDescription.value = L.운영자의권한정보를등록할수있습니다
        obj.getMenuList({ roleCode: 'NOAUTH' })
    }
})
</script>
<style lang="scss" scoped>
.menu-contents {
    display: flex;
    border: 1px solid #dddddd;
    padding: 12px;
    border-radius: 4px;
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
</style>
