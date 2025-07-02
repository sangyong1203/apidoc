<template>
    <BlockLayout
        :title="L.Today집계"
        id="TodaySum"
        :className="className"
        draggable="false"
    >
        <el-descriptions :column="1" border>
            <el-descriptions-item :label="L.건물" align="center">
                <div class="value-unit">
                    <span class="value">{{ obj.operationToday.buildingCnt }} </span> 
                    <span class="unit">EA</span>
                </div>
            </el-descriptions-item>
            <el-descriptions-item :label="L.활동로봇" align="center">
                <div class="value-unit">
                    <span class="value">{{ obj.operationToday.operatingCnt }}</span> 
                    <span class="unit">EA</span>
                </div>
            </el-descriptions-item>
            <el-descriptions-item :label="L.작업시간" align="center">
                <div class="value-unit">
                    <span class="value">{{ obj.operationToday.workTime }}</span> 
                    <span class="unit">Hr</span>
                </div>
            </el-descriptions-item>
            <el-descriptions-item :label="L.종합공기질" align="center">
                <div style="text-align: right; padding-right: 2px; ">{{ obj.operationToday.aqLevel == null ? '' : aqLevel[obj.operationToday.aqLevel] }}</div> 
                <div style="text-align: right; padding-right: 2px; font-size: 8px !important; line-height: 8px;">{{ ` ( ${obj.operationToday.levelCnt} / ${obj.operationToday.levelTotalCnt} )`}}</div>
            </el-descriptions-item>
        </el-descriptions>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { toRefs, onMounted, onUnmounted } from 'vue'
import BlockLayout from '../layout/BlockLayout.vue'
import { useService } from '../model_service/Service'
import dayjs from 'dayjs'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정 
const L = useLangStore().lang.dashboard

interface Prop {
    className?: string
}
const props = defineProps<Prop>()
const { className } = toRefs(props)


const obj = useService()
let interval:any = null
onMounted( async ()=>{
    let today = dayjs(new Date()).format('YYYY-MM-DD')
    await obj.getOperationToday({todayDate: today})
    interval = setInterval(()=>{
        obj.getOperationToday({todayDate: today})
    }, 1000 * 60)
})
onUnmounted(()=>{
    clearInterval(interval)
    interval = null
})

const aqLevel = {
    0 : L.좋음,
    1 : L.보통,
    2 : L.나쁨,
    3 : L.매우나쁨,
    null : ''
}

</script>
<style lang="scss" scoped>
#TodaySum{
    width: calc(19vw - 10px);
    flex-grow: 1;
    overflow: hidden;
    :deep(.block-item-body) {
        height: 100%;
        padding: 12px ;
    }
    :deep(.el-descriptions__label){
        width: 50%;
    }
    .value-unit{
        display: flex; 
        align-items: center;
        justify-content: flex-end;
    }
    .value{
        display: inline-flex;
        flex:1;
        justify-content: flex-end;
        padding-right: 4px;
    }
    .unit{
        font-size: var(--font10) !important;
        display: inline-flex;
        justify-content: flex-start;
        margin-right: 4px;
    }
}

</style>
