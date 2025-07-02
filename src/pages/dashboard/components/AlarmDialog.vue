<template>
    <el-dialog
        ref="dialogRef"
        class="alarm-dialog"
        width="450"
        :model-value="isShowDialog"
        :show-close="false"
        style="padding: 0px !important; max-height: 95vh; overflow: hidden"
        :style="{ top: top }"
        center
    >
        <template #header>
            <div class="dialog-header">
                <img :src="alarmWarningHeaderIcon" />
                <div class="dialog-header-text">Warning Message</div>
                <el-icon class="close-btn" color="white" @click="onClose"><Close /></el-icon>
            </div>
        </template>
        <div class="msg-box">
            <!-- <div class="msg-box-title" >알람</div> -->
            <img class="warning-img" :src="alarmWarningIcon" />
            <div class="warning-title">Warning!</div>
            <div class="msg-box-content">{{ data.alarmContent }}</div>
            <div class="msg-box-content">{{ data.serial && `${L.시리얼번호}:  ${data.serial}` }}</div>
            <div class="msg-box-time">
                {{ ComUtil.dateFormat(data.createDate, 'YYYY-MM-DD HH:mm:ss') }}
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="info" @click="onConfirm">확인</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts" setup>
import { watch, ref, toRefs, computed } from 'vue'
import alarmWarningHeaderIcon from '@/assets/icons/common/warning_white.svg'
import alarmWarningIcon from '@/assets/icons/common/alarmWarningIcon.svg'
import ComUtil from '@/common/utils/ComUtil'
import { useLangStore } from '@/stores/LangStore'
import { useService } from '../model_service/Service'
const L = useLangStore().lang.dashboard

export interface Props {
    data: any
    index: number
}

const props = defineProps<Props>()
const { data, index } = toRefs(props)
const obj = useService()
const isShowDialog = ref(data.value ? true : false)

const onConfirm = () => {
    isShowDialog.value = false
    obj.confirmAlarmPopup({ id: data.value.id, serial: data.value.serial })
}
const onClose = () => {
    isShowDialog.value = false
}
const dialogRef: any = ref(null)
const top = computed(() => {
    let indexNm = index.value + 1
    let topPx = (indexNm % 10) * 20
    return topPx + 'px'
})
watch(data, () => {
    isShowDialog.value = true
})
</script>
<style lang="scss" scoped>
:deep(.el-dialog__header) {
    border-bottom: none !important;
}
:deep(.el-dialog__body) {
    background: #161616 !important;
}
.dialog-header {
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 20px;
    background-color: #f94040;
    display: flex;
    align-items: center;
    img {
        height: 28px;
    }
    .dialog-header-text {
        color: #ffff;
        font-size: 24px;
        padding-left: 4px;
    }
}
.close-btn {
    position: absolute;
    right: 12px;
    cursor: pointer;
}
.warning-img {
    height: 100px;
}
.warning-title {
    font-size: 32px;
    margin-bottom: 12px;
    color: #f94040;
}
.dialog-footer {
    padding-bottom: 20px;
}
.alarm-dialog {
    height: 100%;
}
.msg-box {
    display: flex;
    justify-content: center;
    padding: 0px 24px;
    flex-direction: column;
    align-items: center;
}

.msg-box-content {
    font-size: 18px;
    padding: 8px 0;
    text-align: center;
}
.msg-box-time {
    font-size: 10px;
}
</style>
