<template>
    <PageHeader
        :title="L.운영자접근관리"
        :description="L.운영자계정을영구정지일시정지정지해제를통해사용자를관리할수있습니다"
    ></PageHeader>
    <PageBody>
        <SearchBox :on-search="getList" extra>
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
                    :label="L.사이트"
                    v-model="searchParams.companyId"
                    :placeholder="L.사이트선택"
                    :list="obj.siteList"
                    option-label="companyName"
                    option-value="id"
                />
                <DropdownList
                    :label="L.상태"
                    v-model="searchParams.statusCode"
                    :placeholder="L.상태선택"
                    :list="obj.userStatusList"
                    option-label="name"
                    option-value="code"
                />
                <DropdownList
                    :label="L.일시정지구분"
                    v-model="searchParams.pauseStatusCode"
                    :placeholder="L.구분선택"
                    :list="obj.tempPauseList"
                    option-label="name"
                    option-value="code"
                />
            </template>
        </SearchBox>
        <OperationBox :total="obj.totalRow" bottom-line>
            <OperationButton type="해제" @click="toRelease" />
            <OperationButton type="일시정지" @click="toPause" />
            <OperationButton type="영구정지" @click="toTerminate" />
        </OperationBox>
        <GridTable
            ref="gridRef"
            :columns="columns"
            :row-size="searchParams.rowSize"
            :current-page="searchParams.page"
            :total-count="obj.totalRow"
            :row-headers="['checkbox']"
            @sort-change="handleSortChange"
            @on-check="getCheckedRows"
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
    GridTable,
} from '@/components'
import { Service } from './model_service/Service'
import { ref, reactive, onActivated } from 'vue'
import { Notification, useGlobalDialog } from '@/common/dialog/ComDialog'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정
const L = useLangStore().lang.systemManagerAccess

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
    pauseStatusCode: '',
    companyId:0
})
const selectedRows = ref<number[]>([])

//검색 구분 선택 리스트
const searchTypes: any = ref([
    // { label: L.전체, searchKey: '' },
    { label: L.아이디, searchKey: 'loginId' },
    { label: L.이름, searchKey: 'name' },
])
//기간 구분 선택 리스트
const dateTypes: any = ref([
    { label: L.등록일, dateKey: 'createDate' },
    { label: L.수정일, dateKey: 'updateDate' },
])
// 테이블 컬럼 설정값
const columns: any[] = [
    {
        header: 'NO',
        name: 'indexNum',
        align: 'center',
        width: 80,
    },

    {
        header: L.아이디,
        name: 'loginId',
        align: 'center',
    },
    {
        header: L.이름,
        name: 'name',
        align: 'center',
    },
    {
        header: L.전화번호,
        name: 'phone',
        align: 'center',
    },
    {
        header: L.이메일,
        name: 'email',
        align: 'center',
    },
    {
        header: L.상태,
        name: 'statusName',
        align: 'center',
    },
    {
        header: L.일시정지구분,
        name: 'pauseStatusName',
        align: 'center',
    },
    {
        header: L.정지일시,
        name: 'createDate',
        align: 'center',
        sortable: true,
    },
    {
        header: L.최종로그인일시,
        name: 'updateDate',
        align: 'center',
        sortable: true,
    },
]

// 페이지 render후 데이터 호출
const gridRef: any = ref(null)
onActivated(async () => {
    await getList()
    obj.getSiteList()
    obj.getTempPauseList()
    obj.getUserStatusList()
})
// 테이블 데이터 호출
const getList = async () => {
    await obj.getList(searchParams)
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

// 일시정지 해제
const toRelease = () => {
    useGlobalDialog(L.일시정지상태를해제하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.release({ ids: selectedRows.value }).then((res: any) => {
                Notification.success(L.일시정지상태를해제하였습니다)
                getList()
            })
        })
        .onCancel(() => {})
}
// 일시정지
const toPause = () => {
    useGlobalDialog(L.일시정지상태로변경하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.pause({ ids: selectedRows.value }).then((res: any) => {
                Notification.success(L.일시정지상태로변경되였습니다)
                getList()
            })
        })
        .onCancel(() => {})
}
// 영구정지
const toTerminate = () => {
    useGlobalDialog(L.영구정지상태로변경하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.terminate({ ids: selectedRows.value }).then((res: any) => {
                Notification.success(L.영구정지상태로변경되였습니다)
                getList()
            })
        })
        .onCancel(() => {})
}
// 체크한 행 값 받아오기
const getCheckedRows = (values: any[]) => {
    selectedRows.value = values.map(item => item.id)
}
</script>
