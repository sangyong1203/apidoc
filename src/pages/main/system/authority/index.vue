<template>
    <PageHeader :title="L.운영권한관리" :description="L.운영권한을관리할수있습니다"></PageHeader>
    <PageBody>
        <OperationBox :total="obj.totalRow" bottom-line>
            <OperationButton type="등록" :auth="navStore.getAuthAction()" @click="toRegisterPage" />
        </OperationBox>
        <GridTable
            ref="gridRef"
            :columns="columns"
            :row-size="searchParams.rowSize"
            :current-page="searchParams.page"
            :total-count="obj.totalRow"
            @row-click="toDetailPage"
            @sort-change="handleSortChange"
        />
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
import { GridTable, Pagination, OperationBox, OperationButton, PageHeader, PageBody } from '@/components'
import { Service } from './model_service/Service'
import { useNavStore } from '@/stores/NavStore'
import { ref, reactive, onActivated } from 'vue'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정
const L = useLangStore().lang.systemAuthority

const navStore = useNavStore()
const obj = reactive(new Service())
const searchParams = reactive({
    page: 1,
    rowSize: 15,
    sortColumn:'',
    sortAscending: false
})

// 테이블 컬럼 설정값
const columns: any[] = [
    {
        header: 'NO',
        name: 'indexNum',
        align: 'center',
        width: 80,
    },
    {
        header: L.권한명,
        name: 'roleName',
        align: 'center',
    },
    // {
    //     header: L.권한코드,
    //     name: 'roleCode',
    //     align: 'center',
    // },
    {
        header: L.권한설명,
        name: 'description',
        align: 'center',
    },
    {
        header: L.사용여부,
        name: 'useYn',
        align: 'center',
        formatter: 'listItemText',
        editor: {
            type: 'select',
            options: {
                listItems: [
                    { text: L.사용, value: 'Y' },
                    { text: L.미사용, value: 'N' },
                ],
            },
        },
    },
    {
        header: L.등록일자,
        name: 'createDate',
        align: 'center',
        sortable: true,
    },
    {
        header: L.수정일자,
        name: 'updateDate',
        align: 'center',
        sortable: true,
    },
]

// 페이지 render후 데이터 호출
const gridRef: any = ref(null)
onActivated(async () => {
    await getList()
    gridRef.value?.setTableData(obj.list)
})

// 테이블 데이터 호출
const getList = async () => {
    await obj.getList(searchParams)
    gridRef.value?.setTableData(obj.list)
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
const handleSortChange = (data: any) => {
    searchParams.sortColumn = data.columnName
    searchParams.sortAscending = !searchParams.sortAscending
    getList()
}
// 등록 페이지 이동
const toRegisterPage = () => {
    navStore.navTo(L.운영자권한등록, '/system/authority/edit')
}
// 상세 페이지 이동
const toDetailPage = (row: any) => {
    navStore.navTo(L.운영자권한상세, '/system/authority/detail', row)
}
</script>
