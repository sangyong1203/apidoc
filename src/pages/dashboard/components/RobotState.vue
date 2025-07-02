<template>
    <BlockLayout :title="L.로봇관제상태" id="RobotState" :className="className" draggable="false">
        <el-row :gutter="8">
            <el-col :span="8">
                <img
                    v-if="getSignalState() == 'good'"
                    class="signal"
                    src="@/assets/icons/common/signal_good.svg"
                    alt="state icon"
                />
                <img
                    v-if="getSignalState() == 'normal'"
                    class="signal"
                    src="@/assets/icons/common/signal_normal.svg"
                    alt="state icon"
                />
                <img
                    v-if="getSignalState() == 'bad'"
                    class="signal"
                    src="@/assets/icons/common/signal_bad.svg"
                    alt="state icon"
                />
                <img
                    v-if="getSignalState() == 'default'"
                    class="signal"
                    src="@/assets/icons/common/signal_default.svg"
                    alt="state icon"
                />
            </el-col>
            <el-col :span="8">
                <div class="description-title">{{ L.통신상태 }}</div>
                <el-descriptions :column="1" size="small" style="flex: 1; overflow: hidden; width: 100%;" border>
                    <el-descriptions-item :label="L.온라인" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.operationStatus.operatingCnt }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.오프라인" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{
                                obj.operationStatus.totalCnt -
                                obj.operationStatus.operatingCnt
                            }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.전체" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.operationStatus.totalCnt }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
            <el-col :span="8">
                <div class="description-title">{{ L.베터리 }}</div>
                <el-descriptions :column="1" size="small" style="flex: 1; overflow: hidden; width: 100%;" border>
                    <el-descriptions-item :label="L.above90" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.battery.BS01 }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.above70" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.battery.BS02 }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.above50" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.battery.BS03 }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.above20" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.battery.BS04 }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item :label="L.전체" align="center" width="100">
                        <div class="value-unit">
                            <span class="value">{{ obj.battery.totalCnt }}</span>
                            <span class="unit">EA</span>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { toRefs, onMounted, onUnmounted } from 'vue'
import BlockLayout from '../layout/BlockLayout.vue'
import { useService } from '../model_service/Service'
import { useLangStore } from '@/stores/LangStore'

// 다국어 설정
const L = useLangStore().lang.dashboard

interface Prop {
    className?: string
}
const props = defineProps<Prop>()
const { className } = toRefs(props)

const obj = useService()
let interval: any = null
onMounted(() => {
    obj.getNetwork()
    obj.getBattery()

    interval = setInterval(() => {
        obj.getNetwork()
        obj.getBattery()
    }, 1000 * 60 )
})
onUnmounted(() => {
    clearInterval(interval)
    interval = null
})

// obj.operationStatus.totalCnt - obj.operationStatus.operatingCnt
const getSignalState = () => {
    let onlineRate = 0
    if (obj.operationStatus.totalCnt !== 0) {
        onlineRate = obj.operationStatus.operatingCnt / obj.operationStatus.totalCnt
    }
    let batteryRate = 0
    if (obj.battery.totalCnt !== 0) {
        ;(obj.battery.BS01 * 0.9 + obj.battery.BS02 * 0.7 + obj.battery.BS03 * 0.5 + obj.battery.BS04 * 0.2) /
            obj.battery.totalCnt
    }

    let result = 'default'
    if (onlineRate >= 0.9 && batteryRate >= 0.7) {
        result = 'good'
    } else if (onlineRate < 0.5 || batteryRate < 0.5) {
        result = 'bad'
    } else {
        result = 'default'
    }
    return result
}
</script>
<style lang="scss" scoped>
#RobotState {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    .el-row {
        padding: 8px 12px 12px 12px;
        height: 100%;
    }
    .el-col {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .signal {
        height: 15vh;
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
        line-height: 12px;
        display: inline-flex;
        justify-content: flex-start;
        margin-right: 4px;
    }
    .description-title {
        margin-bottom: 6px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
    }
}
</style>
