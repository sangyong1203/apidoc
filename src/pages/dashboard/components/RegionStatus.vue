<template>
    <BlockLayout :title="L.지역별현황" id="RegionStatus" :className="className">
        <el-table :data="obj.operationRegionStatus" size="small" height="100%">
            <el-table-column prop="province" :label="L.지역" />
            <el-table-column prop="totalCnt" :label="L.설치" />
            <el-table-column prop="operatingRate" :label="L.운영율+'(%)'"/>
        </el-table>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { onMounted, toRefs, onUnmounted } from 'vue'
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
    obj.getOperationRegionStatus()
    interval = setInterval(() => {
        obj.getOperationRegionStatus()
    }, 1000 * 60 * 20)
})
onUnmounted(() => {
    clearInterval(interval)
    interval = null
})
</script>
<style lang="scss" scoped>
#RegionStatus {
    width: calc(19vw - 10px);
    flex-grow: 2.27;
    overflow: hidden;
    :deep(.block-item-body) {
        height: 100%;
        padding: 12px 8px 12px 12px;
    }
}

</style>
