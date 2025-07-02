<template>
    <BlockLayout :title="L.장애이력" id="ErrorHistory" :className="className">
        <el-table :data="obj.alarm" height="100%" size="small" >
        </el-table>
    </BlockLayout>
</template>
<script lang="ts" setup>
import { toRefs, onMounted, onUnmounted, ref } from 'vue'
import BlockLayout from '../layout/BlockLayout.vue'
import { useService } from '../model_service/Service'
import ComUtil from '@/common/utils/ComUtil'
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

let interval: any = null

onMounted(async () => {
    // await obj.getAlarm()
    // setModelFilter()
    // interval = setInterval(() => {
    //     obj.getAlarm()
    // }, 1000 * 3)
})
onUnmounted(() => {
    clearInterval(interval)
    interval = null
})
</script>
<style lang="scss" scoped>
#ErrorHistory {
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
