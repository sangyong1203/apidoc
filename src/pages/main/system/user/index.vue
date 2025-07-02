<template>
    <PageHeader :title="L.사용자정보" :description="L.사용자의정보를조회할수있습니다"></PageHeader>
    <PageBody>
        <SearchBox :on-search="searchList" >
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
        </SearchBox>
        <el-divider />
        <el-table ref="tableRef" size="large" :data="tableData" @scroll="onScroll" style="margin-bottom: 20px;" @row-click="toDetailPage">
            <el-table-column type="index" label="NO" width="80px"/>
            <el-table-column prop="name" :label="L.이름"/>
            <el-table-column prop="phone_number" :label="L.전화번호"/>
            <el-table-column prop="email" :label="L.이메일"/>
            <el-table-column prop="userCreateDate" :label="L.등록일"  >
                <template #default="{ row }">
                    {{ ComUtil.dateFormat(row.userCreateDate, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="userLastModifiedDate" :label="L.수정일"  >
                <template #default="{ row }">
                    {{ ComUtil.dateFormat(row.userLastModifiedDate, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
        </el-table>
    </PageBody>
</template>
<script lang="ts" setup>
import {
    SearchBox,
    DoubleDatePicker,
    SearchText,
    DropdownList,
    PageHeader,
    PageBody,
} from '@/components'
import { Service } from './model_service/Service'
import { ref, reactive, onActivated } from 'vue'
import { useLangStore } from '@/stores/LangStore'
import ComUtil from '@/common/utils/ComUtil'
import { ElTable } from 'element-plus'
import { Message } from '@/common/dialog/ComDialog'
import { useNavStore } from '@/stores/NavStore'
import type { List } from './model_service/Type'

// 다국어 설정
const L = useLangStore().lang.systemUser

const obj = reactive(new Service())
const tableRef:any = ref(null)
const isLoading = ref(false)
const tableData= ref<List[]>([])
const navStore = useNavStore()

const searchParams = reactive({
    searchValue: '',
    dateKey: '',
    searchKey: '',
    startDate: '',
    endDate: '',
    page: 1,
    rowSize: 30,
    sortColumn: '',
    sortAscending: false,
})
//검색 구분 선택 리스트
const searchTypes: any = ref([
    // { label: L.전체, searchKey: '' },
    { label: L.이름, searchKey: 'name' },
    { label: L.전화번호, searchKey: 'phone_number' },
])
//기간 구분 선택 리스트
const dateTypes: any = ref([
    { label: L.등록일, dateKey: 'createDate' },
    { label: L.수정일, dateKey: 'updateDate' },
])

// 페이지 render후 데이터 호출
onActivated(async () => {
    await getList()
})
const searchList = async () =>{
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
        paginationToken: ''
    }
    await obj.getList(params)
    tableData.value = obj.list
    tableRef.value?.setScrollTop(0)
}

// 테이블 데이터 호출
const getList = async () => {
    if(isLoading.value) return
    if(obj.paginationToken == 'end') {
        Message.warning('No more data.')
        return
    }
    isLoading.value = true
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
        // companyId: searchParams.companyId,
        paginationToken: obj.paginationToken
    }
    await obj.getList(params)
    obj.list.forEach( (item:any) => {
        tableData.value.push(item)
    })
    setTimeout(async()=>{
        isLoading.value = false
    }, 500)
}
// scroll시 데이터  호출 
const onScroll = (props:any) => {
    const el = document.querySelector('.el-table__body-wrapper')
    const elBody = document.querySelector('.el-table__body')
    const tableHeight = el?.clientHeight
    const scrollHeight = elBody?.clientHeight
    if(tableHeight && scrollHeight && (props.scrollTop + tableHeight >= scrollHeight - 10)){
        getList()
    }
}
// 상세 페이지 이동
const toDetailPage = (row: any) => {
    navStore.navTo(L.사용자정보상세 , '/system/user/detail', row)
}
</script>
