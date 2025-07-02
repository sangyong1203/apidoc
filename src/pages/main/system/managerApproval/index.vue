<template>
    <PageHeader
        :title="L.운영자계정신청관리"
        :description="L.운영자계정신청목록을조회하고승인할수있습니다"
    ></PageHeader>
    <PageBody>
        <OperationBox :total="obj.totalRow" bottom-line>
            <OperationButton type="반려" @click="toReject" />
            <OperationButton type="승인" @click="toAccept" />
        </OperationBox>
        <el-table
            :data="obj.list"
            height="100%"
            border
            class-name="no-border"
            multiple
            @selection-change="getCheckedRows"
            @sort-change="handleSortChange"
        >
            <el-table-column type="selection" width="40" />
            <el-table-column
                label="NO"
                type="index"
                :index="ComUtil.indexMethod(searchParams.rowSize, searchParams.page)"
                width="80"
            />
            <el-table-column prop="loginId" :label="L.아이디" />
            <el-table-column prop="name" :label="L.이름" width="100"/>
            <el-table-column prop="phone" :label="L.전화번호" />
            <el-table-column prop="email" :label="L.이메일" width="240" show-overflow-tooltip/>
            <el-table-column prop="companyName" :label="L.사이트" width="230">
                <template #default="scope">
                    <DropdownList
                        style="width: 100%"
                        v-model="scope.row.companyId"
                        :placeholder="L.사이트를선택해주세요"
                        :list="obj.siteList"
                        option-label="companyName"
                        option-value="id"
                        @click.stop
                    />
                </template>
            </el-table-column>
            <el-table-column prop="roleCode" :label="L.요청권한" width="230">
                <template #default="scope">
                    <DropdownList
                        style="width: 100%"
                        v-model="scope.row.roleCode"
                        :placeholder="L.권한을선택해주세요"
                        :list="obj.roleList"
                        option-label="roleName"
                        option-value="roleCode"
                        @click.stop
                    />
                </template>
            </el-table-column>
            <el-table-column prop="createDate" :label="L.신청일시" width="180" sortable>
                <template #default="scope">
                    {{ ComUtil.dateFormat(scope.row.createDate, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="pendingName" :label="L.승인상태" width="140px" />
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
import { Service } from './model_service/Service'
import { ref, reactive, onActivated } from 'vue'
import { Notification, useGlobalDialog, Message } from '@/common/dialog/ComDialog'
import { useLangStore } from '@/stores/LangStore'
import ComUtil from '@/common/utils/ComUtil'

// 다국어 설정
const L = useLangStore().lang.systemManagerApproval

const obj = reactive(new Service())
const searchParams = reactive({
    page: 1,
    rowSize: 15,
    sortColumn: '',
    sortAscending: false,
})
const selectedRows = ref<any[]>([])

// 페이지 render후 데이터 호출
const gridRef: any = ref(null)
onActivated(async () => {
    await obj.getRoleList()
    await obj.getSiteList()
    await getList()
})
// 테이블 데이터 호출
const getList = async () => {
    const params = {
        page: searchParams.page,
        rowSize: searchParams.rowSize,
        sortColumn: searchParams.sortColumn,
        sortAscending: searchParams.sortAscending,
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
// 승인 하기
const toAccept = () => {

    if(selectedRows.value.length === 0)return
    let isEmpty = false
    const params = selectedRows.value.map(item => {
        if (!item.companyId || !item.roleCode) isEmpty = true
        return {
            id: item.id,
            companyId: item.companyId,
            roleCode: item.roleCode,
            approvalYn: 'Y',
        }
    })
    if (isEmpty) {
        Message.warning(L.사이트권한을선택해주세요)
        return
    }
    if (isEmpty) return

    useGlobalDialog(L.승인하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.accept({ managers: params }).then((res: any) => {
                Notification.success(L.승인완료하였습니다)
                getList()
            })
        })
        .onCancel(() => {})
}
// 반려 하기
const toReject = () => {
    
    if(selectedRows.value.length === 0)return
    let isEmpty = false
    const params = selectedRows.value.map(item => {
        if (!item.companyId || !item.roleCode) isEmpty = true
        return {
            id: item.id,
            companyId: item.companyId,
            roleCode: item.roleCode,
            approvalYn: 'N',
        }
    })
    if (isEmpty) {
        Message.warning(L.사이트권한을선택해주세요)
        return
    }
    useGlobalDialog(L.반려하시겠습니까, L.확인, 'YN')
        .onConfirm(() => {
            obj.reject({ managers: params }).then((res: any) => {
                Notification.success(L.반려하였습니다)
                getList()
            })
        })
        .onCancel(() => {})
}

// 체크한 행 값 받아오기
const getCheckedRows = (values: any[]) => {
    selectedRows.value = values
}
</script>
