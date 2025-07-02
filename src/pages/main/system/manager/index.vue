<template>
    <PageHeader :title="L.운영자관리" :description="L.운영자의정보를관리할수있습니다"></PageHeader>
    <PageBody>
        <SearchBox :on-search="getList" extra>
            <DropdownList
                :label="L.사이트"
                v-model="searchParams.companyId"
                :placeholder="L.사이트선택"
                :list="obj.siteList"
                option-label="companyName"
                option-value="id"
            />
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
            <DoubleDatePicker
                :label="L.기간"
                v-model:start-date="searchParams.startDate"
                v-model:end-date="searchParams.endDate"
            >
                <DropdownList
                    width="140px"
                    v-model="searchParams.dateKey"
                    :placeholder="L.구분선택"
                    :list="dateTypes"
                    option-label="label"
                    option-value="dateKey"
                />
            </DoubleDatePicker>
            <template #extra>
                <DropdownList
                    :label="L.상태"
                    v-model="searchParams.statusCode"
                    :placeholder="L.상태선택"
                    :list="statusCodeTypes"
                    option-label="label"
                    option-value="statusCode"
                />
            </template>
        </SearchBox>
        <OperationBox :total="obj.totalRow" bottom-line>
            <OperationButton type="등록" :auth="navStore.getAuthAction()" @click="toRegisterPage" />
        </OperationBox>
        <el-table
            ref="tableRef"
            size="large"
            border
            class-name="no-border"
            :data="obj.list"
            @row-click="toDetailPage"
            @sort-change="handleSortChange"
        >
            <el-table-column type="index" label="NO" width="80px" :index="ComUtil.indexMethod(searchParams.rowSize, searchParams.page)"/>
            <el-table-column prop="loginId" :label="L.아이디" />
            <el-table-column prop="name" :label="L.이름" width="100" />
            <el-table-column prop="phone" :label="L.전화번호" />
            <el-table-column prop="email" :label="L.이메일" show-overflow-tooltip />
            <el-table-column prop="roleName" :label="L.운영권한" />
            <el-table-column prop="statusName" :label="L.상태" width="80" />
            <el-table-column prop="createDate" :label="L.등록일" sortable>
                <template #default="{ row }">
                    {{ ComUtil.dateFormat(row.createDate, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="updateDate" :label="L.수정일">
                <template #default="{ row }">
                    {{ ComUtil.dateFormat(row.updateDate, 'YYYY-MM-DD HH:mm:ss') }}
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
</template>
<script lang="ts" setup>
import {
    SearchBox,
    Pagination,
    DoubleDatePicker,
    SearchText,
    DropdownList,
    OperationBox,
    OperationButton,
    PageHeader,
    PageBody,
} from '@/components'
import { Service } from './model_service/Service'
import { useNavStore } from '@/stores/NavStore'
import { ref, reactive, onActivated } from 'vue'
import { useLangStore } from '@/stores/LangStore'
import ComUtil from '@/common/utils/ComUtil'

// 다국어 설정
const L = useLangStore().lang.systemManager

const navStore = useNavStore()
const obj = reactive(new Service())
const searchParams = reactive({
    searchValue: '',
    dateKey: '',
    searchKey: '',
    startDate: '',
    endDate: '',
    page: 1,
    rowSize: 15,
    sortColumn: '',
    sortAscending: false,
    statusCode: '',
    companyId: 0,
})
//검색 구분 선택 리스트
const searchTypes: any = ref([
    { label: L.아이디, searchKey: 'loginId' },
    { label: L.이름, searchKey: 'name' },
])
//기간 구분 선택 리스트
const dateTypes: any = ref([
    { label: L.등록일, dateKey: 'createDate' },
    { label: L.수정일, dateKey: 'updateDate' },
])
const statusCodeTypes: any = ref([
    { label: L.정상, statusCode: 'MSTS0001' },
    { label: L.일시정지, statusCode: 'MSTS0002' },
    { label: L.영구정지, statusCode: 'MSTS0003' },
])

// 페이지 render후 데이터 호출
const gridRef: any = ref(null)
onActivated(async () => {
    await getList()
    obj.getSiteList()
})
// 테이블 데이터 호출
const getList = async () => {
    const params = {
        page: searchParams.page,
        rowSize: searchParams.rowSize,
        searchKey: searchParams.searchKey,
        searchValue: searchParams.searchValue,
        dateKey: searchParams.dateKey,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        sortColumn: searchParams.sortColumn,
        sortAscending: searchParams.sortAscending,
        statusCode: searchParams.statusCode,
        companyId: searchParams.companyId,
    }
    await obj.getList(params)
    gridRef.value?.setTableData(obj.list)
}
const handleSortChange = (data: any) => {
    searchParams.sortColumn = data.columnName
    searchParams.sortAscending = !searchParams.sortAscending
    getList()
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
const toRegisterPage = () => {
    navStore.navTo(L.운영자등록, '/system/manager/edit')
}
// 상세 페이지 이동
const toDetailPage = (row: any) => {
    navStore.navTo(L.운영자상세정보, '/system/manager/detail', row)
}
</script>
