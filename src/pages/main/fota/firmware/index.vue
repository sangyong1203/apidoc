<template>
    <PageHeader :title="L.업데이트등록" :description="L.제품의펌웨어업데이트를위한등록과정진행과등록이력을조회할수있습니다"></PageHeader>
    <PageBody>
        <SearchBox :on-search="getList" >
            <SearchText :label="L.검색" v-model="searchParams.searchValue">
                <DropdownList
                    width="140px"
                    v-model="searchParams.searchKey"
                    :placeholder="L.구분선택"
                    :list="searchTypes"
                    option-label="label"
                    option-value="searchKey"
                />
            </SearchText>
        </SearchBox>
        <OperationBox :total="obj.totalRow" bottom-line>
            <el-button type="primary" @click="toRegister">{{ L.업데이트등록하기 }}</el-button>
        </OperationBox>
        <el-table :data="obj.list"  border class-name="no-border" @sort-change="handleSortChange">
            <el-table-column label="NO" type="index" :index="ComUtil.indexMethod(searchParams.rowSize, searchParams.page)" width="80"/>
            <el-table-column prop="categoryName" :label="L.카테고리" width="200"/>
            <el-table-column prop="modelName" :label="L.모델명" width="220" />
            <el-table-column prop="version" :label="L.버전" width="200" />
            <el-table-column prop="note" :label="L.설명" show-overflow-tooltip className="align-left"/>
            <el-table-column prop="createDate" :label="L.등록일자" width="260" sortable>
                <template #default="scope">
                    {{ComUtil.dateFormat(scope.row.createDate, 'YYYY-MM-DD HH:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column :label="L.설정" width="180px">
                <template #default="scope">
                    <el-button @click="openSettingInfo(scope.row)">{{L.설정보기}}</el-button>
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
    <SettingInfoDialog ref="settingInfoDialogRef" @refresh="refresh"></SettingInfoDialog>

</template>
<script lang="ts" setup>
import {
    SearchBox,
    Pagination,
    SearchText,
    DropdownList,
    OperationBox,
    PageHeader,
    PageBody,
} from '@/components'
import { Service } from './model_service/Service'
import { reactive, onActivated, ref } from 'vue'
import EditDialog from './EditDialog.vue'
import SettingInfoDialog from './SettingInfoDialog.vue'
import ComUtil from '@/common/utils/ComUtil'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.fotaFirmware

const obj = reactive(new Service())
const editDialogRef: any = ref(null)
const settingInfoDialogRef :any = ref(null)

const searchParams = reactive({
    searchValue: '',
    searchKey: '',
    page: 1,
    rowSize: 15,
    sortColumn: '',
    sortAscending: false,
    statusCode: '',
})
//검색 구분 선택 리스트
const searchTypes: any = ref([
    // { label: L.전체, searchKey: '' },
    { label: L.카테고리, searchKey: 'categoryName' },
    { label: L.모델, searchKey: 'modelName' },
    { label: L.버전, searchKey: 'version' },
])

// 페이지 render후 데이터 호출
onActivated(async () => {
    await getList()
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
const openSettingInfo = (value:any) => {
    settingInfoDialogRef.value.openDialog(value.setting)
}
// 등록 다이어로그 열기
const toRegister = () => {
    editDialogRef.value?.openDialog('등록')
}
// 페이지 데이터 갱신
const refresh = async () => {
    getList()
}

</script>
