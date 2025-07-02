<template>
    <PageHeader title="메뉴 관리" description="메뉴를 관리할 수 있습니다."></PageHeader>
    <PageBody flex-direction="row" gap="20px">
        <section>
            <OperationBox title="메뉴" bottom-line>
                <OperationButton
                    type="등록"
                    :disabled="state.selectTree.id == null"
                    :auth="useNavStore().getAuthAction()"
                    @click="openDialog()"
                />
                <OperationButton type="기타" label="다국어" @click="openLocalizationDialog" />
            </OperationBox>
            <el-tree
                ref="tree"
                node-key="id"
                :data="obj.list"
                :props="state.defaultProps"
                :expand-on-click-node="true"
                default-expand-all
                highlight-current
                @node-click="handleNodeClick"
            />
        </section>
        <section style="height: 100%; width: 50%; border: 1px solid var(--border-color)">
            <OperationBox title="상세 정보" bottom-line>
                <OperationButton
                    v-if="!isEdit"
                    type="수정"
                    :disabled="state.selectTree.id == null"
                    :auth="useNavStore().getAuthAction()"
                    @click="isEdit = true"
                />
                <OperationButton
                    type="저장"
                    v-if="isEdit"
                    :auth="useNavStore().getAuthAction()"
                    @click="updateMenu()"
                />
                <OperationButton
                    type="삭제"
                    :auth="useNavStore().getAuthAction()"
                    @click="deleteMenu()"
                />
            </OperationBox>
            <el-form ref="editFormRef" :rules="state.rules" :model="state.selectTree" require-asterisk-position="right" label-width="120px">
                <el-form-item label="메뉴" prop="title">
                    <el-input v-model="state.selectTree.title" :disabled="!isEdit"></el-input>
                </el-form-item>
                <el-form-item label="영문메뉴" prop="titleEn">
                    <el-input v-model="state.selectTree.titleEn" :disabled="!isEdit"></el-input>
                </el-form-item>
                <el-form-item label="경로">
                    <el-input v-model="state.selectTree.path" :disabled="!isEdit"></el-input>
                </el-form-item>
                <el-form-item label="순서">
                    <el-input-number
                        v-model="state.selectTree.stp"
                        :min="1"
                        :max="99"
                        controls-position="right"
                        :disabled="!isEdit"
                    />
                </el-form-item>
                <el-form-item label="아이콘">
                    <el-input v-model="state.selectTree.icon" :disabled="!isEdit"></el-input>
                </el-form-item>
                <el-form-item label="사용여부">
                    <el-radio-group v-model="state.selectTree.useYn">
                        <el-radio value="Y" :disabled="!isEdit">Yes</el-radio>
                        <el-radio value="N" :disabled="!isEdit">No</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </section>

        <!-- ------------------ 등록 다이얼로그--------------- -->
        <el-dialog v-model="state.dialogVisible" title="메뉴등록" width="500px">
            <el-form
                ref="regForm"
                :rules="state.rules"
                :model="state.dialogSelectTree"
                label-position="left"
                label-width="80px"
            >
                <el-form-item label="메뉴" prop="title">
                    <el-input v-model="state.dialogSelectTree.title" show-word-limit maxlength="20" />
                </el-form-item>
                <el-form-item label="영문메뉴" prop="titleEn">
                    <el-input v-model="state.dialogSelectTree.titleEn" show-word-limit maxlength="20" />
                </el-form-item>
                <el-form-item label="경로">
                    <el-input v-model="state.dialogSelectTree.path" show-word-limit maxlength="50" />
                </el-form-item>
                <el-form-item label="순서" prop="stp">
                    <el-input v-model.number="state.dialogSelectTree.stp" show-word-limit maxlength="3" />
                </el-form-item>
                <el-form-item label="아이콘">
                    <el-input v-model="state.dialogSelectTree.icon" show-word-limit maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="사용여부">
                    <el-radio-group v-model="state.dialogSelectTree.useYn">
                        <el-radio value="Y">Yes</el-radio>
                        <el-radio value="N">No</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="state.dialogVisible = false" class="POST">취소</el-button>
                    <el-button type="primary" @click="createMenu()" class="POST">확인</el-button>
                </span>
            </template>
        </el-dialog>
    </PageBody>
    <LocalizationDialog ref="localizationDialogRef"></LocalizationDialog>
