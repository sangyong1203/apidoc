<template>
    <PageHeader :title="L.업데이트작업관리" :description="L.제품의펌웨어설치과정을관리및모니터링할수있습니다"></PageHeader>
    <PageBody>
        <SearchBox :on-search="getList" >
            <DropdownTreeList
                :label="L.카테고리"
                label-width="80px"
                v-model="searchParams.categoryId"
                :placeholder="L.카테고리선택"
                :list="obj.categoryList??[]"
                option-label="categoryName"
                option-value="id"
                @on-change="getModelCodeList"
            />
            <DropdownList
                :label="L.모델"
                v-model="searchParams.modelId"
                :placeholder="L.모델선택"
                :list="obj.modelList??[]"
                option-label="modelName"
                option-value="id"
            />
            <DropdownList 
                width="300px"
                :label="L.업데이트상태" 
                v-model="searchParams.status" 
                :placeholder="L.업데이트상태선택" 
                :list="statusList"
                option-label="label" 
                option-value="value" 
            />
        </SearchBox>
        <OperationBox :total="obj.totalRow" bottom-line>
            <!-- <el-button type="primary" @click="toRegister">{{ L.업데이트Job생성하기 }}</el-button> -->
            <OperationButton type="기타" :auth="useNavStore().getAuthAction()" button-type="primary" :label="L.업데이트Job생성하기" @click="toRegister" />
            <OperationButton type="삭제" :auth="useNavStore().getAuthAction()" @click="toDelete" />

        </OperationBox>
        <el-table ref="tableRef" :data="obj.list" height="100%" @selection-change="getCheckedRows" @sort-change="handleSortChange" border class-name="no-border" >
            <el-table-column type="selection" width="40"/>
            <el-table-column label="NO" type="index" :index="ComUtil.indexMethod(searchParams.rowSize, searchParams.page)" width="80"/>
            <el-table-column prop="jobId" :label="L.JobID" show-overflow-tooltip/>
            <el-table-column prop="categoryName" :label="L.카테고리" />
            <el-table-column prop="modelName" :label="L.모델" />
            <el-table-column prop="version" :label="L.업데이트버전" width="150px"/>
            <el-table-column prop="type" :label="L.유형" />
            <el-table-column prop="status" :label="L.상태" width="95px">
                <template #default="scope">
                    <el-tag effect="light" style="width: 70px;" :type="statusType[scope.row.status ]">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="L.업데이트대상" width="150px">
                <template #default="scope">
                    <el-button @click="openDeviceListDialog(scope.row)">{{L.목록보기}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" :label="L.시작일자" width="180" sortable>
                <template #default="scope">
                    {{ComUtil.dateFormat(scope.row.createDate, 'YYYY-MM-DD HH:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column prop="completedDate" :label="L.종료일자" width="180" sortable>
                <template #default="scope">
                    {{ComUtil.dateFormat(scope.row.completedDate, 'YYYY-MM-DD HH:mm:ss')}}
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :totalRow="obj.totalRow"
            :page="searchParams.page"
            :rowSize="searchParams.rowSize"
            @current-change="handleCurrentPage"
            @size-change="handleSizeChange"
        />
    </PageBody>
    <EditDialog ref="editDialogRef" @refresh="refresh"></EditDialog>
    <DeviceListDialog ref="deviceListDialogRef"></DeviceListDialog>

</template>
<script lang="ts" setup>
import {
    SearchBox,
    Pagination,
    DropdownList,
    OperationBox,
    PageHeader,
    PageBody,
} from '@/components'
import { Service } from './model_service/Service'
import { reactive, onActivated, ref } from 'vue'
import EditDialog from './EditDialog.vue'
import DeviceListDialog from './DeviceListDialog.vue'
import { Notification, useGlobalDialog } from '@/common/dialog/ComDialog'
import ComUtil from '@/common/utils/ComUtil'
import { useNavStore } from '@/stores/NavStore'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.fotaJob

const obj = reactive(new Service())
const editDialogRef: any = ref(null)
const deviceListDialogRef: any = ref(null)
const selectedRows: any = ref([]) // 선택한 행
const tableRef:any =ref(null)
const searchParams = reactive({
    searchValue: '',
    searchKey: '',
    page: 1,
    rowSize: 15,
    sortColumn: '',
    sortAscending: false,
    status: '',
    categoryId: null,
    modelId: null
})

const statusList: any = ref([
    // { label: L.전체, value: '' },
    { label: L.대기, value: '대기' },
    { label: L.실행중, value: '실행중' },
    { label: L.성공, value: '성공' },
    { label: L.실패, value: '실패' },
])
// 상태 tag
const statusType:any  = {
    '실행중': 'warning',
    '대기' : 'info',
    '성공' : 'success',
    '실패': 'danger',
    '-' : 'info',
}
// 페이지 render후 데이터 호출
onActivated(async () => {
    await getList()
    obj.getCategoryList()
})
// 테이블 데이터 호출
const getList = async () => {
    const params = {
        page: searchParams.page,
        rowSize: searchParams.rowSize,
        searchKey: searchParams.searchKey,
        searchValue: searchParams.searchValue,
        sortColumn: searchParams.sortColumn,
        sortAscending: searchParams.sortAscending,
        categoryId: searchParams.categoryId,
        modelId: searchParams.modelId,
        status: searchParams.status
    }
    await obj.getList(params)
}
// 페이지 선택시 해당 페이지 데이터호출
const handleCurrentPage = (value: number) => {
    searchParams.page = value
    getList()
}
// pagination row size 선택시 해당 데이터호출
const handleSizeChange = (value: number) => {
    searchParams.rowSize = value
    getList()
}
// sorting
const handleSortChange = (data: any) => {
    searchParams.sortColumn = data.prop
    searchParams.sortAscending = data.order === 'ascending' ? true : false
    getList()
}
// 실행중인 job은 선택 불가 
const selectable = (row:any) => {
    return row.status !== '실행중'
}
// 등록 다이어로그 열기
const toRegister = () => {
    editDialogRef.value?.openDialog()
}

const toDelete = () => {
    if (selectedRows.value.length === 0) {
        Notification.warning(L.삭제할항목을선택해주세요)
        return
    }
    useGlobalDialog(L.삭제하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.delete({ jobId: selectedRows.value[0].jobId }).then(res => {
                getList()
                Notification.success(L.삭제성공)
            })
        })
        .onCancel(() => {})
}
// 페이지 데이터 갱신
const refresh = async () => {
    getList()
}

// 체크한 행 값 받아오기
const getCheckedRows = (val:any[]) => {
    // selectedRows.value = values.map( item => item.jobId)
    selectedRows.value = ComUtil.getTableSelection(tableRef, val)

}
const openDeviceListDialog = (row:any) => {
    deviceListDialogRef.value!.openDialog(row.jobId)
}

// 모델 dropdown list 데이터 불러오기
const getModelCodeList = async (value: any) => {
    obj.modelList = []
    searchParams.modelId = null
    if(!value) return
    await obj.getModelList({categoryId:value})
}


</script>
<style lang="scss" scoped>
</style>
