<template>
    <div class="block-container" :class="className">
        <div class="block-item" :class="className">
            <div
                v-if="title"
                class="block-item-header"
                :class="className"
                @click="moveToPage"
                :style="{ cursor: routePath ? 'pointer' : '' }"
                lang="ko"
            >
                {{ title }}
                <div class="header-slot"><slot name="header"></slot></div>
            </div>
            <div class="block-item-body" :class="className">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue'
import { useNavStore } from '@/stores/NavStore'

export interface Props {
    title?: string
    className?: string
    routePath?: string // 이동할 페이지 경로
    routName?: string // 이동할 페이지 명
}
const props = defineProps<Props>()
const { title, className, routePath, routName } = toRefs(props)

const moveToPage = () => {
    routePath.value && useNavStore().navTo(routName.value ?? '', routePath.value)
}
</script>
<style scoped>
.block-container {
    padding: 4px;
    display: flex;
    flex: 1;
}

.block-item {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.block-item .block-item-header {
    font-size: 16px !important;
    padding: 8px 12px;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
}
.header-slot {
    position: absolute;
    right: 12px;
    height: calc(100% - 16px);
    display: flex;
    align-items: center;
}
.block-item-body {
    height: calc(100% - 35px);
    /* background-color: #0c141e96; */
}
</style>