</template>

<script setup>
import { PageBody, PageHeader } from '@/components'
import { useNavStore } from '@/stores/NavStore'
import { ElMessage as message, ElMessageBox as messageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import LocalizationDialog from './LocalizationDialog.vue'
import { Service } from './model_service/Service'

const obj = reactive(new Service())
const tree = ref(null)
const regForm = ref(null)
const editFormRef = ref(null)
const isEdit = ref(false)
const state = reactive({
    rules: {
        title: [{ required: true, message: '메뉴명을 입력해 주세요', trigger: 'blur' }],
        expsrSeq: [{ type: 'number', message: '숫자만 입력해 주세요' }],
    },
    selectTree: {},
    defaultProps: {
        children: 'children',
        label: 'title',
    },
    dialogVisible: false,
    dialogSelectTree: {},
})

onMounted(async () => {
    await obj.getMenuList()
})

const handleNodeClick = data => {
    data.useYn = data.useYn || 'N'
    state.selectTree = data
}
// 메뉴 등록
const createMenu = () => {
    const currentNode = tree.value.getCurrentNode()
    if (currentNode != null) {
        let treeObj = {
            id: currentNode.id || '',
            lev: currentNode.lev || 0,
            ...state.dialogSelectTree,
        }
        regForm.value.validate(async valid => {
            if (valid) {
                treeObj.stp = treeObj.stp || 99
                obj.createMenu(treeObj).then(res => {
                        treeObj.id = res.data.id
                        treeObj.lev = res.data.lev
                        tree.value.append(treeObj, currentNode)
                        state.dialogVisible = false
                        message({ type: 'success', message: '등록되었습니다.' })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                return false
            }
        })
    }
}

// 메뉴 수정
const updateMenu = () => {
    editFormRef.value.validate(async valid => {
        if (valid) {
            const currentNode = tree.value.getCurrentNode()
            const treeObj = {
                id: currentNode.id,
                title: currentNode.title,
                titleEn: currentNode.titleEn,
                path: currentNode.path,
                icon: currentNode.icon,
                stp: currentNode.stp,
                useYn: currentNode.useYn,
            }
            if (currentNode != null) {
                obj.updateMenu(treeObj)
                    .then(res => {
                        message({ type: 'success', message: '수정되었습니다.' })
                        isEdit.value = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    })
}
// 메뉴 삭제
const deleteMenu = () => {
    if(state.selectTree.id == null){
        message({ type: 'warning', message: '삭제할 메뉴를 선택하세요.' })
        return
    }
    messageBox
        .confirm('삭제하겠습니까?', { type: 'warning', confirmButtonText: '확인', cancelButtonText: '취소' })
        .then(async () => {
            const currentNode = tree.value.getCurrentNode()
            if (currentNode != null) {
                //const { id } = currentNode.id;
                obj.deleteMenu({ id: currentNode.id })
                    .then(res => {
                        tree.value.remove(currentNode)
                        state.selectTree = {}
                        message({ type: 'success', message: '삭제되었습니다.' })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
        .catch(() => {})
}
// 메뉴 등록 창 열기
const openDialog = () => {
    state.dialogSelectTree = { useYn: 'N' }
    state.dialogVisible = true
}
// 다국어 창 열기
const localizationDialogRef = ref(null)
const openLocalizationDialog = () => {
    localizationDialogRef.value.openDialog()
}

</script>
<style lang="scss" scoped>
section {
    padding: 0 20px 20px 20px;
    height: 100%;
    width: 60%;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
:deep(.el-tree) {
    height: 100%;
    overflow: scroll;
}
:deep(.el-tree-node) {
    padding: 4px;
}
</style>
