<template>
    <BlockLayout :title="L.알람현황" id="AlarmStatus" :className="className">
        <template #header>
            <div @click="toAlarmPage" class="more">{{ L.자세히보기 }} ></div>
        </template>
        <el-table :data="obj.alarm" height="100%" size="small" @row-click="toAlarmPage">
            <el-table-column label="NO" type="index" />
            <el-table-column
                prop="modelName"
                :label="L.모델"
                :filters="modelFilter"
                :filter-method="filterHandle"
                width="160px"
            />
            <el-table-column
                prop="errorLevel"
                :label="L.알람레벨"
                :filters="alarmCodeFilter"
                :filter-method="filterHandle"
                width="120px"
            >
                <template #default="{ row }">
                    <div v-if="row.errorLevel" class="alarm-level">
                        <div :style="{ backgroundColor: errLevelColor(row.errorLevel) }"></div>
                        {{ row.errorLevel }}
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column prop="errorContent" :label="L.내용" className="align-left">
                <template #default="{ row }">
                    <div v-if="row.errorContent">
                        {{ row.errorContent }}
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="actionStatusName"
                :label="L.조치현황"
                :filters="actionFilter"
                :filter-method="filterHandle"
                show-overflow-tooltip
                width="130px"
            >
                <template #default="{ row }">
                    <div v-if="row.errorLevel" class="alarm-level">
                        {{ row.actionStatusName }}
                    </div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" :label="L.발생시각" sortable width="180px">
                <template #default="{ row }">
                    {{ ComUtil.dateFormat(row.createDate, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
        </el-table>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { toRefs, onMounted, onUnmounted, ref } from 'vue'
import BlockLayout from '../layout/BlockLayout.vue'
import { useService } from '../model_service/Service'
import ComUtil from '@/common/utils/ComUtil'
import { COLOR_TYPE } from '@/common/types/ComTypes'
import { useNavStore } from '@/stores/NavStore'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정
const L = useLangStore().lang.dashboard

const navStore = useNavStore()

interface Prop {
    className?: string
}
const props = defineProps<Prop>()
const { className } = toRefs(props)

const obj = useService()

// 알람코드 컬러 셋
const errLevelColor= (codeType: string) => {
    codeType = codeType.replace(' ', '')
    const codes: Record<string, string> = {
        'Code1': COLOR_TYPE.RED,
        'Code2': COLOR_TYPE.ORANGE,
        'Code3': COLOR_TYPE.GREEN,
        'Code4': COLOR_TYPE.BLUE,
    }
    return codes[codeType]
}
// 모델 필터 리스트
const modelFilter = ref([{ text: '', value: '' }])
// 알람코드 필터 리스트
const alarmCodeFilter = ref([
    { text: 'Code 1', value: 'Code 1' },
    { text: 'Code 2', value: 'Code 2' },
    { text: 'Code 3', value: 'Code 3' },
    { text: 'Code 4', value: 'Code 4' },
])
// 조치필요 필터 리스트
const actionFilter = ref([
    { text: L.대기중, value: 'Waiting' },
    { text: L.처리중, value: 'Pending' },
    { text: L.완료, value: 'Success' },
])

let interval: any = null

onMounted(async () => {
    await obj.getAlarm()
    setModelFilter()
    interval = setInterval(() => {
        obj.getAlarm()
    }, 1000 * 3)
})
onUnmounted(() => {
    clearInterval(interval)
    interval = null
})
// 모델 필터 리스트 설정
const setModelFilter = () => {
    modelFilter.value = []
    obj.alarm.forEach(item => {
        if (modelFilter.value.some(itemA => itemA.text === item.modelName)) return
        modelFilter.value.push({ text: item.modelName, value: item.modelName })
    })
}
// 필터 처리
const filterHandle = (value: string, row: any, column: any) => {
    const property = column['property']
    return row[property] === value
}
// 알람 이력 조회 페이지 이동
const toAlarmPage = () => {
    navStore.navTo(L.알람이력, '/analysis/alarmHistory')
}
</script>
<style lang="scss" scoped>
#AlarmStatus {
    width: calc(50vw - 1.25rem);
    height: 100%;
    .more {
        font-size: var(--font12) !important;
        margin-right: 4px;
    }
    .more:hover {
        cursor: pointer;
    }
    :deep(.block-item-body) {
        height: 100%;
        padding: 12px 8px 8px 12px;
    }
    .alarm-level {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-left: -5px;
        div {
            width: 12px;
            height: 12px;
            border-radius: 50px;
        }
    }
}
</style>
